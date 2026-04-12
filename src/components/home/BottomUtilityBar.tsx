function MoonIcon() {
  return (
    <svg className="h-3 w-3 text-gray-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
      />
    </svg>
  )
}

export function BottomUtilityBar() {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-2 py-1 text-[11px] text-gray-600">
      <button type="button" className="inline-flex items-center gap-0.5 hover:underline">
        <MoonIcon />
        야간모드
      </button>
      <button type="button" className="inline-flex items-center gap-0.5 hover:underline">
        <span className="text-sm leading-none">−</span>
        닫기
      </button>
      <button type="button" className="inline-flex items-center gap-0.5 hover:underline">
        <span className="text-[10px]">▲</span>
        맨위로
      </button>
    </div>
  )
}
