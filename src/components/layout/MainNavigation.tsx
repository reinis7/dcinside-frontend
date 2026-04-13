const NAV_ITEMS: { label: string; hasDropdown?: boolean }[] = [
  { label: '갤러리' },
  { label: '마이너갤' },
  { label: '미니갤' },
  { label: '인물갤' },
  { label: '갤로그', hasDropdown: true },
]

export function MainNavigation() {
  return (
    <nav className="bg-dc-nav text-white" aria-label="주요 메뉴">
      <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-x-4 gap-y-1 px-2 py-2 text-[13px]">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 font-bold">
          {NAV_ITEMS.map(({ label, hasDropdown }) => (
            <li key={label}>
              <a href="#" className="inline-flex items-center gap-0.5 whitespace-nowrap hover:underline">
                {label}
                {hasDropdown && (
                  <span className="text-[9px] leading-none text-white/90" aria-hidden>
                    ▼
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
        <p className="whitespace-nowrap text-[11px] font-normal text-white/90">
          어제 1,019,142개 게시글 등록
        </p>
      </div>
    </nav>
  )
}
