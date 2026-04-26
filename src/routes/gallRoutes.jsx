import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { GallHomePage } from '../pages/gall/GallHomePage'
import { GallMinorIndexPage } from '../pages/gall/GallMinorIndexPage'
import { GallMiniIndexPage } from '../pages/gall/GallMiniIndexPage'
import { GallPersonIndexPage } from '../pages/gall/GallPersonIndexPage'
import { GallCreateStubPage } from '../pages/gall/GallCreateStubPage'
import { GallBoardViewPage } from '../pages/gall/GallBoardViewPage'
import { RequireAuth } from '../auth/RequireAuth'

function GallLayout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#333]">
      <header className="border-b border-[#d3d3d3] bg-white">
        <div className="mx-auto flex h-[58px] w-[1050px] items-center justify-between px-1">
          <Link to="/www" className="block">
            <img
              src="/snapshot/nstatic.dcinside.com/dc/w/images/dcin_logo.png"
              alt="dcinside"
              className="h-[28px] w-auto"
            />
          </Link>

          <nav className="flex items-center gap-3 text-[12px] text-[#666]">
            <Link to="/gall" className="hover:underline">
              갤러리
            </Link>
            <span>|</span>
            <Link to="/gall/m" className="hover:underline">
              마이너갤
            </Link>
            <span>|</span>
            <Link to="/gall/n" className="hover:underline">
              미니갤
            </Link>
            <span>|</span>
            <Link to="/gall/p" className="hover:underline">
              인물갤
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-[1050px] px-1 py-3 text-[12px]">{children}</main>
    </div>
  )
}

export function GallRoutes() {
  return (
    <GallLayout>
      <Routes>
        <Route index element={<GallHomePage />} />
        <Route path="create" element={<RequireAuth cancelTo="/gall"><GallCreateStubPage /></RequireAuth>} />
        <Route path="m" element={<GallMinorIndexPage />} />
        <Route path="m/create" element={<RequireAuth cancelTo="/gall/m"><GallCreateStubPage /></RequireAuth>} />
        <Route path="n" element={<GallMiniIndexPage />} />
        <Route path="n/create" element={<RequireAuth cancelTo="/gall/n"><GallCreateStubPage /></RequireAuth>} />
        <Route path="p" element={<GallPersonIndexPage />} />
        <Route path="p/create" element={<RequireAuth cancelTo="/gall/p"><GallCreateStubPage /></RequireAuth>} />
        <Route path="board/view" element={<GallBoardViewPage />} />
        <Route path="*" element={<Navigate to="/gall" replace />} />
      </Routes>
    </GallLayout>
  )
}

