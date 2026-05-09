import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../../../../auth/authContext'
import { firstGraphQLErrorMessage } from '../../../../api/firstGraphQLErrorMessage'
import { UserManageJoinModal } from '../../../common/UserManageJoinModal'
import { UserNotificationsModal } from '../../../common/UserNotificationsModal'

export function LoginBox() {
  const navigate = useNavigate()
  const { viewer, isAuthed, isLoading, login, logout } = useAuth()

  const displayName = useMemo(() => {
    const u = viewer?.username?.trim()
    if (u) return u
    const n = viewer?.name?.trim()
    if (n) return n
    return '회원'
  }, [viewer?.name, viewer?.username])
  const currentUserId = viewer?.username?.trim() || viewer?.userId?.trim() || ''
  const myGallogPath = currentUserId ? `/gallog/${encodeURIComponent(currentUserId)}/posting/all` : '/gallog'

  const [form, setForm] = useState({
    userId: '',
    password: '',
    saveId: false,
    secureConn: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userModal, setUserModal] = useState(null)

  const canLogin = form.userId.trim().length > 0 && form.password.length > 0 && !isSubmitting && !isLoading

  const onChange = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canLogin) return
    setIsSubmitting(true)
    try {
      await login({ userId: form.userId, password: form.password })
      toast.success('로그인되었습니다.')
    } catch (err) {
      toast.error(firstGraphQLErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border border-[#d3d3d3] bg-white p-3">
      {isAuthed ? (
        <div className="rounded border border-[#2f3d8f] p-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[13px] font-bold text-[#2f3d8f]">
                <span className="truncate">{displayName}님</span>
                <span className="text-[#333]">{'>'}</span>
              </div>
              <div className="mt-1 text-[11px] text-[#333]">
                <span className="font-semibold">글</span> 0 <span className="mx-1 text-[#aaa]">|</span>{' '}
                <span className="font-semibold">댓글</span> 0 <span className="mx-1 text-[#aaa]">|</span>{' '}
                <span className="font-semibold">방명록</span> 0
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-1 text-[11px]">
              <button
                type="button"
                className="h-[26px] rounded border border-[#b1b1b1] bg-white px-2 text-[#333] hover:bg-[#f3f3f3]"
                onClick={() => toast.info('로컬 환경에서는 미구현입니다.')}
              >
                2단계
              </button>
              <button
                type="button"
                className="h-[26px] rounded border border-[#2f3d8f] bg-[#2f3d8f] px-2 font-bold text-white hover:bg-[#26327a]"
                onClick={() => void logout()}
              >
                로그아웃
              </button>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-1 text-[11px] text-[#333]">
            <button
              type="button"
              className="h-[28px] rounded border border-[#d3d3d3] bg-white hover:bg-[#f3f3f3]"
              onClick={() => navigate(myGallogPath)}
            >
              MY갤로그
            </button>
            <button
              type="button"
              className="h-[28px] rounded border border-[#d3d3d3] bg-white hover:bg-[#f3f3f3]"
              onClick={() => navigate('/sign/myinfo/modify')}
            >
              고정닉정보
            </button>
            <button
              type="button"
              className="h-[28px] rounded border border-[#d3d3d3] bg-white hover:bg-[#f3f3f3]"
              onClick={() => toast.info('로컬 환경에서는 미구현입니다.')}
            >
              즐겨찾기
            </button>
            <button
              type="button"
              className="h-[28px] rounded border border-[#d3d3d3] bg-white hover:bg-[#f3f3f3]"
              onClick={() => setUserModal('manage-join')}
            >
              운영/가입
            </button>
            <button
              type="button"
              className="h-[28px] rounded border border-[#d3d3d3] bg-white hover:bg-[#f3f3f3]"
              onClick={() => toast.info('로컬 환경에서는 미구현입니다.')}
            >
              스크랩
            </button>
            <button
              type="button"
              className="h-[28px] rounded border border-[#d3d3d3] bg-white hover:bg-[#f3f3f3]"
              onClick={() => setUserModal('notifications')}
            >
              알림
            </button>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-[1fr_92px] gap-2">
              <div className="grid gap-2">
                <input
                  className="h-[30px] bg-[#f6f6f6] px-2 outline-none"
                  placeholder="식별 코드"
                  value={form.userId}
                  onChange={onChange('userId')}
                  autoComplete="username"
                  disabled={isSubmitting || isLoading}
                />
                <input
                  className="h-[30px] bg-[#f6f6f6] px-2 outline-none"
                  placeholder="비밀번호"
                  type="password"
                  value={form.password}
                  onChange={onChange('password')}
                  autoComplete="current-password"
                  disabled={isSubmitting || isLoading}
                />
              </div>
              <div className="grid content-start gap-2">
                <label className="flex items-center gap-1 text-[11px] text-[#333]">
                  <input
                    type="checkbox"
                    className="h-[12px] w-[12px]"
                    checked={form.saveId}
                    onChange={onChange('saveId')}
                    disabled={isSubmitting || isLoading}
                  />{' '}
                  코드 저장
                </label>
                <label className="flex items-center gap-1 text-[11px] text-[#333]">
                  <input
                    type="checkbox"
                    className="h-[12px] w-[12px]"
                    checked={form.secureConn}
                    onChange={onChange('secureConn')}
                    disabled={isSubmitting || isLoading}
                  />{' '}
                  보안접속
                </label>
                <button
                  type="submit"
                  disabled={!canLogin}
                  className={
                    canLogin
                      ? 'h-[30px] bg-[#3b4890] text-[12px] font-bold text-white hover:bg-[#2f3d8f]'
                      : 'h-[30px] bg-[#d8d8d8] text-[12px] font-bold text-[#8a8a8a]'
                  }
                >
                  {isSubmitting ? '…' : '로그인'}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-2 flex items-center justify-between border-t border-dashed border-[#d3d3d3] pt-2 text-[11px]">
            <div className="flex items-center gap-2 text-[#333]">
              <a
                href="#"
                className="font-bold hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/sign/join/agree')
                }}
              >
                고정닉 신청
              </a>
              <span className="text-[#aaa]">|</span>
              <a
                href="#"
                className="hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/sign/login?s_url=%2Fwww')
                }}
              >
                식별 코드·비밀번호찾기
              </a>
            </div>
            <button
              type="button"
              className="inline-flex h-[18px] w-[18px] items-center justify-center rounded bg-[#f3f3f3] text-[12px] text-[#666]"
              aria-label="알림"
              onClick={() => toast.info('로컬 환경에서는 알림 기능이 아직 없습니다.')}
            >
              🔔
            </button>
          </div>
        </>
      )}

      <UserManageJoinModal open={userModal === 'manage-join'} onClose={() => setUserModal(null)} />
      <UserNotificationsModal open={userModal === 'notifications'} onClose={() => setUserModal(null)} />
    </div>
  )
}

