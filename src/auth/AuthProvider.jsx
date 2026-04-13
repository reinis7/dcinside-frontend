import { useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from './authApi'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [viewer, setViewer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadViewer = useCallback(async () => {
    setIsLoading(true)
    try {
      const ok = await authApi.ensureValidAccessToken()
      if (!ok) {
        setViewer(null)
        return
      }
      const data = await authApi.fetchViewer()
      setViewer(data?.viewer ?? null)
    } catch {
      setViewer(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadViewer()
  }, [loadViewer])

  const login = useCallback(async ({ userId, password }) => {
    const data = await authApi.login({ userId, password })
    const user = data?.login?.user ?? null
    if (user) setViewer(user)
    else await loadViewer()
    return data
  }, [loadViewer])

  const logout = useCallback(() => {
    authApi.logout()
    setViewer(null)
  }, [])

  const value = useMemo(
    () => ({
      viewer,
      isLoading,
      isAuthed: Boolean(viewer),
      loadViewer,
      login,
      logout,
    }),
    [viewer, isLoading, loadViewer, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
