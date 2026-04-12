const COLS: { title: string; links: string[] }[] = [
  {
    title: '갤러리',
    links: ['실시간 베스트 갤러리'],
  },
  {
    title: '인기갤러리',
    links: [
      '만화·애니',
      '인터넷 방송',
      '게임',
      '스포츠',
      '야구',
      '축구',
      '국내야구',
      '해외야구',
      'LoL',
      '스타',
    ],
  },
  {
    title: '주요서비스',
    links: ['갤로그', '이벤트', '디시콘'],
  },
  {
    title: '갤러리 순회',
    links: ['KBO', '삼성 라이온즈', 'LG 트윈스', 'kt wiz', '두산 베어스', 'SSG 랜더스'],
  },
  {
    title: '디시미디어',
    links: [
      'GameMeca',
      'IT동아',
      '뉴시스',
      '스포탈코리아',
      '이데일리',
      '조선비즈',
      '헤럴드경제',
      '머니투데이',
      '파이낸셜뉴스',
    ],
  },
  {
    title: '디시이슈',
    links: ['디시이슈'],
  },
]

export function SiteMapSection() {
  return (
    <section className="mb-px border border-gray-300 border-t-4 border-t-dc-nav bg-white">
      <h2 className="border-b border-gray-200 px-2 py-1 text-[12px] font-bold text-gray-900">
        공지사항
      </h2>
      <div className="grid grid-cols-2 divide-x divide-y divide-gray-200 sm:grid-cols-3 lg:grid-cols-6">
        {COLS.map((col) => (
          <div key={col.title} className="min-w-0 px-2 py-2">
            <h3 className="mb-1 text-[11px] font-bold text-gray-900">{col.title}</h3>
            <ul className="space-y-0.5 text-[11px] text-gray-800">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="block truncate hover:text-dc-nav hover:underline">
                    {l}
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
