export function ThumbStrip({ items }) {
  return (
    <div className="grid grid-cols-5 gap-1">
      {items.map((it) => (
        <a
          key={it.id}
          href={it.href}
          className="group relative block overflow-hidden rounded border border-[#d3d3d3] bg-white"
        >
          <img src={it.thumb} alt="" className="h-[64px] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1 py-0.5 text-[11px] leading-tight text-white">
            <span className="block truncate">{it.title}</span>
          </div>
          <div className="absolute inset-0 ring-0 ring-[#2f3d8f] transition group-hover:ring-2" />
        </a>
      ))}
    </div>
  )
}

