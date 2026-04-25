import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { registerUser } from '../../auth/registerApi'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'
import { useAuth } from '../../auth/authContext'

function makeSecurityCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function SignJoinSecurityPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login: doLogin, loadViewer } = useAuth()
  const joinForm = location.state?.joinForm
  const generatedCode = useMemo(() => makeSecurityCode(), [])
  const securityCode = location.state?.securityCode ?? generatedCode
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  return (
    <section className="mx-auto w-[760px] border border-[#d1d5db] bg-white p-4 text-[12px]">
      <h2 className="text-[24px] font-semibold">고정닉 신청</h2>
      <p className="mt-1 text-[12px] text-[#666]">페이지 경로 &gt; 보안 코드 발급</p>

      <h3 className="mt-5 text-[18px] font-semibold">보안 코드 발급</h3>

      <div className="mt-3 border-t-2 border-[#374151] pt-3">
        <p className="text-[12px] text-[#666]">
          아래 보안 코드는 임시 샘플입니다. 실제 구현에서는 서버 발급 코드/만료시간 검증이 들어갑니다.
        </p>
        <div className="mt-2 border border-dashed border-[#9ca3af] bg-[#f9fafb] py-3 text-center text-[24px] font-bold tracking-[0.2em]">
          {securityCode}
        </div>

        <div className="mt-3 border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2">
          <p className="mb-1 font-semibold">입력 요약</p>
          <ul className="list-disc pl-4">
            <li>식별 코드: {joinForm?.userId ?? '(미입력)'}</li>
            <li>닉네임: {joinForm?.nickname ?? '(미입력)'}</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link className="text-[#666] hover:underline" to="/sign/join/info">
          이전
        </Link>
        <button
          type="button"
          className={
            !isSubmitting
              ? 'inline-flex h-[28px] min-w-[56px] items-center justify-center rounded-sm border border-[#5f5f5f] bg-[#6c6c6c] px-4 text-[12px] font-semibold text-white'
              : 'inline-flex h-[28px] min-w-[56px] items-center justify-center rounded-sm border border-[#b1b1b1] bg-[#d8d8d8] px-4 text-[12px] font-semibold text-[#8a8a8a]'
          }
          disabled={isSubmitting}
          onClick={async () => {
            if (isSubmitting) return
            setErrorMsg('')
            setIsSubmitting(true)
            try {
              const agree = location.state?.agree ?? { terms: false, privacy: false, marketing: false }
              const registerData = await registerUser({
                username: joinForm?.userId ?? '',
                password: joinForm?.password ?? '',
                email: joinForm?.email,
                nickname: joinForm?.nickname ?? '',
                agreedTerms: Boolean(agree.terms),
                agreedPrivacy: Boolean(agree.privacy),
                agreedMarketing: Boolean(agree.marketing),
                securityCode,
              })

              const payload = registerData?.dcinsideRegisterUser
              if (!payload?.success) {
                throw new Error(payload?.message || '회원가입에 실패했습니다.')
              }

              // 자동 로그인(JWT)
              await doLogin({ userId: joinForm?.userId ?? '', password: joinForm?.password ?? '' })
              await loadViewer()

              navigate('/sign/join/done', {
                replace: true,
                state: { joinForm, securityCode, registerResult: payload, autoLoggedIn: true },
              })
            } catch (err) {
              setErrorMsg(firstGraphQLErrorMessage(err))
            } finally {
              setIsSubmitting(false)
            }
          }}
        >
          신청 완료
        </button>
      </div>

      {errorMsg ? (
        <div className="mt-3 rounded border border-[#f2b8b5] bg-[#fff5f5] px-3 py-2 text-[12px] text-[#d31900]">
          {errorMsg}
        </div>
      ) : null}
    </section>
  )
}
