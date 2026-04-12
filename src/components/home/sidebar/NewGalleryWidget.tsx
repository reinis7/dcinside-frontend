import { PaginationArrows } from '../PaginationArrows'

const NAMES = [
  '버츄얼 스나',
  '오늘의 핫토픽',
  '신규 취미 갤',
  '지역 소모임',
  '모바일 게임 QnA',
]

export function NewGalleryWidget() {
  return (
    <div className="border border-gray-300 bg-gray-50">
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-dashed border-gray-300 px-1 py-1">
        <div className="text-[12px] font-bold">
          <span className="text-red-600">NEW</span>{' '}
          <span className="text-gray-900">신설갤</span>
        </div>
        <PaginationArrows current={1} total={10} />
      </div>
      <div className="flex flex-wrap items-center gap-0 border-b border-dashed border-gray-300 px-1 py-0.5 text-[10px] text-gray-700">
        {(['메인', '마이너', '미니', '인물'] as const).map((t, i) => (
          <span key={t} className="inline-flex items-center">
            {i > 0 && <span className="px-0.5 text-gray-300">|</span>}
            <button
              type="button"
              className={t === '마이너' ? 'font-bold text-amber-800' : ''}
            >
              {t}
            </button>
          </span>
        ))}
      </div>
      <ul className="divide-y divide-gray-200 bg-white px-1 py-0.5 text-[11px]">
        {NAMES.map((n) => (
          <li key={n}>
            <a href="#" className="block truncate py-0.5 hover:underline">
              {n}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
