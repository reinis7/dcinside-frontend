export function BoardListPager({ page, pageCount, onPageChange }) {
  const windowSize = 10
  const safePage = Math.min(Math.max(1, page), Math.max(1, pageCount))
  const windowStart = Math.floor((safePage - 1) / windowSize) * windowSize + 1
  const windowEnd = Math.min(pageCount, windowStart + windowSize - 1)
  const pages = []
  for (let n = windowStart; n <= windowEnd; n += 1) pages.push(n)

  const buttonClass =
    'inline-flex h-[26px] min-w-[26px] items-center justify-center border px-1.5 text-[12px] disabled:cursor-default disabled:text-[#bbb]'

  return (
    <nav className="flex items-center justify-center gap-1 border-t border-[#e6e6e6] bg-white px-3 py-3" aria-label="게시글 페이지">
      <button
        type="button"
        className={`${buttonClass} border-[#d0d0d0] bg-white text-[#444] disabled:bg-[#f7f7f7]`}
        disabled={safePage <= 1}
        onClick={() => onPageChange(safePage - 1)}
      >
        이전
      </button>
      {windowStart > 1 ? (
        <button
          type="button"
          className={`${buttonClass} border-[#d0d0d0] bg-white text-[#444]`}
          onClick={() => onPageChange(windowStart - 1)}
        >
          …
        </button>
      ) : null}
      {pages.map((n) => {
        const current = n === safePage
        return (
          <button
            key={n}
            type="button"
            aria-current={current ? 'page' : undefined}
            className={
              current
                ? `${buttonClass} border-[#2f3d8f] bg-[#3b4890] font-bold text-white`
                : `${buttonClass} border-[#d0d0d0] bg-white text-[#333] hover:border-[#3b4890]`
            }
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        )
      })}
      {windowEnd < pageCount ? (
        <button
          type="button"
          className={`${buttonClass} border-[#d0d0d0] bg-white text-[#444]`}
          onClick={() => onPageChange(windowEnd + 1)}
        >
          …
        </button>
      ) : null}
      <button
        type="button"
        className={`${buttonClass} border-[#d0d0d0] bg-white text-[#444] disabled:bg-[#f7f7f7]`}
        disabled={safePage >= pageCount}
        onClick={() => onPageChange(safePage + 1)}
      >
        다음
      </button>
    </nav>
  )
}
