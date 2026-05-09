import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'
import { useAuth } from '../../auth/authContext'
import { GallogShell } from './GallogShell'

const GALLOG_POSTS_QUERY = gql`
  query GallogUserPosts($first: Int = 100, $authorName: String!) {
    posts(first: $first, where: { authorName: $authorName, orderby: { field: DATE, order: DESC } }) {
      nodes {
        databaseId
        title
        date
        uri
        dcinsideGalleryId
        dcinsideGalleryType
      }
    }
  }
`

const TAB_KEYS = ['all', 'main', 'minor', 'mini', 'person']

function stripHtml(html) {
  if (!html) return ''
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function pickPostTitle(node) {
  const t = node?.title
  if (typeof t === 'string') return t
  if (t && typeof t === 'object' && typeof t.rendered === 'string') return t.rendered
  return ''
}

function normalizeDcinsideGalleryType(raw) {
  const s = String(raw ?? '').trim().toUpperCase()
  if (!s) return 'MAIN'
  if (s === '메인' || s === 'MAIN') return 'MAIN'
  if (s === '마이너' || s === 'MINOR') return 'MINOR'
  if (s === '미니' || s === 'MINI') return 'MINI'
  if (s === '인물' || s === 'PERSON') return 'PERSON'
  if (s.includes('인물') || s.includes('PERSON')) return 'PERSON'
  if (s.includes('미니') || s.includes('MINI')) return 'MINI'
  if (s.includes('마이너') || s.includes('MINOR')) return 'MINOR'
  return 'MAIN'
}

function galleryTypeShortLabel(typeRaw) {
  const t = normalizeDcinsideGalleryType(typeRaw)
  if (t === 'MAIN') return '메인'
  if (t === 'MINOR') return '마이너'
  if (t === 'MINI') return '미니'
  if (t === 'PERSON') return '인물'
  return t || ''
}

function boardBasePrefixForGalleryType(typeRaw) {
  const t = normalizeDcinsideGalleryType(typeRaw)
  if (t === 'MAIN') return '/gall/board'
  if (t === 'MINOR') return '/gall/mgallery/board'
  if (t === 'MINI') return '/gall/mini/board'
  if (t === 'PERSON') return '/gall/p/board'
  return '/gall/board'
}

function buildDcinsidePostViewHref({ galleryType, galleryId, postDatabaseId }) {
  if (galleryId == null || String(galleryId).trim() === '') return null
  if (postDatabaseId == null) return null
  const base = boardBasePrefixForGalleryType(galleryType)
  const gid = encodeURIComponent(String(galleryId).trim())
  const no = encodeURIComponent(String(postDatabaseId))
  return `${base}/view/?id=${gid}&no=${no}`
}

function buildDcinsideGalleryListHref({ galleryType, galleryId }) {
  if (galleryId == null || String(galleryId).trim() === '') return null
  const base = boardBasePrefixForGalleryType(galleryType)
  const gid = encodeURIComponent(String(galleryId).trim())
  return `${base}/lists/?id=${gid}`
}

function postMatchesGalleryTab(node, tabKey) {
  if (tabKey === 'all') return true
  const t = normalizeDcinsideGalleryType(node?.dcinsideGalleryType)
  const map = { main: 'MAIN', minor: 'MINOR', mini: 'MINI', person: 'PERSON' }
  return t === map[tabKey]
}

function postMatchesTitleQuery(node, qRaw) {
  const q = String(qRaw ?? '')
    .trim()
    .toLowerCase()
  if (!q) return true
  const title = stripHtml(pickPostTitle(node)).toLowerCase()
  return title.includes(q)
}

function formatWrittenAt(iso) {
  if (!iso) return '-'
  const d = dayjs(iso)
  return d.isValid() ? d.format('YYYY.MM.DD HH:mm') : '-'
}

export function GallogPostingPage() {
  const { userId = '', galleryType: routeGalleryTab = 'all' } = useParams()
  const { viewer } = useAuth()
  const currentUserId = (viewer?.username || viewer?.userId || '').trim()
  const targetUserId = decodeURIComponent(userId || currentUserId || 'user')
  const safeGalleryTab = TAB_KEYS.includes(routeGalleryTab) ? routeGalleryTab : 'all'
  const postingPath = (type) => `/gallog/${encodeURIComponent(targetUserId)}/posting/${type}`

  const [titleQueryDraft, setTitleQueryDraft] = useState('')
  const [titleQueryApplied, setTitleQueryApplied] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')

  const postsQuery = useQuery(GALLOG_POSTS_QUERY, {
    skip: !targetUserId,
    variables: { first: 100, authorName: targetUserId },
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  })

  const nodes = postsQuery.data?.posts?.nodes ?? []

  const tabCounts = useMemo(() => {
    const c = { all: nodes.length, main: 0, minor: 0, mini: 0, person: 0 }
    for (const n of nodes) {
      const t = normalizeDcinsideGalleryType(n?.dcinsideGalleryType)
      if (t === 'MAIN') c.main++
      else if (t === 'MINOR') c.minor++
      else if (t === 'MINI') c.mini++
      else if (t === 'PERSON') c.person++
    }
    return c
  }, [nodes])

  const tabLabels = {
    all: '전체',
    main: '갤러리',
    minor: '마이너갤',
    mini: '미니갤',
    person: '인물갤',
  }

  const filteredPosts = useMemo(() => {
    const step1 = nodes.filter((n) => postMatchesGalleryTab(n, safeGalleryTab))
    const step2 = step1.filter((n) => postMatchesTitleQuery(n, titleQueryApplied))
    const sorted = [...step2].sort((a, b) => {
      const da = dayjs(a.date).valueOf()
      const db = dayjs(b.date).valueOf()
      if (!Number.isFinite(da) || !Number.isFinite(db)) return 0
      return sortOrder === 'asc' ? da - db : db - da
    })
    return sorted
  }, [nodes, safeGalleryTab, titleQueryApplied, sortOrder])

  function applyTitleSearch() {
    setTitleQueryApplied(titleQueryDraft.trim())
  }

  function onSearchSubmit(e) {
    e.preventDefault()
    applyTitleSearch()
  }

  return (
    <GallogShell targetUserId={targetUserId} activeMenu="posting">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2f3d8f] pb-1">
        <div className="flex flex-wrap items-center gap-3">
          {TAB_KEYS.map((key) => (
            <Link
              key={key}
              to={postingPath(key)}
              className={
                safeGalleryTab === key
                  ? 'border-b-2 border-[#2f3d8f] pb-0.5 text-[13px] font-bold text-[#d31900]'
                  : 'text-[13px] font-semibold text-[#333] hover:underline'
              }
            >
              {tabLabels[key]}({tabCounts[key]})
            </Link>
          ))}
        </div>
        <form
          className="flex items-center border border-[#d7d7d7] bg-white"
          onSubmit={onSearchSubmit}
          role="search"
        >
          <input
            value={titleQueryDraft}
            onChange={(e) => setTitleQueryDraft(e.target.value)}
            className="h-[24px] w-[210px] px-2 text-[12px] outline-none"
            placeholder="게시글 제목 검색"
            aria-label="게시글 제목 검색"
          />
          <button
            type="submit"
            className="h-[24px] w-[24px] border-l border-[#d7d7d7] bg-[#f3f3f3] text-[11px]"
            aria-label="검색"
          >
            🔍
          </button>
        </form>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="h-[30px] min-w-[160px] border border-[#d7d7d7] bg-[#f8f8f8] px-2 text-[12px]"
          aria-label="정렬"
        >
          <option value="desc">최신순</option>
          <option value="asc">오래된순</option>
        </select>
        <span className="inline-flex h-[22px] items-center rounded bg-[#2f3d8f] px-2 text-[11px] font-semibold text-white">
          공개
        </span>
      </div>

      {postsQuery.loading ? (
        <div className="mt-3 flex min-h-[420px] items-center justify-center border-y border-[#2f3d8f] text-[14px] text-[#666]">
          불러오는 중…
        </div>
      ) : postsQuery.error ? (
        <div className="mt-3 flex min-h-[420px] flex-col items-center justify-center gap-2 border-y border-[#2f3d8f] px-4 text-center text-[13px] text-[#d31900]">
          <div>게시글을 불러오지 못했습니다: {firstGraphQLErrorMessage(postsQuery.error)}</div>
          <div className="text-[11px] text-[#888]">
            WPGraphQL에서 <code className="rounded bg-[#f3f3f3] px-1">posts(where: &#123; authorName &#125;)</code> 가
            다르면 스키마에 맞게 쿼리를 수정해야 합니다.
          </div>
        </div>
      ) : nodes.length === 0 ? (
        <div className="mt-3 flex min-h-[420px] items-center justify-center border-y border-[#2f3d8f] text-[48px] font-bold tracking-[-0.03em] text-[#444]">
          게시글이 없습니다.
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="mt-3 flex min-h-[420px] flex-col items-center justify-center gap-2 border-y border-[#2f3d8f] text-[14px] text-[#666]">
          <span>조건에 맞는 게시글이 없습니다.</span>
          <span className="text-[12px] text-[#999]">
            갤 종류 탭·제목 검색·정렬을 바꿔 보세요.
          </span>
        </div>
      ) : (
        <div className="mt-3 border-y border-[#2f3d8f]">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#ddd] bg-[#f7f8fb] text-[#333]">
                <th className="w-[52px] px-2 py-2 text-center font-bold">No</th>
                <th className="w-[72px] px-2 py-2 text-center font-bold">구분</th>
                <th className="px-2 py-2 text-left font-bold">제목</th>
                <th className="w-[130px] px-2 py-2 text-center font-bold">갤러리</th>
                <th className="w-[130px] px-2 py-2 text-center font-bold">작성일</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((node, idx) => {
                const title = stripHtml(pickPostTitle(node)) || '제목 없음'
                const galleryId =
                  node.dcinsideGalleryId != null ? String(node.dcinsideGalleryId).trim() : ''
                const galleryType =
                  node.dcinsideGalleryType != null ? String(node.dcinsideGalleryType).trim() : ''
                const internalHref = buildDcinsidePostViewHref({
                  galleryType,
                  galleryId,
                  postDatabaseId: node.databaseId,
                })
                const listHref = buildDcinsideGalleryListHref({ galleryType, galleryId })
                const typeLabel = galleryTypeShortLabel(galleryType)

                return (
                  <tr key={node.databaseId ?? idx} className="border-b border-[#eee] hover:bg-[#fafafa]">
                    <td className="px-2 py-2 text-center text-[#888]">{node.databaseId ?? '-'}</td>
                    <td className="px-2 py-2 text-center text-[#555]">{typeLabel}</td>
                    <td className="px-2 py-2">
                      {internalHref ? (
                        <Link to={internalHref} className="font-semibold text-[#0035ca] hover:underline">
                          {title}
                        </Link>
                      ) : node.uri ? (
                        <a href={node.uri} className="font-semibold text-[#0035ca] hover:underline">
                          {title}
                        </a>
                      ) : (
                        <span className="font-semibold text-[#333]">{title}</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {listHref && galleryId ? (
                        <Link to={listHref} className="text-[#2e9b57] hover:underline">
                          {galleryId}
                        </Link>
                      ) : (
                        <span className="text-[#aaa]">-</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center text-[#666]">{formatWrittenAt(node.date)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </GallogShell>
  )
}
