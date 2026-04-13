import { Link, useLocation } from 'react-router-dom'

export function SignJoinDonePage() {
  const location = useLocation()
  const joinForm = location.state?.joinForm
  const securityCode = location.state?.securityCode

  return (
    <section className="mx-auto w-[760px] border border-[#d1d5db] bg-white p-4 text-[12px]">
      <h2 className="text-[24px] font-semibold">고정닉 신청</h2>
      <p className="mt-1 text-[12px] text-[#666]">페이지 경로 &gt; 고정닉 신청 완료</p>

      <h3 className="mt-5 text-[18px] font-semibold">신청이 완료되었습니다.</h3>

      <div className="mt-3 border-t-2 border-[#374151] pt-3">
        <p className="text-[12px] text-[#666]">가입 백엔드 연동 전까지는 데모 완료 화면으로 동작합니다.</p>
        <div className="mt-3 border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2">
          <p className="mb-1 font-semibold">신청 정보</p>
          <ul className="list-disc pl-4">
            <li>식별 코드: {joinForm?.userId ?? '(미입력)'}</li>
            <li>닉네임: {joinForm?.nickname ?? '(미입력)'}</li>
            <li>보안 코드: {securityCode ?? '(없음)'}</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link className="text-[#666] hover:underline" to="/sign/join/agree">
          처음으로
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/sign/login?s_url=%2Fwww" className="text-[#334499] hover:underline">
            로그인으로 이동
          </Link>
          <Link to="/www" className="text-[#334499] hover:underline">
            www 홈으로 이동
          </Link>
        </div>
      </div>
    </section>
  )
}
