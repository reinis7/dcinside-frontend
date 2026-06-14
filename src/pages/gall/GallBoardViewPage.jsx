import { useQuery } from '@apollo/client/react'
import dayjs from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { createGalleryComment, deleteGalleryComment, fetchGalleryPostComments, getCommentActionErrorMessage } from '../../api/gallCommentApi'
import { deletePostById, findGalleryPostStats, GALL_POST_VIEW_QUERY, getPostActionErrorMessage, incrementPostView, recommendPost } from '../../api/gallPostApi'
import { useAuth } from '../../auth/authContext'
import { gallBoardListHref, gallBoardWriteHref, resolveGallBoardBase } from '../../utils/gallBoardPaths'
import { GallPostImageUploadButton } from './GallPostImageUploadButton'

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

function GallPostStatsControls({
  commentCount,
  hasRecommended,
  isRecommending,
  loginHref,
  onRecommend,
  onScrollComments,
  recommendCount,
  showLoginLink,
  viewCount,
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 text-[12px]">
      <span className="font-semibold text-[#666]">조회 {viewCount ?? 0}</span>
      <button
        type="button"
        className="h-[28px] rounded-sm border border-[#293f90] bg-[#2f4aa0] px-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        onClick={onRecommend}
        disabled={hasRecommended || isRecommending}
        title={hasRecommended ? '이미 추천한 글입니다.' : '추천'}
      >
        {isRecommending ? '처리중' : `추천 ${recommendCount ?? 0}`}
      </button>
      <button
        type="button"
        className="h-[28px] rounded-sm border border-[#cfd4dd] bg-white px-3 font-semibold text-[#333] hover:bg-[#f8f8f8]"
        onClick={onScrollComments}
      >
        댓글 {commentCount ?? 0}
      </button>
      {showLoginLink && loginHref ? (
        <Link to={loginHref} className="text-[#3b4890] hover:underline">
          로그인
        </Link>
      ) : null}
    </div>
  )
}

function GallPostActionBar({
  canManagePost,
  editHref,
  isDeleting,
  listHref,
  onDelete,
  writeHref,
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-y border-[#e5e5e5] py-2 text-[12px]">
      <Link to={listHref} className="h-[28px] rounded-sm border border-[#cfd4dd] bg-white px-3 font-semibold text-[#333] hover:bg-[#f8f8f8]">
        목록
      </Link>
      <Link to={writeHref} className="h-[28px] rounded-sm border border-[#9da9c6] bg-white px-3 font-semibold text-[#2f3d8f] hover:bg-[#f8f8f8]">
        글쓰기
      </Link>
      {canManagePost ? (
        <>
          <Link to={editHref} className="h-[28px] rounded-sm border border-[#cfd4dd] bg-white px-3 font-semibold text-[#333] hover:bg-[#f8f8f8]">
            수정
          </Link>
          <button
            type="button"
            className="h-[28px] rounded-sm border border-[#cfd4dd] bg-white px-3 font-semibold text-[#333] hover:bg-[#f8f8f8] disabled:opacity-60"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제중' : '삭제'}
          </button>
        </>
      ) : null}
    </div>
  )
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
  const [submitMode, setSubmitMode] = useState('general')
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

  async function handleSubmit(withRecommend) {
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

    setSubmitMode(withRecommend ? 'recommend' : 'general')
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      await createGalleryComment({
        postDatabaseId,
        content: trimmedContent,
        withRecommend,
      })
      setContent('')
      await onCreated?.(withRecommend)
    } catch (err) {
      setErrorMsg(getCommentActionErrorMessage(err))
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
            onClick={() => handleSubmit(false)}
            disabled={disabled || !isAuthed || !isCommentOpen || isSubmitting || isMediaUploading}
          >
            {isSubmitting && submitMode === 'general' ? '등록중' : '등록'}
          </button>
          <button
            type="button"
            className="h-[30px] rounded-sm border border-[#d31900] bg-[#e53935] px-4 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => handleSubmit(true)}
            disabled={disabled || !isAuthed || !isCommentOpen || isSubmitting || isMediaUploading}
            title="댓글과 함께 추천합니다"
          >
            {isSubmitting && submitMode === 'recommend' ? '등록중' : '댓글+추천'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function GallBoardViewPage() {
  const loc = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthed, viewer } = useAuth()
  const boardId = searchParams.get('id') || 'dcbest'
  const postNo = searchParams.get('no') || ''
  const hasValidPostNo = /^\d+$/.test(postNo)
  const boardBase = resolveGallBoardBase(loc.pathname)
  const [comments, setComments] = useState([])
  const [commentsError, setCommentsError] = useState('')
  const [commentDraftRequest, setCommentDraftRequest] = useState(null)
  const [isCommentsLoading, setIsCommentsLoading] = useState(false)
  const [viewCount, setViewCount] = useState(null)
  const [recommendCount, setRecommendCount] = useState(null)
  const [hasRecommended, setHasRecommended] = useState(false)
  const [isRecommending, setIsRecommending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingCommentId, setDeletingCommentId] = useState(null)
  const viewIncrementedRef = useRef(false)

  const { data, loading, error, refetch } = useQuery(GALL_POST_VIEW_QUERY, {
    variables: { id: postNo, galleryId: boardId },
    skip: !hasValidPostNo,
    fetchPolicy: 'network-only',
  })

  const post = data?.post ?? null
  const postStats = useMemo(
    () => findGalleryPostStats(data?.galleryPosts, post?.databaseId),
    [data?.galleryPosts, post?.databaseId],
  )
  const galleryId = post?.dcinsideGalleryId || boardId
  const categoryName = stripHtml(post?.headText || postStats?.headText) || '게시판'
  const writerName =
    stripHtml(post?.writer) ||
    stripHtml(postStats?.writer) ||
    stripHtml(post?.author?.node?.username) ||
    stripHtml(post?.author?.node?.name) ||
    '-'
  const title = stripHtml(post?.title) || '제목 없음'
  const mediaCommentsByUrl = useMemo(() => buildMediaCommentsByUrl(comments), [comments])
  const postContentHtml = useMemo(
    () => addCommentButtonsToPostMedia(post?.content || '', mediaCommentsByUrl),
    [mediaCommentsByUrl, post?.content],
  )
  const listHref = gallBoardListHref(boardBase, galleryId)
  const writeHref = gallBoardWriteHref(boardBase, galleryId)
  const editHref = post?.databaseId ? gallBoardWriteHref(boardBase, galleryId, post.databaseId) : writeHref
  const loginHref = `/sign/login?s_url=${encodeURIComponent(`${loc.pathname}${loc.search}`)}`
  const isCommentOpen = post?.commentStatus !== 'closed'
  const currentUsername = viewer?.username || viewer?.userId || viewer?.name || ''
  const commentCount = comments.length || post?.commentCount || 0
  const canManagePost = Boolean(
    isAuthed &&
      viewer?.databaseId &&
      post?.author?.node?.databaseId &&
      Number(viewer.databaseId) === Number(post.author.node.databaseId),
  )

  function canDeleteComment(comment) {
    if (!isAuthed || !viewer?.databaseId || !comment) return false
    if (canManagePost) return true
    return Number(viewer.databaseId) === Number(comment.authorId)
  }

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
      setComments(await fetchGalleryPostComments(postDatabaseId))
    } catch (err) {
      setComments([])
      setCommentsError(getCommentActionErrorMessage(err))
    } finally {
      setIsCommentsLoading(false)
    }
  }

  async function handleDeleteComment(comment) {
    if (!comment?.id || deletingCommentId) return
    const ok = window.confirm('이 댓글을 삭제할까요?')
    if (!ok) return

    setDeletingCommentId(comment.id)
    try {
      await deleteGalleryComment(comment.id)
      toast.success('댓글이 삭제되었습니다.')
      await Promise.all([loadComments(post.databaseId), refetch()])
    } catch (err) {
      toast.error(getCommentActionErrorMessage(err))
    } finally {
      setDeletingCommentId(null)
    }
  }

  useEffect(() => {
    if (!post?.databaseId) {
      setComments([])
      return
    }
    void loadComments(post.databaseId)
  }, [post?.databaseId])

  useEffect(() => {
    if (!post?.databaseId) return
    const nextViewCount =
      typeof post.viewCount === 'number'
        ? post.viewCount
        : typeof postStats?.viewCount === 'number'
          ? postStats.viewCount
          : 0
    const nextRecommendCount =
      typeof post.recommendCount === 'number'
        ? post.recommendCount
        : typeof postStats?.recommendCount === 'number'
          ? postStats.recommendCount
          : 0
    setViewCount(nextViewCount)
    setRecommendCount(nextRecommendCount)
    setHasRecommended(Boolean(post.hasRecommended))
  }, [
    post?.databaseId,
    post?.viewCount,
    post?.recommendCount,
    post?.hasRecommended,
    postStats?.viewCount,
    postStats?.recommendCount,
  ])

  useEffect(() => {
    if (!post?.databaseId || viewIncrementedRef.current) return
    viewIncrementedRef.current = true

    void incrementPostView({ galleryId, databaseId: post.databaseId })
      .then((result) => {
        if (typeof result?.viewCount === 'number') setViewCount(result.viewCount)
      })
      .catch(() => {
        viewIncrementedRef.current = false
      })
  }, [galleryId, post?.databaseId])

  function scrollToComments() {
    document.getElementById('gall-comment-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleRecommend() {
    if (!post?.databaseId || hasRecommended || isRecommending) return
    if (!isAuthed) {
      toast.error('추천은 로그인 후 이용할 수 있습니다.')
      return
    }

    setIsRecommending(true)
    try {
      const result = await recommendPost({ galleryId, databaseId: post.databaseId })
      if (!result) {
        toast.info('추천 기능을 사용할 수 없습니다.')
        return
      }
      if (typeof result.recommendCount === 'number') setRecommendCount(result.recommendCount)
      setHasRecommended(Boolean(result.hasRecommended || result.alreadyRecommended))
      if (result.alreadyRecommended) toast.info('이미 추천한 글입니다.')
      else toast.success('추천했습니다.')
    } catch (err) {
      toast.error(getPostActionErrorMessage(err))
    } finally {
      setIsRecommending(false)
    }
  }

  async function handleDelete() {
    if (!post?.id || isDeleting) return
    const ok = window.confirm('이 게시글을 삭제할까요?')
    if (!ok) return

    setIsDeleting(true)
    try {
      await deletePostById(post.id)
      toast.success('게시글이 삭제되었습니다.')
      navigate(listHref, { replace: true })
    } catch (err) {
      toast.error(getPostActionErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

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
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0 text-[11px] text-[#777]">
                <span className="font-semibold text-[#444]">{writerName}</span>
                <span className="mx-1 text-[#bbb]">|</span>
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
              <GallPostStatsControls
                commentCount={commentCount}
                hasRecommended={hasRecommended}
                isRecommending={isRecommending}
                loginHref={loginHref}
                onRecommend={handleRecommend}
                onScrollComments={scrollToComments}
                recommendCount={recommendCount ?? postStats?.recommendCount ?? 0}
                showLoginLink={!isAuthed}
                viewCount={viewCount ?? postStats?.viewCount ?? 0}
              />
            </div>
          </header>
          <div
            className="prose max-w-none py-4 text-[13px] leading-6 text-[#333]"
            onClick={handlePostContentClick}
            dangerouslySetInnerHTML={{ __html: postContentHtml }}
          />
          <GallPostActionBar
            canManagePost={canManagePost}
            editHref={editHref}
            isDeleting={isDeleting}
            listHref={listHref}
            onDelete={handleDelete}
            writeHref={writeHref}
          />
          <section id="gall-comment-section" className="mt-4 border-t border-[#e5e5e5] pt-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-[#222]">
                댓글 <span className="text-[#d31900]">[{commentCount}]</span>
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
                      {comment.withRecommend ? (
                        <span className="ml-1 rounded bg-[#e53935] px-1 py-0.5 text-[10px] font-bold text-white">
                          추천
                        </span>
                      ) : null}
                    </div>
                    <div className="break-words text-[#333]">
                      <div dangerouslySetInnerHTML={{ __html: comment.content || '' }} />
                      {canDeleteComment(comment) ? (
                        <button
                          type="button"
                          className="mt-1 text-[11px] font-semibold text-[#777] hover:text-[#d31900] disabled:opacity-60"
                          onClick={() => handleDeleteComment(comment)}
                          disabled={deletingCommentId === comment.id}
                        >
                          {deletingCommentId === comment.id ? '삭제중' : '삭제'}
                        </button>
                      ) : null}
                    </div>
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
              onCreated={async (withRecommend) => {
                await Promise.all([loadComments(post.databaseId), refetch()])
                if (withRecommend) toast.success('댓글과 추천이 등록되었습니다.')
                else toast.success('댓글이 등록되었습니다.')
              }}
              postDatabaseId={post.databaseId}
            />
          </section>
        </article>
      ) : null}
    </section>
  )
}
