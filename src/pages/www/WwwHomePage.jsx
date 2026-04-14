import { useMemo } from 'react'
import { buildWwwHomeMock } from '../../mocks/wwwHomeMock'
import { RealtimeBestSection } from '../../components/www/home/RealtimeBestSection'
import { ConceptSection } from '../../components/www/home/ConceptSection'
import { RightSidebar } from '../../components/www/home/RightSidebar'

function formatNumber(n) {
  return n.toLocaleString('ko-KR')
}

export function WwwHomePage() {
  const data = useMemo(() => buildWwwHomeMock({ seed: 20260413 }), [])

  return (
    <section>
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
