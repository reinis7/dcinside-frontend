import { useMemo, useState } from 'react'
import { RankListItem } from './ui/RankListItem'

export function HotBox({ rankings }) {
  const [tab, setTab] = useState('person')
  const [page, setPage] = useState(1)

  const all = useMemo(() => rankings?.[tab] ?? [], [rankings, tab])
  const totalPages = Math.max(1, Math.ceil(all.length / 10))
  const items = useMemo(() => all.slice((page - 1) * 10, page * 10), [all, page])

  return (
    <div className="border border-[#d3d3d3] bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-[13px] font-bold">
          <span className="text-[#d31900]">HOT</span> <span className="text-[#333]">흥한갤</span>
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
              className={t.id === tab ? 'font-bold text-[#2fa40e] underline' : 'text-[#333]'}
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
      <div className="border-t border-[#d3d3d3] px-3">
        <ol className="py-1">
          {items.map((it) => (
            <RankListItem key={it.id} color="green" item={it} showTag showDelta={false} />
          ))}
        </ol>
      </div>
      <div className="flex items-center justify-between border-t border-[#d3d3d3] px-3 py-1 text-[11px] text-[#666]">
        <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
          전체 순위
        </a>
        <button
          type="button"
          className="hover:underline"
          onClick={() => setPage((p) => (p >= totalPages ? 1 : p + 1))}
        >
          {(page - 1) * 10 + 1}위 - {page * 10}위
        </button>
      </div>
    </div>
  )
}

