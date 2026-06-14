import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { copyPostLinkToClipboard } from '../../utils/sharePostLink'

function SilbeIcon() {
  return (
    <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#b8b8b8] bg-[#f4f4f4] text-[10px] font-bold leading-none text-[#666]">
      B
    </span>
  )
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51 15.42 17.49" />
      <path d="M15.41 6.51 8.59 10.49" />
    </svg>
  )
}

function ConceptStarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.47 7.58h7.98l-6.46 4.69 2.47 7.58L12 17.66l-6.46 4.69 2.47-7.58-6.46-4.69h7.98L12 2.5z" />
    </svg>
  )
}

function GallDialogShell({ ariaLabelledBy, children, onClose, open }) {
  useEffect(() => {
    if (!open) return
    const onEsc = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose, open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
    >
      <button type="button" className="absolute inset-0 cursor-default" aria-label="배경 닫기" onClick={onClose} />
      <div className="relative z-[101] w-full max-w-[420px] border-2 border-[#2f3d8f] bg-white shadow-lg">{children}</div>
    </div>
  )
}

function GallSilbeRecommendConfirmModal({ isSubmitting, onClose, onConfirm, open, postTitle }) {
  return (
    <GallDialogShell ariaLabelledBy="gall-silbe-confirm-title" onClose={onClose} open={open}>
      <div className="border-b border-[#e0e0e0] px-4 py-3">
        <h2 id="gall-silbe-confirm-title" className="text-[15px] font-bold text-[#333]">
          실베추천
        </h2>
      </div>
      <div className="px-4 py-5 text-[13px] leading-6 text-[#444]">
        <p>이 글을 실시간 베스트에 추천하시겠습니까?</p>
        {postTitle ? (
          <p className="mt-3 rounded border border-[#ececec] bg-[#fafafa] px-3 py-2 text-[12px] text-[#666]">
            {postTitle}
          </p>
        ) : null}
      </div>
      <div className="flex justify-end gap-2 border-t border-[#ececec] px-4 py-3">
        <button
          type="button"
          className="h-[32px] min-w-[72px] rounded border border-[#cfcfcf] bg-white px-3 text-[13px] font-semibold text-[#444]"
          onClick={onClose}
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          type="button"
          className="h-[32px] min-w-[72px] rounded border border-[#2f3d8f] bg-[#3b4890] px-3 text-[13px] font-bold text-white disabled:opacity-60"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? '처리중' : '확인'}
        </button>
      </div>
    </GallDialogShell>
  )
}

function GallPostShareLinkModal({ isCopying, onClose, onCopy, open, shareUrl }) {
  return (
    <GallDialogShell ariaLabelledBy="gall-share-link-title" onClose={onClose} open={open}>
      <div className="flex items-center justify-between border-b border-[#e0e0e0] px-4 py-3">
        <h2 id="gall-share-link-title" className="text-[15px] font-bold text-[#333]">
          공유
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center border border-[#2f3d8f] bg-[#2f3d8f] text-[18px] leading-none text-white hover:bg-[#26327a]"
          aria-label="닫기"
        >
          ×
        </button>
      </div>
      <div className="px-4 py-5">
        <p className="mb-3 text-[13px] text-[#666]">아래 링크를 복사해 공유할 수 있습니다.</p>
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="h-[36px] w-full rounded border border-[#d6d6d6] bg-[#fafafa] px-2 text-[12px] text-[#333] outline-none"
          onFocus={(event) => event.target.select()}
        />
      </div>
      <div className="flex justify-end gap-2 border-t border-[#ececec] px-4 py-3">
        <button
          type="button"
          className="h-[32px] min-w-[72px] rounded border border-[#cfcfcf] bg-white px-3 text-[13px] font-semibold text-[#444]"
          onClick={onClose}
          disabled={isCopying}
        >
          닫기
        </button>
        <button
          type="button"
          className="h-[32px] min-w-[88px] rounded border border-[#2f3d8f] bg-[#3b4890] px-3 text-[13px] font-bold text-white disabled:opacity-60"
          onClick={onCopy}
          disabled={isCopying || !shareUrl}
        >
          {isCopying ? '복사중' : '링크 복사'}
        </button>
      </div>
    </GallDialogShell>
  )
}

export function GallPostEngagementPanel({
  hasRecommended,
  hasSilbeRecommended,
  isAuthed,
  isRecommending,
  isSilbeRecommending,
  onConceptRecommend,
  onSilbeLoginRequired,
  onSilbeRecommend,
  postTitle,
  recommendCount,
  shareUrl,
}) {
  const [silbeConfirmOpen, setSilbeConfirmOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  function handleSilbeClick() {
    if (hasSilbeRecommended || isSilbeRecommending) return
    if (!isAuthed) {
      onSilbeLoginRequired?.()
      return
    }
    setSilbeConfirmOpen(true)
  }

  async function handleSilbeConfirm() {
    try {
      await onSilbeRecommend?.()
      setSilbeConfirmOpen(false)
    } catch {
      // Parent shows error toast; keep dialog open for retry.
    }
  }

  async function handleCopyLink() {
    if (!shareUrl || isCopying) return
    setIsCopying(true)
    try {
      await copyPostLinkToClipboard(shareUrl)
      toast.success('링크가 클립보드에 복사되었습니다.')
    } catch (err) {
      toast.error(err?.message || '링크 복사에 실패했습니다.')
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <>
      <div className="mx-auto mt-4 w-full max-w-[420px] border border-[#d8d8d8] bg-white">
        <div className="flex items-center justify-center gap-8 border-b border-[#e5e5e5] px-4 py-4">
          <div className="flex flex-col items-center leading-none">
            <span className="text-[28px] font-bold text-[#e53935]">{recommendCount ?? 0}</span>
            <span className="mt-1 text-[18px] font-semibold text-[#666]">0</span>
          </div>
          <button
            type="button"
            className="inline-flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-[#2f4aa0] text-white disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onConceptRecommend}
            disabled={hasRecommended || isRecommending}
            title={hasRecommended ? '이미 추천한 글입니다.' : '개념글 추천'}
          >
            <ConceptStarIcon />
            <span className="mt-1 text-[13px] font-bold">{isRecommending ? '처리중' : '개념'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 divide-x divide-[#e5e5e5]">
          <button
            type="button"
            className="flex h-[42px] items-center justify-center gap-1.5 text-[13px] font-semibold text-[#444] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSilbeClick}
            disabled={hasSilbeRecommended || isSilbeRecommending}
            title={hasSilbeRecommended ? '이미 실베추천한 글입니다.' : '실베추천'}
          >
            <SilbeIcon />
            <span>{isSilbeRecommending ? '처리중' : '실베추천'}</span>
          </button>
          <button
            type="button"
            className="flex h-[42px] items-center justify-center gap-1.5 text-[13px] font-semibold text-[#444] hover:bg-[#fafafa]"
            onClick={() => setShareDialogOpen(true)}
          >
            <ShareIcon />
            <span>공유</span>
          </button>
        </div>
      </div>

      <GallSilbeRecommendConfirmModal
        isSubmitting={isSilbeRecommending}
        onClose={() => {
          if (!isSilbeRecommending) setSilbeConfirmOpen(false)
        }}
        onConfirm={handleSilbeConfirm}
        open={silbeConfirmOpen}
        postTitle={postTitle}
      />

      <GallPostShareLinkModal
        isCopying={isCopying}
        onClose={() => {
          if (!isCopying) setShareDialogOpen(false)
        }}
        onCopy={handleCopyLink}
        open={shareDialogOpen}
        shareUrl={shareUrl}
      />
    </>
  )
}
