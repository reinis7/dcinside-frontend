import { Navigate, Route, Routes } from 'react-router-dom'
import { WwwHomePage } from '../pages/www/WwwHomePage'
import { WwwMyPage } from '../pages/www/WwwMyPage'
import { RequireAuth } from '../auth/RequireAuth'
import { Header } from '../components/common/Header'

function WwwLayout() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#333]">
      <Header />

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
