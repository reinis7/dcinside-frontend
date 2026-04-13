export function RankListItem({ color, item, showTag, showDelta }) {
  const badgeBg =
    color === 'blue' ? 'bg-[#4b53a7]' : color === 'green' ? 'bg-[#2fa40e]' : 'bg-[#f07600]'
  const delta =
    item.deltaDir === 'same'
      ? '-'
      : item.deltaDir === 'up'
        ? (
            <span className="inline-flex items-center gap-0.5 text-[#d31900]">
              <span>{item.delta}</span>
              <span className="text-[10px] leading-none">▲</span>
            </span>
          )
        : (
            <span className="inline-flex items-center gap-0.5 text-[#3b4890]">
              <span>{item.delta}</span>
              <span className="text-[10px] leading-none">▼</span>
            </span>
          )

  return (
    <li className="flex items-center justify-between gap-2 py-1 text-[12px]">
      <a href={item.href} className="flex min-w-0 flex-1 items-center gap-2 hover:underline">
        <span
          className={`inline-flex h-[16px] w-[16px] items-center justify-center ${badgeBg} text-[11px] font-bold text-white`}
        >
          {item.rank}
        </span>
        <span className="min-w-0 truncate text-[#333]">{item.name}</span>
        {showTag ? <span className="shrink-0 text-[11px] text-[#999]">{item.tag}</span> : null}
      </a>
      {showDelta ? <span className="shrink-0 text-[11px] text-[#666]">{delta}</span> : null}
    </li>
  )
}

