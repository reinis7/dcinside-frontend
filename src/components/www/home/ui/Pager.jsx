export function Pager({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] leading-none">
      <span className="text-[11px] text-[#333]">
        <span className="font-bold text-[#d31900]">{page}</span>/{totalPages}
      </span>
      <button
        type="button"
        aria-label="이전 페이지"
        className="flex h-[15px] w-[15px] items-center justify-center border border-[#2f3d8f] bg-[#3b4890] disabled:cursor-default disabled:opacity-50"
        onClick={onPrev}
        disabled={page <= 1}
      >
        <span
          className="h-0 w-0 border-y-[4px] border-r-[5px] border-y-transparent border-r-white"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        aria-label="다음 페이지"
        className="flex h-[15px] w-[15px] items-center justify-center border border-[#2f3d8f] bg-[#3b4890] disabled:cursor-default disabled:opacity-50"
        onClick={onNext}
        disabled={page >= totalPages}
      >
        <span
          className="h-0 w-0 border-y-[4px] border-l-[5px] border-y-transparent border-l-white"
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

