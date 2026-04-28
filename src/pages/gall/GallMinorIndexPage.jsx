import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'

const HOT_MINOR = [
  '지지직',
  '니케',
  '미국 주식',
  '퓨처스리그',
  '블루 아카이브',
  '미국 농구',
  '던파',
  '아이온2',
  '보겸',
  'MLB(메이저리그)',
]

const NEW_MINOR = [
  ['브랜드드 시티 AFC', 'asdfmovie(애니메이션)'],
  ['종문의 기원', '이승민(프로게이머)'],
  ['중병 웹이브스', '디그 잇'],
  ['유튜브백셀', '루더스 호수대이큇스...'],
  ['고도 장가 FC', '강라온(모델)'],
  ['버터덕', 'FTK(윤희왕)'],
]

const TICKER_ITEMS = ['충격 마이너 갤러리', 'KFC', '2026 탑스 올...', '복학요사 시즌2', '모털택시 시즌 3', '이경일 둘 이 블...']

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

const TOPIC_LAYOUT_ROWS = [
  [{ topicName: '연예', widthWeight: 1, columnCount: 7 }],
  [{ topicName: '게임', widthWeight: 1, columnCount: 7 }],
  [{ topicName: '취미', widthWeight: 1, columnCount: 7 }],
  [
    { topicName: '만화/애니', widthWeight: 1, columnCount: 3 },
    { topicName: '해외방송', widthWeight: 1, columnCount: 2 },
    { topicName: '음식', widthWeight: 1, columnCount: 2 },
  ],
  [
    { topicName: '국내방송', widthWeight: 1, columnCount: 4 },
    { topicName: '음악', widthWeight: 1, columnCount: 4 },
  ],
  [
    { topicName: '스포츠', widthWeight: 1, columnCount: 4 },
    { topicName: '스포츠스타', widthWeight: 1, columnCount: 4 },
  ],
  [
    { topicName: '생활', widthWeight: 2, columnCount: 4 },
    { topicName: '학술', widthWeight: 2, columnCount: 4 },
    { topicName: '대학', widthWeight: 1, columnCount: 2 },
    { topicName: '직업', widthWeight: 1, columnCount: 2 },
  ],
  [
    { topicName: '금융/재테크', widthWeight: 1, columnCount: 1 },
    { topicName: '성공/계발', widthWeight: 1, columnCount: 1 },
    { topicName: '디지털/IT', widthWeight: 1, columnCount: 1 },
    { topicName: '교통/운송', widthWeight: 1, columnCount: 1 },
    { topicName: '건강/심리', widthWeight: 1, columnCount: 1 },
    { topicName: '교육', widthWeight: 1, columnCount: 1 },
    { topicName: '수능', widthWeight: 1, columnCount: 1 },
  ],
]

const MINOR_INDEX_PAGE_QUERY = gql`
  query MinorIndexPage($parentTopics: [String!], $topicLimit: Int, $topLimit: Int = 20, $newLimit: Int = 20) {
    dcinsideGalleryTopicTree(parentTopics: $parentTopics, limit: $topicLimit, galleryTypeName: "마이너") {
      name
      topicId
      slug
      galleryCount
      child {
        galleries {
          databaseId
          slug
          title
          status
        }
      }
    }

    dcinsideTopGalleriesByType(galleryTypes: ["마이너"], limit: $topLimit) {
      position
      databaseId
      slug
      title
      status
      score
    }

    dcinsideNewGalleriesByType(galleryTypeName: "마이너", limit: $newLimit) {
      position
      databaseId
      slug
      title
      status
      score
    }
  }
`

function toColumns(items, colCount = 7) {
  const columns = Array.from({ length: colCount }, () => [])
  items.forEach((item, idx) => {
    columns[idx % colCount].push(item)
  })
  return columns
}

function MinorCreateButton({ onClick, isBusy = false }) {
  return (
    <button
      type="button"
      className={`inline-flex h-[30px] items-center justify-center rounded-full border border-[#ef9f00] bg-[#f3b100] px-4 text-[15px] font-bold leading-none text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] ${
        isBusy ? 'cursor-wait opacity-80' : 'cursor-pointer'
      }`}
      onClick={onClick}
      disabled={isBusy}
    >
      마이너 갤러리 만들기
    </button>
  )
}

export function GallMinorIndexPage() {
  const navigate = useNavigate()
  const { isAuthed, isLoading, viewer, logout } = useAuth()
  const { data, loading: isTopicTreeLoading } = useQuery(MINOR_INDEX_PAGE_QUERY, {
    variables: {
      parentTopics: GALLERY_PARENT_TOPICS,
      topicLimit: 50,
      topLimit: 20,
      newLimit: 20,
    },
    fetchPolicy: 'network-only',
  })
  const topicTree = data?.dcinsideGalleryTopicTree ?? []
  const topMinor = useMemo(() => {
    const list = data?.dcinsideTopGalleriesByType ?? []
    return list
      .filter((g) => g?.title)
      .map((g) => ({
        key: String(g.slug ?? g.databaseId ?? g.title),
        id: String(g.slug ?? g.databaseId ?? ''),
        title: g.title,
        position: Number(g.position ?? 0),
        score: typeof g.score === 'number' ? g.score : Number(g.score ?? 0),
      }))
      .sort((a, b) => {
        // prefer explicit position, fallback to score desc
        const ap = a.position || 0
        const bp = b.position || 0
        if (ap && bp) return ap - bp
        return (b.score || 0) - (a.score || 0)
      })
      .slice(0, 10)
  }, [data])

  const newMinorColumns = useMemo(() => {
    const list = data?.dcinsideNewGalleriesByType ?? []
    const items = list
      .filter((g) => g?.title)
      .map((g) => ({
        key: String(g.slug ?? g.databaseId ?? g.title),
        id: String(g.slug ?? g.databaseId ?? ''),
        title: g.title,
        position: Number(g.position ?? 0),
        score: typeof g.score === 'number' ? g.score : Number(g.score ?? 0),
      }))
      .sort((a, b) => {
        const ap = a.position || 0
        const bp = b.position || 0
        if (ap && bp) return ap - bp
        return (b.score || 0) - (a.score || 0)
      })
      .slice(0, 12)

    const mid = Math.ceil(items.length / 2)
    return {
      left: items.slice(0, mid),
      right: items.slice(mid),
    }
  }, [data])

  const handleCreate = () => {
    if (isLoading) return
    if (!isAuthed) {
      const ok = confirm('로그인 후 이용할 수 있습니다.\n로그인 페이지로 이동할까요?')
      if (!ok) return
      navigate('/sign/login?s_url=%2Fgall%2Fm%2Fcreate')
      return
    }
    navigate('/gall/m/create')
  }

  const displayName = viewer?.username || viewer?.name || '회원'
  const topicSectionMap = useMemo(() => {
    const topicMap = new Map(topicTree.map((topic) => [topic?.name, topic]))
    return new Map(
      GALLERY_PARENT_TOPICS.map((topicName) => {
      const topic = topicMap.get(topicName)
      const galleries = (topic?.child ?? []).flatMap((child) => {
        const rows = child?.galleries ?? []
        return rows
          .filter((gallery) => gallery?.title)
          .map((gallery) => ({
            key: `${gallery.databaseId ?? gallery.slug ?? gallery.title}`,
            label: gallery.title,
            slug: gallery.slug,
            href: `/gall/mgallery/board/lists/?id=${encodeURIComponent(String(gallery.slug ?? gallery.databaseId ?? ''))}`,
          }))
      })
        return [topicName, { topicName, count: topic?.galleryCount ?? galleries.length, galleries }]
      }),
    )
  }, [topicTree])

  return (
    <section className="grid gap-2 text-[12px]">
      <div className="grid grid-cols-[1fr_300px] gap-2">
        <div className="border border-[#d3d3d3] bg-white px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[17px] font-semibold tracking-[-0.02em] text-[#222]">
              누구나 개설할 수 있는 <span className="text-[#3b4890]">마이너 갤러리</span>를 만들어보세요.
            </div>
            <MinorCreateButton onClick={handleCreate} isBusy={isLoading} />
          </div>
        </div>

        <aside className="border border-[#3b4890] bg-white">
          {isAuthed ? (
            <>
              <div className="flex items-center justify-between border-b border-[#dedede] px-3 py-1">
                <div className="flex min-w-0 items-center gap-1 text-[18px] font-bold tracking-[-0.01em] text-[#1f3b8f]">
                  <span className="truncate">{displayName}님</span>
                  <span className="text-[15px] text-[#233f95]">›</span>
                </div>
                <button
                  type="button"
                  className="h-[30px] rounded-[4px] border border-[#243f93] bg-[#2f4aa0] px-3 text-[13px] font-bold text-white"
                  onClick={logout}
                >
                  로그아웃
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 py-1.5 text-[12px] font-semibold text-[#222]">
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  갤로그
                </a>
                <span className="text-[#bbb]">|</span>
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  즐겨찾기
                </a>
                <span className="text-[#bbb]">|</span>
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  운영
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
              <Link
                to="/sign/login?s_url=%2Fgall%2Fm"
                className="block border-b border-[#dedede] px-3 py-2 text-[14px] font-bold tracking-[-0.02em] text-[#3b4890] hover:underline"
              >
                로그인해 주세요.
              </Link>
              <div className="flex items-center justify-center gap-3 py-2 text-[12px] font-semibold text-[#222]">
                <span>갤찾기</span>
                <span className="text-[#bbb]">|</span>
                <span>스크랩</span>
                <span className="text-[#bbb]">|</span>
                <span>알림</span>
              </div>
            </>
          )}
        </aside>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-2">
        <div className="border border-[#3b4890] bg-white">
          <div className="grid grid-cols-2">
            <div className="border-r border-[#d7d7d7] p-2">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="text-[15px] font-bold">
                  <span className="mr-1 text-[#ff3f00]">HOT</span>
                  <span className="text-[#222]">종합 마이너 갤러리</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#3b4890]">
                  <button
                    type="button"
                    className="h-[18px] rounded-full border border-[#c8d1ef] bg-[#f4f7ff] px-2 text-[11px] leading-none"
                  >
                    전체 순위
                  </button>
                  <button type="button" className="h-[18px] w-[18px] rounded-full border border-[#c8c8c8] text-[10px] leading-none">
                    ◀
                  </button>
                  <button type="button" className="h-[18px] w-[18px] rounded-full border border-[#c8c8c8] text-[10px] leading-none">
                    ▶
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[12px] leading-[1.35] text-[#444]">
                {(topMinor.length ? topMinor : HOT_MINOR.map((name, idx) => ({ key: name, id: '', title: name, position: idx + 1 }))).map((item, idx) => (
                  <Link
                    key={item.key}
                    to={item.id ? `/gall/mgallery/board/lists/?id=${encodeURIComponent(item.id)}` : '#'}
                    className="truncate hover:underline"
                    onClick={(e) => {
                      if (item.id) return
                      e.preventDefault()
                    }}
                    title={item.title}
                  >
                    <span className="mr-1.5 inline-flex h-4 w-4 items-center justify-center bg-[#ffa500] text-[11px] font-bold text-white">
                      {idx + 1}
                    </span>
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-2">
              <div className="mb-1.5 text-[14px] font-bold whitespace-nowrap">
                <span className="mr-1 text-[#ff4700]">NEW</span>
                <span className="text-[#222]">신설 마이너 갤러리</span>
              </div>
              {newMinorColumns.left.length ? (
                <div className="grid grid-cols-2 gap-x-4 text-[12px] leading-[1.35] text-[#444]">
                  <ul className="grid gap-y-0.5">
                    {newMinorColumns.left.map((item) => (
                      <li key={item.key} className="truncate">
                        <Link
                          to={`/gall/mgallery/board/lists/?id=${encodeURIComponent(item.id)}`}
                          className="hover:underline"
                          title={item.title}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <ul className="grid gap-y-0.5">
                    {newMinorColumns.right.map((item) => (
                      <li key={item.key} className="truncate">
                        <Link
                          to={`/gall/mgallery/board/lists/?id=${encodeURIComponent(item.id)}`}
                          className="hover:underline"
                          title={item.title}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[12px] leading-[1.35] text-[#444]">
                  {NEW_MINOR.map(([left, right]) => (
                    <div key={left} className="contents">
                      <a href="#" className="truncate hover:underline" onClick={(e) => e.preventDefault()}>
                        {left}
                      </a>
                      <a href="#" className="truncate hover:underline" onClick={(e) => e.preventDefault()}>
                        {right}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-[#d7d7d7] px-2 py-1.5 text-[12px] text-[#555]">
            {TICKER_ITEMS.map((item, idx) => (
              <a
                key={`${item}_${idx}`}
                href="#"
                className={
                  idx === 0
                    ? 'truncate font-semibold text-[#d31900] hover:underline'
                    : 'truncate hover:underline'
                }
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            ))}
            <a href="#" className="ml-auto text-[11px] text-[#444] hover:underline" onClick={(e) => e.preventDefault()}>
              더보기 ▶
            </a>
          </div>
        </div>

        <div className={isAuthed ? 'border border-[#e3e6ef] bg-gradient-to-br from-[#f4f6f9] via-[#fdfefe] to-white' : ''} />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="h-[22px] rounded-full bg-[#2f3d8f] px-3 text-[12px] font-bold text-white"
          onClick={() => navigate('/gall')}
        >
          갤러리 전체보기
        </button>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="rounded-full bg-[#2f3d8f] px-3 py-[2px] text-[11px] font-bold text-white">실시간 북적 갤러리</span>
          <span className="inline-flex h-4 w-4 items-center justify-center bg-[#ff9f00] text-[10px] font-bold text-white">6</span>
          <span className="font-semibold text-[#444]">미국 주식</span>
        </div>
      </div>

      <div className="border border-[#3b4890] bg-white">
        {TOPIC_LAYOUT_ROWS.map((row, rowIdx) => (
          <div
            key={`topic-row-${rowIdx}`}
            className={rowIdx === 0 ? 'grid' : 'grid border-t border-[#3b4890]'}
            style={{ gridTemplateColumns: row.map((panel) => `${panel.widthWeight}fr`).join(' ') }}
          >
            {row.map((panel, panelIdx) => {
              const section = topicSectionMap.get(panel.topicName) ?? { topicName: panel.topicName, count: 0, galleries: [] }
              const columns = toColumns(section.galleries, panel.columnCount)
              return (
                <div key={panel.topicName} className={panelIdx === 0 ? '' : 'border-l border-[#3b4890]'}>
                  <div className="flex items-center justify-between border-b border-[#d9d9d9] px-3 py-2">
                    <div className="text-[13px]">
                      <span className="font-bold text-[#3b4890]">{section.topicName}</span>
                      <span className="ml-1 text-[#888]">({isTopicTreeLoading ? '--' : section.count})</span>
                    </div>
                    <button type="button" className="h-4 w-4 border border-[#cfcfcf] bg-[#f6f6f6]" aria-label="정렬">
                      ▼
                    </button>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: `repeat(${panel.columnCount}, minmax(0, 1fr))` }}>
                    {columns.map((column, colIdx) => (
                      <ul key={colIdx} className="min-h-[360px] border-r border-[#ececec] px-3 py-2 last:border-r-0">
                        {column.map((gallery, rowIdx2) => (
                          <li key={`${gallery.key}_${rowIdx2}`} className="truncate py-[1px] text-[12px] leading-[1.45] text-[#444]">
                            <a href={gallery.href} className="hover:underline">
                              {gallery.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ))}
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

