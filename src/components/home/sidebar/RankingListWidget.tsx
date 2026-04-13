type RankRow = { rank: number; name: string; trend: 'up' | 'down' | 'flat' }

type RankingListWidgetProps = {
  title: string
  rows: RankRow[]
  footerLink?: string
  rankStyle?: 'orange' | 'blue'
}

function TrendIcon({ trend }: { trend: RankRow['trend'] }) {
  if (trend === 'up') return <span className="text-[10px] text-red-500">▲</span>
  if (trend === 'down') return <span className="text-[10px] text-blue-600">▼</span>
  return <span className="text-[10px] text-gray-400">-</span>
}

const SUB_TABS = ['메인', '마이너', '미니', '인물'] as const

export function RankingListWidget({
  title,
  rows,
  footerLink = '11위 - 20위',
  rankStyle = 'orange',
}: RankingListWidgetProps) {
  const rankBg = rankStyle === 'orange' ? 'bg-orange-500' : 'bg-blue-700'

  return (
    <div className="border border-gray-300 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-gray-200 px-1 py-1">
        <span className="text-[12px] font-bold text-gray-900">{title}</span>
        <div className="flex flex-wrap items-center gap-0 text-[10px] text-gray-600">
          {SUB_TABS.map((t, i) => (
            <span key={t} className="inline-flex items-center">
              {i > 0 && <span className="px-0.5 text-gray-300">|</span>}
              <button type="button" className="hover:underline">
                {t}
              </button>
            </span>
          ))}
        </div>
      </div>
      <ol className="py-0.5">
        {rows.map((r) => (
          <li key={r.rank}>
            <a
              href="#"
              className="flex items-center gap-1 px-1 py-0.5 text-[11px] hover:bg-gray-50"
            >
              <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[10px] font-bold text-white ${rankBg}`}
              >
                {r.rank}
              </span>
              <span className="min-w-0 flex-1 truncate text-gray-900">{r.name}</span>
              <TrendIcon trend={r.trend} />
            </a>
          </li>
        ))}
      </ol>
      <div className="border-t border-gray-100 bg-gray-50 px-1 py-0.5 text-right">
        <a href="#" className="text-[10px] text-dc-nav hover:underline">
          {footerLink}
        </a>
      </div>
    </div>
  )
}
