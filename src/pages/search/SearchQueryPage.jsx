import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'

const SEARCH_POSTS_QUERY = gql`
  query SearchPosts($keyword: String!, $first: Int = 25) {
    posts(first: $first, where: { search: $keyword, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        databaseId
        title
        excerpt
        date
        uri
        author {
          node {
            name
          }
        }
      }
    }
  }
`

const SEARCH_POSTS_RELEVANCE_QUERY = gql`
  query SearchPostsByRelevance($keyword: String!, $first: Int = 25) {
    posts(first: $first, where: { search: $keyword, orderby: { field: RELEVANCE, order: DESC } }) {
      nodes {
        id
        databaseId
        title
        excerpt
        date
        uri
        author {
          node {
            name
          }
        }
      }
    }
  }
`

const SEARCH_GALLERY_POOL_QUERY = gql`
  query SearchGalleryPool($limit: Int!) {
    dcinsideTopGalleriesByType(galleryTypes: ["메인"], limit: $limit) {
      databaseId
      slug
      title
      score
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

  const galleryPoolQuery = useQuery(SEARCH_GALLERY_POOL_QUERY, {
    variables: { limit: 160 },
    fetchPolicy: 'cache-first',
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

  const matchedGalleries = useMemo(() => {
    if (!hasKeyword) return []
    const pool = galleryPoolQuery.data?.dcinsideTopGalleriesByType ?? []
    const lower = keywordParam.toLowerCase()
    return pool
      .filter((g) => stripHtml(g?.title || '').toLowerCase().includes(lower))
      .slice(0, 25)
      .map((g, idx) => {
        const id = g.slug || String(g.databaseId || '')
        const title = stripHtml(g.title) || id || '갤러리'
        const seed = Number(g.databaseId ?? idx + 1)
        const fakeNew = (seed % 5) + 1
        const fakeTotal = ((seed * 97) % 50_000) + 100
        return { id, title, score: g.score, fakeNew, fakeTotal }
      })
  }, [galleryPoolQuery.data, hasKeyword, keywordParam])

  const postRows = useMemo(() => {
    const nodes = postsQuery.data?.posts?.nodes ?? []
    return nodes.map((node) => ({
      key: node.id || String(node.databaseId),
      databaseId: node.databaseId,
      title: stripHtml(node.title) || '제목 없음',
      snippet: snippetFromPost(node),
      writer: node.author?.node?.name?.trim() || '-',
      writtenAt: formatPostDate(node.date),
      uri: node.uri || '',
    }))
  }, [postsQuery.data])

  const totalGalleryPool = galleryPoolQuery.data?.dcinsideTopGalleriesByType?.length ?? 0

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
          총 갤러리 수{' '}
          <span className="font-semibold text-[#222]">{totalGalleryPool.toLocaleString('ko-KR')}</span>개
          {hasKeyword ? (
            <>
              {' '}
              · 검색 일치 <span className="font-semibold text-[#2f3d8f]">{matchedGalleries.length}</span>건
            </>
          ) : null}
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
              ) : galleryPoolQuery.loading ? (
                <div className="px-3 py-8 text-center text-[12px] text-[#666]">갤러리 목록 불러오는 중…</div>
              ) : matchedGalleries.length === 0 ? (
                <div className="px-3 py-8 text-center text-[12px] text-[#888]">
                  제목에 「{keywordParam}」이(가) 포함된 메인 갤러리가 없습니다.
                  <div className="mt-1 text-[11px] text-[#aaa]">흥한 메인 갤 일부만 대상으로 필터합니다.</div>
                </div>
              ) : (
                <ul className="divide-y divide-[#efefef] px-3 py-2 text-[12px] text-[#333]">
                  {matchedGalleries.map((g) => (
                    <li key={g.id || g.title} className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2">
                      <Link
                        to={`/gall/board/lists/?id=${encodeURIComponent(g.id)}`}
                        className="font-semibold text-[#0035ca] hover:underline"
                      >
                        {g.title}
                      </Link>
                      <span className="text-[11px] text-[#888]">
                        새글 {g.fakeNew}/{g.fakeTotal.toLocaleString('ko-KR')}
                      </span>
                      {typeof g.score === 'number' ? (
                        <span className="text-[11px] text-[#aaa]">점수 {g.score}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
              <div className="border-t border-[#efefef] px-3 py-2 text-[12px] font-bold text-[#444]">인물 갤러리</div>
              <div className="px-3 pb-4 text-[11px] text-[#999]">인물 갤 검색 API 연동 시 표시됩니다.</div>
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
                        {row.uri ? (
                          <a href={row.uri} className="text-[13px] font-semibold text-[#0035ca] hover:underline">
                            {row.title}
                          </a>
                        ) : (
                          <span className="text-[13px] font-semibold text-[#0035ca]">{row.title}</span>
                        )}
                      </div>
                      <p className="mb-2 line-clamp-2 text-[12px] leading-relaxed text-[#555]">{row.snippet}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#888]">
                        <span className="text-[#2e9b57]">워드프레스 게시물</span>
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
