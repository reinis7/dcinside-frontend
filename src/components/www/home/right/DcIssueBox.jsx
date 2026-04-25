import { useMemo, useState } from 'react'
import { MiniPager } from '../ui/MiniPager'

export function DcIssueBox({ items }) {
  const [page, setPage] = useState(1)
  const totalPages = 2

  const slice = useMemo(() => items.slice((page - 1) * 5, (page - 1) * 5 + 5), [items, page])

  return (
    <div className="border border-[#d3d3d3] bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-end gap-2">
          <div className="text-[13px] font-bold text-[#333]">디시이슈</div>
          <div className="text-[14px] font-black italic text-[#555]">dcissue</div>
        </div>
        <MiniPager
          valueText={`${page}/${totalPages}`}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
      <div className="border-t border-[#d3d3d3] px-3 py-2">
        <div className="grid grid-cols-2 gap-2">
          {slice.slice(0, 2).map((it, idx) => (
            <a key={it.id} href={it.href} className="block">
              <img src={it.thumb} alt="" className="h-[70px] w-full border border-[#d3d3d3] object-cover" />
              <div className="mt-1 truncate text-[12px] text-[#333] hover:underline">
                <span className="mr-1 font-bold text-[#3b4890]">{idx + 1}</span>
                {it.title}
              </div>
            </a>
          ))}
        </div>
        <div className="mt-2 grid gap-1 text-[12px] text-[#333]">
          {slice.slice(2, 5).map((it, idx) => (
            <a key={it.id} href={it.href} className="truncate hover:underline">
              <span className="mr-1 font-bold text-[#3b4890]">{idx + 3}</span>
              {it.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

