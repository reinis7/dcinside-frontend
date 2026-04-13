import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { WwwHomePage } from '../pages/www/WwwHomePage'
import { WwwMyPage } from '../pages/www/WwwMyPage'
import { RequireAuth } from '../auth/RequireAuth'

function WwwLayout() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#333]">
      <header className="border-b border-[#d3d3d3] bg-white">
        <div className="mx-auto flex h-[58px] w-[1050px] items-center justify-between px-1">
          <Link to="/www" className="block">
            <img
              src="/snapshot/nstatic.dcinside.com/dc/w/images/dcin_logo.png"
              alt="dcinside"
              className="h-[28px] w-auto"
            />
          </Link>

          <form className="flex w-[560px] items-stretch gap-0">
            <input
              className="h-[30px] flex-1 rounded-l border border-[#2f3d8f] px-3 text-[12px] outline-none"
              placeholder="갤러리 & 통합검색"
            />
            <button
              type="button"
              className="h-[30px] w-[44px] rounded-r border border-[#2f3d8f] bg-[#2f3d8f] text-[12px] font-bold text-white"
            >
              ▶
            </button>
          </form>

          <div className="flex items-center gap-3 text-[12px] text-[#666]">
            <Link to="/sign/login?s_url=%2Fwww" className="hover:underline">
              로그인
            </Link>
            <span>|</span>
            <Link to="/sign/join/agree" className="hover:underline">
              회원가입
            </Link>
            <span>|</span>
            <Link to="/www/my" className="hover:underline">
              마이
            </Link>
          </div>
        </div>

        <div className="bg-[#2f3d8f] text-white">
          <div className="mx-auto flex h-[34px] w-[1050px] items-center justify-between px-1 text-[12px] font-bold">
            <nav className="flex items-center gap-4">
              <Link to="/www" className="hover:underline">
                갤러리
              </Link>
              <Link to="/www" className="hover:underline">
                마이너갤
              </Link>
              <Link to="/www" className="hover:underline">
                미니갤
              </Link>
              <Link to="/www" className="hover:underline">
                인물갤
              </Link>
              <Link to="/www" className="hover:underline">
                갤로그
              </Link>
              <Link to="/www" className="hover:underline">
                더보기
              </Link>
            </nav>
            <button
              type="button"
              className="h-[22px] rounded border border-white/40 bg-white/10 px-2 text-[11px] font-bold text-white hover:bg-white/20"
            >
              다크 테마(임시)
            </button>
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
