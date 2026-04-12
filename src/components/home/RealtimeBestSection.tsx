import { PaginationArrows } from './PaginationArrows'

const FEATURED = [
  { line1: '이슈 한 줄 요약', line2: '부제 또는 출처' },
  { line1: '실시간 화제 글', line2: '갤러리명' },
  { line1: '주간 인기 토픽', line2: '20:00 기준' },
  { line1: '모바일 핫이슈', line2: '댓글 많은 글' },
]

const POSTS: {
  title: string
  comments: number
  gallery: string
  time: string
  titleGreen?: boolean
}[] = [
  {
    title: '첫 페이지 레이아웃 맞추는 중',
    comments: 88,
    gallery: '프로그래밍 갤',
    time: '21:50',
    titleGreen: true,
  },
  { title: '디시 메인 퍼블리싱 팁 정리', comments: 366, gallery: '싱글벙글 지구촌', time: '20:20' },
  { title: 'Tailwind로 밀도 높은 UI', comments: 42, gallery: '웹디자인 연구', time: '19:12' },
  { title: 'API 연동은 백엔드에서', comments: 15, gallery: '개발 노트', time: '18:55' },
  { title: '썸네일·목록 행 높이 맞추기', comments: 201, gallery: 'UI 갤러리', time: '18:00' },
  { title: '갤러리 블록 2열 그리드', comments: 7, gallery: '레이아웃', time: '17:40' },
  { title: '사이드바 로그인 박스 구조', comments: 56, gallery: '디시 프론트', time: '17:05' },
  { title: '실북갤 순위 위젯 마크업', comments: 129, gallery: '마크업', time: '16:48' },
  { title: '공지사항 6단 사이트맵', comments: 3, gallery: '정보', time: '16:10' },
  { title: '하단 야간모드·맨위로 바', comments: 22, gallery: '푸터', time: '15:33' },
]

export function RealtimeBestSection() {
  return (
    <section className="border-b border-gray-200">
      <div className="flex flex-wrap items-end justify-between gap-2 px-1.5 pb-1 pt-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]">
          <button type="button" className="font-bold text-gray-900">
            <span className="text-red-600">✓</span> 실시간 베스트
          </button>
          <span className="text-gray-300">|</span>
          <button type="button" className="text-gray-600">
            <span className="text-gray-400">✓</span> 실베라이트
          </button>
          <span className="text-gray-300">|</span>
          <button type="button" className="inline-flex items-center gap-0.5 text-gray-700">
            <span className="text-[10px]">▶</span>
            실갤
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            className="rounded-sm border border-green-600 bg-green-50 px-1.5 py-0.5 text-[11px] text-green-800"
          >
            랭킹 <span className="text-[9px]">▼</span>
          </button>
        </div>
        <PaginationArrows current={1} total={10} />
      </div>

      <div className="h-1 bg-dc-nav" aria-hidden />

      <div className="grid grid-cols-2 gap-px bg-gray-200 p-px sm:grid-cols-4">
        {FEATURED.map((f, i) => (
          <div key={i} className="relative aspect-[5/3] min-h-[72px] bg-gradient-to-br from-gray-300 to-gray-400">
            <div className="absolute inset-x-0 bottom-0 bg-black/55 px-1 py-0.5 text-[10px] leading-tight text-white">
              <div className="truncate">{f.line1}</div>
              <div className="truncate text-white/90">{f.line2}</div>
            </div>
          </div>
        ))}
      </div>

      <ul className="divide-y divide-gray-200">
        {POSTS.map((p, i) => (
          <li key={i}>
            <a href="#" className="flex items-center gap-2 px-1.5 py-1 hover:bg-gray-50">
              <span className="h-9 w-9 shrink-0 bg-gradient-to-br from-violet-200 to-indigo-200" />
              <span className="min-w-0 flex-1">
                <span className={`text-[12px] font-bold ${p.titleGreen ? 'text-green-700' : 'text-gray-900'}`}>
                  {p.title}
                </span>
                <span className="text-[12px] font-bold text-red-600"> [{p.comments}]</span>
              </span>
              <span className="shrink-0 text-right text-[11px] text-gray-500">
                <span className="truncate">{p.gallery}</span>
                <span className="text-gray-300"> | </span>
                {p.time}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
