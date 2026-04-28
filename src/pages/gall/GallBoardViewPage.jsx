import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import dayjs from 'dayjs'
import { Link, useLocation, useSearchParams } from 'react-router-dom'

const POST_DETAIL_QUERY = gql`
  query GallBoardDetail($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      slug
      date
      title
      content
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

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function formatDateTime(isoDate) {
  if (!isoDate) return '-'
  const d = dayjs(isoDate)
  if (!d.isValid()) return '-'
  return d.format('YYYY.MM.DD HH:mm')
}

export function GallBoardViewPage() {
  const loc = useLocation()
  const [searchParams] = useSearchParams()
  const boardId = searchParams.get('id') || 'dcbest'
  const postNo = searchParams.get('no') || ''
  const hasValidPostNo = /^\d+$/.test(postNo)

  const { data, loading, error } = useQuery(POST_DETAIL_QUERY, {
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
      : '/www'

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
        </article>
      ) : null}
    </section>
  )
}
