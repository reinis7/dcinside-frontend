export function Pager({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-center gap-3 text-[12px] text-[#666]">
      <button
        type="button"
        aria-label="이전 페이지"
        className="rounded border border-[#cfcfcf] bg-white px-2 py-0.5 hover:bg-[#f6f6f6]"
        onClick={onPrev}
        disabled={page <= 1}
      >
        이전
      </button>
      <span>
        <span className="font-bold text-[#333]">{page}</span>/{totalPages}
      </span>
      <button
        type="button"
        aria-label="다음 페이지"
        className="rounded border border-[#cfcfcf] bg-white px-2 py-0.5 hover:bg-[#f6f6f6]"
        onClick={onNext}
        disabled={page >= totalPages}
      >
        다음
      </button>
    </div>
  )
}

