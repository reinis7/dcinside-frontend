import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'
import { BlockLoader } from '../../components/common/Loader'

const GALLERY_PARENT_TOPICS = [
  '스페셜',
  'AI 이미지',
  '디시미디어',
  '연예',
  '게임',
  '성인',
  '국내방송',
  '취미',
  '해외방송',
  '음식',
  '음악',
  '만화/애니',
  '스포츠',
  '건강/심리',
  '생물',
  '금융/재테크',
  '생활',
  '학술',
  '대학',
  '직업/인물',
  '성공/계발',
  '디지털/IT',
  '교통/운송',
  '교육',
  '공무원',
  '수능',
  '여행/풍경',
  '밀리터리',
  '패션',
  '쇼핑/장터',
]

// Manual layout rows (edit columnCount freely).
// Row width is distributed by columnCount sum (not by item count).
const TOPIC_LAYOUT_ROWS = [
  [{ topicName: '스페셜', columnCount: 1 }, { topicName: 'AI 이미지', columnCount: 1 }, { topicName: '디시미디어', columnCount: 2 }, { topicName: '연예', columnCount: 3 }],
  [{ topicName: '게임', columnCount: 3 }, { topicName: '성인', columnCount: 4 }],
  [{ topicName: '국내방송', columnCount: 7 }],
  [{ topicName: '취미', columnCount: 2 }, { topicName: '해외방송', columnCount: 1 }, { topicName: '음식', columnCount: 1 }, { topicName: '음악', columnCount: 1 }, { topicName: '만화/애니', columnCount: 2 }],
  [{ topicName: '스포츠', columnCount: 4 }, { topicName: '건강/심리', columnCount: 1 }, { topicName: '생물', columnCount: 1 }, { topicName: '금융/재테크', columnCount: 1 }],
  [{ topicName: '생활', columnCount: 1 }, { topicName: '학술', columnCount: 1 }, { topicName: '대학', columnCount: 1 }, { topicName: '직업/인물', columnCount: 1 }, { topicName: '성공/계발', columnCount: 1 }, { topicName: '디지털/IT', columnCount: 1 }, { topicName: '교통/운송', columnCount: 1 }],
  [{ topicName: '교육', columnCount: 1 }, { topicName: '공무원', columnCount: 1 }, { topicName: '수능', columnCount: 2 }, { topicName: '여행/풍경', columnCount: 1 }, { topicName: '밀리터리', columnCount: 1 }, { topicName: '패션', columnCount: 1 }],
  [{ topicName: '쇼핑/장터', columnCount: 7 }],
]

const MAIN_INDEX_PAGE_QUERY = gql`
  query MainIndexPage($parentTopics: [String!], $topicLimit: Int, $topLimit: Int = 20, $newLimit: Int = 20) {
    dcinsideGalleryTopicTree(parentTopics: $parentTopics, limit: $topicLimit, galleryTypeName: "메인") {
      name
      topicId
      galleryCount
      child {
        galleries {
          databaseId
          slug
          title
          description
          status
        }
      }
    }

    dcinsideTopGalleriesByType(galleryTypes: ["메인"], limit: $topLimit) {
      position
      databaseId
      slug
      title
      status
      score
    }

    dcinsideNewGalleriesByType(galleryTypeName: "메인", limit: $newLimit) {
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
  // Browser-only decode (no SSR in this app, but guard anyway).
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

function toColumns(items, colCount = 7) {
  const columns = Array.from({ length: colCount }, () => [])
  items.forEach((item, idx) => {
    columns[idx % colCount].push(item)
  })
  return columns
}

export function GallHomePage() {
  const navigate = useNavigate()
  const { isAuthed } = useAuth()

  const { data, loading, error } = useQuery(MAIN_INDEX_PAGE_QUERY, {
    variables: {
      parentTopics: GALLERY_PARENT_TOPICS,
      topicLimit: 50,
      topLimit: 20,
      newLimit: 20,
    },
    fetchPolicy: 'network-only',
  })

  const topicTree = data?.dcinsideGalleryTopicTree ?? []
  const topicSectionMap = useMemo(() => {
    const topicMap = new Map(topicTree.map((topic) => [topic?.name, topic]))
    return new Map(
      GALLERY_PARENT_TOPICS.map((topicName) => {
        const topic = topicMap.get(topicName)
        const galleries = (topic?.child ?? [])
          .flatMap((child) => child?.galleries ?? [])
          .filter((g) => g?.title)
          .map((g) => {
            const id = String(g.slug ?? g.databaseId ?? '')
            return {
              key: `${g.databaseId ?? g.slug ?? g.title}`,
              label: stripHtml(g.title),
              description: stripHtml(g.description),
              href: id ? `/gall/board/lists/?id=${encodeURIComponent(id)}` : '#',
            }
          })
        return [topicName, { topicName, count: topic?.galleryCount ?? galleries.length, galleries }]
      }),
    )
  }, [topicTree])

  const hotMain = useMemo(() => {
    const list = data?.dcinsideTopGalleriesByType ?? []
    return list
      .filter((g) => g?.title)
      .map((g) => ({
        key: String(g.slug ?? g.databaseId ?? g.title),
        id: String(g.slug ?? g.databaseId ?? ''),
        title: stripHtml(g.title),
        position: Number(g.position ?? 0),
        score: typeof g.score === 'number' ? g.score : Number(g.score ?? 0),
      }))
      .sort((a, b) => {
        const ap = a.position || 0
        const bp = b.position || 0
        if (ap && bp) return ap - bp
        return (b.score || 0) - (a.score || 0)
      })
      .slice(0, 20)
  }, [data])

  const newMain = useMemo(() => {
    const list = data?.dcinsideNewGalleriesByType ?? []
    const items = list
      .filter((g) => g?.title)
      .map((g) => ({
        key: String(g.slug ?? g.databaseId ?? g.title),
        id: String(g.slug ?? g.databaseId ?? ''),
        title: stripHtml(g.title),
        position: Number(g.position ?? 0),
      }))
      .sort((a, b) => {
        const ap = a.position || 0
        const bp = b.position || 0
        if (ap && bp) return ap - bp
        return 0
      })
      .slice(0, 12)
    const mid = Math.ceil(items.length / 2)
    return { left: items.slice(0, mid), right: items.slice(mid) }
  }, [data])

  if (loading) return <BlockLoader label="메인 갤러리 불러오는 중..." />

  return (
    <section className="grid gap-2 text-[12px]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="h-[22px] rounded-full bg-[#2f3d8f] px-3 text-[12px] font-bold text-white"
          onClick={() => navigate('/gall')}
        >
          갤러리 전체보기
        </button>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="rounded-full border border-[#c8d1ef] bg-[#f4f7ff] px-3 py-[2px] text-[11px] font-bold text-[#2f3d8f]">
            인기순
          </span>
        </div>
      </div>

      {error ? (
        <div className="rounded border border-[#d3d3d3] bg-white px-4 py-3 text-[12px] text-[#d31900]">
          메인 갤러리를 불러오지 못했습니다: {error.message}
        </div>
      ) : null}

      <div className="grid grid-cols-[1fr_300px] gap-2">
        <div className="border border-[#3b4890] bg-white">
          <div className="flex items-center justify-between border-b border-[#d9d9d9] px-3 py-2">
            <div className="text-[15px] font-bold">
              <span className="mr-1 text-[#ff3f00]">HOT</span>
              <span className="text-[#222]">흥한 갤러리</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#3b4890]">
              <button type="button" className="h-[18px] rounded-full border border-[#c8d1ef] bg-[#f4f7ff] px-2 text-[11px] leading-none">
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
          <div className="grid grid-cols-4 gap-x-6 gap-y-3 px-3 py-4 text-[12px] leading-[1.35] text-[#444]">
            {hotMain.map((g, idx) => (
              <a
                key={g.key}
                href={g.id ? `/gall/board/lists/?id=${encodeURIComponent(g.id)}` : '#'}
                target="_blank"
                rel="noreferrer"
                className="flex min-w-0 items-center gap-2 hover:underline"
                title={g.title}
              >
                <span className="inline-flex h-4 min-w-4 items-center justify-center bg-[#ff3f00] px-[3px] text-[11px] font-bold text-white">
                  {idx + 1}
                </span>
                <span className="truncate">{g.title}</span>
              </a>
            ))}
            {!hotMain.length ? <div className="px-1 py-2 text-[12px] text-[#888]">표시할 갤러리가 없습니다.</div> : null}
          </div>
        </div>

        <aside className="border border-[#d3d7e2] bg-white">
          <div className="flex items-center justify-between border-b border-[#e5e8f0] px-3 py-2">
            <div className="text-[14px] font-bold text-[#222]">게시판/강좌</div>
            <button type="button" className="h-4 w-4 border border-[#cfcfcf] bg-[#f6f6f6]" aria-label="정렬">
              ▼
            </button>
          </div>
          <div className="border-b border-[#e5e8f0] px-3 py-3 text-[12px] text-[#666]">
            <div className="font-bold text-[#ff4700]">NEW 신설 갤러리 {newMain.left.length + newMain.right.length}</div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 px-3 py-3 text-[12px] leading-[1.35] text-[#444]">
            {newMain.left.length ? (
              <>
                <ul className="grid gap-y-0.5">
                  {newMain.left.map((item) => (
                    <li key={item.key} className="truncate">
                      <a
                        href={item.id ? `/gall/board/lists/?id=${encodeURIComponent(item.id)}` : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                        title={item.title}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className="grid gap-y-0.5">
                  {newMain.right.map((item) => (
                    <li key={item.key} className="truncate">
                      <a
                        href={item.id ? `/gall/board/lists/?id=${encodeURIComponent(item.id)}` : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                        title={item.title}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="col-span-2 text-[#888]">신설갤이 없습니다.</div>
            )}
          </div>
        </aside>
      </div>

      <div className="border border-[#3b4890] bg-white">
        {TOPIC_LAYOUT_ROWS.map((row, rowIdx) => (
          <div
            key={`topic-row-${rowIdx}`}
            className={rowIdx === 0 ? 'grid' : 'grid border-t border-[#3b4890]'}
            style={{ gridTemplateColumns: row.map((panel) => `${Math.max(1, Number(panel.columnCount) || 1)}fr`).join(' ') }}
          >
            {row.map((panel, panelIdx) => {
              const section = topicSectionMap.get(panel.topicName) ?? { topicName: panel.topicName, count: 0, galleries: [] }
              const columns = toColumns(section.galleries, panel.columnCount)
              return (
                <div key={panel.topicName} className={panelIdx === 0 ? '' : 'border-l border-[#3b4890]'}>
                  <div className="flex items-center justify-between border-b border-[#d9d9d9] px-3 py-2">
                    <div className="text-[13px]">
                      <span className="font-bold text-[#3b4890]">{section.topicName}</span>
                      <span className="ml-1 text-[#888]">({section.count})</span>
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
                            <a
                              href={gallery.href}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                              title={gallery.description ? `${gallery.label} — ${gallery.description}` : gallery.label}
                            >
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

