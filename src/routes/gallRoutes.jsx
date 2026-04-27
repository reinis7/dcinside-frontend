import { Navigate, Route, Routes } from 'react-router-dom'
import { GallHomePage } from '../pages/gall/GallHomePage'
import { GallMinorIndexPage } from '../pages/gall/GallMinorIndexPage'
import { GallMiniIndexPage } from '../pages/gall/GallMiniIndexPage'
import { GallPersonIndexPage } from '../pages/gall/GallPersonIndexPage'
import { GallCreateStubPage } from '../pages/gall/GallCreateStubPage'
import { GallBoardViewPage } from '../pages/gall/GallBoardViewPage'
import { GallMinorBoardListPage } from '../pages/gall/GallMinorBoardListPage'
import { RequireAuth } from '../auth/RequireAuth'
import { Header } from '../components/common/Header'

function GallLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#333]">
      <Header />

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
        <Route path="mgallery/board/lists" element={<GallMinorBoardListPage />} />
        <Route path="board/view" element={<GallBoardViewPage />} />
        <Route path="*" element={<Navigate to="/gall" replace />} />
      </Routes>
    </GallLayout>
  )
}

