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

export function GallogPostingPage() {
  const { userId = '', galleryType = 'all' } = useParams()
  const { viewer } = useAuth()
  const currentUserId = (viewer?.username || viewer?.userId || '').trim()
  const targetUserId = decodeURIComponent(userId || currentUserId || 'user')
  const safeGalleryType = ['all', 'main', 'minor', 'mini', 'person'].includes(galleryType) ? galleryType : 'all'
  const postingPath = (type) => `/gallog/${encodeURIComponent(targetUserId)}/posting/${type}`

  return (
    <GallogShell targetUserId={targetUserId} activeMenu="posting">
      <div className="flex items-center justify-between border-b border-[#2f3d8f] pb-1">
        <div className="flex items-center gap-3">
          {TYPE_TABS.map((tab) => (
            <Link
              key={tab.key}
              to={postingPath(tab.key)}
              className={
                safeGalleryType === tab.key
                  ? 'border-b-2 border-[#2f3d8f] pb-0.5 text-[13px] font-bold text-[#d31900]'
                  : 'text-[13px] font-semibold text-[#333] hover:underline'
              }
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center border border-[#d7d7d7] bg-white">
          <input className="h-[24px] w-[210px] px-2 text-[12px] outline-none" placeholder="게시글 제목 검색" />
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

      <div className="mt-3 flex min-h-[420px] items-center justify-center border-y border-[#2f3d8f] text-[48px] font-bold tracking-[-0.03em] text-[#444]">
        게시글이 없습니다.
      </div>
    </GallogShell>
  )
}

