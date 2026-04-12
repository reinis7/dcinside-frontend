import { PaginationArrows } from '../PaginationArrows'

const LINKS = ['미디어 헤드라인 1', '관련 기사 요약 2', '이슈 브리핑 3']

export function DcMediaWidget() {
  return (
    <div className="border border-gray-300 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-1 py-1">
        <span className="text-[12px] font-bold text-gray-900">디시미디어</span>
        <PaginationArrows current={1} total={2} />
      </div>
      <div className="grid grid-cols-2 gap-1 p-1">
        <div>
          <div className="aspect-square bg-gradient-to-br from-slate-300 to-slate-400" />
          <p className="mt-0.5 text-[10px] leading-tight text-gray-800">
            썸네일 제목 한두 줄까지
          </p>
        </div>
        <div>
          <div className="aspect-square bg-gradient-to-br from-zinc-300 to-zinc-400" />
          <p className="mt-0.5 text-[10px] leading-tight text-gray-800">
            짧은 설명 텍스트
          </p>
        </div>
      </div>
      <ul className="border-t border-gray-100 px-1 py-0.5 text-[11px] text-gray-800">
        {LINKS.map((t) => (
          <li key={t}>
            <a href="#" className="block truncate py-0.5 hover:underline">
              · {t}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
