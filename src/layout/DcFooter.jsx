const FOOTER_GROUPS = [
  {
    title: '갤러리',
    links: [
      { href: 'https://gall.dcinside.com/board/lists/?id=dcbest', label: '실시간 베스트 갤러리' },
    ],
  },
  {
    title: '주요서비스',
    links: [
      { href: 'https://gallog.dcinside.com', label: '갤로그' },
      { href: 'https://event.dcinside.com/', label: '이벤트' },
      { href: 'https://mall.dcinside.com/?from=A08', label: '디시콘' },
    ],
  },
  {
    title: '디시이슈',
    links: [{ href: 'https://issuefeed.dcinside.com', label: '디시이슈' }],
  },
]

export function DcFooter() {
  return (
    <footer className="mt-6 border-t border-[#ddd] bg-[#f3f3f3] text-[12px] text-neutral-700">
      <div className="mx-auto max-w-[1100px] px-3 py-4">
        <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-neutral-300 pb-3">
          <a
            href="https://gall.dcinside.com/list.php?id=know"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-neutral-900 hover:underline"
          >
            공지사항
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="m-0 mb-1 text-[13px] font-bold text-[#29367c]">
                {group.title}
              </h3>
              <ul className="m-0 list-none space-y-1 p-0">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-neutral-600 hover:text-[#0033a0] hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="info_policy mt-4 flex flex-wrap gap-x-3 gap-y-1 border-t border-neutral-300 pt-3 text-[11px] text-neutral-600">
          <a href="https://www.dcinside.com/company" target="_blank" rel="noreferrer" className="hover:underline">
            회사소개
          </a>
          <a href="https://nstatic.dcinside.com/dc/w/policy/privacy_index.html" target="_blank" rel="noreferrer" className="font-semibold hover:underline">
            개인정보처리방침
          </a>
          <a href="https://nstatic.dcinside.com/dc/w/policy/policy_index.html" target="_blank" rel="noreferrer" className="hover:underline">
            이용약관
          </a>
        </div>
        <div className="copyright mt-2 text-[11px] text-neutral-500">
          Copyright ⓒ 1999 - 2026 dcinside. All rights reserved. (클론 데모 레이아웃)
        </div>
      </div>
    </footer>
  )
}
