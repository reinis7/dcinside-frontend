export function SubNavigation() {
  return (
    <div className="border-b border-gray-200 bg-gray-100">
      <div className="mx-auto max-w-site px-2 py-1.5">
        <div className="inline-flex items-stretch border border-gray-300 bg-[#e8e8e8] text-[11px] text-gray-800 shadow-sm">
          <span className="flex items-center px-2 py-0.5">최근 방문 갤러리</span>
          <button
            type="button"
            className="border-l border-gray-300 bg-[#dedede] px-1.5 text-[10px] leading-none text-gray-600 hover:bg-gray-300"
            aria-label="최근 방문 갤러리 목록 열기"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  )
}
