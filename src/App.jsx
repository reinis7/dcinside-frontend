import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { WwwRoutes } from './routes/wwwRoutes'
import { SignRoutes } from './routes/signRoutes'
import { GallRoutes } from './routes/gallRoutes'
import { GallogRoutes } from './routes/gallogRoutes'
import { SearchRoutes } from './routes/searchRoutes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/www" replace />} />
        <Route path="/www/*" element={<WwwRoutes />} />
        <Route path="/gall/*" element={<GallRoutes />} />
        <Route path="/gallog/*" element={<GallogRoutes />} />
        <Route path="/search/*" element={<SearchRoutes />} />
        <Route path="/sign/*" element={<SignRoutes />} />
        <Route path="*" element={<Navigate to="/www" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
