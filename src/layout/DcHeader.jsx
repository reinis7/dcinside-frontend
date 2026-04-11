const GNB_LINKS = [
  { href: 'https://gall.dcinside.com', label: '갤러리' },
  { href: 'https://gall.dcinside.com/m', label: '마이너갤' },
  { href: 'https://gall.dcinside.com/n', label: '미니갤' },
  { href: 'https://gall.dcinside.com/p', label: '인물갤' },
  { href: 'https://gallog.dcinside.com', label: '갤로그' },
]

const RECENT_GALLS = [
  { href: '#', label: 'Github', badge: 'ⓜ' },
  { href: '#', label: '아이돌마스터' },
  { href: '#', label: '실시간 베스트' },
]

export function DcHeader() {
  return (
    <>
      <header className="border-b border-[#d7d7d7] bg-white">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-4 px-3 py-3 md:flex-nowrap md:gap-6">
          <h1 className="m-0 shrink-0">
            <a
              href="https://www.dcinside.com/"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-[184px] max-w-[50vw] items-center bg-contain bg-left bg-no-repeat text-[0]"
              style={{
                backgroundImage:
                  'url(https://nstatic.dcinside.com/dc/logo_day/dc_logo.gif)',
              }}
            >
              디시인사이드
            </a>
          </h1>

          <div className="min-w-0 flex-1">
            <h2 className="sr-only">갤러리 검색</h2>
            <form
              className="flex w-full max-w-xl overflow-hidden rounded border border-[#29367c]"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <fieldset className="m-0 flex min-w-0 flex-1 border-0 p-0">
                <legend className="sr-only">통합검색</legend>
                <input
                  className="min-w-0 flex-1 border-0 px-3 py-2 text-sm outline-none"
                  type="search"
                  name="search"
                  placeholder="갤러리 & 통합검색"
                  autoComplete="off"
                />
              </fieldset>
              <button
                type="submit"
                className="shrink-0 bg-[#3b4890] px-4 text-sm font-medium text-white hover:bg-[#29367c]"
              >
                검색
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="border-b border-[#22397a] bg-[#29367c]">
        <nav
          className="mx-auto flex max-w-[1100px] flex-col gap-2 px-3 py-2 text-[13px] text-white md:flex-row md:items-center md:justify-between md:gap-4"
          aria-label="주요 메뉴"
        >
          <h2 className="sr-only">GNB</h2>
          <ul className="m-0 flex list-none flex-wrap gap-x-1 gap-y-1 p-0">
            {GNB_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded px-2 py-1 text-white/95 hover:bg-white/10"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-white/85">
            <a href="#" className="hover:underline">
              어제 <em className="not-italic text-amber-200">910,130개</em>{' '}
              게시글
            </a>
            <span className="hidden text-white/40 sm:inline">|</span>
            <span>
              총 갤러리 <em className="not-italic text-amber-200">93,735개</em>
            </span>
          </div>
        </nav>
      </div>

      <div className="border-b border-[#ccc] bg-[#f3f3f3]">
        <div className="mx-auto flex max-w-[1100px] items-center gap-2 px-3 py-2 text-[12px]">
          <h3 className="m-0 shrink-0 font-bold text-[#333]">최근 방문</h3>
          <ul className="m-0 flex min-w-0 list-none gap-2 overflow-x-auto p-0">
            {RECENT_GALLS.map((g) => (
              <li key={g.label} className="shrink-0">
                <a href={g.href} className="text-[#0033a0] hover:underline">
                  {g.label}
                  {g.badge ? (
                    <span className="ml-0.5 text-[#666]">{g.badge}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
