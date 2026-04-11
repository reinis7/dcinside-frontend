const ISSUE_RANK = [
  { n: 1, href: 'https://issuefeed.dcinside.com', title: '데모: 디시이슈 랭킹 자리' },
  { n: 2, href: 'https://issuefeed.dcinside.com', title: 'WordPress 글은 왼쪽 목록에 표시됩니다' },
  { n: 3, href: 'https://issuefeed.dcinside.com', title: '사이드바는 로그인·이슈 위젯 레이아웃 예시' },
  { n: 4, href: 'https://issuefeed.dcinside.com', title: '백엔드 연동 후 여기에 GraphQL 위젯을 두면 됩니다' },
  { n: 5, href: 'https://issuefeed.dcinside.com', title: 'Tailwind 유틸로 DC 스타일을 맞춘 상태입니다' },
]

export function HomeSidebar() {
  return (
    <section
      className="w-full shrink-0 space-y-3 lg:w-[300px]"
      aria-label="본문 오른쪽 영역"
    >
      <h2 className="sr-only">본문 오른쪽 컨텐츠 영역</h2>

      <div className="rounded border border-neutral-300 bg-white p-3">
        <form
          className="space-y-3"
          onSubmit={(e) => e.preventDefault()}
          aria-label="로그인 (데모)"
        >
          <fieldset className="m-0 space-y-2 border-0 p-0">
            <legend className="sr-only">로그인</legend>
            <div>
              <label htmlFor="demo-user" className="sr-only">
                식별 코드
              </label>
              <input
                id="demo-user"
                className="w-full rounded border border-neutral-300 px-2 py-1.5 text-[13px] outline-none focus:border-[#3b4890]"
                placeholder="식별 코드"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="demo-pw" className="sr-only">
                비밀번호
              </label>
              <input
                id="demo-pw"
                type="password"
                className="w-full rounded border border-neutral-300 px-2 py-1.5 text-[13px] outline-none focus:border-[#3b4890]"
                placeholder="비밀번호"
                autoComplete="current-password"
              />
            </div>
          </fieldset>
          <div className="flex items-center justify-between gap-2 text-[12px]">
            <label className="flex cursor-pointer items-center gap-1 text-neutral-600">
              <input type="checkbox" className="rounded border-neutral-400" />
              코드 저장
            </label>
            <span className="text-neutral-500">보안접속</span>
          </div>
          <button
            type="submit"
            className="w-full rounded bg-[#3b4890] py-2 text-[13px] font-semibold text-white hover:bg-[#29367c]"
          >
            로그인
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-neutral-500">
          데모 UI — 실제 인증은 WordPress와 별도 연동
        </p>
      </div>

      <article className="rounded border border-neutral-300 bg-white">
        <header className="border-b border-neutral-200 px-3 py-2">
          <h3 className="m-0 text-[13px] font-bold text-[#333]">
            이슈랭킹<span className="font-normal text-[#888]">(예시)</span>
          </h3>
        </header>
        <ol className="m-0 list-none space-y-0 p-0">
          {ISSUE_RANK.map((item) => (
            <li
              key={item.n}
              className="border-b border-neutral-100 last:border-b-0"
            >
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex gap-2 px-3 py-2 text-[12px] leading-snug hover:bg-[#f5f7fb]"
              >
                <span className="w-5 shrink-0 text-center font-bold text-[#3b4890]">
                  {item.n}
                </span>
                <span className="min-w-0 text-neutral-800">{item.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </article>
    </section>
  )
}
