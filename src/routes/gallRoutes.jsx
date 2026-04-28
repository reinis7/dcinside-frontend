import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { GallHomePage } from '../pages/gall/GallHomePage'
import { GallMinorIndexPage } from '../pages/gall/GallMinorIndexPage'
import { GallMiniIndexPage } from '../pages/gall/GallMiniIndexPage'
import { GallPersonIndexPage } from '../pages/gall/GallPersonIndexPage'
import { GallCreateStubPage } from '../pages/gall/GallCreateStubPage'
import { GallBoardViewPage } from '../pages/gall/GallBoardViewPage'
import { GallMainBoardListPage } from '../pages/gall/GallMainBoardListPage'
import { GallMinorBoardListPage } from '../pages/gall/GallMinorBoardListPage'
import { GallMinorBoardWritePage } from '../pages/gall/GallMinorBoardWritePage'
import { GallMainBoardWritePage } from '../pages/gall/GallMainBoardWritePage'
import { RequireAuth } from '../auth/RequireAuth'
import { Header } from '../components/common/Header'
import { DcFooter } from '../layout/DcFooter'

function GallLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#333]">
      <Header />

      <main className="mx-auto w-[1050px] px-1 py-3 text-[12px]">{children}</main>
      <DcFooter />
    </div>
  )
}

function RedirectNgalleryToMiniLists() {
  const loc = useLocation()
  return <Navigate to={`/gall/mini/board/lists${loc.search}`} replace />
}

function RedirectNgalleryToMiniWrite() {
  const loc = useLocation()
  return <Navigate to={`/gall/mini/board/write${loc.search}`} replace />
}

function RedirectNgalleryToMiniView() {
  const loc = useLocation()
  return <Navigate to={`/gall/mini/board/view${loc.search}`} replace />
}

function RedirectPersonToP() {
  const loc = useLocation()
  return <Navigate to={`/gall/p${loc.search}`} replace />
}

function RedirectPersonToPLists() {
  const loc = useLocation()
  return <Navigate to={`/gall/p/board/lists${loc.search}`} replace />
}

function RedirectPersonToPWrite() {
  const loc = useLocation()
  return <Navigate to={`/gall/p/board/write${loc.search}`} replace />
}

function RedirectPersonToPView() {
  const loc = useLocation()
  return <Navigate to={`/gall/p/board/view${loc.search}`} replace />
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
        <Route path="p/board/lists" element={<GallMinorBoardListPage />} />
        <Route path="p/board/write" element={<GallMinorBoardWritePage />} />
        <Route path="p/board/view" element={<GallBoardViewPage />} />
        <Route path="person" element={<RedirectPersonToP />} />
        <Route path="person/board/lists" element={<RedirectPersonToPLists />} />
        <Route path="person/board/write" element={<RedirectPersonToPWrite />} />
        <Route path="person/board/view" element={<RedirectPersonToPView />} />
        <Route path="mgallery/board/lists" element={<GallMinorBoardListPage />} />
        <Route path="mgallery/board/write" element={<GallMinorBoardWritePage />} />
        <Route path="mgallery/board/view" element={<GallBoardViewPage />} />
        <Route path="mini/board/lists" element={<GallMinorBoardListPage />} />
        <Route path="mini/board/write" element={<GallMinorBoardWritePage />} />
        <Route path="mini/board/view" element={<GallBoardViewPage />} />
        <Route path="ngallery/board/lists" element={<RedirectNgalleryToMiniLists />} />
        <Route path="ngallery/board/write" element={<RedirectNgalleryToMiniWrite />} />
        <Route path="ngallery/board/view" element={<RedirectNgalleryToMiniView />} />
        <Route path="board/lists" element={<GallMainBoardListPage />} />
        <Route path="board/write" element={<GallMainBoardWritePage />} />
        <Route path="board/view" element={<GallBoardViewPage />} />
        <Route path="*" element={<Navigate to="/gall" replace />} />
      </Routes>
    </GallLayout>
  )
}

