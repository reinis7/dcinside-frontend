const FOOTER_LINKS: { label: string; bold?: boolean }[] = [
  { label: '회사소개' },
  { label: '제휴안내' },
  { label: '광고안내' },
  { label: '이용약관' },
  { label: '개인정보처리방침', bold: true },
  { label: '청소년보호정책' },
]

export function SiteFooter() {
  return (
    <footer className="mt-4 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-site flex-col items-center px-2 py-6 text-[11px]">
        <nav
          className="flex flex-wrap items-center justify-center text-gray-700"
          aria-label="푸터 링크"
        >
          {FOOTER_LINKS.map(({ label, bold }, i) => (
            <span key={label} className="inline-flex items-center">
              {i > 0 && (
                <span className="mx-2 select-none text-gray-300" aria-hidden>
                  |
                </span>
              )}
              <a
                href="#"
                className={`whitespace-nowrap hover:underline ${bold ? 'font-bold text-gray-800' : ''}`}
              >
                {label}
              </a>
            </span>
          ))}
        </nav>
        <p className="mt-2 text-center text-gray-500">
          Copyright ⓒ 1999 - 2026 dcinside. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
