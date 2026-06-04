import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { createWordpressComment, fetchWordpressComments } from '../../api/wordpressCommentsApi'
import { useAuth } from '../../auth/authContext'

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

function formatDateTime(isoDate) {
  if (!isoDate) return '-'
  const d = dayjs(isoDate)
  if (!d.isValid()) return '-'
  return d.format('YYYY.MM.DD HH:mm')
}

function GallBoardCommentForm({ currentUsername, disabled, isAuthed, isCommentOpen, onCreated, postDatabaseId }) {
  const [content, setContent] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    if (isSubmitting) return
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

  return (
    <div className="mt-3 rounded-sm border border-[#d9d9d9] bg-[#fafafa] p-2">
      <div className="mb-1 text-[12px] font-semibold text-[#333]">
        {currentUsername || '댓글 작성'}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="block h-[72px] w-full resize-none border border-[#cfcfcf] bg-white p-2 text-[13px] outline-none focus:border-[#3b4890] disabled:bg-[#f3f3f3]"
        placeholder={isAuthed ? '댓글을 입력해 주세요.' : '로그인 후 댓글을 작성할 수 있습니다.'}
        disabled={disabled || !isAuthed || !isCommentOpen || isSubmitting}
      />
      <div className="min-h-[18px] pt-1 text-[12px]">
        {errorMsg ? <span className="font-semibold text-[#d31900]">{errorMsg}</span> : null}
        {!errorMsg && !isCommentOpen ? <span className="text-[#777]">이 게시글은 댓글 작성이 닫혀 있습니다.</span> : null}
      </div>
      <div className="mt-1 flex justify-end">
        <button
          type="button"
          className="h-[30px] rounded-sm border border-[#293f90] bg-[#2f4aa0] px-4 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleSubmit}
          disabled={disabled || !isAuthed || !isCommentOpen || isSubmitting}
        >
          {isSubmitting ? '등록중' : '등록'}
        </button>
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
  const [isCommentsLoading, setIsCommentsLoading] = useState(false)

  const { data, loading, error, refetch } = useQuery(POST_DETAIL_QUERY, {
    variables: { id: postNo },
    skip: !hasValidPostNo,
    fetchPolicy: 'network-only',
  })

  const post = data?.post ?? null
  const categoryName = post?.categories?.edges?.[0]?.node?.name ?? '게시판'
  const title = stripHtml(post?.title) || '제목 없음'
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
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
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
                {comments.map((comment) => (
                  <div key={comment.id} className="grid grid-cols-[120px_1fr_120px] gap-2 px-2 py-2 text-[12px]">
                    <div className="truncate font-semibold text-[#333]">
                      {stripHtml(comment.authorName) || '익명'}
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
