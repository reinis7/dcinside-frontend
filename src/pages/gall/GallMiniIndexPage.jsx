import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'

const GALLERY_PARENT_TOPICS = [
  '연예',
  '게임',
  '취미',
  '만화/애니',
  '해외방송',
  '음식',
  '국내방송',
  '음악',
  '스포츠',
  '스포츠스타',
  '생활',
  '학술',
  '대학',
  '직업',
  '금융/재테크',
  '성공/계발',
  '디지털/IT',
  '교통/운송',
  '건강/심리',
  '교육',
  '수능',
]

const MINI_TOPIC_TREE_QUERY = gql`
  query NewQuery($parentTopics: [String!], $limit: Int) {
    dcinsideGalleryTopicTree(parentTopics: $parentTopics, limit: $limit) {
      name
      galleryCount
      child {
        galleries {
          databaseId
          slug
          title
          status
        }
      }
    }
  }
`

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function GallMiniIndexPage() {
  const navigate = useNavigate()
  const { isAuthed, isLoading, viewer, logout } = useAuth()
  const { data, loading } = useQuery(MINI_TOPIC_TREE_QUERY, {
    variables: { parentTopics: GALLERY_PARENT_TOPICS, limit: 50 },
    fetchPolicy: 'network-only',
  })
  const topicTree = data?.dcinsideGalleryTopicTree ?? []
  const displayName = viewer?.username || viewer?.name || '회원'

  const sections = useMemo(() => {
    const map = new Map(topicTree.map((t) => [t?.name, t]))
    return GALLERY_PARENT_TOPICS.map((name) => {
      const topic = map.get(name)
      const galleries = (topic?.child ?? []).flatMap((c) => c?.galleries ?? []).filter((g) => g?.title)
      return {
        name,
        count: topic?.galleryCount ?? galleries.length,
        items: galleries.slice(0, 9).map((g) => ({
          key: String(g.slug ?? g.databaseId ?? g.title),
          title: stripHtml(g.title),
          href: `/gall/ngallery/board/lists/?id=${encodeURIComponent(String(g.slug ?? g.databaseId ?? ''))}`,
        })),
      }
    })
  }, [topicTree])

  return (
    <section className="grid gap-2 text-[12px]">
      <div className="grid grid-cols-[1fr_300px] gap-2">
        <div className="border border-[#d3d3d3] bg-white px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[17px] font-semibold tracking-[-0.02em] text-[#222]">
              비공개/멤버 가입 등 차별화된 기능의 <span className="text-[#3b4890]">미니 갤러리</span>를 만들어보세요.
            </div>
            <button
              type="button"
              className="inline-flex h-[30px] items-center justify-center rounded-full border border-[#ef9f00] bg-[#6b6bff] px-4 text-[14px] font-bold leading-none text-white"
              onClick={() => {
                if (isLoading) return
                if (!isAuthed) {
                  const ok = confirm('로그인 후 이용할 수 있습니다.\n로그인 페이지로 이동할까요?')
                  if (!ok) return
                  navigate('/sign/login?s_url=%2Fgall%2Fn%2Fcreate')
                  return
                }
                navigate('/gall/n/create')
              }}
              disabled={isLoading}
            >
              미니 갤러리 만들기
            </button>
          </div>
        </div>

        <aside className="border border-[#3b4890] bg-white">
          {isAuthed ? (
            <>
              <div className="flex items-center justify-between border-b border-[#dedede] px-3 py-1">
                <div className="flex min-w-0 items-center gap-1 text-[18px] font-bold tracking-[-0.01em] text-[#1f3b8f]">
                  <span className="truncate">{displayName}님</span>
                  <span className="text-[15px] text-[#233f95]">›</span>
                </div>
                <button
                  type="button"
                  className="h-[30px] rounded-[4px] border border-[#243f93] bg-[#2f4aa0] px-3 text-[13px] font-bold text-white"
                  onClick={logout}
                >
                  로그아웃
                </button>
              </div>
              <div className="flex items-center justify-center gap-3 py-2 text-[12px] font-semibold text-[#222]">
                <span>즐겨찾기</span>
                <span className="text-[#bbb]">|</span>
                <span>스크랩</span>
                <span className="text-[#bbb]">|</span>
                <span>알림</span>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/sign/login?s_url=%2Fgall%2Fn"
                className="block border-b border-[#dedede] px-3 py-2 text-[14px] font-bold tracking-[-0.02em] text-[#3b4890] hover:underline"
              >
                로그인해 주세요.
              </Link>
              <div className="flex items-center justify-center gap-3 py-2 text-[12px] font-semibold text-[#222]">
                <span>즐겨찾기</span>
                <span className="text-[#bbb]">|</span>
                <span>스크랩</span>
                <span className="text-[#bbb]">|</span>
                <span>알림</span>
              </div>
            </>
          )}
        </aside>
      </div>

      <div className="border border-[#3b4890] bg-white">
        {sections.map((section, idx) => (
          <div key={section.name} className={idx === 0 ? '' : 'border-t border-[#3b4890]'}>
            <div className="flex items-center justify-between border-b border-[#d9d9d9] px-3 py-2">
              <div className="text-[13px]">
                <span className="font-bold text-[#3b4890]">{section.name}</span>
                <span className="ml-1 text-[#888]">({loading ? '--' : section.count})</span>
              </div>
              <button type="button" className="h-4 w-4 border border-[#cfcfcf] bg-[#f6f6f6]" aria-label="정렬">
                ▼
              </button>
            </div>
            <div className="grid grid-cols-3 gap-0">
              {section.items.map((item) => (
                <Link key={item.key} to={item.href} className="border-r border-[#ececec] px-3 py-3 hover:bg-[#fafafa] last:border-r-0">
                  <div className="grid grid-cols-[72px_1fr] gap-3">
                    <div className="h-[54px] w-[72px] bg-[#eff3f8]" />
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-bold text-[#222]">{item.title}</div>
                      <div className="mt-1 truncate text-[12px] text-[#777]">미니 갤러리</div>
                    </div>
                  </div>
                </Link>
              ))}
              {!section.items.length ? <div className="px-3 py-6 text-[12px] text-[#888]">표시할 갤러리가 없습니다.</div> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

