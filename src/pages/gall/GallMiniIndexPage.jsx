import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'
import { BlockLoader } from '../../components/common/Loader'

const GALLERY_PARENT_TOPICS = [
  '연예',
  '게임',
  '해외방송',
  '게임',
  '취미',
  '만화/애니',
  '스포츠',
  '스포츠스타',
  '디지털/IT',
  '교통/운송',
  '음식',
  '패션',
  '음악',
  '여행/풍경',
  '합성',
  '생물',
  '건강/심리',
  '학술',
  '교육',
  '공무원',
  '대학',
  '수능',
  '직업',
  '정치인/유명인',
  '밀리터리',
  '금융/재테크',
  '성공/계발',
  '생활',
  '지역',
  '쇼핑/장터',
  '정부/기관',
  '기업',
  '이슈',
  '미디어',
  '성인',
  '기타',

]

const MINI_TOPIC_TREE_QUERY = gql`
  query NewQuery($parentTopics: [String!], $limit: Int) {
    dcinsideGalleryTopicTree(parentTopics: $parentTopics, limit: $limit, galleryTypeName: "미니") {
      topicId
      name
      galleryCount
      child {
        topicId
        name
        galleries {
          databaseId
          slug
          title
          description
          status
          score
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
          description: stripHtml(g.description),
          href: `/gall/mini/board/lists/?id=${encodeURIComponent(String(g.slug ?? g.databaseId ?? ''))}`,
        })),
      }
    })
  }, [topicTree])

  const topScoreGalleries = useMemo(() => {
    const galleries = topicTree
      .flatMap((t) => t?.child ?? [])
      .flatMap((c) => c?.galleries ?? [])
      .filter((g) => g?.title)

    const unique = new Map()
    galleries.forEach((g) => {
      const key = String(g?.slug ?? g?.databaseId ?? '')
      if (!key) return
      if (!unique.has(key)) unique.set(key, g)
    })

    return Array.from(unique.values())
      .map((g) => ({
        key: String(g?.slug ?? g?.databaseId ?? g?.title),
        id: String(g?.slug ?? g?.databaseId ?? ''),
        title: stripHtml(g?.title),
        score: typeof g?.score === 'number' ? g.score : Number(g?.score ?? 0),
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 20)
  }, [topicTree])

  if (loading) {
    return <BlockLoader label="미니 갤러리 불러오는 중..." />
  }

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
        <div className="flex items-center justify-between border-b border-[#d9d9d9] px-3 py-2">
          <div className="text-[13px] font-bold text-[#3b4890]">흥한 미니 갤러리</div>
          <div className="flex items-center gap-1 text-[12px] text-[#666]">
            <span className="rounded-full border border-[#d9d9d9] bg-[#f6f6f6] px-2 py-[2px]">전체 순위</span>
            <button type="button" className="h-[18px] w-[18px] border border-[#cfcfcf] bg-white text-[11px]" aria-label="이전">
              ◀
            </button>
            <button type="button" className="h-[18px] w-[18px] border border-[#cfcfcf] bg-white text-[11px]" aria-label="다음">
              ▶
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-x-6 gap-y-3 px-3 py-4">
          {topScoreGalleries.map((g, idx) => (
            <Link
              key={g.key}
              to={`/gall/mini/board/lists/?id=${encodeURIComponent(g.id)}`}
              className="flex min-w-0 items-center gap-2 hover:underline"
              title={g.title}
            >
              <span className="inline-flex h-[16px] min-w-[16px] items-center justify-center bg-[#3b4890] px-[3px] text-[11px] font-bold text-white">
                {idx + 1}
              </span>
              <span className="truncate text-[13px] text-[#222]">{g.title}</span>
            </Link>
          ))}
          {!topScoreGalleries.length ? <div className="px-1 py-2 text-[12px] text-[#888]">표시할 갤러리가 없습니다.</div> : null}
        </div>
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
                      <div className="mt-1 truncate text-[12px] text-[#777]">{item.description || '미니 갤러리'}</div>
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

