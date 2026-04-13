import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export function SignLoginPage() {
  const [searchParams] = useSearchParams()
  const sUrl = searchParams.get('s_url') ?? '/www'
  const [form, setForm] = useState({
    userId: '',
    password: '',
    saveId: false,
    secureConn: true,
  })

  const canLogin = form.userId.trim().length > 0 && form.password.length > 0

  const onChange = (key) => (e) => {
    const value = typeof e === 'boolean' ? e : e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <section className="mx-auto w-[760px] border border-[#d1d5db] bg-white p-4 text-[12px]">
      <h2 className="text-[24px] font-semibold">로그인</h2>
      <p className="mt-1 text-[12px] text-[#666]">요청된 복귀 경로(s_url): {sUrl}</p>

      <div className="mt-3 grid max-w-[420px] gap-3 border-t-2 border-[#374151] pt-3">
        <label className="grid gap-1">
          <span className="font-semibold">식별 코드</span>
          <input
            value={form.userId}
            onChange={onChange('userId')}
            placeholder="식별 코드를 입력하세요"
            autoComplete="username"
            className="rounded border border-[#d1d5db] px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="font-semibold">비밀번호</span>
          <input
            type="password"
            value={form.password}
            onChange={onChange('password')}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            className="rounded border border-[#d1d5db] px-3 py-2"
          />
        </label>

        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={form.saveId} onChange={onChange('saveId')} className="h-3 w-3" />
            <span>코드 저장</span>
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={form.secureConn} onChange={onChange('secureConn')} className="h-3 w-3" />
            <span>보안접속</span>
          </label>
        </div>

        <div className="flex justify-end">
          {canLogin ? (
            <Link
              className="inline-flex h-[28px] min-w-[56px] items-center justify-center rounded-sm border border-[#5f5f5f] bg-[#6c6c6c] px-4 text-[12px] font-semibold text-white"
              to={sUrl}
            >
              로그인
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex h-[28px] min-w-[56px] items-center justify-center rounded-sm border border-[#b1b1b1] bg-[#d8d8d8] px-4 text-[12px] text-[#8a8a8a]"
              disabled
            >
              로그인
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[12px] text-[#666]">
        <Link to="/sign/join/agree" className="text-[#334499] hover:underline">
          고정닉 신청
        </Link>
        <span>|</span>
        <Link to="/sign/help/find-id" className="text-[#334499] hover:underline">
          식별 코드 찾기
        </Link>
        <span>|</span>
        <Link to="/sign/help/reset-password" className="text-[#334499] hover:underline">
          비밀번호 찾기
        </Link>
      </div>
    </section>
  )
}
