import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'
import { DcFooter } from '../../layout/DcFooter'

const MENU_ITEMS = [
  { key: 'home', label: '홈' },
  { key: 'posting', label: '게시글' },
  { key: 'comment', label: '댓글' },
  { key: 'scrap', label: '스크랩' },
  { key: 'guestbook', label: '방명록' },
]

export function GallogShell({ targetUserId, activeMenu, children }) {
  const { viewer, logout } = useAuth()
  const currentUserId = (viewer?.username || viewer?.userId || '').trim()
  const displayName = currentUserId || targetUserId
  const encodedUserId = encodeURIComponent(targetUserId)

  const menuPath = {
    home: `/gallog/${encodedUserId}`,
    posting: `/gallog/${encodedUserId}/posting/all`,
    comment: `/gallog/${encodedUserId}/comment/all`,
    scrap: `/gallog/${encodedUserId}/scrap`,
    guestbook: `/gallog/${encodedUserId}/guestbook`,
  }

  return (
    <div className="min-h-screen bg-white text-[#333]">
      <div className="mx-auto w-[1050px] px-1 pt-3">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <Link to="/www" className="text-[#d31900] hover:underline">
            디시인사이드 메인가기 &gt;
          </Link>
          <div className="flex items-center gap-2 text-[#666]">
            <Link to="/gall" className="hover:underline">
              갤러리
            </Link>
            <span>|</span>
            <Link to="/gall/m" className="hover:underline">
              마이너갤
            </Link>
            <span>|</span>
            <Link to="/gall/n" className="hover:underline">
              미니갤
            </Link>
            <span>|</span>
            <Link to="/gall/p" className="hover:underline">
              인물갤
            </Link>
            <span>|</span>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
              디시게임
            </a>
            <span>|</span>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
              이벤트
            </a>
            <span>|</span>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
              디시콘
            </a>
            <span>|</span>
            <span className="font-semibold text-[#333]">{displayName}</span>
            <button
              type="button"
              onClick={() => void logout()}
              className="h-[18px] rounded-sm border border-[#2f3d8f] bg-[#2f3d8f] px-2 text-[10px] font-bold text-white"
            >
              로그아웃
            </button>
            <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
              야간모드
            </a>
          </div>
        </div>

        <div className="border border-[#1f2f77]">
          <div className="flex items-center justify-between bg-[#1f377f] px-4 py-4 text-white">
            <div className="rounded bg-black/35 px-3 py-1.5 text-[30px] font-bold tracking-[-0.02em]">
              <span className="text-[#ffd15c]">{targetUserId}</span>의 갤로그입니다.
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-black/35 px-3 py-1 text-[12px] font-semibold">오늘의 방문자 1/3</span>
              <button type="button" className="h-[24px] w-[24px] rounded bg-black/35 text-[12px]">
                ⚙
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[#2d4aa7] bg-[#f6fbdd] px-3 py-1.5 text-[12px] text-[#547f22]">
            <span>익명 사용 미니갤에 남긴 글은 작성자만 볼 수 있습니다.</span>
            <span>×</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[145px_1fr] gap-6">
          <aside>
            <div className="overflow-hidden border border-[#d7d7d7] bg-white">
              {MENU_ITEMS.map((item) => {
                const active = item.key === activeMenu
                return (
                  <Link
                    key={item.key}
                    to={menuPath[item.key]}
                    className={
                      active
                        ? 'block border-b border-[#d7d7d7] bg-[#263a8b] px-3 py-2 text-[13px] font-bold text-white last:border-b-0'
                        : 'block border-b border-[#d7d7d7] px-3 py-2 text-[13px] text-[#333] hover:bg-[#f7f7f7] last:border-b-0'
                    }
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </aside>

          <main className="min-h-[560px]">{children}</main>
        </div>
      </div>
      <DcFooter />
    </div>
  )
}

