import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SignLoginPage } from '../pages/sign/SignLoginPage'
import { SignJoinAgreePage } from '../pages/sign/SignJoinAgreePage'
import { SignJoinInfoPage } from '../pages/sign/SignJoinInfoPage'
import { SignJoinSecurityPage } from '../pages/sign/SignJoinSecurityPage'
import { SignJoinDonePage } from '../pages/sign/SignJoinDonePage'

function SignHomePage() {
  return (
    <section className="rounded border border-slate-300 bg-white p-4 text-sm">
      <h2 className="text-lg font-semibold">sign 홈</h2>
      <p className="mt-2 text-slate-700">인증 관련 페이지 네임스페이스입니다.</p>
      <p className="mt-2">
        <Link to="/sign/login?s_url=%2Fwww" className="text-blue-700 hover:underline">
          로그인 페이지로 이동
        </Link>
      </p>
      <p className="mt-1">
        <Link to="/sign/join/agree" className="text-blue-700 hover:underline">
          고정닉 신청(약관동의) 이동
        </Link>
      </p>
    </section>
  )
}

function SignFindIdPage() {
  return (
    <section className="rounded border border-slate-300 bg-white p-4">
      <h2 className="text-xl font-semibold">식별 코드 찾기</h2>
      <p className="mt-2 text-sm text-slate-600">실제 인증 연동 전까지는 안내 페이지로 동작합니다.</p>
      <p className="mt-2">
        <Link to="/sign/login" className="text-sm text-blue-700 hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </section>
  )
}

function SignResetPasswordPage() {
  return (
    <section className="rounded border border-slate-300 bg-white p-4">
      <h2 className="text-xl font-semibold">비밀번호 찾기</h2>
      <p className="mt-2 text-sm text-slate-600">실제 인증 연동 전까지는 안내 페이지로 동작합니다.</p>
      <p className="mt-2">
        <Link to="/sign/login" className="text-sm text-blue-700 hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </section>
  )
}

function SignLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#ececec] text-[#333]">
      <header className="bg-[#2f3d8f] text-white">
        <div className="mx-auto flex h-[56px] w-[980px] items-center justify-between px-1">
          <Link to="/sign" className="block">
            <img
              src="/snapshot/nstatic.dcinside.com/dc/w/images/dcin_logo.png"
              alt="dcinside"
              className="h-[30px] w-auto"
            />
          </Link>
          <nav className="flex items-center gap-2 text-[12px] text-white/90">
            <Link to="/sign/join/agree" className="hover:underline">
              갤러리
            </Link>
            <span>|</span>
            <Link to="/sign/login?s_url=%2Fwww" className="hover:underline">
              마이너갤
            </Link>
            <span>|</span>
            <Link to="/sign/help/find-id" className="hover:underline">
              미니갤
            </Link>
            <span>|</span>
            <Link to="/www" className="hover:underline">
              인물갤
            </Link>
            <span>|</span>
            <Link to="/sign" className="hover:underline">
              갤로그
            </Link>
            <span>|</span>
            <Link to="/sign/join/agree" className="hover:underline">
              이벤트
            </Link>
            <span>|</span>
            <Link to="/sign/join/agree" className="hover:underline">
              디시콘
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-[980px] px-1 py-4 text-[15px]">
        <p className="mb-3 hidden text-[12px] text-slate-500">현재 경로: {location.pathname + location.search}</p>
        <Routes>
          <Route index element={<SignHomePage />} />
          <Route path="login" element={<SignLoginPage />} />
          <Route path="join/agree" element={<SignJoinAgreePage />} />
          <Route path="join/info" element={<SignJoinInfoPage />} />
          <Route path="join/security" element={<SignJoinSecurityPage />} />
          <Route path="join/done" element={<SignJoinDonePage />} />
          <Route path="help/find-id" element={<SignFindIdPage />} />
          <Route
            path="help/reset-password"
            element={<SignResetPasswordPage />}
          />
          <Route path="*" element={<Navigate to="/sign" replace />} />
        </Routes>
      </main>

      <footer className="mt-10 border-t border-[#d3d3d3] bg-white">
        <div className="mx-auto w-[980px] px-1 py-6 text-center text-[12px] text-[#666]">
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

export function SignRoutes() {
  return <SignLayout />
}
