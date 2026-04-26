import { useMemo } from 'react'
import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { buildWwwHomeMock } from '../../mocks/wwwHomeMock'
import { RealtimeBestSection } from '../../components/www/home/RealtimeBestSection'
import { ConceptSection } from '../../components/www/home/ConceptSection'
import { RightSidebar } from '../../components/www/home/RightSidebar'

const REALTIME_BEST_QUERY = gql`
  query NewQuery {
    posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        date
        title
        content
        categories {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`

function formatNumber(n) {
  return n.toLocaleString('ko-KR')
}

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function formatTime(isoDate) {
  if (!isoDate) return '00:00'
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return '00:00'
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function toRealtimeBestItems(nodes) {
  return nodes.map((node) => {
    const plainTitle = stripHtml(node.title)
    const plainContent = stripHtml(node.content)
    const fallbackTitle = plainContent || '제목 없음'
    const categoryName = node.categories?.edges?.[0]?.node?.name

    return {
      id: node.id,
      title: plainTitle || fallbackTitle,
      gallery: categoryName ?? '게시판',
      time: formatTime(node.date),
      commentCount: 0,
      href: '#',
      thumb: '/snapshot/nstatic.dcinside.com/dc/w/images/img_none1.jpg',
    }
  })
}

export function WwwHomePage() {
  const data = useMemo(() => buildWwwHomeMock({ seed: 20260413 }), [])
  const { data: queryData, loading, error } = useQuery(REALTIME_BEST_QUERY, {
    fetchPolicy: 'network-only',
  })
  const realtimeBestItems = useMemo(() => {
    const nodes = queryData?.posts?.nodes ?? []
    if (!nodes.length) return []
    return toRealtimeBestItems(nodes)
  }, [queryData])

  return (
    <section>
      <div className="mb-2 text-[11px] text-[#666]">
        어제 <span className="font-bold underline">{formatNumber(data.stats.yesterdayPosts)}개</span> 게시글 등록 / 어제{' '}
        <span className="font-bold underline">{formatNumber(data.stats.yesterdayComments)}개</span> 댓글 등록 / 총 갤러리 수{' '}
        <span className="font-bold underline">{formatNumber(data.stats.totalGalleries)}개</span>
      </div>

      <div className="grid grid-cols-[728px_300px] gap-[22px]">
        <div className="grid gap-4">
          <RealtimeBestSection
            items={realtimeBestItems}
            loading={loading}
            errorMessage={error?.message ?? null}
          />
          <ConceptSection categories={data.conceptCategories} postsByCategory={data.conceptPostsByCategory} />
        </div>

        <RightSidebar rankings={data.rankings} media={data.media} dcissue={data.dcissue} />
      </div>
    </section>
  )
}
