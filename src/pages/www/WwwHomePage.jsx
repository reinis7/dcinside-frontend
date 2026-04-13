import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { buildWwwHomeMock } from '../../mocks/wwwHomeMock'
import { RealtimeBestSection } from '../../components/www/home/RealtimeBestSection'
import { ConceptSection } from '../../components/www/home/ConceptSection'
import { RightSidebar } from '../../components/www/home/RightSidebar'
import { useAuth } from '../../auth/authContext'

function formatNumber(n) {
  return n.toLocaleString('ko-KR')
}

export function WwwHomePage() {
  const data = useMemo(() => buildWwwHomeMock({ seed: 20260413 }), [])
  const { viewer, isAuthed, isLoading, logout } = useAuth()

  return (
    <section>
      <div
        className={[
          'mb-2 rounded border px-3 py-2 text-[12px]',
          isAuthed ? 'border-[#b8d7c9] bg-[#f2fbf6] text-[#1d7a62]' : 'border-[#d3d3d3] bg-white text-[#333]',
        ].join(' ')}
      >
        {isLoading ? (
          <div className="text-[#666]">로그인 상태 확인 중…</div>
        ) : isAuthed ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-bold">로그인됨</span>
              <span className="ml-2 text-[#333]">
                {viewer?.username ? `(${viewer.username})` : ''}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/www/my" className="text-[#334499] hover:underline">
                마이페이지
              </Link>
              <button
                type="button"
                className="rounded border border-[#5f5f5f] bg-[#6c6c6c] px-3 py-1 text-[12px] font-semibold text-white"
                onClick={() => void logout()}
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-bold">비로그인</span>
              <span className="ml-2 text-[#666]">테스트용 표시입니다.</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/sign/login?s_url=%2Fwww" className="text-[#334499] hover:underline">
                로그인
              </Link>
              <Link to="/sign/register" className="text-[#334499] hover:underline">
                회원가입
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mb-2 text-[11px] text-[#666]">
        어제 <span className="font-bold underline">{formatNumber(data.stats.yesterdayPosts)}개</span> 게시글 등록 / 어제{' '}
        <span className="font-bold underline">{formatNumber(data.stats.yesterdayComments)}개</span> 댓글 등록 / 총 갤러리 수{' '}
        <span className="font-bold underline">{formatNumber(data.stats.totalGalleries)}개</span>
      </div>

      <div className="grid grid-cols-[728px_300px] gap-[22px]">
        <div className="grid gap-4">
          <RealtimeBestSection items={data.realtimeBest} />
          <ConceptSection categories={data.conceptCategories} postsByCategory={data.conceptPostsByCategory} />
        </div>

        <RightSidebar rankings={data.rankings} media={data.media} dcissue={data.dcissue} />
      </div>
    </section>
  )
}
