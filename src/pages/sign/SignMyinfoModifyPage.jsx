import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../auth/authContext'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'
import { toast } from 'sonner'

const MYINFO_TABS = [
  { id: 'basic', label: '기본 정보 변경' },
  { id: 'password', label: '비밀번호 변경' },
  { id: 'security', label: '보안 센터' },
  { id: 'withdraw', label: '고정닉 탈퇴' },
]

function verifyStorageKey(viewer) {
  if (!viewer) return null
  const id = viewer.databaseId ?? viewer.id
  if (id == null) return null
  return `dcinside.myinfo.modify.${id}`
}

export function SignMyinfoModifyPage() {
  const { viewer, login } = useAuth()
  const key = useMemo(() => verifyStorageKey(viewer), [viewer])

  const [activeTab, setActiveTab] = useState('basic')
  const [verified, setVerified] = useState(false)
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!key) return
    setVerified(sessionStorage.getItem(key) === '1')
  }, [key])

  const loginUsername = viewer?.username?.trim() || viewer?.name?.trim() || ''

  const onVerifySubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (!loginUsername) {
      setErrorMsg('식별 정보를 불러오지 못했습니다. 다시 로그인해 주세요.')
      return
    }
    if (!password) {
      setErrorMsg('비밀번호를 입력해 주시기 바랍니다.')
      return
    }
    setIsSubmitting(true)
    try {
      await login({ userId: loginUsername, password })
      if (key) sessionStorage.setItem(key, '1')
      setVerified(true)
      setPassword('')
      toast.success('본인 확인이 완료되었습니다.')
    } catch (err) {
      setErrorMsg(firstGraphQLErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const onTabClick = useCallback((id) => {
    setActiveTab(id)
    if (id !== 'basic') toast.info('해당 메뉴는 준비 중입니다.')
  }, [])

  const activeTabLabel = MYINFO_TABS.find((t) => t.id === activeTab)?.label ?? ''

  return (
    <section className="mx-auto w-[760px] border border-[#d1d5db] bg-white p-4 text-[12px]">
      <h2 className="text-[24px] font-semibold">고정닉 정보</h2>
      <p className="mt-1 text-[12px] text-[#666]">페이지 경로 &gt; 기본 정보 변경</p>

      <div className="mt-4 flex border-b border-[#ccc]">
        {MYINFO_TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabClick(tab.id)}
              className={
                active
                  ? 'relative -mb-px border border-b-0 border-[#2f3d8f] bg-white px-4 py-2 text-[13px] font-semibold text-[#2f3d8f]'
                  : 'border border-transparent bg-[#e8e8e8] px-4 py-2 text-[13px] font-semibold text-[#555] hover:bg-[#dedede]'
              }
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="border border-t-0 border-[#ccc] p-4">
        <h3 className="border-b border-[#333] pb-2 text-[15px] font-bold text-[#333]">{activeTabLabel}</h3>

        {activeTab === 'basic' && !verified ? (
          <div className="mx-auto mt-6 max-w-[360px] border border-[#cfcfcf] bg-[#fafafa] px-6 py-8">
            <form onSubmit={onVerifySubmit} className="grid gap-4">
              <p className="text-center text-[12px] font-semibold text-[#d31900]">
                비밀번호를 입력해 주시기 바랍니다.
              </p>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[36px] border border-[#b5b5b5] px-3 text-[13px] outline-none focus:border-[#2f3d8f]"
              />
              {errorMsg ? <p className="text-center text-[12px] text-[#d31900]">{errorMsg}</p> : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[38px] bg-[#2f3d8f] text-[13px] font-bold text-white hover:bg-[#26327a] disabled:bg-[#a8a8a8]"
              >
                {isSubmitting ? '확인 중…' : '확인'}
              </button>
            </form>
          </div>
        ) : activeTab === 'basic' ? (
          <div className="mt-6 grid max-w-[420px] gap-4">
            <p className="text-[12px] text-[#666]">본인 확인이 완료되었습니다. 표시 정보는 서버에서 불러온 값입니다.</p>
            <label className="grid gap-1">
              <span className="font-semibold text-[#333]">식별 코드</span>
              <input
                readOnly
                value={viewer?.username ?? ''}
                className="h-[34px] cursor-default border border-[#d1d5db] bg-[#f3f3f3] px-3 text-[13px] text-[#555]"
              />
            </label>
            <label className="grid gap-1">
              <span className="font-semibold text-[#333]">닉네임</span>
              <input
                readOnly
                value={viewer?.name ?? ''}
                className="h-[34px] cursor-default border border-[#d1d5db] bg-[#f3f3f3] px-3 text-[13px] text-[#555]"
              />
            </label>
            <p className="text-[11px] leading-relaxed text-[#888]">
              닉네임·기본 정보 수정 API가 연결되면 이 화면에서 저장할 수 있습니다.
            </p>
          </div>
        ) : (
          <div className="mt-10 py-8 text-center text-[13px] text-[#666]">준비 중입니다.</div>
        )}
      </div>
    </section>
  )
}
