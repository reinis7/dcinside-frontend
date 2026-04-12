export function LoginBox() {
  return (
    <div className="border border-gray-300 bg-white p-1.5 text-[11px]">
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <input
            type="text"
            className="w-full border border-gray-300 px-1 py-0.5 text-[11px]"
            placeholder="아이디"
            autoComplete="username"
          />
          <input
            type="password"
            className="w-full border border-gray-300 px-1 py-0.5 text-[11px]"
            placeholder="비밀번호"
            autoComplete="current-password"
          />
        </div>
        <div className="flex w-[108px] shrink-0 flex-col justify-between gap-1">
          <label className="flex cursor-pointer items-center gap-0.5 leading-none">
            <input type="checkbox" className="h-3 w-3" />
            <span>코드 저장</span>
          </label>
          <label className="flex cursor-pointer items-center gap-0.5 leading-none">
            <input type="checkbox" className="h-3 w-3" defaultChecked />
            <span>보안접속</span>
          </label>
          <button
            type="button"
            className="w-full bg-dc-nav py-1.5 text-[12px] font-bold text-white hover:opacity-90"
          >
            로그인
          </button>
        </div>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 border-t border-gray-100 pt-1 text-[10px] text-gray-600">
        <a href="#" className="hover:underline">
          고정닉 신청
        </a>
        <span className="text-gray-300">|</span>
        <a href="#" className="hover:underline">
          식별 코드·비밀번호찾기
        </a>
        <button
          type="button"
          className="ml-auto text-gray-500 hover:text-gray-800"
          aria-label="알림"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
