import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './authContext'

export function RequireAuth({ children, confirmMessage, cancelTo = '/www' }) {
  const { isLoading, isAuthed } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="rounded border border-[#d3d3d3] bg-white px-4 py-8 text-center text-[12px] text-[#666]">
        로그인 정보를 확인하는 중…
      </div>
    )
  }
  if (!isAuthed) {
    const next = encodeURIComponent(location.pathname + location.search)
    if (confirmMessage) {
      const ok = confirm(confirmMessage)
      if (!ok) return <Navigate to={cancelTo} replace />
    }
    return <Navigate to={`/sign/login?s_url=${next}`} replace />
  }
  return children
}

