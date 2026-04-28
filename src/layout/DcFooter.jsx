const FOOTER_LINKS = [
  { href: 'https://www.dcinside.com/company', label: '회사소개' },
  { href: 'https://www.dcinside.com/partnership', label: '제휴안내' },
  { href: 'https://www.dcinside.com/ad', label: '광고안내' },
  { href: 'https://nstatic.dcinside.com/dc/w/policy/policy_index.html', label: '이용약관' },
  { href: 'https://nstatic.dcinside.com/dc/w/policy/privacy_index.html', label: '개인정보처리방침', strong: true },
  { href: 'https://www.dcinside.com/policy/youth', label: '청소년보호정책' },
  { href: 'https://nstatic.dcinside.com/dc/w/policy/minor_gallery_policy.html', label: '미니 갤러리 운영원칙' },
]

export function DcFooter() {
  return (
    <footer className="mt-6 border-t border-[#ddd] bg-white text-[12px] text-[#555]">
      <div className="mx-auto w-[1050px] px-1 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px]">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={link.strong ? 'font-bold text-[#222] hover:underline' : 'hover:underline'}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="mt-2 text-center text-[11px] text-[#777]">
          Copyright ⓒ 1999 - 2026 dcinside. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
