import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function strengthScore(pw) {
  let score = 0
  if (/[A-Za-z]/.test(pw)) score += 1
  if (/[0-9]/.test(pw)) score += 1
  if (/[^A-Za-z0-9]/.test(pw)) score += 1
  if (pw.length >= 12) score += 1
  return Math.min(4, score)
}

export function SignJoinInfoPage() {
  const navigate = useNavigate()
  // 백엔드가 있다고 가정: join draft가 이미 생성되어 식별 코드는 고정된 상태(수정 불가)
  const [draft] = useState({
    userId: 'wish8583',
    captchaImageSrc: '/snapshot/nstatic.dcinside.com/dc/w/images/img_none1.jpg',
  })

  const [form, setForm] = useState({
    password: '',
    passwordConfirm: '',
    nickname: '',
    nickType: '비고정닉',
    captcha: '',
  })

  const [openSecurityNotice, setOpenSecurityNotice] = useState(false)
  const [securityNoticeChecked, setSecurityNoticeChecked] = useState(false)
  const [securityCode] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase())

  const pwMatched = form.password.length > 0 && form.password === form.passwordConfirm
  const pwLenOk = form.password.length >= 8 && form.password.length <= 20
  const pwComboOk = /[A-Za-z]/.test(form.password) && /[0-9]/.test(form.password) && /[^A-Za-z0-9]/.test(form.password)
  const score = strengthScore(form.password)

  const canNext = useMemo(() => {
    return pwMatched && pwLenOk && pwComboOk && form.nickname.trim().length >= 2 && form.captcha.trim().length > 0
  }, [pwMatched, pwLenOk, pwComboOk, form.nickname, form.captcha])

  const onChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <section className="mx-auto w-[900px] text-[#333]">
      <ol className="mb-6 mt-2 grid grid-cols-4 overflow-hidden rounded border border-[#a8a8a8] bg-[#9f9f9f] text-[16px] text-white">
        <li className="py-3 text-center">약관 동의</li>
        <li className="bg-white py-3 text-center font-semibold text-[#273589]">기본 정보 입력</li>
        <li className="py-3 text-center">보안 코드 발급</li>
        <li className="py-3 text-center">고정닉 신청 완료</li>
      </ol>

      <h2 className="text-[18px] font-bold text-[#273589]">기본 정보 입력</h2>
      <div className="mt-2 h-px w-full bg-[#273589]" />

      <div className="mt-5 rounded border border-[#d1d5db] bg-white p-0">
        <div className="p-10">
          <div className="grid grid-cols-[180px_1fr] gap-x-10 gap-y-8 text-[15px]">
            <div className="pt-1 text-center font-bold">식별 코드</div>
            <div>
              <div className="font-bold">{draft.userId}</div>
              <p className="mt-2 text-[13px] text-[#666]">식별 코드는 로그인 시 사용됩니다.</p>
              <p className="mt-2 text-[13px] text-[#d50000]">
                식별 코드, 보안 코드를 저장해 주세요.
                <br />
                저장하지 않을 경우 식별 코드, 보안 코드를 찾을 수 없습니다.
              </p>
              <p className="mt-2 text-[13px] text-[#d50000]">
                식별 코드는 수정할 수 없습니다. 재신청을 해서 다른 식별 코드를 선택할 수 있습니다.
              </p>
            </div>

            <div className="pt-1 text-center font-bold">비밀번호 입력</div>
            <div>
              <input
                type="password"
                value={form.password}
                onChange={onChange('password')}
                placeholder="비밀번호를 입력해 주세요."
                className="h-[38px] w-full border border-[#cfcfcf] px-3 text-[14px] outline-none"
              />
              <input
                type="password"
                value={form.passwordConfirm}
                onChange={onChange('passwordConfirm')}
                placeholder="비밀번호를 재확인해 주세요."
                className="mt-2 h-[38px] w-full border border-[#cfcfcf] px-3 text-[14px] outline-none"
              />

              <div className="mt-4 text-[13px] font-bold">비밀번호 필수 조건</div>
              <div className="mt-2 space-y-1 text-[13px] text-[#666]">
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-4 w-4 rounded-full border ${pwComboOk ? 'bg-[#6b7bbf] border-[#6b7bbf]' : 'border-[#bdbdbd]'}`} />
                  <span>영문, 숫자, 특수문자 조합입니다.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-4 w-4 rounded-full border ${pwLenOk ? 'bg-[#6b7bbf] border-[#6b7bbf]' : 'border-[#bdbdbd]'}`} />
                  <span>8~20자입니다.</span>
                </div>
                {form.passwordConfirm.length > 0 && (
                  <div className={`mt-1 text-[13px] ${pwMatched ? 'text-[#1d7a62]' : 'text-[#d50000]'}`}>
                    {pwMatched ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-[13px] font-bold">
                <span>안전 정도</span>
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#bdbdbd] text-[11px] text-[#666]">
                  ?
                </span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-3 ${score >= i ? 'bg-[#7b7b7b]' : 'bg-[#d1d1d1]'}`} />
                ))}
              </div>
            </div>

            <div className="pt-1 text-center font-bold">닉네임 만들기</div>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <input
                  value={form.nickname}
                  onChange={onChange('nickname')}
                  placeholder="닉네임을 입력해 주세요."
                  className="h-[38px] w-full border border-[#cfcfcf] px-3 text-[14px] outline-none"
                />
                <p className="mt-2 text-[12px] text-[#666]">2~20자 닉네임을 입력해 주세요.(띄어쓰기는 할 수 없습니다.)</p>
              </div>
              <select
                value={form.nickType}
                onChange={onChange('nickType')}
                className="h-[38px] w-[110px] border border-[#cfcfcf] bg-[#f3f3f3] px-2 text-[14px] outline-none"
              >
                <option>비고정닉</option>
                <option>고정닉</option>
              </select>
            </div>

            <div className="pt-1 text-center font-bold">자동 입력 방지 코드</div>
            <div className="flex items-center gap-2">
              <div className="h-[38px] w-[160px] overflow-hidden border border-[#cfcfcf] bg-white">
                <img src={draft.captchaImageSrc} alt="captcha" className="h-full w-full object-cover" />
              </div>
              <input
                value={form.captcha}
                onChange={onChange('captcha')}
                placeholder="코드 입력"
                className="h-[38px] w-[160px] border border-[#cfcfcf] px-3 text-[14px] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6">
          {canNext ? (
            <button
              type="button"
              className="inline-flex h-[44px] w-[110px] items-center justify-center rounded-sm border border-[#4a4a4a] bg-[#5a5a5a] text-[16px] font-bold text-white"
              onClick={() => {
                setSecurityNoticeChecked(false)
                setOpenSecurityNotice(true)
              }}
            >
              다음
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex h-[44px] w-[110px] items-center justify-center rounded-sm border border-[#b1b1b1] bg-[#d8d8d8] text-[16px] font-bold text-[#8a8a8a]"
            >
              다음
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Link to="/sign/join/agree" className="text-[13px] text-[#666] hover:underline">
          이전
        </Link>
      </div>

      {openSecurityNotice && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/25 px-4 py-12"
          role="dialog"
          aria-modal="true"
          aria-label="보안 코드 발급 안내"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpenSecurityNotice(false)
          }}
        >
          <div className="w-full max-w-[420px] border border-[#1f2a7a] bg-white shadow-lg">
            <div className="flex items-start justify-between border-b border-[#bdbdbd] px-4 py-3">
              <h3 className="text-[18px] font-bold text-[#0f1c6d]">보안 코드 발급 안내</h3>
              <button
                type="button"
                className="inline-flex h-6 w-6 items-center justify-center border border-[#1f2a7a] bg-[#2f3d8f] text-[14px] leading-none text-white"
                aria-label="닫기"
                onClick={() => setOpenSecurityNotice(false)}
              >
                ×
              </button>
            </div>
            <div className="px-4 py-4 text-[13px] leading-6 text-[#333]">
              <p>보안 코드가 발급되었습니다.</p>
              <p className="font-bold">다음 화면에서 보안 코드를 저장해 주세요.</p>
              <p>
                보안 코드는 따로 확인할 수 있는 페이지가 없으며 분실 시 식별 코드 찾기, 비밀번호
                재설정, 고정닉 변경, 마이너갤/미니갤 매니저 위임, 부매니저 선임, 탈퇴가 불가능합니다.
              </p>
              <p className="font-bold">반드시 저장해 주세요</p>

              <label className="mt-4 flex items-center gap-2 text-[13px]">
                <input
                  type="checkbox"
                  checked={securityNoticeChecked}
                  onChange={(e) => setSecurityNoticeChecked(e.target.checked)}
                  className="h-3 w-3"
                />
                <span>위 내용을 확인했습니다.</span>
              </label>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  disabled={!securityNoticeChecked}
                  className={[
                    'inline-flex h-[34px] w-[110px] items-center justify-center rounded-sm border text-[14px] font-bold',
                    securityNoticeChecked
                      ? 'border-[#1f2a7a] bg-[#2f3d8f] text-white'
                      : 'border-[#b1b1b1] bg-[#d8d8d8] text-[#8a8a8a]',
                  ].join(' ')}
                  onClick={() => {
                    const joinForm = { userId: draft.userId, nickname: form.nickname, nickType: form.nickType }
                    setOpenSecurityNotice(false)
                    navigate('/sign/join/security', { state: { joinForm, securityCode } })
                  }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
