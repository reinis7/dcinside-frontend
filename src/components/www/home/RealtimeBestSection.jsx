import { useMemo, useState } from 'react'
import { Pager } from './ui/Pager'
import { ThumbStrip } from './ui/ThumbStrip'

export function RealtimeBestSection({ items, loading = false, errorMessage = null }) {
  const [page, setPage] = useState(1)
  const pageSize = 30
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page])

  return (
    <div className="border border-[#d3d3d3] bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-bold text-[#273589]">실시간 베스트</h2>
          <span className="text-[11px] font-bold text-[#3b4890]">실베라이트</span>
        </div>
        <div className="flex items-center gap-2">
          {loading ? <span className="text-[11px] text-[#666]">불러오는 중...</span> : null}
          {!loading && errorMessage ? <span className="text-[11px] text-[#d31900]">불러오기 실패</span> : null}
          <Pager
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      </div>

      <div className="border-t border-[#d3d3d3] px-3 py-2">
        <ThumbStrip items={pageItems.slice(0, 5)} />
      </div>

      <ul className="border-t border-[#d3d3d3]">
        {pageItems.map((it) => (
          <li
            key={it.id}
            className="grid grid-cols-[46px_1fr_152px] items-center gap-2 border-b border-[#ededed] px-3 py-1.5 last:border-b-0"
          >
            <img
              src={it.thumb}
              alt=""
              className="h-[38px] w-[46px] rounded border border-[#e5e5e5] bg-white object-cover"
            />
            <a href={it.href} className="min-w-0 truncate text-[12px] text-[#333] hover:underline">
              {it.title}{' '}
              {it.commentCount > 0 ? <span className="font-bold text-[#d31900]">[{it.commentCount}]</span> : null}
            </a>
            <div className="truncate text-right text-[11px]">
              <span className="text-[#555]">{it.categoryName ?? it.gallery ?? '게시판'}</span>
              <span className="mx-1 text-[#aaa]">|</span>
              <span className="text-[#999]">{it.time}</span>
            </div>
          </li>
        ))}
        {!loading && pageItems.length === 0 ? (
          <li className="px-3 py-4 text-center text-[12px] text-[#666]">표시할 게시물이 없습니다.</li>
        ) : null}
      </ul>
    </div>
  )
}

