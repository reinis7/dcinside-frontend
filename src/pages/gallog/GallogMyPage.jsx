import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'
import { DcFooter } from '../../layout/DcFooter'

const SIDE_MENUS = [
  { id: 'summary', label: '총' },
  { id: 'posts', label: '게시글' },
  { id: 'comments', label: '댓글' },
  { id: 'scraps', label: '스크랩' },
  { id: 'guestbook', label: '방명록' },
]

const CONTENT_SECTIONS = [
  { id: 'posts', title: '게시글', count: 0, empty: '게시글이 없습니다.' },
  { id: 'comments', title: '댓글', count: 0, empty: '댓글이 없습니다.' },
  { id: 'scraps', title: '스크랩', count: 0, empty: '스크랩이 없습니다.' },
  { id: 'guestbook', title: '방명록', count: 0, empty: '방명록이 없습니다.' },
]

export function GallogMyPage() {
  const { userId = '' } = useParams()
  const { viewer } = useAuth()
  const currentUserId = (viewer?.username || viewer?.userId || '').trim()
  const targetUserId = decodeURIComponent(userId || currentUserId || 'user')
  const isMyGallog = currentUserId && currentUserId === targetUserId

  return (
    <div className="min-h-screen bg-white text-[#333]">
      <div className="mx-auto w-[1050px] px-1 pt-3">
        <div className="mb-2 text-[11px]">
          <Link to="/www" className="text-[#d31900] hover:underline">
            디시인사이드 메인가기
          </Link>
        </div>

        <div className="border border-[#1f2f77]">
          <div className="flex items-center justify-between bg-[#263a8b] px-4 py-4 text-white">
            <div className="rounded bg-black/30 px-3 py-1.5 text-[20px] font-bold tracking-[-0.02em]">
              <span className="text-[#ffd15c]">{targetUserId}</span>의 갤로그입니다.
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="rounded bg-black/30 px-2 py-1">오늘의 방문자 1/3</span>
              <button type="button" className="rounded bg-black/30 px-2 py-1">
                ⚙
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#2d4aa7] bg-[#f6fbdd] px-3 py-1.5 text-[12px] text-[#4f7f1f]">
            <span>익명 사용 미지정 빈칸 글 작성자만 볼 수 있습니다.</span>
            <span>×</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[130px_1fr] gap-3">
          <aside>
            <div className="overflow-hidden border border-[#d7d7d7] bg-white">
              {SIDE_MENUS.map((item, idx) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={
                    idx === 0
                      ? 'block border-b border-[#d7d7d7] bg-[#263a8b] px-3 py-2 text-[13px] font-bold text-white'
                      : 'block border-b border-[#d7d7d7] px-3 py-2 text-[13px] text-[#333] hover:bg-[#f7f7f7] last:border-b-0'
                  }
                >
                  {item.label}
                </a>
              ))}
            </div>
          </aside>

          <main className="min-h-[560px]">
            <section id="summary" className="border-b border-[#2f3d8f] pb-6">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#2f3d8f]">{targetUserId}</h2>
              <div className="mt-2 text-[12px] text-[#666]">
                {isMyGallog ? '내 갤로그' : `${targetUserId}님의 갤로그`}
              </div>
            </section>

            {CONTENT_SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="mt-7">
                <div className="border-b border-[#2f3d8f] pb-1">
                  <div className="inline-flex items-center gap-1 text-[18px] font-bold text-[#d31900]">
                    <span>{section.title}</span>
                    <span className="text-[13px] text-[#333]">({section.count})</span>
                    <span className="rounded bg-[#2f3d8f] px-1.5 py-0.5 text-[10px] text-white">공개</span>
                  </div>
                </div>
                <div className="flex min-h-[140px] items-center justify-center border-b border-[#2f3d8f] text-[28px] font-semibold tracking-[-0.02em] text-[#444]">
                  {section.empty}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
      <DcFooter />
    </div>
  )
}

