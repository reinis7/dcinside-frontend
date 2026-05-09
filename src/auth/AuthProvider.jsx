import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { apolloClient } from '../apollo/apolloClient'
import * as authApi from './authApi'
import { AuthContext } from './authContext'
import { hasRenewableStoredSession } from './jwtStorage'

const VIEWER_STORAGE_KEY = 'dcinside.viewer'

function loadCachedViewer() {
  try {
    const raw = localStorage.getItem(VIEWER_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function saveCachedViewer(viewer) {
  try {
    if (!viewer) {
      localStorage.removeItem(VIEWER_STORAGE_KEY)
      return
    }
    localStorage.setItem(VIEWER_STORAGE_KEY, JSON.stringify(viewer))
  } catch {
    // ignore storage errors
  }
}

export function AuthProvider({ children }) {
  const initialHasValidToken = hasRenewableStoredSession(0)
  const [viewer, setViewer] = useState(() => (initialHasValidToken ? loadCachedViewer() : null))
  const [isLoading, setIsLoading] = useState(() => !(initialHasValidToken && Boolean(loadCachedViewer())))

  const loadViewer = useCallback(async () => {
    setIsLoading(true)
    try {
      const ok = await authApi.ensureValidAccessToken()
      if (!ok) {
        setViewer(null)
        saveCachedViewer(null)
        return
      }
      const data = await authApi.fetchViewer()
      const nextViewer = data?.viewer ?? null
      setViewer(nextViewer)
      saveCachedViewer(nextViewer)
    } catch {
      setViewer(null)
      saveCachedViewer(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // If we already have a valid token + cached viewer, trust localStorage
    // and skip server verification on app entry.
    if (initialHasValidToken && viewer) {
      setIsLoading(false)
      return
    }
    void loadViewer()
  }, [initialHasValidToken, loadViewer, viewer])

  /** 만료·리프레시 실패 등으로 토큰이 지워지면 로그아웃과 동일하게 UI·Apollo 캐시 정리 */
  useEffect(() => {
    return authApi.subscribeSessionInvalidation(({ reason }) => {
      setViewer(null)
      saveCachedViewer(null)
      void apolloClient.clearStore().catch(() => {})
      setIsLoading(false)
      if (reason !== 'logout') {
        toast.info('세션이 만료되어 로그아웃되었습니다.')
      }
    })
  }, [])

  // 다른 탭에서 로그인/로그아웃해도 현재 탭 UI를 즉시 동기화
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== 'dcinside.auth') return
      if (!e.newValue) {
        setViewer(null)
        saveCachedViewer(null)
        void apolloClient.clearStore().catch(() => {})
        return
      }
      const cachedViewer = loadCachedViewer()
      if (cachedViewer) setViewer(cachedViewer)
      void loadViewer()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [loadViewer])

  const login = useCallback(async ({ userId, password }) => {
    const data = await authApi.login({ userId, password })
    const user = data?.login?.user ?? null
    if (user) {
      setViewer(user)
      saveCachedViewer(user)
    }
    else await loadViewer()
    return data
  }, [loadViewer])

  const logout = useCallback(() => {
    try {
      for (const k of Object.keys(sessionStorage)) {
        if (k.startsWith('dcinside.myinfo.modify.')) sessionStorage.removeItem(k)
      }
    } catch {
      // ignore
    }
    authApi.logout()
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
