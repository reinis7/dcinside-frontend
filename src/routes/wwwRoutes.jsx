import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { WwwHomePage } from '../pages/www/WwwHomePage'
import { WwwMyPage } from '../pages/www/WwwMyPage'
import { RequireAuth } from '../auth/RequireAuth'

function WwwLayout() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#333]">
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
              <Link to="/gall" className="hover:underline">
                갤러리
              </Link>
              <Link to="/gall/m" className="hover:underline">
                마이너갤
              </Link>
              <Link to="/gall/n" className="hover:underline">
                미니갤
              </Link>
              <Link to="/gall/p" className="hover:underline">
                인물갤
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto w-[1050px] px-1 py-3 text-[12px]">
        <Routes>
          <Route index element={<WwwHomePage />} />
          <Route
            path="my"
            element={
              <RequireAuth>
                <WwwMyPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/www" replace />} />
        </Routes>
      </main>

      <footer className="mt-10 border-t border-[#d3d3d3] bg-white">
        <div className="mx-auto w-[1050px] px-1 py-6 text-center text-[12px] text-[#666]">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
              회사소개
            </a>
            <span>|</span>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
              제휴안내
            </a>
            <span>|</span>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
              광고안내
            </a>
            <span>|</span>
            <a
              href="https://nstatic.dcinside.com/dc/w/policy/policy_index.html"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              이용약관
            </a>
            <span>|</span>
            <a
              href="https://nstatic.dcinside.com/dc/w/policy/privacy_index.html"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#333] hover:underline"
            >
              개인정보처리방침
            </a>
            <span>|</span>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
              청소년보호정책
            </a>
          </div>
          <div className="mt-2 text-[11px] text-[#777]">
            Copyright ⓒ 1999 - 2026 dcinside. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export function WwwRoutes() {
  return <WwwLayout />
}
