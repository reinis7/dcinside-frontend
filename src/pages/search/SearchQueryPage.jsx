import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'

const SEARCH_POST_FIELDS_FRAGMENT = gql`
  fragment SearchPostFields on Post {
    id
    databaseId
    title
    excerpt
    date
    uri
    dcinsideGalleryId
    dcinsideGalleryType
    categories {
      edges {
        node {
          id
          name
        }
      }
    }
    author {
      node {
        name
      }
    }
  }
`

const SEARCH_POSTS_QUERY = gql`
  query SearchPosts($keyword: String!, $first: Int = 25) {
    posts(first: $first, where: { search: $keyword, orderby: { field: DATE, order: DESC } }) {
      nodes {
        ...SearchPostFields
      }
    }
  }
  ${SEARCH_POST_FIELDS_FRAGMENT}
`

const SEARCH_POSTS_RELEVANCE_QUERY = gql`
  query SearchPostsByRelevance($keyword: String!, $first: Int = 25) {
    posts(first: $first, where: { search: $keyword, orderby: { field: RELEVANCE, order: DESC } }) {
      nodes {
        ...SearchPostFields
      }
    }
  }
  ${SEARCH_POST_FIELDS_FRAGMENT}
`

/**
 * 갤 검색은 「갤 이름(제목)」과 「갤 ID(slug/post_name·DB id)」에만 매칭합니다.
 * dcinsideGalleryByGalleryId는 제목 검색 시 GraphQL 에러(Gallery not found)를 내면
 * 같은 문서의 contentNodes까지 클라이언트에서 망가질 수 있어 단건 조회는 별도 요청(errorPolicy: ignore)으로 둡니다.
 * - SearchGalleryContentNodes: contentNodes만 (한 번의 요청)
 * - SearchGalleryLookupById: 갤 ID 정확 조회 (실패 시 무시)
 * - 게시물 검색(SearchPosts*) 노드에서 dcinsideGalleryId 병합
 */
export const SEARCH_GALLERIES_PROMPT_QUERY = `
query SearchGalleryContentNodes($keyword: String!, $first: Int = 60) {
  galleryContentNodes: contentNodes(
    first: $first
    where: { search: $keyword, orderby: { field: MODIFIED, order: DESC } }
  ) {
    nodes {
      __typename
      ... on Gallery {
        databaseId
        slug
        title
      }
      ... on NodeWithTitle {
        title
      }
      ... on DatabaseIdentifier {
        databaseId
      }
      ... on ContentNode {
        slug
      }
    }
  }
}

query SearchGalleryLookupById($galleryId: String!) {
  dcinsideGalleryByGalleryId(galleryId: $galleryId) {
    galleryId
    databaseId
    postName
    title
    score
  }
}

# 게시물 검색과 변수 공유 → dcinsideGalleryId 병합
# query SearchPosts($keyword: String!, $first: Int = 25) { posts(where: { search: $keyword }) { nodes { dcinsideGalleryId dcinsideGalleryType } } }
`

const SEARCH_GALLERY_LOOKUP_BY_ID_QUERY = gql`
  query SearchGalleryLookupById($galleryId: String!) {
    dcinsideGalleryByGalleryId(galleryId: $galleryId) {
      galleryId
      databaseId
      postName
      title
      score
    }
  }
`

const SEARCH_GALLERIES_MERGED_QUERY = gql`
  query SearchGalleryContentNodes($keyword: String!, $first: Int = 60) {
    galleryContentNodes: contentNodes(
      first: $first
      where: { search: $keyword, orderby: { field: MODIFIED, order: DESC } }
    ) {
      nodes {
        __typename
        ... on Gallery {
          databaseId
          slug
          title
        }
        ... on NodeWithTitle {
          title
        }
        ... on DatabaseIdentifier {
          databaseId
        }
        ... on ContentNode {
          slug
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

function stripHtml(html) {
  if (!html) return ''
  const plain = String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return decodeHtmlEntities(plain)
}

function normalizeKeyword(raw) {
  return String(raw ?? '')
    .trim()
    .replace(/\s+/g, ' ')
}

function normalizeKeywordForMatch(raw) {
  try {
    return String(raw ?? '')
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
  } catch {
    return String(raw ?? '')
      .trim()
      .toLowerCase()
  }
}

function nfLower(s) {
  try {
    return String(s ?? '')
      .normalize('NFC')
      .toLowerCase()
  } catch {
    return String(s ?? '').toLowerCase()
  }
}

/** 갤 검색 보조(contentNodes): 제목(이름)·slug/post_name·DB id 문자열만 매칭 (본문·설명 등 제외) */
function galleryMatchesNameOrId(poolRow, keywordLower) {
  const title = nfLower(stripHtml(poolRow?.title || ''))
  const slug = nfLower(String(poolRow?.slug ?? '').trim())
  const db = nfLower(String(poolRow?.databaseId ?? '').trim())
  return (
    title.includes(keywordLower) ||
    slug.includes(keywordLower) ||
    (db.length > 0 && keywordLower.length > 0 && db.includes(keywordLower))
  )
}

function formatPostDate(iso) {
  if (!iso) return '-'
  const d = dayjs(iso)
  return d.isValid() ? d.format('YYYY.MM.DD HH:mm') : '-'
}

function snippetFromPost(node, maxLen = 140) {
  const ex = stripHtml(node?.excerpt)
  if (ex) return ex.length > maxLen ? `${ex.slice(0, maxLen)}…` : ex
  const t = stripHtml(node?.title)
  return t.length > maxLen ? `${t.slice(0, maxLen)}…` : t
}

/** dcinsideGalleryType → SPA 게시판 base 경로 (gallRoutes와 동일 규칙) */
function boardBasePrefixForGalleryType(typeRaw) {
  const t = String(typeRaw ?? '')
    .trim()
    .toUpperCase()
  if (t === 'MAIN') return '/gall/board'
  if (t === 'MINOR') return '/gall/mgallery/board'
  if (t === 'MINI') return '/gall/mini/board'
  if (t === 'PERSON') return '/gall/p/board'
  return '/gall/board'
}

function galleryTypeShortLabel(typeRaw) {
  const t = String(typeRaw ?? '')
    .trim()
    .toUpperCase()
  if (t === 'MAIN') return '메인'
  if (t === 'MINOR') return '마이너'
  if (t === 'MINI') return '미니'
  if (t === 'PERSON') return '인물'
  return t || ''
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

/** slug 기준 중복 제거 */
function dedupeGalleryMerge(primary, secondary) {
  const seen = new Set()
  const out = []
  for (const g of [...primary, ...secondary]) {
    const id = String(g.slug ?? g.databaseId ?? '').trim()
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push(g)
  }
  return out
}

function normalizeBackendGalleryTypeEnum(raw) {
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

/** dcinsideGalleryByGalleryId 단건 조회 → 검색 풀 행 (스키마에 galleryType 없으면 메인으로 간주) */
function mapDcinsideGalleryLookupToPool(row) {
  if (!row) return null
  const slug = String(row.galleryId ?? row.postName ?? '').trim()
  const id = slug || String(row.databaseId ?? '').trim()
  if (!id) return null
  return {
    databaseId: row.databaseId,
    slug: id,
    title: row.title,
    description: '',
    galleryTypeEnum: normalizeBackendGalleryTypeEnum(row.galleryType ?? row.galleryTypeName),
    score: row.score,
    _source: 'dcinsideGalleryByGalleryId',
  }
}

/**
 * contentNodes 검색 결과 중 갤 후보로 남길 노드.
 * WPGraphQL에서 갤 CPT가 GraphQL 타입 Post로만 노출되는 경우가 많아 Post는 제외하지 않는다.
 * (일반 글 노이즈는 galleryHitsMerged 단계의 galleryMatchesNameOrId로 줄인다.)
 * Page·MediaItem만 제외한다.
 */
function isLikelyGalleryContentNode(node) {
  if (!node) return false
  const t = node?.__typename || ''
  if (t === 'Page' || t === 'MediaItem') return false
  if (/gallery/i.test(t)) return true
  if (/dcinside/i.test(t)) return true
  if (t === 'Post') return true
  if (t.length > 0) return true
  const slug = String(node.slug ?? '').trim()
  const db = node.databaseId != null ? String(node.databaseId).trim() : ''
  const title = pickTitleFromNode(node).trim()
  return Boolean(slug || db || title)
}

function pickTitleFromNode(node) {
  const raw = node?.title
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object' && typeof raw.rendered === 'string') return raw.rendered
  return ''
}

function mapContentNodeToPool(node) {
  if (!node || !isLikelyGalleryContentNode(node)) return null
  const slug = String(node.slug ?? '').trim()
  const title = pickTitleFromNode(node)
  const id = slug || String(node.databaseId ?? '').trim()
  if (!id) return null
  const typename = node.__typename || ''
  let galleryTypeEnum = 'MAIN'
  if (/인물|person|people/i.test(typename)) galleryTypeEnum = 'PERSON'
  else if (/미니|mini/i.test(typename)) galleryTypeEnum = 'MINI'
  else if (/마이너|minor/i.test(typename)) galleryTypeEnum = 'MINOR'
  return {
    databaseId: node.databaseId,
    slug: id,
    title,
    description: '',
    galleryTypeEnum,
    score: undefined,
    _source: 'contentNodes',
    __typename: typename,
  }
}

/** posts 검색 결과에서 갤 메타만 뽑기 — 갤 ID 문자열이 검색어와 이름·ID 규칙으로 맞을 때만 */
function mapPostsSearchToGalleryRows(nodes, keywordRaw) {
  const kw = normalizeKeywordForMatch(keywordRaw)
  const seen = new Set()
  const rows = []
  for (const node of nodes ?? []) {
    const gid = node?.dcinsideGalleryId != null ? String(node.dcinsideGalleryId).trim() : ''
    if (!gid || seen.has(gid)) continue
    const galleryType =
      node?.dcinsideGalleryType != null ? String(node.dcinsideGalleryType).trim() : ''
    const row = {
      databaseId: undefined,
      slug: gid,
      title: gid,
      description: '',
      galleryTypeEnum: normalizeBackendGalleryTypeEnum(galleryType),
      score: undefined,
      _source: 'postsSearch',
    }
    if (!galleryMatchesNameOrId(row, kw)) continue
    seen.add(gid)
    rows.push(row)
  }
  return rows
}

/** contentNodes 전용 응답만 매핑 (단건 조회는 별도 쿼리) */
function galleryHitsFromContentNodesSearch(data, keywordRaw) {
  const kw = normalizeKeywordForMatch(keywordRaw)
  const rows = []
  for (const node of data?.galleryContentNodes?.nodes ?? []) {
    const m = mapContentNodeToPool(node)
    if (!m) continue
    // 서버 search가 돌려준 Gallery 타입은 이미 검색어 매칭으로 들어온 것으로 간주(유니코드·클라 필터 불일치 방지)
    const isRootGalleryTypename =
      typeof node?.__typename === 'string' && /^gallery$/i.test(String(node.__typename))
    if (isRootGalleryTypename || galleryMatchesNameOrId(m, kw)) rows.push(m)
  }
  return dedupeGalleryMerge(rows, [])
}

const TABS = [
  { id: 'integrated', label: '통합' },
  { id: 'gallery', label: '갤러리' },
  { id: 'video', label: '동영상' },
  { id: 'posts', label: '게시물' },
]

export function SearchQueryPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const keywordParam = normalizeKeyword(searchParams.get('keyword') ?? '')
  const [draft, setDraft] = useState(keywordParam)
  const [activeTab, setActiveTab] = useState('integrated')
  const [postSort, setPostSort] = useState('latest')

  const hasKeyword = keywordParam.length > 0

  useEffect(() => {
    setDraft(keywordParam)
  }, [keywordParam])

  const galleryLookupQuery = useQuery(SEARCH_GALLERY_LOOKUP_BY_ID_QUERY, {
    skip: !hasKeyword,
    variables: { galleryId: keywordParam },
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  })

  const galleryMergedSearchQuery = useQuery(SEARCH_GALLERIES_MERGED_QUERY, {
    skip: !hasKeyword,
    variables: { keyword: keywordParam, first: 60 },
    /** 인메모리 캐시에 남은 불완전 Gallery 객체와 병합되면 slug/title이 빠져 행이 버려지는 경우 방지 */
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const postsQueryDate = useQuery(SEARCH_POSTS_QUERY, {
    skip: !hasKeyword || postSort !== 'latest',
    variables: { keyword: keywordParam, first: 25 },
    fetchPolicy: 'network-only',
  })

  const postsQueryRel = useQuery(SEARCH_POSTS_RELEVANCE_QUERY, {
    skip: !hasKeyword || postSort !== 'relevance',
    variables: { keyword: keywordParam, first: 25 },
    fetchPolicy: 'network-only',
  })

  const postsQuery = postSort === 'latest' ? postsQueryDate : postsQueryRel

  const galleryHits = useMemo(() => {
    const lookupPrimary = []
    const lookupHit = mapDcinsideGalleryLookupToPool(galleryLookupQuery.data?.dcinsideGalleryByGalleryId)
    if (lookupHit) lookupPrimary.push(lookupHit)

    const fromNodes = galleryHitsFromContentNodesSearch(galleryMergedSearchQuery.data, keywordParam)
    const mergedLookupNodes = dedupeGalleryMerge(lookupPrimary, fromNodes)

    const fromPosts = mapPostsSearchToGalleryRows(postsQuery.data?.posts?.nodes, keywordParam)
    return dedupeGalleryMerge(mergedLookupNodes, fromPosts)
  }, [
    galleryLookupQuery.data,
    galleryMergedSearchQuery.data,
    postsQuery.data,
    keywordParam,
  ])

  /** 게시물 검색은 갤 섹션 표시를 막지 않음 — contentNodes·단건 조회만 기다린다 (posts는 나중에 병합) */
  const gallerySearchLoading =
    galleryLookupQuery.loading || galleryMergedSearchQuery.loading

  const gallerySearchAnyError = galleryMergedSearchQuery.error || postsQuery.error

  const matchedGalleries = useMemo(() => {
    if (!hasKeyword) return []
    return galleryHits.slice(0, 60).map((g, idx) => {
      const id = g.slug || String(g.databaseId || '')
      const title = stripHtml(g.title) || id || '갤러리'
      const seed = Number(g.databaseId ?? idx + 1)
      const fakeNew = (seed % 5) + 1
      const fakeTotal = ((seed * 97) % 50_000) + 100
      const listHref = buildDcinsideGalleryListHref({
        galleryType: g.galleryTypeEnum,
        galleryId: id,
      })
      return {
        id,
        title,
        score: g.score,
        fakeNew,
        fakeTotal,
        galleryTypeEnum: g.galleryTypeEnum,
        typeLabel: galleryTypeShortLabel(g.galleryTypeEnum),
        listHref,
      }
    })
  }, [galleryHits, hasKeyword])

  const totalGalleryHits = galleryHits.length

  const postRows = useMemo(() => {
    const nodes = postsQuery.data?.posts?.nodes ?? []
    return nodes.map((node) => {
      const galleryId = node.dcinsideGalleryId != null ? String(node.dcinsideGalleryId).trim() : ''
      const galleryType = node.dcinsideGalleryType != null ? String(node.dcinsideGalleryType).trim() : ''
      const categoryName =
        node.categories?.edges?.find((e) => e?.node?.name)?.node?.name?.trim() || ''
      const internalViewHref = buildDcinsidePostViewHref({
        galleryType,
        galleryId,
        postDatabaseId: node.databaseId,
      })
      const galleryListHref = buildDcinsideGalleryListHref({ galleryType, galleryId })
      const galleryLineLabel =
        categoryName.length > 0
          ? `${categoryName} 갤러리`
          : galleryId
            ? `${galleryId} (${galleryTypeShortLabel(galleryType)})`
            : galleryTypeShortLabel(galleryType) || '갤러리'

      return {
        key: node.id || String(node.databaseId),
        databaseId: node.databaseId,
        title: stripHtml(node.title) || '제목 없음',
        snippet: snippetFromPost(node),
        writer: node.author?.node?.name?.trim() || '-',
        writtenAt: formatPostDate(node.date),
        wpUri: node.uri || '',
        galleryId,
        galleryType,
        galleryLineLabel,
        internalViewHref,
        galleryListHref,
      }
    })
  }, [postsQuery.data])

  function submitSearch(nextKeyword) {
    const q = normalizeKeyword(nextKeyword)
    if (!q) {
      setSearchParams({}, { replace: true })
      return
    }
    setSearchParams({ keyword: q }, { replace: false })
  }

  function onSubmitSearch(e) {
    e.preventDefault()
    submitSearch(draft)
  }

  function showGallerySection() {
    return activeTab === 'integrated' || activeTab === 'gallery'
  }

  function showPostsSection() {
    return activeTab === 'integrated' || activeTab === 'posts'
  }

  return (
    <div className="space-y-3">
      <div className="border border-[#cfcfcf] bg-white px-4 py-4">
        <form className="flex max-w-[720px] items-stretch gap-0" onSubmit={onSubmitSearch}>
          <input
            className="h-[44px] min-w-0 flex-1 border border-[#29367c] px-3 text-[14px] outline-none"
            placeholder="검색어를 입력하세요"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="검색어"
          />
          <button
            type="submit"
            className="h-[44px] shrink-0 bg-[#29367c] px-6 text-[14px] font-bold text-white hover:bg-[#1f2a5c]"
          >
            검색
          </button>
          <button
            type="button"
            className="ml-2 h-[44px] shrink-0 border border-[#29367c] bg-[#f5f6fb] px-4 text-[13px] font-semibold text-[#29367c] hover:bg-[#ebeefe]"
            onClick={() => navigate('/www')}
          >
            최근 방문
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ddd] bg-white px-3 py-2">
        <nav className="flex flex-wrap gap-4 text-[13px] font-bold">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                activeTab === tab.id
                  ? 'text-[#ff4200] underline decoration-[#ff4200] underline-offset-4'
                  : 'text-[#333] hover:text-[#2f3d8f]'
              }
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="text-[12px] text-[#666]">
          {hasKeyword ? (
            <>
              갤러리 검색 결과{' '}
              <span className="font-semibold text-[#222]">{totalGalleryHits.toLocaleString('ko-KR')}</span>건
              <span className="ml-1 text-[11px] text-[#aaa]">
                (contentNodes + 단건 조회 + 게시물 메타)
              </span>
              {gallerySearchAnyError ? (
                <span className="ml-2 text-[11px] text-[#c45c00]">(일부 요청 경고)</span>
              ) : null}
            </>
          ) : (
            <span className="text-[#888]">
              갤러리는 이름(제목) 또는 갤 ID(slug)로만 찾습니다.
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_300px]">
        <div className="space-y-3">
          {activeTab === 'video' ? (
            <section className="border border-[#3b4890] bg-white p-8 text-center text-[13px] text-[#666]">
              동영상 검색은 준비 중입니다.
            </section>
          ) : null}

          {showGallerySection() ? (
            <section className="border border-[#3b4890] bg-white">
              <div className="flex items-center justify-between border-b border-[#d9d9d9] px-3 py-2">
                <h2 className="text-[14px] font-bold text-[#222]">
                  갤러리{' '}
                  <span className="text-[#2f3d8f]">{hasKeyword ? `${matchedGalleries.length}건` : ''}</span>
                </h2>
              </div>
              {!hasKeyword ? (
                <div className="px-3 py-8 text-center text-[12px] text-[#888]">검색어를 입력해 주세요.</div>
              ) : gallerySearchLoading ? (
                <div className="px-3 py-8 text-center text-[12px] text-[#666]">갤러리 검색 중…</div>
              ) : matchedGalleries.length > 0 ? (
                <ul className="divide-y divide-[#efefef] px-3 py-2 text-[12px] text-[#333]">
                  {matchedGalleries.map((g) => (
                    <li key={`${g.galleryTypeEnum}_${g.id}`} className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2">
                      <span className="rounded bg-[#f0f2f8] px-1.5 py-0.5 text-[10px] font-semibold text-[#555]">
                        {g.typeLabel}
                      </span>
                      {g.listHref ? (
                        <Link to={g.listHref} className="font-semibold text-[#0035ca] hover:underline">
                          {g.title}
                        </Link>
                      ) : (
                        <span className="font-semibold text-[#0035ca]">{g.title}</span>
                      )}
                      <span className="text-[11px] text-[#888]">
                        새글 {g.fakeNew}/{g.fakeTotal.toLocaleString('ko-KR')}
                      </span>
                      {typeof g.score === 'number' ? (
                        <span className="text-[11px] text-[#aaa]">점수 {g.score}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-8 text-center text-[12px] text-[#888]">
                  {galleryMergedSearchQuery.error ? (
                    <div className="mb-2 text-[12px] text-[#d31900]">
                      contentNodes 갤 검색 오류: {firstGraphQLErrorMessage(galleryMergedSearchQuery.error)}
                    </div>
                  ) : null}
                  {postsQuery.error ? (
                    <div className="mb-2 text-[12px] text-[#d31900]">
                      게시물 검색 오류(갤 메타 병합에 사용):{' '}
                      {firstGraphQLErrorMessage(postsQuery.error)}
                    </div>
                  ) : null}
                  「{keywordParam}」와 맞는 갤러리가 없습니다.
                  <div className="mt-1 text-[11px] text-[#aaa]">
                    단건 조회·contentNodes·게시물 검색으로 모은 뒤, 갤 이름·slug·DB 번호에 검색어가 들어가는 항목만
                    보여 줍니다.
                  </div>
                </div>
              )}
            </section>
          ) : null}

          {showPostsSection() ? (
            <section className="border border-[#3b4890] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d9d9d9] px-3 py-2">
                <h2 className="text-[14px] font-bold text-[#222]">게시물</h2>
                <div className="flex gap-2 text-[12px]">
                  <button
                    type="button"
                    className={
                      postSort === 'latest'
                        ? 'font-bold text-[#ff4200]'
                        : 'text-[#666] hover:underline'
                    }
                    onClick={() => setPostSort('latest')}
                  >
                    최신순
                  </button>
                  <span className="text-[#ddd]">|</span>
                  <button
                    type="button"
                    className={
                      postSort === 'relevance'
                        ? 'font-bold text-[#ff4200]'
                        : 'text-[#666] hover:underline'
                    }
                    onClick={() => setPostSort('relevance')}
                  >
                    정확도순
                  </button>
                </div>
              </div>
              {!hasKeyword ? (
                <div className="px-3 py-8 text-center text-[12px] text-[#888]">검색어를 입력해 주세요.</div>
              ) : postsQuery.loading ? (
                <div className="px-3 py-8 text-center text-[12px] text-[#666]">게시물 검색 중…</div>
              ) : postsQuery.error ? (
                <div className="px-3 py-6 text-[12px] leading-relaxed text-[#d31900]">
                  게시물 검색을 불러오지 못했습니다: {firstGraphQLErrorMessage(postsQuery.error)}
                  <div className="mt-2 text-[11px] text-[#888]">
                    WPGraphQL `posts(where: search)` 스키마가 다르면 이 섹션만 비활성화됩니다.
                  </div>
                </div>
              ) : postRows.length === 0 ? (
                <div className="px-3 py-8 text-center text-[12px] text-[#888]">검색 결과가 없습니다.</div>
              ) : (
                <ul className="divide-y divide-[#efefef]">
                  {postRows.map((row) => (
                    <li key={row.key} className="px-3 py-3">
                      <div className="mb-1">
                        {row.internalViewHref ? (
                          <Link
                            to={row.internalViewHref}
                            className="text-[13px] font-semibold text-[#0035ca] hover:underline"
                          >
                            {row.title}
                          </Link>
                        ) : row.wpUri ? (
                          <a href={row.wpUri} className="text-[13px] font-semibold text-[#0035ca] hover:underline">
                            {row.title}
                          </a>
                        ) : (
                          <span className="text-[13px] font-semibold text-[#0035ca]">{row.title}</span>
                        )}
                      </div>
                      <p className="mb-2 line-clamp-2 text-[12px] leading-relaxed text-[#555]">{row.snippet}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#888]">
                        {row.galleryListHref ? (
                          <Link to={row.galleryListHref} className="text-[#2e9b57] hover:underline">
                            {row.galleryLineLabel}
                          </Link>
                        ) : row.galleryId || row.galleryType ? (
                          <span className="text-[#2e9b57]">{row.galleryLineLabel}</span>
                        ) : (
                          <span className="text-[#2e9b57]">갤러리 미연결</span>
                        )}
                        <span>{row.writer}</span>
                        <span>{row.writtenAt}</span>
                        {row.databaseId ? <span className="text-[#bbb]">#{row.databaseId}</span> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}
        </div>

        <aside className="space-y-3">
          <div className="border border-[#d3d7e2] bg-white p-3">
            <div className="mb-2 text-[13px] font-bold text-[#222]">다음 검색</div>
            <div className="flex gap-1">
              <input className="h-[28px] flex-1 border border-[#cfcfcf] px-2 text-[12px]" placeholder="Daum" readOnly />
              <button type="button" className="h-[28px] border border-[#cfcfcf] bg-[#f6f6f6] px-2 text-[11px]">
                검색
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#555]">
              <span className="cursor-default rounded border border-[#e8e8e8] bg-[#fafafa] px-2 py-0.5">날씨</span>
              <span className="cursor-default rounded border border-[#e8e8e8] bg-[#fafafa] px-2 py-0.5">운세</span>
              <span className="cursor-default rounded border border-[#e8e8e8] bg-[#fafafa] px-2 py-0.5">환율</span>
            </div>
          </div>

          <div className="border border-[#d3d7e2] bg-white">
            <div className="border-b border-[#e5e8f0] px-3 py-2 text-[14px] font-bold text-[#222]">실시간 베스트</div>
            <div className="h-[120px] bg-[#eff3f8] px-3 py-3 text-[11px] text-[#888]">위젯 자리 (데모)</div>
          </div>
        </aside>
      </div>
    </div>
  )
}
