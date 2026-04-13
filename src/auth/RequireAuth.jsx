import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './authContext'

export function RequireAuth({ children }) {
  const { isLoading, isAuthed } = useAuth()
  const location = useLocation()

  if (isLoading) return null
  if (!isAuthed) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/sign/login?s_url=${next}`} replace />
  }
  return children
}

