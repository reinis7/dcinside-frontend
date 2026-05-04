import { useParams } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'
import { GallogShell } from './GallogShell'

const TYPE_TABS = ['전체(0)', '갤러리(0)', '마이너갤(0)', '미니갤(0)', '인물갤(0)']

const SECTION_META = {
  comment: { title: '댓글이 없습니다.', activeMenu: 'comment', searchPlaceholder: '댓글 내용 검색', showTopFilters: true },
  scrap: { title: '스크랩이 없습니다.', activeMenu: 'scrap' },
  guestbook: { title: '방명록이 없습니다.', activeMenu: 'guestbook' },
}

export function GallogSimpleSectionPage({ sectionKey }) {
  const { userId = '' } = useParams()
  const { viewer } = useAuth()
  const currentUserId = (viewer?.username || viewer?.userId || '').trim()
  const targetUserId = decodeURIComponent(userId || currentUserId || 'user')
  const meta = SECTION_META[sectionKey] ?? SECTION_META.comment

  return (
    <GallogShell targetUserId={targetUserId} activeMenu={meta.activeMenu}>
      {meta.showTopFilters ? (
        <>
          <div className="flex items-center justify-between border-b border-[#2f3d8f] pb-1">
            <div className="flex items-center gap-3">
              {TYPE_TABS.map((label, idx) => (
                <span
                  key={label}
                  className={idx === 0 ? 'border-b-2 border-[#2f3d8f] pb-0.5 text-[13px] font-bold text-[#d31900]' : 'text-[13px] font-semibold text-[#333]'}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="flex items-center border border-[#d7d7d7] bg-white">
              <input className="h-[24px] w-[210px] px-2 text-[12px] outline-none" placeholder={meta.searchPlaceholder} />
              <button type="button" className="h-[24px] w-[24px] border-l border-[#d7d7d7] bg-[#f3f3f3] text-[11px]">
                🔍
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <select className="h-[30px] min-w-[160px] border border-[#d7d7d7] bg-[#f8f8f8] px-2 text-[12px]">
              <option>전체 보기</option>
            </select>
            <span className="inline-flex h-[22px] items-center rounded bg-[#2f3d8f] px-2 text-[11px] font-semibold text-white">공개</span>
          </div>
        </>
      ) : null}

      <div className="mt-3 flex min-h-[520px] items-center justify-center border-y border-[#2f3d8f] text-[48px] font-bold tracking-[-0.03em] text-[#444]">
        {meta.title}
      </div>
    </GallogShell>
  )
}

