type PaginationArrowsProps = {
  current: number
  total: number
}

export function PaginationArrows({ current, total }: PaginationArrowsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <span className="pr-0.5 text-[11px] tabular-nums text-gray-600">
        {current}/{total}
      </span>
      <button
        type="button"
        className="flex h-[18px] w-[18px] items-center justify-center bg-dc-nav text-[9px] leading-none text-white hover:opacity-90"
        aria-label="이전"
      >
        ◀
      </button>
      <button
        type="button"
        className="flex h-[18px] w-[18px] items-center justify-center bg-dc-nav text-[9px] leading-none text-white hover:opacity-90"
        aria-label="다음"
      >
        ▶
      </button>
    </div>
  )
}
