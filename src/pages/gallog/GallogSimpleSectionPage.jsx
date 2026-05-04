import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'
import { GallogShell } from './GallogShell'

const TYPE_TABS = [
  { key: 'all', label: '전체(0)' },
  { key: 'main', label: '갤러리(0)' },
  { key: 'minor', label: '마이너갤(0)' },
  { key: 'mini', label: '미니갤(0)' },
  { key: 'person', label: '인물갤(0)' },
]

const SECTION_META = {
  comment: { title: '댓글이 없습니다.', activeMenu: 'comment', searchPlaceholder: '댓글 내용 검색', showTopFilters: true },
  scrap: {
    title: '스크랩에 글이 없습니다.',
    activeMenu: 'scrap',
    showScrapToolbar: true,
    searchPlaceholder: '게시물 제목 또는 글쓴이 검색',
  },
  guestbook: { title: '방명록이 없습니다.', activeMenu: 'guestbook', showGuestbookComposer: true },
}

export function GallogSimpleSectionPage({ sectionKey }) {
  const { userId = '', galleryType = 'all' } = useParams()
  const { viewer } = useAuth()
  const currentUserId = (viewer?.username || viewer?.userId || '').trim()
  const targetUserId = decodeURIComponent(userId || currentUserId || 'user')
  const encodedUserId = encodeURIComponent(targetUserId)
  const safeGalleryType = ['all', 'main', 'minor', 'mini', 'person'].includes(galleryType) ? galleryType : 'all'
  const basePath = sectionKey === 'comment' ? 'comment' : 'posting'
  const typedPath = (type) => `/gallog/${encodedUserId}/${basePath}/${type}`
  const meta = SECTION_META[sectionKey] ?? SECTION_META.comment

  return (
    <GallogShell targetUserId={targetUserId} activeMenu={meta.activeMenu}>
      {meta.showTopFilters ? (
        <>
          <div className="flex items-center justify-between border-b border-[#2f3d8f] pb-1">
            <div className="flex items-center gap-3">
              {TYPE_TABS.map((tab, idx) => (
                <Link
                  key={tab.key}
                  to={typedPath(tab.key)}
                  className={
                    safeGalleryType === tab.key || (idx === 0 && safeGalleryType === 'all')
                      ? 'border-b-2 border-[#2f3d8f] pb-0.5 text-[13px] font-bold text-[#d31900]'
                      : 'text-[13px] font-semibold text-[#333]'
                  }
                >
                  {tab.label}
                </Link>
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

      {meta.showScrapToolbar ? (
        <>
          <div className="flex items-center justify-between border-b border-[#2f3d8f] pb-1">
            <div className="text-[28px] font-bold text-[#d31900]">스크랩</div>
            <div className="flex items-center border border-[#d7d7d7] bg-white">
              <input className="h-[24px] w-[250px] px-2 text-[12px] outline-none" placeholder={meta.searchPlaceholder} />
              <button type="button" className="h-[24px] w-[24px] border-l border-[#d7d7d7] bg-[#f3f3f3] text-[11px]">
                🔍
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between border-b border-[#d9d9d9] pb-2">
            <div className="flex items-center gap-2">
              <span className="h-[20px] w-[20px] rounded-full bg-[#f3f3f3]" />
              <button type="button" className="inline-flex h-[22px] items-center rounded-full bg-[#2f3d8f] px-3 text-[11px] font-semibold text-white">
                📁 전체
              </button>
              <button type="button" className="inline-flex h-[22px] items-center rounded-full border border-[#cfcfcf] bg-white px-3 text-[11px] font-semibold text-[#333]">
                기본
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-[20px] w-[20px] rounded-full bg-[#f3f3f3]" />
              <span className="h-[20px] w-[20px] rounded-full bg-[#f3f3f3]" />
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[26px] font-semibold text-[#444]">0개</span>
            <select className="h-[30px] min-w-[160px] border border-[#d7d7d7] bg-[#f8f8f8] px-2 text-[12px]">
              <option>전체 보기</option>
            </select>
            <span className="inline-flex h-[22px] items-center rounded bg-[#2f3d8f] px-2 text-[11px] font-semibold text-white">공개</span>
            <button type="button" className="inline-flex h-[22px] items-center rounded border border-[#cfcfcf] bg-white px-2 text-[11px] font-semibold text-[#333]">
              편집
            </button>
          </div>
        </>
      ) : null}

      {meta.showGuestbookComposer ? (
        <>
          <div className="flex items-center justify-between border-b border-[#2f3d8f] pb-1">
            <div className="text-[28px] font-bold text-[#d31900]">방명록(0)</div>
            <div className="flex items-center gap-2">
              <button type="button" className="h-[26px] rounded border border-[#cfcfcf] bg-white px-3 text-[12px] text-[#333]">
                차단설정
              </button>
              <select className="h-[26px] border border-[#cfcfcf] bg-white px-2 text-[12px] text-[#333]">
                <option>2026</option>
              </select>
            </div>
          </div>

          <div className="mt-1 border-y border-[#2f3d8f] bg-white p-3">
            <div className="grid grid-cols-[120px_1fr] gap-3">
              <div className="text-[28px] font-semibold text-[#333]">{targetUserId}</div>
              <div className="grid gap-2">
                <textarea className="min-h-[86px] w-full resize-none border border-[#d7d7d7] p-2 text-[12px] outline-none" />
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-1 text-[12px] text-[#666]">
                    <input type="checkbox" className="h-[12px] w-[12px]" />
                    비밀글
                  </label>
                  <button type="button" className="h-[30px] rounded border border-[#4f4f4f] bg-[#666] px-5 text-[12px] font-bold text-white">
                    등록
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="mt-3 flex min-h-[520px] items-center justify-center border-y border-[#2f3d8f] text-[48px] font-bold tracking-[-0.03em] text-[#444]">
        {meta.title}
      </div>
    </GallogShell>
  )
}

