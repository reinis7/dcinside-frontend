import { useEffect } from 'react'
import { toast } from 'sonner'

/** 알림 목록 — 빈 상태 UI (추후 API 연동 시 목록 렌더링) */
export function UserNotificationsModal({ open, onClose, notifications = [] }) {
  useEffect(() => {
    if (!open) return
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open) return null

  const empty = notifications.length === 0

  const onDeleteAll = () => {
    if (empty) {
      toast.info('삭제할 알림이 없습니다.')
      return
    }
    toast.info('알림 삭제 API는 준비 중입니다.')
  }

  const onSettings = () => {
    toast.info('알림 설정은 준비 중입니다.')
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-notifications-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="배경 닫기"
        onClick={onClose}
      />
      <div className="relative z-[101] w-full max-w-[380px] border-2 border-[#2f3d8f] bg-white shadow-lg">
        <div className="flex items-center gap-2 border-b border-[#e0e0e0] px-3 py-2">
          <h2 id="user-notifications-title" className="shrink-0 text-[14px] font-bold text-[#333]">
            알림
          </h2>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1 text-[12px] text-[#333]">
            <button type="button" onClick={onDeleteAll} className="shrink-0 hover:text-[#2f3d8f] hover:underline">
              전체삭제
            </button>
            <span className="shrink-0 text-[#ccc]">|</span>
            <button type="button" onClick={onSettings} className="shrink-0 hover:text-[#2f3d8f] hover:underline">
              설정
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center border border-[#2f3d8f] bg-[#2f3d8f] text-[18px] leading-none text-white hover:bg-[#26327a]"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
        </div>

        <div className="min-h-[200px] px-3 py-12">
          {empty ? (
            <p className="text-center text-[13px] text-[#aaa]">새로운 알림이 없습니다.</p>
          ) : (
            <ul className="grid gap-2 text-[12px] text-[#333]">
              {notifications.map((n) => (
                <li key={n.id} className="border-b border-[#eee] py-2">
                  {n.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
