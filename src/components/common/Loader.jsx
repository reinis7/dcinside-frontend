export function InlineLoader({ label = '불러오는 중...' }) {
  return (
    <span className="inline-flex items-center gap-2 text-[12px] text-[#666]">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#cfcfcf] border-t-[#3b4890]" aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}

export function BlockLoader({ label = '불러오는 중...' }) {
  return (
    <div className="flex items-center justify-center rounded border border-[#d3d3d3] bg-white px-4 py-10 text-[12px] text-[#666]">
      <InlineLoader label={label} />
    </div>
  )
}

