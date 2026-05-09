import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'

const SUB_HEADERS = ['최근 방문', '실시간 베스트', '싱글벙글 지구촌', '힛갤', '위뉴스', '개정줌']
const USER_DROPDOWN_ITEMS = [
  { key: 'my-gallog', label: 'MY갤로그', toType: 'gallog' },
  { key: 'fixed-nick', label: '고정닉정보' },
  { key: 'favorites', label: '즐겨찾기' },
  { key: 'manage-join', label: '운영/가입' },
  { key: 'scrap', label: '스크랩' },
  { key: 'alarm-list', label: '알림 리스트' },
]

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthed, viewer, logout } = useAuth()
  const displayName = viewer?.username || viewer?.name || '회원'
  const currentUserId = viewer?.username || viewer?.userId || null
  const myGallogHref = currentUserId ? `/gallog/${encodeURIComponent(currentUserId)}/posting/all` : '/gallog'
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const headerSearchRef = useRef(null)

  useEffect(() => {
    if (!location.pathname.startsWith('/search/q')) return
    const kw = new URLSearchParams(location.search).get('keyword') ?? ''
    const el = headerSearchRef.current
    if (el) el.value = kw
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!isUserMenuOpen) return
    const handleOutside = (event) => {
      if (!userMenuRef.current) return
      if (!userMenuRef.current.contains(event.target)) setIsUserMenuOpen(false)
    }
    const handleEsc = (event) => {
      if (event.key === 'Escape') setIsUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isUserMenuOpen])

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

        <form
          className="flex w-[320px] items-stretch gap-0"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            const q = headerSearchRef.current?.value.trim() ?? ''
            if (!q) return
            navigate(`/search/q?keyword=${encodeURIComponent(q)}`)
          }}
        >
          <input
            ref={headerSearchRef}
            className="h-[38px] flex-1 rounded-l border border-[#2f3d8f] px-3 text-[13px] outline-none"
            placeholder="갤러리 & 통합검색"
            defaultValue=""
            aria-label="통합 검색어"
          />
          <button
            type="submit"
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

        <div className="flex w-[420px] flex-col items-end gap-1">
          {isAuthed ? (
            <>
              <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 text-[11px] text-[#555]">
                {[
                  { label: '갤러리', to: '/gall' },
                  { label: '마이너갤', to: '/gall/m' },
                  { label: '인물갤', to: '/gall/p' },
                ].map((item, idx, arr) => (
                  <span key={item.label} className="inline-flex items-center">
                    <Link to={item.to} className="hover:underline">
                      {item.label}
                    </Link>
                    {idx < arr.length - 1 ? <span className="ml-2 text-[#cfcfcf]">|</span> : null}
                  </span>
                ))}
                <span className="inline-flex items-center">
                  <Link to={myGallogHref} className="hover:underline">
                    갤로그
                  </Link>
                  <span className="ml-2 text-[#cfcfcf]">|</span>
                </span>
                <span className="inline-flex items-center">
                  <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                    디시게임
                  </a>
                  <span className="ml-2 text-[#cfcfcf]">|</span>
                </span>
                <span className="inline-flex items-center">
                  <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                    이벤트
                  </a>
                  <span className="ml-2 text-[#cfcfcf]">|</span>
                </span>
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  디시트렌드
                </a>
              </div>

              <div className="flex items-center gap-2 text-[12px]">
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1 font-semibold text-[#333] hover:underline"
                  >
                    {displayName}
                    <span className="text-[10px]">▼</span>
                  </button>
                  {isUserMenuOpen ? (
                    <div className="absolute right-0 z-20 mt-1 min-w-[120px] border border-[#cfcfcf] bg-white py-1 text-[12px] shadow-sm">
                      {USER_DROPDOWN_ITEMS.map((item) =>
                        item.toType === 'gallog' ? (
                          <Link
                            key={item.key}
                            to={myGallogHref}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-3 py-1.5 text-[#333] hover:bg-[#f5f7fb]"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block w-full px-3 py-1.5 text-left text-[#333] hover:bg-[#f5f7fb]"
                          >
                            {item.label}
                          </button>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="h-[20px] rounded-sm border border-[#2f3d8f] bg-[#2f3d8f] px-2 text-[11px] font-bold text-white"
                >
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-[12px] text-[#555]">
              <Link to="/sign/login" className="hover:underline">
                로그인
              </Link>
              <span className="text-[#cfcfcf]">|</span>
              <Link to="/sign/register" className="hover:underline">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#2f3d8f] text-white">
        <div className="mx-auto flex h-[42px] w-[1050px] items-center justify-between px-1 text-[13px] font-bold">
          <nav className="flex items-center gap-5">
            <Link
              to="/gall"
              className={/^\/gall(\/$|$)/.test(location.pathname) || /^\/gall\/board(\/|$)/.test(location.pathname) || location.pathname === '/gall/create' ? 'text-[#ffd15c]' : 'hover:underline'}
            >
              갤러리
            </Link>
            <Link
              to="/gall/m"
              className={
                /^\/gall\/m(\/|$)/.test(location.pathname) || /^\/gall\/mgallery(\/|$)/.test(location.pathname)
                  ? 'text-[#ffd15c]'
                  : 'hover:underline'
              }
            >
              마이너갤
            </Link>
            <Link
              to="/gall/n"
              className={/^\/gall\/n(\/|$)/.test(location.pathname) || /^\/gall\/mini(\/|$)/.test(location.pathname) ? 'text-[#ffd15c]' : 'hover:underline'}
            >
              미니갤
            </Link>
            <Link
              to="/gall/p"
              className={/^\/gall\/p(\/|$)/.test(location.pathname) || /^\/gall\/person(\/|$)/.test(location.pathname) ? 'text-[#ffd15c]' : 'hover:underline'}
            >
              인물갤
            </Link>
            <Link to={myGallogHref} className="hover:underline">
              갤로그
            </Link>
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
