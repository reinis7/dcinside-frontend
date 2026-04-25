import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

function titleFromPath(pathname) {
  if (pathname === '/gall/create') return '갤러리 만들기'
  if (pathname === '/gall/m/create') return '마이너 갤러리 만들기'
  if (pathname === '/gall/n/create') return '미니 갤러리 만들기'
  if (pathname === '/gall/p/create') return '인물 갤러리 만들기'
  return '갤러리 만들기'
}

function backToFromPath(pathname) {
  if (pathname === '/gall/m/create') return '/gall/m'
  if (pathname === '/gall/n/create') return '/gall/n'
  if (pathname === '/gall/p/create') return '/gall/p'
  return '/gall'
}

export function GallCreateStubPage() {
  const loc = useLocation()
  const title = useMemo(() => titleFromPath(loc.pathname), [loc.pathname])
  const backTo = useMemo(() => backToFromPath(loc.pathname), [loc.pathname])

  return (
    <section className="rounded border border-[#d3d3d3] bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-[16px] font-semibold">{title}</div>
        <Link to={backTo} className="text-[12px] text-[#334499] hover:underline">
          돌아가기
        </Link>
      </div>
      <div className="mt-3 text-[12px] text-[#666]">기초 틀만 남겨둔 상태입니다. (다시 설계 후 구현 예정)</div>
    </section>
  )
}

