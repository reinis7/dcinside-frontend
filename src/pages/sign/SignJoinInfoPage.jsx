import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export function SignJoinInfoPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const agree = location.state?.agree ?? { terms: false, privacy: false, marketing: false }

  const [form, setForm] = useState({
    userId: '',
    password: '',
    email: '',
    nickname: '',
  })
  const [errorMsg, setErrorMsg] = useState('')

  const canNext =
    form.userId.trim().length > 0 &&
    form.password.length >= 8 &&
    form.nickname.trim().length > 0 &&
    Boolean(agree?.terms && agree?.privacy)

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  return (
    <section className="mx-auto w-[760px] border border-[#d1d5db] bg-white p-4 text-[12px]">
      <h2 className="text-[24px] font-semibold">고정닉 신청</h2>
      <p className="mt-1 text-[12px] text-[#666]">페이지 경로 &gt; 정보 입력</p>

      <h3 className="mt-5 text-[18px] font-semibold">가입 정보</h3>

      <div className="mt-3 grid gap-3 border-t-2 border-[#374151] pt-3">
        {!agree?.terms || !agree?.privacy ? (
          <p className="text-[#d31900]">약관 동의가 필요합니다. 이전 단계에서 필수 항목에 동의해 주세요.</p>
        ) : null}

        <label className="grid gap-1">
          <span className="font-semibold">식별 코드</span>
          <input
            value={form.userId}
            onChange={onChange('userId')}
            className="rounded border border-[#d1d5db] px-3 py-2"
            autoComplete="username"
          />
        </label>

        <label className="grid gap-1">
          <span className="font-semibold">비밀번호 (8자 이상)</span>
          <input
            type="password"
            value={form.password}
            onChange={onChange('password')}
            className="rounded border border-[#d1d5db] px-3 py-2"
            autoComplete="new-password"
          />
        </label>

        <label className="grid gap-1">
          <span className="font-semibold">이메일 (선택)</span>
          <input
            type="email"
            value={form.email}
            onChange={onChange('email')}
            className="rounded border border-[#d1d5db] px-3 py-2"
            autoComplete="email"
          />
        </label>

        <label className="grid gap-1">
          <span className="font-semibold">닉네임</span>
          <input value={form.nickname} onChange={onChange('nickname')} className="rounded border border-[#d1d5db] px-3 py-2" />
        </label>

        {errorMsg ? (
          <div className="rounded border border-[#f2b8b5] bg-[#fff5f5] px-3 py-2 text-[#d31900]">{errorMsg}</div>
        ) : null}
      </div>

      <div className="mt-5 flex justify-between">
        <Link className="text-[#666] hover:underline" to="/sign/join/agree">
          이전
        </Link>
        <button
          type="button"
          disabled={!canNext}
          className={
            canNext
              ? 'inline-flex h-[28px] min-w-[56px] items-center justify-center rounded-sm border border-[#5f5f5f] bg-[#6c6c6c] px-4 text-[12px] font-semibold text-white'
              : 'inline-flex h-[28px] min-w-[56px] items-center justify-center rounded-sm border border-[#b1b1b1] bg-[#d8d8d8] px-4 text-[12px] font-semibold text-[#8a8a8a]'
          }
          onClick={() => {
            setErrorMsg('')
            if (!canNext) {
              setErrorMsg('필수 항목을 확인해 주세요.')
              return
            }
            navigate('/sign/join/security', {
              state: {
                joinForm: {
                  userId: form.userId.trim(),
                  password: form.password,
                  email: form.email.trim() || undefined,
                  nickname: form.nickname.trim(),
                },
                agree,
              },
            })
          }}
        >
          다음
        </button>
      </div>
    </section>
  )
}
