import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'

const MINOR_BOARD_LIST_ATTEMPT_1 = gql`
  query MinorBoardListByGalleryId($galleryId: String!, $first: Int = 50) {
    dcinsideMinorPostsByGalleryId(galleryId: $galleryId, first: $first) {
      nodes {
        id
        databaseId
        date
        title
        writer
        viewCount
        recommendCount
        headText
      }
    }
  }
`

const MINOR_BOARD_LIST_ATTEMPT_2 = gql`
  query MinorBoardListByGalleryId2($galleryId: String!, $first: Int = 50) {
    dcinsidePostsByGalleryId(galleryId: $galleryId, first: $first) {
      id
      databaseId
      date
      title
    }
  }
`

// WPGraphQL meta query variants (if backend exposes gallery_id as post meta)
const MINOR_BOARD_LIST_ATTEMPT_4 = gql`
  query MinorBoardListByMetaQuery($galleryId: String!, $first: Int = 50) {
    posts(
      first: $first
      where: {
        orderby: { field: DATE, order: DESC }
        metaQuery: { metaArray: [{ key: "gallery_id", value: $galleryId, compare: EQUAL_TO }] }
      }
    ) {
      nodes {
        id
        databaseId
        date
        title
      }
    }
  }
`

const MINOR_BOARD_LIST_ATTEMPT_5 = gql`
  query MinorBoardListByMetaQuery2($galleryId: String!, $first: Int = 50) {
    posts(
      first: $first
      where: {
        orderby: { field: DATE, order: DESC }
        metaQuery: { metaArray: [{ key: "gallery_id", value: $galleryId }] }
      }
    ) {
      nodes {
        id
        databaseId
        date
        title
      }
    }
  }
`

// Alternate custom resolver shapes
const MINOR_BOARD_LIST_ATTEMPT_6 = gql`
  query MinorBoardListByGalleryId3($galleryId: String!, $limit: Int = 50) {
    dcinsideMinorPostsByGalleryId(galleryId: $galleryId, limit: $limit) {
      nodes {
        id
        databaseId
        date
        title
        writer
        viewCount
        recommendCount
        headText
      }
    }
  }
`

const MINOR_BOARD_LIST_ATTEMPT_3 = gql`
  query MinorBoardListFallback($first: Int = 50) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        databaseId
        date
        title
      }
    }
  }
`

const GALLERY_LIST_PAGE_QUERY = gql`
  query GalleryListPage($galleryId: String!, $first: Int = 50) {
    dcinsideGalleryByGalleryId(galleryId: $galleryId) {
      galleryId
      databaseId
      postName
      title
      ownerDisplayName
      ownerNickname
      status
      score
      position
    }

    dcinsidePostsByGalleryId(galleryId: $galleryId, first: $first) {
      id
      databaseId
      date
      title
    }
  }
`

const GALLERY_PARENT_TOPICS = [
  '연예',
  '게임',
  '취미',
  '만화/애니',
  '해외방송',
  '음식',
  '국내방송',
  '음악',
  '스포츠',
  '스포츠스타',
  '생활',
  '학술',
  '대학',
  '직업',
  '금융/재테크',
  '성공/계발',
  '디지털/IT',
  '교통/운송',
  '건강/심리',
  '교육',
  '수능',
]

const GALLERY_META_WITH_DESCRIPTION_QUERY = gql`
  query GalleryMetaWithDescription($parentTopics: [String!], $limit: Int, $galleryTypeName: String) {
    dcinsideGalleryTopicTree(parentTopics: $parentTopics, limit: $limit, galleryTypeName: $galleryTypeName) {
      child {
        galleries {
          databaseId
          slug
          title
          description
        }
      }
    }
  }
`

const GALLERY_META_QUERY = gql`
  query GalleryMeta($parentTopics: [String!], $limit: Int, $galleryTypeName: String) {
    dcinsideGalleryTopicTree(parentTopics: $parentTopics, limit: $limit, galleryTypeName: $galleryTypeName) {
      child {
        galleries {
          databaseId
          slug
          title
        }
      }
    }
  }
`

function flattenGalleries(treeNodes) {
  return (treeNodes ?? []).flatMap((topic) => (topic?.child ?? []).flatMap((child) => child?.galleries ?? []))
}

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

function formatWrittenAt(isoDate) {
  if (!isoDate) return '-'
  const d = dayjs(isoDate)
  if (!d.isValid()) return '-'
  return d.format('YY/MM/DD')
}

function toRows(nodes) {
  return nodes.map((node, idx) => {
    const postNo = node?.databaseId ? String(node.databaseId) : '-'
    const seed = Number(node?.databaseId ?? idx + 1)
    const writer = node?.writer || node?.authorName
    const viewCount = typeof node?.viewCount === 'number' ? node.viewCount : (seed * 13) % 50000
    const recommendCount = typeof node?.recommendCount === 'number' ? node.recommendCount : (seed * 7) % 300
    const headText = node?.headText
    return {
      no: postNo,
      postDatabaseId: node?.databaseId ?? null,
      type: headText || (idx < 2 ? '공지' : '일반'),
      title: stripHtml(node?.title) || '제목 없음',
      writer: writer || (idx < 2 ? '운영자' : `갤러${(seed % 90) + 10}`),
      writtenAt: formatWrittenAt(node?.date),
      viewCount,
      recommendCount,
    }
  })
}

function isSchemaMismatchError(message) {
  if (!message) return false
  return /Cannot query field|Unknown type|Unknown argument|not defined by type|did you mean|InputObject/i.test(message)
}

export function GallMinorBoardListPage() {
  const loc = useLocation()
  const [searchParams] = useSearchParams()
  const { isAuthed, viewer, logout } = useAuth()
  const galleryId = searchParams.get('id') || 'mgallery'
  const boardBase = loc.pathname.includes('/gall/mini/')
    ? 'mini'
    : loc.pathname.includes('/gall/p/') || loc.pathname.includes('/gall/person/')
      ? 'p'
      : loc.pathname.includes('/gall/board/')
        ? 'board'
        : 'mgallery'
  const [pageSize, setPageSize] = useState(50)

  const { data, loading, error } = useQuery(GALLERY_LIST_PAGE_QUERY, {
    variables: { galleryId, first: pageSize },
    fetchPolicy: 'network-only',
  })

  const rows = useMemo(() => {
    return toRows(data?.dcinsidePostsByGalleryId ?? [])
  }, [data])
  const galleryDetail = data?.dcinsideGalleryByGalleryId ?? null
  const galleryTitle = galleryDetail?.title ? stripHtml(galleryDetail.title) : `${galleryId} 갤러리`
  const galleryStatus = galleryDetail?.status || '-'
  const galleryPosition = galleryDetail?.position ?? '-'
  const galleryScore = galleryDetail?.score ?? '-'
  const galleryPostName = galleryDetail?.postName || '일반'
  const ownerDisplayName = galleryDetail?.ownerDisplayName || ''
  const ownerNickname = galleryDetail?.ownerNickname || ''
  const managerLabel = (ownerDisplayName || ownerNickname || '').trim() || '-'
  const displayName = viewer?.username || viewer?.name || '회원'
  const loginHref = `/sign/login?s_url=${encodeURIComponent(`${loc.pathname}${loc.search}`)}`
  const writeHref = boardBase === 'board' ? '' : `/gall/${boardBase}/board/write/?id=${encodeURIComponent(galleryId)}`

  return (
    <section className="grid grid-cols-[1fr_300px] gap-3">
      <div className="border border-[#3b4890] bg-white">
        <div className="border-b border-[#d5dbe6] px-3 py-2">
          <h2 className="text-[32px] leading-none font-bold tracking-[-0.02em] text-[#232c5f]">{galleryTitle}</h2>
        </div>

        <div className="grid grid-cols-[1fr_190px] border-b border-[#d9d9d9] bg-[#f7f8fb]">
          <div className="px-3 py-2 text-[12px] text-[#666]">
            <div>게시물 목록입니다. 최신순으로 표시됩니다.</div>
            <div className="mt-1 text-[#888]">
              상태: {galleryStatus}
              <span className="mx-1 text-[#bbb]">|</span>
              galleryId: {galleryDetail?.galleryId || galleryId}
              <span className="mx-1 text-[#bbb]">|</span>
              DB: {galleryDetail?.databaseId ?? '-'}
            </div>
            {error ? <div className="mt-1 text-[#d31900]">불러오기 실패: {firstGraphQLErrorMessage(error)}</div> : null}
          </div>
          <div className="border-l border-[#d9d9d9] px-3 py-2 text-center">
            <div className="text-[34px] font-bold leading-none text-[#222]">{loading ? '--' : galleryPosition}</div>
            <div className="mt-1 text-[12px] font-semibold text-[#2f3d8f]">흥한갤 순위</div>
            <div className="mt-1 text-[11px] text-[#666]">점수 {loading ? '--' : galleryScore}</div>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-[#d9d9d9] px-3 py-1.5 text-[12px]">
          <div className="flex items-center gap-3 text-[#444]">
            <button type="button" className="rounded-sm border border-[#2f3d8f] bg-[#3b4890] px-3 py-1 font-bold text-white">
              전체글
            </button>
            <button type="button" className="rounded-sm border border-[#cfd4dd] bg-white px-3 py-1 font-semibold text-[#444]">
              개념글
            </button>
            <button type="button" className="rounded-sm border border-[#cfd4dd] bg-white px-3 py-1 font-semibold text-[#444]">
              공지
            </button>
            <span className="ml-3 text-[#333]">{galleryPostName}</span>
          </div>
          <div className="flex items-center gap-1">
            <select
              value={String(pageSize)}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-[22px] border border-[#cfcfcf] bg-white px-1 text-[12px] text-[#444]"
            >
              <option value="20">20개</option>
              <option value="50">50개</option>
              <option value="100">100개</option>
            </select>
            {writeHref ? (
              <Link to={writeHref} className="inline-flex h-[22px] items-center rounded-sm border border-[#9da9c6] bg-white px-2 text-[12px] font-bold text-[#2f3d8f]">
                ✎ 글쓰기
              </Link>
            ) : null}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-[12px]">
            <colgroup>
              <col className="w-[78px]" />
              <col className="w-[62px]" />
              <col />
              <col className="w-[120px]" />
              <col className="w-[74px]" />
              <col className="w-[58px]" />
              <col className="w-[58px]" />
            </colgroup>
            <thead>
              <tr className="border-y border-[#2f3d8f] bg-white text-[#333]">
                <th className="px-2 py-2 font-semibold">번호</th>
                <th className="px-2 py-2 font-semibold">말머리</th>
                <th className="px-2 py-2 text-left font-semibold">제목</th>
                <th className="px-2 py-2 font-semibold">글쓴이</th>
                <th className="px-2 py-2 font-semibold">작성일</th>
                <th className="px-2 py-2 font-semibold">조회</th>
                <th className="px-2 py-2 font-semibold">추천</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-2 py-8 text-center text-[#666]" colSpan={7}>
                    게시글 불러오는 중...
                  </td>
                </tr>
              ) : null}
              {!loading && error ? (
                <tr>
                  <td className="px-2 py-8 text-center text-[#d31900]" colSpan={7}>
                    게시글을 불러오지 못했습니다: {firstGraphQLErrorMessage(error)}
                  </td>
                </tr>
              ) : null}
              {!loading && !error && rows.length === 0 ? (
                <tr>
                  <td className="px-2 py-8 text-center text-[#666]" colSpan={7}>
                    게시글이 없습니다.
                  </td>
                </tr>
              ) : null}
              {!loading && !error
                ? rows.map((row) => (
                    <tr key={`${row.no}_${row.title}`} className="border-b border-[#efefef] text-[#333]">
                      <td className="px-2 py-1.5 text-center text-[#666]">{row.no}</td>
                      <td className="px-2 py-1.5 text-center text-[#666]">{row.type}</td>
                      <td className="px-2 py-1.5">
                        {row.postDatabaseId ? (
                          <Link
                            to={`/gall/${boardBase}/board/view/?id=${encodeURIComponent(galleryId)}&no=${encodeURIComponent(
                              String(row.postDatabaseId),
                            )}`}
                            className="block truncate hover:underline"
                          >
                            {row.title}
                          </Link>
                        ) : (
                          <span className="block truncate">{row.title}</span>
                        )}
                      </td>
                      <td className="truncate px-2 py-1.5 text-center text-[#444]">{row.writer}</td>
                      <td className="px-2 py-1.5 text-center text-[#666]">{row.writtenAt}</td>
                      <td className="px-2 py-1.5 text-center text-[#666]">{row.viewCount}</td>
                      <td className="px-2 py-1.5 text-center text-[#666]">{row.recommendCount}</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="space-y-3">
        <div className="border border-[#d3d7e2] bg-white">
          {isAuthed ? (
            <>
              <div className="flex items-center justify-between border-b border-[#e5e8f0] px-3 py-2">
                <div className="text-[20px] font-bold text-[#3b4890]">
                  <span className="truncate">{displayName}</span>
                  <span className="ml-1 text-[14px] text-[#233f95]">님</span>
                </div>
                <button
                  type="button"
                  className="h-[28px] rounded border border-[#243f93] bg-[#2f4aa0] px-3 text-[12px] font-bold text-white"
                  onClick={logout}
                >
                  로그아웃
                </button>
              </div>
              <div className="flex items-center justify-center gap-3 px-3 py-3 text-[12px] font-semibold text-[#444]">
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  즐겨찾기
                </a>
                <span className="text-[#bbb]">|</span>
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  스크랩
                </a>
                <span className="text-[#bbb]">|</span>
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  알림
                </a>
              </div>
            </>
          ) : (
            <>
              <Link to={loginHref} className="block border-b border-[#e5e8f0] px-3 py-2 text-[34px] font-bold text-[#3b4890]">
                로그인해 주세요.
              </Link>
              <div className="flex items-center justify-center gap-3 px-3 py-3 text-[12px] font-semibold text-[#444]">
                <span>즐겨찾기</span>
                <span className="text-[#bbb]">|</span>
                <span>스크랩</span>
                <span className="text-[#bbb]">|</span>
                <span>알림</span>
              </div>
            </>
          )}
        </div>

        <div className="border border-[#d3d7e2] bg-white p-3">
          <div className="mb-2 text-[14px] font-bold text-[#222]">갤러리 정보</div>
          <dl className="grid grid-cols-[64px_1fr] gap-x-3 gap-y-2 text-[12px] text-[#444]">
            <dt className="font-semibold">매니저</dt>
            <dd className="truncate">
              {managerLabel}{galleryDetail?.galleryId ? ` (${galleryDetail.galleryId})` : ''}
            </dd>
            <dt className="font-semibold">부매니저</dt>
            <dd className="truncate">없음</dd>
            <dt className="font-semibold">개설일</dt>
            <dd className="truncate">-</dd>
          </dl>
          <a
            href="#"
            className="mt-2 inline-block text-[12px] text-[#2f4aa0] hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            갤러리 관리 내역
          </a>
        </div>

        <div className="border border-[#d3d7e2] bg-white p-3">
          <div className="mb-2 text-[20px] font-bold text-[#2b3f90]">실시간 베스트</div>
          <div className="h-[78px] bg-[#eff3f8]" />
        </div>
      </aside>
    </section>
  )
}

