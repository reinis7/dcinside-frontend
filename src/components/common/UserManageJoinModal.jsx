import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const TABS = [
  { id: 'manage', label: '운영 중 갤러리' },
  { id: 'joined', label: '가입한 갤러리' },
]

export function UserManageJoinModal({ open, onClose }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('manage')

  useEffect(() => {
    if (!open) return
    setTab('manage')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open) return null

  const goCreate = (path) => {
    onClose()
    navigate(path)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-manage-join-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="배경 닫기"
        onClick={onClose}
      />
      <div className="relative z-[101] w-full max-w-[440px] border-2 border-[#2f3d8f] bg-white shadow-lg">
        <div className="flex items-stretch border-b border-[#cfcfcf]">
          <div className="flex min-w-0 flex-1 items-stretch">
            {TABS.map((t) => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={
                    active
                      ? 'relative -mb-px flex-1 border border-b-0 border-[#2f3d8f] bg-white px-3 py-2.5 text-[13px] font-bold text-[#2f3d8f]'
                      : 'flex-1 border border-transparent bg-[#e8e8e8] px-3 py-2.5 text-[13px] font-semibold text-[#555] hover:bg-[#dedede]'
                  }
                >
                  {t.label}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center border border-[#2f3d8f] bg-[#2f3d8f] text-[20px] leading-none text-white hover:bg-[#26327a]"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="px-5 pb-6 pt-8 text-[13px]" id="user-manage-join-title">
          {tab === 'manage' ? (
            <div className="grid gap-5">
              <p className="text-center leading-relaxed text-[#333]">
                운영 중인 갤러리가 없습니다.
                <br />
                갤러리를 만들어보세요.
              </p>
              <ul className="grid gap-0 border-t border-[#e5e5e5]">
                {[
                  { label: '마이너갤 만들기', path: '/gall/m/create' },
                  { label: '미니갤 만들기', path: '/gall/n/create' },
                  { label: '인물갤 만들기', path: '/gall/p/create' },
                ].map((row) => (
                  <li key={row.path} className="border-b border-[#e5e5e5]">
                    <button
                      type="button"
                      onClick={() => goCreate(row.path)}
                      className="flex w-full items-center justify-between px-1 py-3 text-left text-[#333] hover:bg-[#f5f7fb]"
                    >
                      <span>{row.label}</span>
                      <span className="text-[#2f3d8f]" aria-hidden="true">
                        ›
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="py-6 text-center leading-relaxed text-[#333]">
              가입한 갤러리가 없습니다.
              <br />
              <Link to="/gall" className="mt-3 inline-block text-[#3b4890] underline hover:text-[#2f3d8f]" onClick={onClose}>
                갤러리 둘러보기
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
