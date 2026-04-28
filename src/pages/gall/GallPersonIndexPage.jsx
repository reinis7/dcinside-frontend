import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'
import { useAuth } from '../../auth/authContext'
import { BlockLoader } from '../../components/common/Loader'

const PERSON_INDEX_PAGE_QUERY = gql`
  query PersonIndexPage($parentTopics: [String!], $limit: Int = 80) {
    dcinsideGalleryTopicTree(parentTopics: $parentTopics, limit: $limit, galleryTypeName: "인물") {
      topicId
      name
      child {
        topicId
        name
        galleries {
          databaseId
          slug
          title
          description
          status
          score
        }
      }
    }

    dcinsideTopGalleriesByType(galleryTypes: ["인물"], limit: 10) {
      position
      databaseId
      slug
      title
      status
      score
    }

    dcinsideNewGalleriesByType(galleryTypeName: "인물", limit: 10) {
      position
      databaseId
      slug
      title
      status
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

function normalizeDashes(text) {
  return String(text).replace(/[\u2013\u2014]/g, '-')
}

function stripHtml(html) {
  if (!html) return ''
  const plain = String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return normalizeDashes(decodeHtmlEntities(plain))
}

const PERSON_THUMBNAIL_URL = 'https://nstatic.dcinside.com/dc/w/images/minorbg.png'

// Manual layout rows (edit columnCount freely).
// Default row "total column count" is 6 (rows should sum to 6).
const PERSON_TOPIC_LAYOUT_ROWS = [
  [
    { topicName: '연예인', columnCount: 2 },
    { topicName: '유튜버/스트리머', columnCount: 2 },
    { topicName: '인플루언서', columnCount: 1 },
    { topicName: '화제인물', columnCount: 1 },
  ],
  [
    { topicName: '스포츠스타', columnCount: 2 },
    { topicName: '정치인', columnCount: 1 },
    { topicName: '문화/예술', columnCount: 1 },
    { topicName: '방송/언론', columnCount: 1 },
    { topicName: '디지털/IT', columnCount: 1 },
  ],
  [
    { topicName: '금융', columnCount: 1 },
    { topicName: '경영', columnCount: 1 },
    { topicName: '역사인물', columnCount: 1 },
    { topicName: '가상인물', columnCount: 1 },
    { topicName: '사무', columnCount: 1 },
    { topicName: '서비스', columnCount: 1 },
  ],
  [
    { topicName: '마케팅', columnCount: 1 },
    { topicName: '디자인', columnCount: 1 },
    { topicName: '의료', columnCount: 1 },
    { topicName: '법률', columnCount: 1 },
    { topicName: '교육', columnCount: 1 },
    { topicName: '종교', columnCount: 1 },
  ],
  [
    { topicName: '관광/여행', columnCount: 1 },
    { topicName: '교통/운송', columnCount: 1 },
    { topicName: '유통/무역', columnCount: 1 },
    { topicName: '생산/관리', columnCount: 1 },
    { topicName: '연구/설계', columnCount: 1 },
    { topicName: '판매/영업', columnCount: 1 },
  ],
  [
    { topicName: '농업/어업', columnCount: 1 },
    { topicName: '자영업', columnCount: 1 },
    { topicName: '공무원', columnCount: 1 },
    { topicName: '학생', columnCount: 1 },
    { topicName: '기타', columnCount: 2 },
  ],
]

function toColumns(list, columnCount = 2) {
  const cols = Array.from({ length: columnCount }, () => [])
  ;(list ?? []).forEach((item, idx) => {
    cols[idx % columnCount].push(item)
  })
  return cols
}

function formatTimeHHmm(dateLike) {
  const d = dayjs(dateLike)
  if (!d.isValid()) return '--:--'
  return d.format('HH:mm')
}

export function GallPersonIndexPage() {
  const navigate = useNavigate()
  const loc = useLocation()
  const { isAuthed, viewer, logout } = useAuth()

  const PARENT_TOPICS = useMemo(
    () => [
      '연예인',
      '유튜버/스트리머',
      '인플루언서',
      '화제인물',
      '스포츠스타',
      '정치인',
      '문화/예술',
      '방송/언론',
      '디지털/IT',
      '금융',
      '경영',
      '역사인물',
      '가상인물',
      '사무',
      '서비스',
      '마케팅',
      '디자인',
      '의료',
      '법률',
      '교육',
      '종교',
      '관광/여행',
      '교통/운송',
      '유통/무역',
      '생산/관리',
      '연구/설계',
      '판매/영업',
      '농업/어업',
      '자영업',
      '공무원',
      '학생',
      '기타',
    ],
    [],
  )

  const { data, loading, error } = useQuery(PERSON_INDEX_PAGE_QUERY, {
    variables: { parentTopics: PARENT_TOPICS, limit: 140 },
    fetchPolicy: 'network-only',
  })

  const loginHref = `/sign/login?s_url=${encodeURIComponent(`${loc.pathname}${loc.search}`)}`
  const displayName = viewer?.username || viewer?.name || '회원'

  const topPeople = useMemo(() => data?.dcinsideTopGalleriesByType ?? [], [data])
  const topPeopleCols = useMemo(() => toColumns(topPeople, 2), [topPeople])

  const recentProfiles = useMemo(() => {
    const base = dayjs()
    const names = ['윤석열', '윤석열', '노무현', '김현지', '하이라이트', '저스틴 게이치']
    return names.map((name, idx) => ({
      id: `${name}_${idx}`,
      name,
      at: base.subtract(idx * 3 + 1, 'minute').toDate(),
    }))
  }, [])

  const topicPanels = useMemo(() => {
    const nodes = data?.dcinsideGalleryTopicTree ?? []
    const byParentName = new Map()
    for (const n of nodes) {
      const nm = stripHtml(n?.name) || ''
      if (!nm) continue
      if (!byParentName.has(nm)) byParentName.set(nm, n)
    }

    const panels = PARENT_TOPICS.map((topicName) => {
      const parent = byParentName.get(topicName) || null
      const allNode = parent?.child?.[0] ?? null
      const allGalleries = allNode?.galleries ?? []
      const galleries = allGalleries.slice(0, 6)
      return {
        key: topicName,
        title: topicName,
        count: allGalleries.length,
        galleries,
      }
    })
    return panels
  }, [data, PARENT_TOPICS])

  const topicPanelMap = useMemo(() => new Map(topicPanels.map((p) => [p.key, p])), [topicPanels])

  return (
    <section className="grid grid-cols-2 gap-3">
      <div className="col-span-2 grid grid-cols-[1fr_300px] gap-3">
        <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[14px] font-semibold text-[#2d7f1b]">
            인물 갤러리(ㅇ)는 일반인, 인플루언서 등 인물을 주제로 누구나 개설이 가능합니다.
          </div>
          <button
            type="button"
            className="inline-flex h-[28px] items-center justify-center rounded-full border border-[#6dbf3e] bg-[#6dbf3e] px-4 text-[12px] font-bold text-white"
            onClick={() => {
              if (!isAuthed) {
                navigate(`/sign/login?s_url=${encodeURIComponent('/gall/p/create')}`)
                return
              }
              navigate('/gall/p/create')
            }}
          >
            인물 갤러리 만들기
          </button>
        </div>

        <div className="border border-[#d3d3d3] bg-white">
          {loading ? <BlockLoader /> : null}
          {!loading && error ? (
            <div className="p-3 text-[12px] font-semibold text-[#d31900]">불러오기 실패: {firstGraphQLErrorMessage(error)}</div>
          ) : null}

          <div className="grid grid-cols-2 gap-0 border-b border-[#d9d9d9]">
            <div className="border-r border-[#d9d9d9] p-3">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-bold text-[#333]">흥한 인물 갤러리</div>
                <div className="flex items-center gap-1 text-[11px] text-[#666]">
                  <span>전체 순위</span>
                  <button type="button" className="h-[18px] w-[18px] border border-[#cfcfcf] bg-white text-[#333]">
                    ◀
                  </button>
                  <button type="button" className="h-[18px] w-[18px] border border-[#cfcfcf] bg-white text-[#333]">
                    ▶
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-6">
                {topPeopleCols.map((col, colIdx) => (
                  <div key={colIdx} className="grid gap-2">
                    {col.map((g) => {
                      const rank = Number(g?.position ?? 0) || colIdx * 5 + 1
                      const slug = g?.slug || ''
                      const title = stripHtml(g?.title) || slug || '인물 갤러리'
                      const href = slug ? `/gall/p/board/lists/?id=${encodeURIComponent(slug)}` : '#'
                      return (
                        <Link key={`${slug}_${rank}`} to={href} className="group flex items-center gap-2 text-[12px] text-[#333]">
                          <span className="inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-sm bg-[#67b43a] px-1 text-[11px] font-bold text-white">
                            {rank}
                          </span>
                          <span className="truncate group-hover:underline">{title}</span>
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-bold text-[#333]">최근 변경 프로필</div>
                <button type="button" className="h-[18px] w-[18px] border border-[#cfcfcf] bg-white text-[#333]">
                  ▾
                </button>
              </div>

              <div className="mt-3 grid gap-2 text-[12px] text-[#333]">
                {recentProfiles.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="truncate">{p.name}</span>
                    <span className="text-[11px] text-[#888]">{formatTimeHHmm(p.at)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-b border-[#2f3d8f] bg-[#2f3d8f] px-3 py-1.5 text-[12px] font-bold text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button type="button" className="h-[20px] rounded-full bg-[#1f2f77] px-3 text-[11px] font-bold text-white">
                  갤러리 전체보기
                </button>
                <button type="button" className="h-[20px] rounded-full border border-[#4053aa] bg-[#2f3d8f] px-3 text-[11px] font-bold text-white">
                  실시간 북적 갤러리
                </button>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="inline-flex h-[16px] items-center rounded-sm bg-[#67b43a] px-1 text-[10px] font-bold text-white">4</span>
                <span>이강인</span>
                <span className="text-[#cfd6ff]">·</span>
                <span>2</span>
                <span className="text-[#cfd6ff]">▾</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="border border-[#d3d3d3] bg-white">
        <div className="border-b border-[#d9d9d9] p-3 text-[13px] font-bold text-[#333]">
          {isAuthed ? `${displayName} 님` : '로그인해 주세요.'}
        </div>
        <div className="px-3 py-2">
          {isAuthed ? (
            <button
              type="button"
              onClick={logout}
              className="h-[28px] w-full rounded-sm border border-[#2f3d8f] bg-[#2f3d8f] text-[12px] font-bold text-white"
            >
              로그아웃
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate(loginHref)}
              className="h-[28px] w-full rounded-sm border border-[#2f3d8f] bg-[#2f3d8f] text-[12px] font-bold text-white"
            >
              로그인
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 border-t border-[#d9d9d9] text-center text-[12px] text-[#333]">
          {['즐겨찾기', '스크랩', '알림'].map((t) => (
            <button key={t} type="button" className="border-r border-[#d9d9d9] py-2 last:border-r-0 hover:bg-[#fafafa]">
              {t}
            </button>
          ))}
        </div>

        <div className="border-t border-[#d9d9d9] p-3 text-[12px] text-[#333]">
          <div className="font-bold">갤러리 정보</div>
          <div className="mt-2 grid gap-1 text-[11px] text-[#666]">
            <div>
              <span className="inline-block w-[56px] font-semibold text-[#444]">매니저</span>-{/* person index doesn’t target one gallery */}
            </div>
            <div>
              <span className="inline-block w-[56px] font-semibold text-[#444]">부매니저</span>없음
            </div>
            <div>
              <span className="inline-block w-[56px] font-semibold text-[#444]">개설일</span>-
            </div>
          </div>
        </div>
      </aside>
      </div>

      <div className="col-span-2 border border-[#d3d3d3] bg-white">
        {PERSON_TOPIC_LAYOUT_ROWS.map((row, rowIdx) => (
          <div
            key={`person-topic-row-${rowIdx}`}
            className={rowIdx === 0 ? 'grid border-t border-[#d9d9d9]' : 'grid border-t border-[#d9d9d9]'}
            style={{ gridTemplateColumns: row.map((p) => `${Math.max(1, Number(p.columnCount) || 1)}fr`).join(' ') }}
          >
            {row.map((layout, idx) => {
              const panel =
                topicPanelMap.get(layout.topicName) ?? { key: layout.topicName, title: layout.topicName, count: 0, galleries: [] }
              return (
                <div key={panel.key} className={idx === 0 ? 'border-b border-[#d9d9d9]' : 'border-l border-b border-[#d9d9d9]'}>
                  <div className="flex items-center justify-between border-b border-[#d9d9d9] bg-[#f6f6f6] px-2 py-1 text-[12px] font-bold text-[#333]">
                    <span className="truncate">
                      {panel.title} <span className="font-semibold text-[#666]">({panel.count})</span>
                    </span>
                    <button type="button" className="h-[16px] w-[16px] border border-[#cfcfcf] bg-white text-[10px] text-[#333]">
                      ▾
                    </button>
                  </div>
                  <div className="px-2 py-2">
                    <div className="grid gap-2">
                      {panel.galleries.length > 0 ? (
                        panel.galleries.map((g) => {
                          const slug = g?.slug || ''
                          const title = stripHtml(g?.title) || slug || '인물 갤러리'
                          const desc = stripHtml(g?.description) || ''
                          return (
                            <Link
                              key={slug || title}
                              to={slug ? `/gall/p/board/lists/?id=${encodeURIComponent(slug)}` : '#'}
                              className="group flex items-center gap-2"
                              title={desc ? `${title} - ${desc}` : title}
                            >
                              <img
                                src={PERSON_THUMBNAIL_URL}
                                alt=""
                                className="h-[40px] w-[40px] shrink-0 rounded-sm border border-[#e5e5e5] bg-white object-cover"
                                loading="lazy"
                              />
                              <div className="min-w-0">
                                <div className="truncate text-[12px] font-semibold text-[#333] group-hover:underline">{title}</div>
                                {desc ? <div className="truncate text-[11px] text-[#777]">{desc}</div> : null}
                              </div>
                            </Link>
                          )
                        })
                      ) : (
                        <div className="py-6 text-center text-[12px] text-[#888]">
                          <div className="font-bold text-[#5a5f7a]">NEW</div>
                          <div className="mt-2">최근 개설된</div>
                          <div>인물 갤러리가 없습니다.</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}

