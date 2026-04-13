const UTIL_LINKS = [
  '갤러리',
  '마이너갤',
  '미니갤',
  '갤로그',
  '디시게임',
  '이벤트',
  '디시콘',
]

function MoonIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 text-dc-link"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
      />
    </svg>
  )
}

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      {/* 상단 유틸 — 우측 정렬 */}
      <div className="mx-auto max-w-site px-2 pt-1">
        <div className="flex flex-wrap items-center justify-end gap-x-1 gap-y-1 text-[11px] leading-none text-dc-link">
          {UTIL_LINKS.map((label, i) => (
            <span key={label} className="inline-flex items-center">
              {i > 0 && (
                <span className="mx-1 text-gray-300 select-none" aria-hidden>
                  |
                </span>
              )}
              <a href="#" className="whitespace-nowrap hover:underline">
                {label}
              </a>
            </span>
          ))}
          <span className="mx-1 text-gray-300 select-none" aria-hidden>
            |
          </span>
          <button
            type="button"
            className="rounded-sm bg-dc-nav px-2 py-0.5 text-[11px] font-normal text-white hover:opacity-90"
          >
            로그인
          </button>
          <span className="mx-1 text-gray-300 select-none" aria-hidden>
            |
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-0.5 whitespace-nowrap hover:underline"
          >
            <MoonIcon />
            야간모드
          </button>
        </div>
      </div>

      {/* 로고 + 검색 */}
      <div className="mx-auto flex max-w-site items-center gap-2 px-2 py-2">
        <div className="shrink-0">
          <a href="/" className="inline-block">
            <span className="text-[22px] font-black italic leading-none tracking-tight text-black">
              dcinside.com
            </span>
          </a>
        </div>
        <div className="flex min-w-0 flex-1 justify-start">
          <div className="flex w-full max-w-[520px] border-2 border-dc-nav">
            <input
              type="search"
              placeholder="갤러리 & 통합검색"
              className="min-h-[32px] min-w-0 flex-1 border-0 px-2 py-1 text-[12px] text-gray-800 placeholder:text-gray-400 outline-none"
              readOnly
              aria-label="검색"
            />
            <button
              type="button"
              className="min-h-[32px] min-w-[36px] shrink-0 bg-dc-nav px-2 text-[12px] text-white hover:opacity-90"
              aria-label="검색 실행"
            >
              검색
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
