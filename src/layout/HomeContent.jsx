import { PostList } from '../PostList.jsx'

export function HomeContent() {
  return (
    <section className="min-w-0 flex-1" aria-label="본문 왼쪽 영역">
      <h2 className="sr-only">본문 왼쪽 컨텐츠 영역</h2>

      <article className="rounded border border-neutral-300 bg-white">
        <header className="flex flex-wrap items-center gap-2 border-b border-neutral-200 bg-[#f8f9fb] px-3 py-2">
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              className="rounded border border-[#29367c] bg-white px-3 py-1 text-[13px] font-semibold text-[#29367c]"
            >
              실시간 베스트
            </button>
            <button
              type="button"
              className="rounded border border-transparent px-3 py-1 text-[13px] text-neutral-600 hover:bg-neutral-100"
            >
              실베<span className="text-[#888]">라이트</span>
            </button>
          </div>
          <a
            href="/gall/board/lists/?id=dcbest"
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-[12px] font-medium text-[#666] hover:text-[#0033a0] hover:underline"
          >
            실갤
          </a>
          <div className="flex items-center gap-1 text-[12px] text-neutral-500">
            <strong className="font-semibold text-[#29367c]">1</strong>
            <span>/</span>
            <span>10</span>
          </div>
        </header>

        <div className="p-0">
          <PostList />
        </div>
      </article>
    </section>
  )
}
