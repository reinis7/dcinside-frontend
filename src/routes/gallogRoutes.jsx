import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { GallogPostingPage } from '../pages/gallog/GallogPostingPage'
import { GallogSimpleSectionPage } from '../pages/gallog/GallogSimpleSectionPage'

function RedirectGallogUserToPosting() {
  const { userId = '' } = useParams()
  return <Navigate to={`/gallog/${encodeURIComponent(userId)}/posting/all`} replace />
}

function RedirectGallogPostingToMain() {
  const { userId = '' } = useParams()
  return <Navigate to={`/gallog/${encodeURIComponent(userId)}/posting/all`} replace />
}

export function GallogRoutes() {
  return (
    <Routes>
      <Route path=":userId" element={<RedirectGallogUserToPosting />} />
      <Route path=":userId/posting" element={<RedirectGallogPostingToMain />} />
      <Route path=":userId/posting/:galleryType" element={<GallogPostingPage />} />
      <Route path=":userId/comment" element={<GallogSimpleSectionPage sectionKey="comment" />} />
      <Route path=":userId/scrap" element={<GallogSimpleSectionPage sectionKey="scrap" />} />
      <Route path=":userId/guestbook" element={<GallogSimpleSectionPage sectionKey="guestbook" />} />
      <Route path="*" element={<Navigate to="/www" replace />} />
    </Routes>
  )
}

