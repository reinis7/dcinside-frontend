import { PaginationArrows } from './PaginationArrows'

const TABS = [
  '개념글',
  '게임',
  '연예/방송',
  '스포츠',
  '교육/금융/IT',
  '여행/음식/생물',
  '지역',
  '기타',
]

const BLOCKS: { title: string; items: string[] }[] = [
  {
    title: '삼성 라이온즈 갤러리',
    items: [
      '시범경기 선발 라인업 총정리',
      '올시즌 기대 포인트',
      '외국인 타자 적응기',
      '홈구장 분위기 직캠',
      '팬들 반응 모음',
    ],
  },
  {
    title: 'kt wiz 갤러리',
    items: [
      '시즌 티켓 정보',
      '신인 드래프트 후기',
      '투수진 분석',
      '타선 득점력',
      '원정 응원 이야기',
    ],
  },
  {
    title: '교정 갤러리',
    items: [
      '오늘의 이슈 토론',
      '관련 뉴스 링크',
      '법령·판례 질문',
      '사례 공유',
      '용어 정리',
    ],
  },
  {
    title: '도시·지역 갤러리',
    items: [
      '지역 축제 소식',
      '맛집 후기',
      '교통 팁',
      '살기 좋은 동네',
      '사진 스팟',
    ],
  },
]

export function GalleryHubSection() {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-gray-200 px-1.5 pb-1 pt-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-0 text-[12px] text-gray-800">
          {TABS.map((t, i) => (
            <span key={t} className="inline-flex items-center">
              {i > 0 && <span className="px-1 text-gray-300">|</span>}
              <a href="#" className="whitespace-nowrap hover:underline">
                {t}
              </a>
            </span>
          ))}
        </div>
        <PaginationArrows current={1} total={6} />
      </div>
      <div className="h-1 bg-dc-nav" aria-hidden />

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {BLOCKS.map((b, idx) => (
          <div
            key={b.title}
            className={`px-2 py-2 sm:border-gray-300 ${idx < BLOCKS.length - 1 ? 'border-b border-dashed border-gray-300 sm:border-b-0' : ''} ${idx % 2 === 0 ? 'sm:border-r sm:border-dashed' : ''} ${idx < 2 ? 'sm:border-b sm:border-dashed' : ''}`}
          >
            <h3 className="mb-1 text-[12px] font-bold text-gray-900">
              <a href="#" className="hover:underline">
                {b.title}
              </a>
              <span className="ml-0.5 text-gray-500">›</span>
            </h3>
            <ul className="space-y-0.5 text-[11px] text-gray-800">
              {b.items.map((line) => (
                <li key={line} className="flex gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" aria-hidden />
                  <a href="#" className="min-w-0 leading-snug hover:underline">
                    {line}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
