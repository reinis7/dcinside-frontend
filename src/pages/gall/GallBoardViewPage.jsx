import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import dayjs from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { createWordpressComment, fetchWordpressComments } from '../../api/wordpressCommentsApi'
import { useAuth } from '../../auth/authContext'
import { GallPostImageUploadButton } from './GallPostImageUploadButton'

const POST_DETAIL_QUERY = gql`
  query GallBoardDetail($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      slug
      date
      title
      content
      commentCount
      commentStatus
      categories {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`

function decodeHtmlEntities(text) {
  if (!text) return ''
  if (typeof document === 'undefined') return text
  const el = document.createElement('textarea')
  el.innerHTML = text
  return el.value
}

function normalizeDashes(text) {
  return String(text).replace(/[\u2013\u2014]/g, '-')
}

function stripHtml(html) {
  if (!html) return ''
  const plain = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return normalizeDashes(decodeHtmlEntities(plain))
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatDateTime(isoDate) {
  if (!isoDate) return '-'
  const d = dayjs(isoDate)
  if (!d.isValid()) return '-'
  return d.format('YYYY.MM.DD HH:mm')
}

function mediaCommentPrefix(mediaUrl) {
  if (!mediaUrl) return ''
  return `[미디어 댓글] ${mediaUrl}\n`
}

function parseMediaComment(comment) {
  const match = String(comment?.plainContent || '').match(/^\[미디어 댓글\]\s+(\S+)\s*(.*)$/s)
  if (!match) return null
  return {
    mediaUrl: match[1],
    body: match[2]?.trim() || '',
  }
}

function buildMediaCommentsByUrl(comments) {
  const grouped = new Map()
  for (const comment of comments) {
    const parsed = parseMediaComment(comment)
    if (!parsed?.mediaUrl) continue
    const list = grouped.get(parsed.mediaUrl) || []
    list.push({
      ...comment,
      mediaCommentBody: parsed.body,
    })
    grouped.set(parsed.mediaUrl, list)
  }
  return grouped
}

function getMediaUrl(mediaEl) {
  if (!mediaEl) return ''
  if (mediaEl.tagName?.toLowerCase() === 'img') return mediaEl.getAttribute('src') || ''
  return mediaEl.getAttribute('src') || mediaEl.querySelector?.('source')?.getAttribute('src') || ''
}

function addVideoCommentsNode(doc, comments) {
  if (!comments?.length) return null

  const container = doc.createElement('div')
  container.className = 'mt-2 border border-[#e5e5e5] bg-[#fafafa] text-[12px] leading-5 text-[#333]'
  container.innerHTML = comments
    .map((comment, index) => {
      const showName = index === 0 || comments[index - 1]?.authorName !== comment.authorName
      return `
        <div class="grid grid-cols-[90px_1fr_95px] gap-2 border-b border-[#eeeeee] px-2 py-1 last:border-b-0">
          <div class="truncate font-semibold text-[#333]">${showName ? escapeHtml(comment.authorName || '익명') : ''}</div>
          <div class="break-words">${escapeHtml(comment.mediaCommentBody || comment.plainContent || '')}</div>
          <div class="text-right text-[#777]">${escapeHtml(formatDateTime(comment.date))}</div>
        </div>
      `
    })
    .join('')
  return container
}

function addCommentButtonsToPostMedia(html, mediaCommentsByUrl) {
  if (!html || typeof DOMParser === 'undefined') return html || ''

  const doc = new DOMParser().parseFromString(html, 'text/html')
  for (const mediaEl of doc.body.querySelectorAll('img, video')) {
    if (mediaEl.closest('.gall-media-comment-target')) continue

    const tagName = mediaEl.tagName?.toLowerCase()
    const mediaUrl = getMediaUrl(mediaEl)
    const wrapper = doc.createElement(tagName === 'video' ? 'div' : 'span')
    wrapper.className = 'gall-media-comment-target group not-prose relative inline-block max-w-full'
    wrapper.setAttribute('data-media-url', mediaUrl)

    const button = doc.createElement('button')
    button.type = 'button'
    button.className =
      'gall-media-comment-button absolute right-1 top-1 hidden rounded bg-[#2f4aa0] px-2 py-1 text-[11px] font-bold text-white shadow group-hover:inline-block'
    button.setAttribute('data-media-comment-button', 'true')
    button.setAttribute('data-media-url', mediaUrl)
    button.textContent = 'comment'

    mediaEl.classList.add('max-w-full')
    mediaEl.parentNode.insertBefore(wrapper, mediaEl)
    wrapper.appendChild(mediaEl)
    wrapper.appendChild(button)
    if (tagName === 'video') {
      const commentsNode = addVideoCommentsNode(doc, mediaCommentsByUrl?.get(mediaUrl))
      if (commentsNode) wrapper.appendChild(commentsNode)
    }
  }

  return doc.body.innerHTML
}

function GallBoardCommentForm({
  currentUsername,
  disabled,
  draftRequest,
  isAuthed,
  isCommentOpen,
  onCreated,
  postDatabaseId,
}) {
  const [content, setContent] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isMediaUploading, setIsMediaUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!draftRequest?.id) return

    setContent((prev) => {
      const prefix = mediaCommentPrefix(draftRequest.mediaUrl)
      if (!prefix || prev.includes(prefix.trim())) return prev
      return `${prefix}${prev}`
    })
    textareaRef.current?.focus()
  }, [draftRequest])

  async function handleSubmit() {
    if (isSubmitting || isMediaUploading) return
    if (!isAuthed) {
      setErrorMsg('댓글 작성은 로그인이 필요합니다.')
      return
    }
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      setErrorMsg('댓글 내용을 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')
    try {
      await createWordpressComment({ postDatabaseId, content: trimmedContent })
      setContent('')
      await onCreated?.()
    } catch (err) {
      setErrorMsg(err?.message || '댓글 등록 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCancel() {
    setContent('')
    setErrorMsg('')
    textareaRef.current?.blur()
  }

  return (
    <div id="gall-comment-form" className="mt-3 rounded-sm border border-[#d9d9d9] bg-[#fafafa] p-2">
      <div className="mb-1 text-[12px] font-semibold text-[#333]">
        {currentUsername || '댓글 작성'}
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="block h-[72px] w-full resize-none border border-[#cfcfcf] bg-white p-2 text-[13px] outline-none focus:border-[#3b4890] disabled:bg-[#f3f3f3]"
        placeholder={isAuthed ? '댓글을 입력해 주세요.' : '로그인 후 댓글을 작성할 수 있습니다.'}
        disabled={disabled || !isAuthed || !isCommentOpen || isSubmitting || isMediaUploading}
      />
      <div className="min-h-[18px] pt-1 text-[12px]">
        {errorMsg ? <span className="font-semibold text-[#d31900]">{errorMsg}</span> : null}
        {!errorMsg && !isCommentOpen ? <span className="text-[#777]">이 게시글은 댓글 작성이 닫혀 있습니다.</span> : null}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <GallPostImageUploadButton
            className="h-[28px] rounded-sm border border-[#cfd4dd] bg-white px-2 text-[12px] font-semibold text-[#333] disabled:opacity-60"
            disabled={disabled || !isAuthed || !isCommentOpen || isSubmitting}
            onError={setErrorMsg}
            onUploadingChange={setIsMediaUploading}
            onUploaded={(mediaHtml) => {
              setContent((prev) => `${prev || ''}${prev ? '\n' : ''}${mediaHtml}`)
              setErrorMsg('')
            }}
          >
            이미지
          </GallPostImageUploadButton>
          <GallPostImageUploadButton
            className="h-[28px] rounded-sm border border-[#cfd4dd] bg-white px-2 text-[12px] font-semibold text-[#333] disabled:opacity-60"
            disabled={disabled || !isAuthed || !isCommentOpen || isSubmitting}
            mediaType="video"
            onError={setErrorMsg}
            onUploadingChange={setIsMediaUploading}
            onUploaded={(mediaHtml) => {
              setContent((prev) => `${prev || ''}${prev ? '\n' : ''}${mediaHtml}`)
              setErrorMsg('')
            }}
          >
            동영상
          </GallPostImageUploadButton>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="h-[30px] rounded-sm border border-[#b8b8b8] bg-white px-3 text-[13px] font-semibold text-[#333] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleCancel}
            disabled={disabled || isSubmitting || isMediaUploading || !content}
          >
            취소
          </button>
          <button
            type="button"
            className="h-[30px] rounded-sm border border-[#293f90] bg-[#2f4aa0] px-4 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSubmit}
            disabled={disabled || !isAuthed || !isCommentOpen || isSubmitting || isMediaUploading}
          >
            {isMediaUploading ? '업로드중' : isSubmitting ? '등록중' : '등록'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function GallBoardViewPage() {
  const loc = useLocation()
  const [searchParams] = useSearchParams()
  const { isAuthed, viewer } = useAuth()
  const boardId = searchParams.get('id') || 'dcbest'
  const postNo = searchParams.get('no') || ''
  const hasValidPostNo = /^\d+$/.test(postNo)
  const [comments, setComments] = useState([])
  const [commentsError, setCommentsError] = useState('')
  const [commentDraftRequest, setCommentDraftRequest] = useState(null)
  const [isCommentsLoading, setIsCommentsLoading] = useState(false)

  const { data, loading, error, refetch } = useQuery(POST_DETAIL_QUERY, {
    variables: { id: postNo },
    skip: !hasValidPostNo,
    fetchPolicy: 'network-only',
  })

  const post = data?.post ?? null
  const categoryName = post?.categories?.edges?.[0]?.node?.name ?? '게시판'
  const title = stripHtml(post?.title) || '제목 없음'
  const mediaCommentsByUrl = useMemo(() => buildMediaCommentsByUrl(comments), [comments])
  const postContentHtml = useMemo(
    () => addCommentButtonsToPostMedia(post?.content || '', mediaCommentsByUrl),
    [mediaCommentsByUrl, post?.content],
  )
  const listHref = loc.pathname.includes('/gall/mgallery/board/view')
    ? `/gall/mgallery/board/lists/?id=${encodeURIComponent(boardId)}`
    : loc.pathname.includes('/gall/mini/board/view')
      ? `/gall/mini/board/lists/?id=${encodeURIComponent(boardId)}`
      : loc.pathname.includes('/gall/p/board/view') || loc.pathname.includes('/gall/person/board/view')
        ? `/gall/p/board/lists/?id=${encodeURIComponent(boardId)}`
      : loc.pathname.includes('/gall/board/view')
        ? `/gall/board/lists/?id=${encodeURIComponent(boardId)}`
        : '/www'
  const loginHref = `/sign/login?s_url=${encodeURIComponent(`${loc.pathname}${loc.search}`)}`
  const isCommentOpen = post?.commentStatus !== 'closed'
  const currentUsername = viewer?.username || viewer?.userId || viewer?.name || ''

  function handlePostContentClick(event) {
    const button = event.target.closest?.('[data-media-comment-button="true"]')
    if (!button) return

    event.preventDefault()
    const mediaUrl = button.getAttribute('data-media-url') || button.closest('.gall-media-comment-target')?.getAttribute('data-media-url') || ''
    setCommentDraftRequest({ id: Date.now(), mediaUrl })
    document.getElementById('gall-comment-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async function loadComments(postDatabaseId) {
    if (!postDatabaseId) return
    setIsCommentsLoading(true)
    setCommentsError('')
    try {
      setComments(await fetchWordpressComments(postDatabaseId))
    } catch (err) {
      setComments([])
      setCommentsError(err?.message || '댓글을 불러오지 못했습니다.')
    } finally {
      setIsCommentsLoading(false)
    }
  }

  useEffect(() => {
    if (!post?.databaseId) {
      setComments([])
      return
    }
    void loadComments(post.databaseId)
  }, [post?.databaseId])

  return (
    <section className="rounded border border-[#d3d3d3] bg-white">
      <div className="flex items-center justify-between border-b border-[#e5e5e5] px-4 py-2 text-[12px]">
        <div className="text-[#555]">
          <Link to={listHref} className="font-semibold hover:underline">
            {boardId}
          </Link>
          <span className="mx-1 text-[#bbb]">/</span>
          <span>{categoryName}</span>
        </div>
        <Link to={listHref} className="text-[#3b4890] hover:underline">
          목록
        </Link>
      </div>

      {!hasValidPostNo ? (
        <div className="px-4 py-6 text-[12px] text-[#666]">잘못된 게시글 번호입니다.</div>
      ) : null}

      {hasValidPostNo && loading ? <div className="px-4 py-6 text-[12px] text-[#666]">게시글 불러오는 중...</div> : null}

      {hasValidPostNo && !loading && error ? (
        <div className="px-4 py-6 text-[12px] text-[#d31900]">게시글을 불러오지 못했습니다: {error.message}</div>
      ) : null}

      {hasValidPostNo && !loading && !error && !post ? (
        <div className="px-4 py-6 text-[12px] text-[#666]">게시글이 없습니다.</div>
      ) : null}

      {hasValidPostNo && !loading && !error && post ? (
        <article className="px-4 py-3">
          <header className="border-b border-[#efefef] pb-2">
            <h1 className="text-[18px] font-semibold text-[#222]">{title}</h1>
            <div className="mt-1 text-[11px] text-[#777]">
              <span>{categoryName}</span>
              <span className="mx-1 text-[#bbb]">|</span>
              <span>{formatDateTime(post.date)}</span>
              {post.databaseId ? (
                <>
                  <span className="mx-1 text-[#bbb]">|</span>
                  <span>no.{post.databaseId}</span>
                </>
              ) : null}
            </div>
          </header>
          <div
            className="prose max-w-none py-4 text-[13px] leading-6 text-[#333]"
            onClick={handlePostContentClick}
            dangerouslySetInnerHTML={{ __html: postContentHtml }}
          />
          <section className="mt-4 border-t border-[#e5e5e5] pt-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-[#222]">
                댓글 <span className="text-[#d31900]">[{comments.length || post.commentCount || 0}]</span>
              </h2>
              {!isAuthed ? (
                <Link to={loginHref} className="text-[12px] font-semibold text-[#3b4890] hover:underline">
                  로그인 후 댓글 작성
                </Link>
              ) : null}
            </div>

            {commentsError ? (
              <div className="mb-2 text-[12px] font-semibold text-[#d31900]">{commentsError}</div>
            ) : null}

            {isCommentsLoading ? (
              <div className="border-y border-[#efefef] px-2 py-5 text-center text-[12px] text-[#777]">
                댓글 불러오는 중...
              </div>
            ) : comments.length > 0 ? (
              <div className="divide-y divide-[#efefef] border-y border-[#efefef]">
                {comments.map((comment, index) => (
                  <div key={comment.id} className="grid grid-cols-[120px_1fr_120px] gap-2 px-2 py-2 text-[12px]">
                    <div className="truncate font-semibold text-[#333]">
                      {index > 0 && comments[index - 1]?.authorName === comment.authorName ? '' : stripHtml(comment.authorName) || '익명'}
                    </div>
                    <div
                      className="break-words text-[#333]"
                      dangerouslySetInnerHTML={{ __html: comment.content || '' }}
                    />
                    <div className="text-right text-[#777]">{formatDateTime(comment.date)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-y border-[#efefef] px-2 py-5 text-center text-[12px] text-[#777]">
                등록된 댓글이 없습니다.
              </div>
            )}

            <GallBoardCommentForm
              currentUsername={currentUsername}
              disabled={!post.databaseId}
              draftRequest={commentDraftRequest}
              isAuthed={isAuthed}
              isCommentOpen={isCommentOpen}
              onCreated={async () => {
                await Promise.all([loadComments(post.databaseId), refetch()])
              }}
              postDatabaseId={post.databaseId}
            />
          </section>
        </article>
      ) : null}
    </section>
  )
}
