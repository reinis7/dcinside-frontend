import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from '../components/common/Header'
import { DcFooter } from '../layout/DcFooter'
import { SearchQueryPage } from '../pages/search/SearchQueryPage'

export function SearchRoutes() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#333]">
      <Header />
      <main className="mx-auto w-[1050px] px-1 py-3 text-[12px]">
        <Routes>
          <Route path="q" element={<SearchQueryPage />} />
          <Route path="*" element={<Navigate to="/search/q" replace />} />
        </Routes>
      </main>
      <DcFooter />
    </div>
  )
}
