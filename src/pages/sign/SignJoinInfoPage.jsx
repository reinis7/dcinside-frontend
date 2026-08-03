import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  validateEmailOptional,
  validateNickname,
  validatePassword,
  validateUsername,
} from '../../auth/joinValidation'

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
  const [fieldErrors, setFieldErrors] = useState({})

  const canNext =
    form.userId.trim().length > 0 &&
    form.password.length >= 8 &&
    form.nickname.trim().length > 0 &&
    Boolean(agree?.terms && agree?.privacy)

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setFieldErrors((prev) => ({ ...prev, [key]: '' }))
    setErrorMsg('')
  }

  function runValidation() {
    const next = {
      userId: validateUsername(form.userId),
      password: validatePassword(form.password),
      nickname: validateNickname(form.nickname),
      email: validateEmailOptional(form.email),
    }
    setFieldErrors(next)
    return next.userId || next.password || next.nickname || next.email || ''
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
            className={
              fieldErrors.userId
                ? 'rounded border border-[#d31900] px-3 py-2 outline-none'
                : 'rounded border border-[#d1d5db] px-3 py-2'
            }
            autoComplete="username"
            placeholder="영문/숫자 3~20자"
          />
          <span className="text-[11px] text-[#888]">영문, 숫자, -, _ 만 사용 (한글 불가 · 3~20자)</span>
          {fieldErrors.userId ? <span className="text-[11px] text-[#d31900]">{fieldErrors.userId}</span> : null}
        </label>

        <label className="grid gap-1">
          <span className="font-semibold">비밀번호 (8자 이상)</span>
          <input
            type="password"
            value={form.password}
            onChange={onChange('password')}
            className={
              fieldErrors.password
                ? 'rounded border border-[#d31900] px-3 py-2 outline-none'
                : 'rounded border border-[#d1d5db] px-3 py-2'
            }
            autoComplete="new-password"
          />
          {fieldErrors.password ? <span className="text-[11px] text-[#d31900]">{fieldErrors.password}</span> : null}
        </label>

        <label className="grid gap-1">
          <span className="font-semibold">이메일 (선택)</span>
          <input
            type="email"
            value={form.email}
            onChange={onChange('email')}
            className={
              fieldErrors.email
                ? 'rounded border border-[#d31900] px-3 py-2 outline-none'
                : 'rounded border border-[#d1d5db] px-3 py-2'
            }
            autoComplete="email"
          />
          {fieldErrors.email ? <span className="text-[11px] text-[#d31900]">{fieldErrors.email}</span> : null}
        </label>

        <label className="grid gap-1">
          <span className="font-semibold">닉네임</span>
          <input
            value={form.nickname}
            onChange={onChange('nickname')}
            className={
              fieldErrors.nickname
                ? 'rounded border border-[#d31900] px-3 py-2 outline-none'
                : 'rounded border border-[#d1d5db] px-3 py-2'
            }
          />
          {fieldErrors.nickname ? <span className="text-[11px] text-[#d31900]">{fieldErrors.nickname}</span> : null}
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
            if (!agree?.terms || !agree?.privacy) {
              setErrorMsg('약관 동의가 필요합니다. 이전 단계에서 필수 항목에 동의해 주세요.')
              return
            }
            const firstError = runValidation()
            if (firstError) {
              setErrorMsg(firstError)
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
