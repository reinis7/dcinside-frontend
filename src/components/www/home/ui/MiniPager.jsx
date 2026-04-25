export function MiniPager({ valueText, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-1">
      <span className="mr-1 text-[11px] text-[#333]">{valueText}</span>
      <button
        type="button"
        aria-label="이전"
        className="h-[16px] w-[18px] border border-[#2f3d8f] bg-[#3b4890] text-[10px] font-bold leading-[14px] text-white"
        onClick={onPrev}
      >
        ◀
      </button>
      <button
        type="button"
        aria-label="다음"
        className="h-[16px] w-[18px] border border-[#2f3d8f] bg-[#3b4890] text-[10px] font-bold leading-[14px] text-white"
        onClick={onNext}
      >
        ▶
      </button>
    </div>
  )
}

