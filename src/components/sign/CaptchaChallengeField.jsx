import { localizeErrorMessage } from '../../api/firstGraphQLErrorMessage'

export function CaptchaChallengeField({
  challenge,
  answer,
  onAnswerChange,
  loading,
  loadError,
  onRefresh,
  disabled = false,
}) {
  return (
    <div className="grid gap-2 rounded border border-[#e5e7eb] bg-[#f9fafb] px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">자동 가입 방지</span>
        <button
          type="button"
          disabled={loading || disabled}
          onClick={() => onRefresh()}
          className="text-[12px] text-[#666] underline hover:text-[#374151] disabled:no-underline disabled:text-[#b1b1b1]"
        >
          새로고침
        </button>
      </div>

      {loading ? (
        <p className="text-[12px] text-[#666]">캡차를 불러오는 중...</p>
      ) : loadError ? (
        <p className="text-[12px] text-[#d31900]">{localizeErrorMessage(loadError) || loadError}</p>
      ) : (
        <>
          <p className="text-[18px] font-bold tracking-wide">{challenge?.question}</p>
          <label className="grid gap-1">
            <span className="text-[12px] font-semibold">답 입력</span>
            <input
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              disabled={disabled || !challenge?.id}
              inputMode="numeric"
              autoComplete="off"
              className="rounded border border-[#d1d5db] bg-white px-3 py-2"
              placeholder="정답을 입력하세요"
            />
          </label>
        </>
      )}
    </div>
  )
}
