import { useMemo, useState } from 'react'
import { buildWwwHomeMock } from '../../mocks/wwwHomeMock'

function formatNumber(n) {
  return n.toLocaleString('ko-KR')
}

function MiniPager({ valueText, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-1">
      <span className="mr-1 text-[11px] text-[#333]">{valueText}</span>
      <button
        type="button"
        className="h-[16px] w-[18px] border border-[#2f3d8f] bg-[#3b4890] text-[10px] font-bold leading-[14px] text-white"
        onClick={onPrev}
      >
        ◀
      </button>
      <button
        type="button"
        className="h-[16px] w-[18px] border border-[#2f3d8f] bg-[#3b4890] text-[10px] font-bold leading-[14px] text-white"
        onClick={onNext}
      >
        ▶
      </button>
    </div>
  )
}

function ThumbStrip({ items }) {
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

function Pager({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-center gap-3 text-[12px] text-[#666]">
      <button
        type="button"
        className="rounded border border-[#cfcfcf] bg-white px-2 py-0.5 hover:bg-[#f6f6f6]"
        onClick={onPrev}
        disabled={page <= 1}
      >
        이전
      </button>
      <span>
        <span className="font-bold text-[#333]">{page}</span>/{totalPages}
      </span>
      <button
        type="button"
        className="rounded border border-[#cfcfcf] bg-white px-2 py-0.5 hover:bg-[#f6f6f6]"
        onClick={onNext}
        disabled={page >= totalPages}
      >
        다음
      </button>
    </div>
  )
}

function RankPager({ page, totalPages, onChange }) {
  const startRank = (page - 1) * 10 + 1
  const endRank = Math.min(page * 10, totalPages * 10)
  return (
    <div className="flex items-center justify-between text-[12px] text-[#666]">
      <button
        type="button"
        className="rounded border border-[#cfcfcf] bg-white px-2 py-0.5 hover:bg-[#f6f6f6]"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        ‹
      </button>
      <span>
        {startRank}-{endRank}
      </span>
      <button
        type="button"
        className="rounded border border-[#cfcfcf] bg-white px-2 py-0.5 hover:bg-[#f6f6f6]"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        ›
      </button>
    </div>
  )
}

function RankListItem({ color, item, showTag, showDelta }) {
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
        <span className={`inline-flex h-[16px] w-[16px] items-center justify-center ${badgeBg} text-[11px] font-bold text-white`}>
          {item.rank}
        </span>
        <span className="min-w-0 truncate text-[#333]">{item.name}</span>
        {showTag ? <span className="shrink-0 text-[11px] text-[#999]">{item.tag}</span> : null}
      </a>
      {showDelta ? <span className="shrink-0 text-[11px] text-[#666]">{delta}</span> : null}
    </li>
  )
}

export function WwwHomePage() {
  const data = useMemo(() => buildWwwHomeMock({ seed: 20260413 }), [])

  const [rtbPage, setRtbPage] = useState(1)
  const rtbPageSize = 20
  const rtbTotalPages = Math.ceil(data.realtimeBest.length / rtbPageSize)
  const rtbItems = useMemo(() => {
    const start = (rtbPage - 1) * rtbPageSize
    return data.realtimeBest.slice(start, start + rtbPageSize)
  }, [data.realtimeBest, rtbPage])

  const [conceptTab, setConceptTab] = useState(data.conceptCategories[0]?.id ?? 'game')
  const [conceptPage, setConceptPage] = useState(1)
  const conceptPageSize = 12
  const conceptAll = useMemo(() => data.conceptPostsByCategory[conceptTab] ?? [], [data, conceptTab])
  const conceptTotalPages = Math.max(1, Math.ceil(conceptAll.length / conceptPageSize))
  const conceptItems = useMemo(() => {
    const start = (conceptPage - 1) * conceptPageSize
    return conceptAll.slice(start, start + conceptPageSize)
  }, [conceptAll, conceptPage])

  const [rankSection, setRankSection] = useState('silbuk') // silbuk | hot | new
  const [rankTab, setRankTab] = useState('main') // main | minor | mini | person
  const [rankPage, setRankPage] = useState(1) // 1 => 1-10, 2 => 11-20 ...
  const rankAll = useMemo(() => data.rankings?.[rankSection]?.[rankTab] ?? [], [data, rankSection, rankTab])
  const rankTotalPages = Math.max(1, Math.ceil(rankAll.length / 10))
  const rankItems = useMemo(() => {
    const start = (rankPage - 1) * 10
    return rankAll.slice(start, start + 10)
  }, [rankAll, rankPage])

  // Right: independent states per box (to match screenshot behavior)
  const [silTab, setSilTab] = useState('main')
  const [silPage, setSilPage] = useState(2) // screenshot shows 11-20
  const silAll = useMemo(() => data.rankings?.silbuk?.[silTab] ?? [], [data, silTab])
  const silTotalPages = Math.max(1, Math.ceil(silAll.length / 10))
  const silItems = useMemo(() => silAll.slice((silPage - 1) * 10, silPage * 10), [silAll, silPage])

  const [hotTab, setHotTab] = useState('person') // screenshot has 인물 강조 느낌
  const [hotPage, setHotPage] = useState(1)
  const hotAll = useMemo(() => data.rankings?.hot?.[hotTab] ?? [], [data, hotTab])
  const hotTotalPages = Math.max(1, Math.ceil(hotAll.length / 10))
  const hotItems = useMemo(() => hotAll.slice((hotPage - 1) * 10, hotPage * 10), [hotAll, hotPage])

  const [newTab, setNewTab] = useState('minor')
  const [newPage, setNewPage] = useState(1)
  const newAll = useMemo(() => data.rankings?.new?.[newTab] ?? [], [data, newTab])
  const newTotalPages = Math.max(1, Math.ceil(newAll.length / 10))
  const newItems = useMemo(() => newAll.slice((newPage - 1) * 10, newPage * 10), [newAll, newPage])

  const [mediaPage, setMediaPage] = useState(1)
  const mediaTotalPages = 2
  const mediaSlice = useMemo(() => data.media.slice((mediaPage - 1) * 4, (mediaPage - 1) * 4 + 4), [data.media, mediaPage])

  const [issuePage, setIssuePage] = useState(1)
  const issueTotalPages = 2
  const issueSlice = useMemo(() => data.dcissue.slice((issuePage - 1) * 5, (issuePage - 1) * 5 + 5), [data.dcissue, issuePage])

  return (
    <section>
      <div className="mb-2 text-[11px] text-[#666]">
        어제 <span className="font-bold underline">{formatNumber(data.stats.yesterdayPosts)}개</span> 게시글 등록 / 어제{' '}
        <span className="font-bold underline">{formatNumber(data.stats.yesterdayComments)}개</span> 댓글 등록 / 총 갤러리 수{' '}
        <span className="font-bold underline">{formatNumber(data.stats.totalGalleries)}개</span>
      </div>

      <div className="grid grid-cols-[728px_300px] gap-[22px]">
        <div className="grid gap-4">
          <div className="border border-[#d3d3d3] bg-white">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-bold text-[#273589]">실시간 베스트</h2>
                <span className="text-[11px] font-bold text-[#3b4890]">실베라이트</span>
              </div>
              <Pager
                page={rtbPage}
                totalPages={rtbTotalPages}
                onPrev={() => setRtbPage((p) => Math.max(1, p - 1))}
                onNext={() => setRtbPage((p) => Math.min(rtbTotalPages, p + 1))}
              />
            </div>
            <div className="border-t border-[#d3d3d3] px-3 py-2">
              <ThumbStrip items={rtbItems.slice(0, 5)} />
            </div>

            <ul className="border-t border-[#d3d3d3]">
              {rtbItems.map((it) => (
                <li
                  key={it.id}
                  className="grid grid-cols-[46px_1fr_62px] items-center gap-2 border-b border-[#ededed] px-3 py-1.5 last:border-b-0"
                >
                  <img
                    src={it.thumb}
                    alt=""
                    className="h-[38px] w-[46px] rounded border border-[#e5e5e5] bg-white object-cover"
                  />
                  <a href={it.href} className="min-w-0 truncate text-[12px] text-[#333] hover:underline">
                    {it.title}{' '}
                    {it.commentCount > 0 ? <span className="font-bold text-[#d31900]">[{it.commentCount}]</span> : null}
                  </a>
                  <div className="text-right text-[11px] text-[#999]">{it.time}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded border border-[#d3d3d3] bg-white">
            <div className="flex items-end justify-between px-4 pt-4">
              <h2 className="text-[16px] font-bold text-[#273589]">개념글</h2>
              <Pager
                page={conceptPage}
                totalPages={conceptTotalPages}
                onPrev={() => setConceptPage((p) => Math.max(1, p - 1))}
                onNext={() => setConceptPage((p) => Math.min(conceptTotalPages, p + 1))}
              />
            </div>

            <div className="mt-3 border-t border-[#d3d3d3] px-4">
              <div className="flex gap-1 pt-3 text-[13px]">
                {data.conceptCategories.map((t) => {
                  const active = t.id === conceptTab
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={[
                        'h-[28px] rounded-sm border px-3',
                        active
                          ? 'border-[#273589] bg-[#273589] font-bold text-white'
                          : 'border-[#cfcfcf] bg-white text-[#333] hover:bg-[#f6f6f6]',
                      ].join(' ')}
                      onClick={() => {
                        setConceptTab(t.id)
                        setConceptPage(1)
                      }}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>

              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 pb-4 text-[13px]">
                {conceptItems.map((it) => (
                  <li key={it.id} className="flex min-w-0 items-center gap-2">
                    <span className="w-[110px] shrink-0 truncate text-[#666]">{it.gallery}</span>
                    <a href={it.href} className="min-w-0 flex-1 truncate text-[#333] hover:underline">
                      {it.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="grid gap-3">
          {/* Login box */}
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

          {/* 실북갤 */}
          <div className="border border-[#d3d3d3] bg-white">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-[13px] font-bold text-[#333]">실북갤</div>
              <div className="flex items-center gap-2 text-[12px]">
                {[
                  { id: 'main', label: '메인' },
                  { id: 'minor', label: '마이너' },
                  { id: 'mini', label: '미니' },
                  { id: 'person', label: '인물' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={t.id === silTab ? 'font-bold text-[#6a5acd] underline' : 'text-[#333]'}
                    onClick={() => {
                      setSilTab(t.id)
                      setSilPage(2)
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-[#d3d3d3] px-3">
              <ol className="py-1">
                {silItems.map((it) => (
                  <RankListItem key={it.id} color="blue" item={it} showTag={false} showDelta />
                ))}
              </ol>
            </div>
            <div className="flex items-center justify-end border-t border-[#d3d3d3] px-3 py-1 text-[11px] text-[#666]">
              <button
                type="button"
                className="hover:underline"
                onClick={() => setSilPage((p) => Math.min(silTotalPages, p + 1))}
              >
                {(silPage - 1) * 10 + 1}위 - {silPage * 10}위
              </button>
            </div>
          </div>

          {/* HOT 흥한갤 */}
          <div className="border border-[#d3d3d3] bg-white">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-[13px] font-bold">
                <span className="text-[#d31900]">HOT</span> <span className="text-[#333]">흥한갤</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                {[
                  { id: 'main', label: '메인' },
                  { id: 'minor', label: '마이너' },
                  { id: 'mini', label: '미니' },
                  { id: 'person', label: '인물' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={t.id === hotTab ? 'font-bold text-[#2fa40e] underline' : 'text-[#333]'}
                    onClick={() => {
                      setHotTab(t.id)
                      setHotPage(1)
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-[#d3d3d3] px-3">
              <ol className="py-1">
                {hotItems.map((it) => (
                  <RankListItem key={it.id} color="green" item={it} showTag showDelta={false} />
                ))}
              </ol>
            </div>
            <div className="flex items-center justify-between border-t border-[#d3d3d3] px-3 py-1 text-[11px] text-[#666]">
              <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                전체 순위
              </a>
              <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                11위 - 20위
              </a>
            </div>
          </div>

          {/* 광고(스크린샷의 큰 배너 영역) */}
          <div className="h-[160px] border border-[#d3d3d3] bg-white">
            <div className="h-full w-full bg-[linear-gradient(135deg,#e7f4da_0%,#f4f7e4_45%,#eaf3db_100%)]" />
          </div>

          {/* NEW 신설갤 */}
          <div className="border border-[#d3d3d3] bg-white">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-[13px] font-bold">
                <span className="text-[#f07600]">NEW</span> <span className="text-[#333]">신설갤</span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                {[
                  { id: 'main', label: '메인' },
                  { id: 'minor', label: '마이너' },
                  { id: 'mini', label: '미니' },
                  { id: 'person', label: '인물' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={t.id === newTab ? 'font-bold text-[#f07600] underline' : 'text-[#333]'}
                    onClick={() => {
                      setNewTab(t.id)
                      setNewPage(1)
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-[#d3d3d3] px-3 py-2 text-[12px] leading-[20px] text-[#333]">
              {newItems.map((it) => (
                <a key={it.id} href={it.href} className="block truncate hover:underline">
                  {it.name}
                </a>
              ))}
            </div>
            <div className="flex items-center justify-end border-t border-[#d3d3d3] px-3 py-1">
              <MiniPager
                valueText={`${newPage}/${newTotalPages}`}
                onPrev={() => setNewPage((p) => Math.max(1, p - 1))}
                onNext={() => setNewPage((p) => Math.min(newTotalPages, p + 1))}
              />
            </div>
          </div>

          {/* 디시미디어 */}
          <div className="border border-[#d3d3d3] bg-white">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-[13px] font-bold text-[#333]">디시미디어</div>
              <MiniPager
                valueText={`${mediaPage}/${mediaTotalPages}`}
                onPrev={() => setMediaPage((p) => Math.max(1, p - 1))}
                onNext={() => setMediaPage((p) => Math.min(mediaTotalPages, p + 1))}
              />
            </div>
            <div className="border-t border-[#d3d3d3] px-3 py-2">
              <div className="grid grid-cols-2 gap-2">
                {mediaSlice.slice(0, 2).map((it) => (
                  <a key={it.id} href={it.href} className="block">
                    <img src={it.thumb} alt="" className="h-[70px] w-full border border-[#d3d3d3] object-cover" />
                    <div className="mt-1 truncate text-[12px] text-[#333] hover:underline">{it.title}</div>
                  </a>
                ))}
              </div>
              <div className="mt-2 grid gap-1 text-[12px] text-[#333]">
                {mediaSlice.slice(2, 4).map((it, idx) => (
                  <a key={it.id} href={it.href} className="truncate hover:underline">
                    <span className="mr-1 font-bold text-[#3b4890]">{idx + 1}</span>
                    {it.title}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 디시이슈 dcissue */}
          <div className="border border-[#d3d3d3] bg-white">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-end gap-2">
                <div className="text-[13px] font-bold text-[#333]">디시이슈</div>
                <div className="text-[14px] font-black italic text-[#555]">dcissue</div>
              </div>
              <MiniPager
                valueText={`${issuePage}/${issueTotalPages}`}
                onPrev={() => setIssuePage((p) => Math.max(1, p - 1))}
                onNext={() => setIssuePage((p) => Math.min(issueTotalPages, p + 1))}
              />
            </div>
            <div className="border-t border-[#d3d3d3] px-3 py-2">
              <div className="grid grid-cols-2 gap-2">
                {issueSlice.slice(0, 2).map((it, idx) => (
                  <a key={it.id} href={it.href} className="block">
                    <img src={it.thumb} alt="" className="h-[70px] w-full border border-[#d3d3d3] object-cover" />
                    <div className="mt-1 truncate text-[12px] text-[#333] hover:underline">
                      <span className="mr-1 font-bold text-[#3b4890]">{idx + 1}</span>
                      {it.title}
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-2 grid gap-1 text-[12px] text-[#333]">
                {issueSlice.slice(2, 5).map((it, idx) => (
                  <a key={it.id} href={it.href} className="truncate hover:underline">
                    <span className="mr-1 font-bold text-[#3b4890]">{idx + 3}</span>
                    {it.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
