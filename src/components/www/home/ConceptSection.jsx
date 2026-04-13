import { useMemo, useState } from 'react'
import { MiniPager } from './ui/MiniPager'

function galleryTitle(gallery) {
  if (!gallery) return '갤러리'
  return gallery.replace(/\s*갤러리\s*$/u, '')
}

export function ConceptSection({ categories, postsByCategory }) {
  const [tab, setTab] = useState(categories[0]?.id ?? 'game')
  const [page, setPage] = useState(1)
  // 원본처럼 "갤러리 제목 + 점 리스트" 2열 구성을 위해
  // 1페이지 = 4개 박스(2열×2행) × 박스당 5개 항목
  const itemsPerGroup = 5
  const groupsPerPage = 4
  const pageSize = itemsPerGroup * groupsPerPage

  const all = useMemo(() => postsByCategory[tab] ?? [], [postsByCategory, tab])
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize))
  const items = useMemo(() => {
    const start = (page - 1) * pageSize
    return all.slice(start, start + pageSize)
  }, [all, page, pageSize])

  const groups = useMemo(() => {
    return Array.from({ length: groupsPerPage }, (_, g) => {
      const start = g * itemsPerGroup
      const slice = items.slice(start, start + itemsPerGroup)
      const title = galleryTitle(slice[0]?.gallery)
      return { title, items: slice }
    })
  }, [items])

  return (
    <div className="rounded border border-[#d3d3d3] bg-white">
      <div className="border-b border-[#2f3d8f] px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[13px]">
            <span className="font-bold text-[#333]">개념글</span>
            <div className="flex items-center gap-3 text-[12px] text-[#333]">
              {categories.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={t.id === tab ? 'font-bold text-[#333]' : 'text-[#333]/80 hover:underline'}
                  onClick={() => {
                    setTab(t.id)
                    setPage(1)
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <MiniPager
            valueText={`${page}/${totalPages}`}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 px-3 py-3 text-[12px] leading-[20px]">
        {[groups.slice(0, 2), groups.slice(2, 4)].map((col, colIdx) => (
          <div key={colIdx} className="grid gap-4">
            {col.map((g, idx) => (
              <div key={`${g.title}_${idx}`} className="min-w-0">
                <div className="flex items-center justify-between border-b border-dashed border-[#d3d3d3] pb-1">
                  <a href="#" className="font-bold text-[#333] hover:underline" onClick={(e) => e.preventDefault()}>
                    {g.title} 갤러리 &gt;
                  </a>
                </div>
                <ul className="mt-2 grid gap-1 text-[#333]">
                  {g.items.map((it) => (
                    <li key={it.id} className="flex min-w-0 items-start gap-2">
                      <span className="mt-[1px] text-[#666]">•</span>
                      <a href={it.href} className="min-w-0 flex-1 truncate hover:underline">
                        {it.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

