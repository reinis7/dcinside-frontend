import { useMemo, useState } from 'react'
import { MiniPager } from '../ui/MiniPager'

export function NewBox({ rankings }) {
  const [tab, setTab] = useState('minor')
  const [page, setPage] = useState(1)

  const all = useMemo(() => rankings?.[tab] ?? [], [rankings, tab])
  const totalPages = Math.max(1, Math.ceil(all.length / 10))
  const items = useMemo(() => all.slice((page - 1) * 10, page * 10), [all, page])

  return (
    <div className="border border-[#d3d3d3] bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-[13px] font-bold">
          <span className="text-[#f07600]">NEW</span> <span className="text-[#333]">신설갤</span>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          {[
            { id: 'main', label: '메인' },
            { id: 'minor', label: '마이너' },
            { id: 'mini', label: '미니' },
            { id: 'person', label: '인물' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={t.id === tab ? 'font-bold text-[#f07600] underline' : 'text-[#333]'}
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
      <div className="border-t border-[#d3d3d3] px-3 py-2 text-[12px] leading-[20px] text-[#333]">
        {items.map((it) => (
          <a key={it.id} href={it.href} className="block truncate hover:underline">
            {it.name}
          </a>
        ))}
      </div>
      <div className="flex items-center justify-end border-t border-[#d3d3d3] px-3 py-1">
        <MiniPager
          valueText={`${page}/${totalPages}`}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
    </div>
  )
}

