import { PaginationArrows } from '../PaginationArrows'

const RANKED = [
  '이슈 랭킹 제목이 길면 말줄임',
  '두 번째 화제 글',
  '정책·사회 관련 토론',
  '연예 이슈 한줄 요약',
  '스포츠 하이라이트',
]

export function DcIssueWidget() {
  return (
    <div className="border border-gray-300 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-1 py-1">
        <div className="text-[12px] font-bold text-gray-900">
          디시이슈{' '}
          <span className="font-serif text-[11px] font-normal italic text-gray-600">
            dcissue
          </span>
        </div>
        <PaginationArrows current={1} total={2} />
      </div>
      <div className="grid grid-cols-2 gap-1 p-1">
        <div>
          <div className="aspect-square bg-gradient-to-br from-stone-300 to-stone-400" />
          <p className="mt-0.5 text-[10px] font-bold leading-tight">이슈 카드 제목</p>
        </div>
        <div>
          <div className="aspect-square bg-gradient-to-br from-neutral-300 to-neutral-400" />
          <p className="mt-0.5 text-[10px] font-bold leading-tight">두 번째 카드</p>
        </div>
      </div>
      <ol className="list-none space-y-0.5 border-t border-gray-100 px-1 py-1 text-[11px]">
        {RANKED.map((t, i) => (
          <li key={t}>
            <a href="#" className="flex gap-1 hover:underline">
              <span className="w-3 shrink-0 text-gray-500">{i + 1}</span>
              <span className="min-w-0 truncate">{t}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}
