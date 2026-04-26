import { Link, useLocation } from 'react-router-dom'

const SUB_HEADERS = ['최근 방문', '실시간 베스트', '싱글벙글 지구촌', '힛갤', '위뉴스', '개정줌']

export function Header() {
  const location = useLocation()

  return (
    <header className="border-b border-[#d3d3d3] bg-white">
      <div className="mx-auto flex h-[78px] w-[1050px] items-center justify-between px-1">
        <Link to="/www" className="block">
          <img
            src="/snapshot/nstatic.dcinside.com/dc/w/images/dcin_logo.png"
            alt="dcinside"
            className="h-[40px] w-auto"
          />
        </Link>

        <form className="flex w-[560px] items-stretch gap-0">
          <input
            className="h-[38px] flex-1 rounded-l border border-[#2f3d8f] px-3 text-[13px] outline-none"
            placeholder="갤러리 & 통합검색"
          />
          <button
            type="button"
            className="h-[38px] w-[52px] rounded-r border border-[#2f3d8f] bg-[#2f3d8f] text-[13px] font-bold text-white"
            aria-label="검색"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              className="mx-auto block"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
        </form>

        <div />
      </div>

      <div className="bg-[#2f3d8f] text-white">
        <div className="mx-auto flex h-[42px] w-[1050px] items-center justify-between px-1 text-[13px] font-bold">
          <nav className="flex items-center gap-5">
            <Link to="/gall" className={location.pathname === '/gall' ? 'text-[#ffd15c]' : 'hover:underline'}>
              갤러리
            </Link>
            <Link to="/gall/m" className={location.pathname.startsWith('/gall/m') ? 'text-[#ffd15c]' : 'hover:underline'}>
              마이너갤
            </Link>
            <Link to="/gall/n" className={location.pathname.startsWith('/gall/n') ? 'text-[#ffd15c]' : 'hover:underline'}>
              미니갤
            </Link>
            <Link to="/gall/p" className={location.pathname.startsWith('/gall/p') ? 'text-[#ffd15c]' : 'hover:underline'}>
              인물갤
            </Link>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
              갤로그
            </a>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
              BJ방송
            </a>
          </nav>
          <button
            type="button"
            className="rounded-full border border-[#f2aa00] bg-[#2f3d8f] px-4 py-1 text-[12px] font-bold text-[#ffc439]"
          >
            디시 로터리 응모
          </button>
        </div>
      </div>

      <div className="border-t border-[#ececec] bg-[#fafafa]">
        <div className="mx-auto flex h-[32px] w-[1050px] items-center justify-between px-1 text-[12px]">
          <div className="flex items-center gap-2 text-[#555]">
            {SUB_HEADERS.map((item, idx) => (
              <a
                key={item}
                href="#"
                className="hover:text-[#2f3d8f] hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                {item}
                {idx < SUB_HEADERS.length - 1 ? <span className="ml-2 text-[#c2c2c2]">×</span> : null}
              </a>
            ))}
          </div>
          <a href="#" className="text-[11px] text-[#3b4890] hover:underline" onClick={(e) => e.preventDefault()}>
            전체
          </a>
        </div>
      </div>
    </header>
  )
}
