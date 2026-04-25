import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'
import { registerUser } from '../../auth/registerApi'
import { useAuth } from '../../auth/authContext'

export function SignRegisterPage() {
  const navigate = useNavigate()
  const { login, loadViewer, viewer } = useAuth()
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    nickname: '',
    agreedTerms: false,
    agreedPrivacy: false,
    agreedMarketing: false,
    securityCode: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const canSubmit =
    form.username.trim().length > 0 &&
    form.password.length >= 8 &&
    form.nickname.trim().length > 0 &&
    form.agreedTerms &&
    form.agreedPrivacy

  const onChange = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit || isSubmitting) return
    setErrorMsg('')
    setIsSubmitting(true)
    try {
      const registerData = await registerUser({
        username: form.username.trim(),
        password: form.password,
        email: form.email.trim() ? form.email.trim() : undefined,
        nickname: form.nickname.trim(),
        agreedTerms: form.agreedTerms,
        agreedPrivacy: form.agreedPrivacy,
        agreedMarketing: form.agreedMarketing,
        securityCode: form.securityCode.trim() ? form.securityCode.trim() : undefined,
      })

      const payload = registerData?.dcinsideRegisterUser
      if (!payload?.success) throw new Error(payload?.message || '회원가입에 실패했습니다.')

      await login({ userId: form.username.trim(), password: form.password })
      await loadViewer()

      navigate('/www', { replace: true })
    } catch (err) {
      setErrorMsg(firstGraphQLErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-[760px] border border-[#d1d5db] bg-white p-4 text-[12px]">
      <h2 className="text-[24px] font-semibold">회원가입</h2>
      <p className="mt-1 text-[12px] text-[#666]">GraphQL 회원가입 + 자동 로그인(JWT) 연동 페이지</p>

      <form onSubmit={onSubmit} className="mt-3 grid gap-3 border-t-2 border-[#374151] pt-3">
        <label className="grid gap-1">
          <span className="font-semibold">식별 코드(username)</span>
          <input value={form.username} onChange={onChange('username')} className="rounded border border-[#d1d5db] px-3 py-2" />
        </label>

        <label className="grid gap-1">
          <span className="font-semibold">비밀번호</span>
          <input
            type="password"
            value={form.password}
            onChange={onChange('password')}
            className="rounded border border-[#d1d5db] px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="font-semibold">이메일(선택)</span>
          <input value={form.email} onChange={onChange('email')} className="rounded border border-[#d1d5db] px-3 py-2" />
        </label>

        <label className="grid gap-1">
          <span className="font-semibold">닉네임</span>
          <input value={form.nickname} onChange={onChange('nickname')} className="rounded border border-[#d1d5db] px-3 py-2" />
        </label>

        <label className="grid gap-1">
          <span className="font-semibold">보안 코드(선택)</span>
          <input
            value={form.securityCode}
            onChange={onChange('securityCode')}
            className="rounded border border-[#d1d5db] px-3 py-2"
          />
        </label>

        <div className="grid gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.agreedTerms} onChange={onChange('agreedTerms')} />
            <span>[필수] 이용약관 동의</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.agreedPrivacy} onChange={onChange('agreedPrivacy')} />
            <span>[필수] 개인정보 수집/이용 동의</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.agreedMarketing} onChange={onChange('agreedMarketing')} />
            <span>[선택] 마케팅 동의</span>
          </label>
        </div>

        {errorMsg ? (
          <div className="rounded border border-[#f2b8b5] bg-[#fff5f5] px-3 py-2 text-[#d31900]">{errorMsg}</div>
        ) : null}

        <div className="flex items-center justify-between">
          <div className="text-[12px] text-[#666]">
            현재 로그인 사용자: <span className="font-semibold">{viewer?.username ?? '(없음)'}</span>
          </div>
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={
              canSubmit && !isSubmitting
                ? 'inline-flex h-[28px] min-w-[56px] items-center justify-center rounded-sm border border-[#5f5f5f] bg-[#6c6c6c] px-4 font-semibold text-white'
                : 'inline-flex h-[28px] min-w-[56px] items-center justify-center rounded-sm border border-[#b1b1b1] bg-[#d8d8d8] px-4 font-semibold text-[#8a8a8a]'
            }
          >
            회원가입 + 자동 로그인
          </button>
        </div>
      </form>
    </section>
  )
}
