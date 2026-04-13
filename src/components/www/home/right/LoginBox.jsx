export function LoginBox() {
  return (
    <div className="border border-[#d3d3d3] bg-white p-3">
      <div className="grid grid-cols-[1fr_92px] gap-2">
        <div className="grid gap-2">
          <input className="h-[30px] bg-[#f6f6f6] px-2 outline-none" placeholder="식별 코드" />
          <input className="h-[30px] bg-[#f6f6f6] px-2 outline-none" placeholder="비밀번호" type="password" />
        </div>
        <div className="grid content-start gap-2">
          <label className="flex items-center gap-1 text-[11px] text-[#333]">
            <input type="checkbox" className="h-[12px] w-[12px]" /> 코드 저장
          </label>
          <label className="flex items-center gap-1 text-[11px] text-[#333]">
            <input type="checkbox" className="h-[12px] w-[12px]" /> 보안접속
          </label>
          <button type="button" className="h-[30px] bg-[#3b4890] text-[12px] font-bold text-white">
            로그인
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-dashed border-[#d3d3d3] pt-2 text-[11px]">
        <div className="flex items-center gap-2 text-[#333]">
          <a href="#" className="font-bold hover:underline" onClick={(e) => e.preventDefault()}>
            고정닉 신청
          </a>
          <span className="text-[#aaa]">|</span>
          <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
            식별 코드·비밀번호찾기
          </a>
        </div>
        <button type="button" className="h-[18px] w-[18px] rounded bg-[#f3f3f3] text-[12px] text-[#666]">
          🔔
        </button>
      </div>
    </div>
  )
}

