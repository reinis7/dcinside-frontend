import { gql } from '@apollo/client/core'
import { apolloClient } from '../apollo/apolloClient'
import {
  clearTokens,
  getRefreshToken,
  hasRenewableStoredSession,
  isRefreshTokenValid,
  saveTokensFromAuthPayload,
} from './jwtStorage'

const sessionInvalidationListeners = new Set()

/**
 * 로컬 세션 제거 시 호출 (만료·리프레시 실패 등). AuthProvider가 viewer·캐시 정리에 구독합니다.
 * @param {(detail: { reason: 'logout' | 'invalidated' }) => void} listener
 */
export function subscribeSessionInvalidation(listener) {
  sessionInvalidationListeners.add(listener)
  return () => sessionInvalidationListeners.delete(listener)
}

function invalidateSessionFromApi(reason = 'invalidated') {
  clearTokens()
  for (const fn of sessionInvalidationListeners) {
    try {
      fn({ reason })
    } catch {
      // ignore listener errors
    }
  }
}

/** 동시에 여러 요청이 만료 토큰을 감지해도 리프레시는 한 번만 실행 */
let refreshInFlight = null

function isUnauthError(err) {
  // Apollo v4: CombinedGraphQLErrors -> err.errors[]
  const gqlErrors = err?.errors ?? err?.graphQLErrors
  if (Array.isArray(gqlErrors)) {
    for (const e of gqlErrors) {
      const code = e?.extensions?.code
      if (code === 'UNAUTHENTICATED' || code === 'FORBIDDEN') return true
      const msg = e?.message
      if (typeof msg === 'string' && /unauth|unauthorized|권한|인증|로그인/i.test(msg)) return true
    }
  }

  const status =
    err?.statusCode ??
    err?.status ??
    err?.networkError?.statusCode ??
    err?.networkError?.status
  if (status === 401 || status === 403) return true

  return false
}

export async function fetchViewer({ signal } = {}) {
  // viewer는 인증 의존 쿼리이므로, 만료/401이면 1회 리프레시 후 재시도합니다.
  return fetchViewerOnce({ signal, allowRefreshRetry: true })
}

async function fetchViewerOnce({ signal, allowRefreshRetry }) {
  const query = gql`
    query Viewer {
      viewer {
        id
        databaseId
        username
        name
      }
    }
  `
  try {
    const { data } = await apolloClient.query({
      query,
      fetchPolicy: 'network-only',
      context: { fetchOptions: { signal } },
    })
    return data
  } catch (err) {
    if (!allowRefreshRetry) {
      if (isUnauthError(err)) invalidateSessionFromApi()
      throw err
    }
    if (!isUnauthError(err)) throw err
    if (!getRefreshToken()) {
      invalidateSessionFromApi()
      throw err
    }

    await refreshSession({ signal })
    return await fetchViewerOnce({ signal, allowRefreshRetry: false })
  }
}

export async function refreshSession({ signal } = {}) {
  if (refreshInFlight) return refreshInFlight

  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  refreshInFlight = (async () => {
    const mutation = gql`
      mutation DcinsideRefresh($input: DCInsideRefreshTokenInput!) {
        dcinsideRefreshToken(input: $input) {
          authToken
          refreshToken
          authTokenExpiresAt
          refreshTokenExpiresAt
          user {
            id
            databaseId
          }
        }
      }
    `

    try {
      const { data } = await apolloClient.mutate({
        mutation,
        variables: { input: { refreshToken } },
        context: { skipAuth: true, fetchOptions: { signal } },
      })

      const payload = data?.dcinsideRefreshToken
      if (payload?.authToken && payload?.refreshToken) {
        saveTokensFromAuthPayload(payload)
      } else {
        invalidateSessionFromApi()
      }
      return data
    } catch (err) {
      invalidateSessionFromApi()
      throw err
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}

/** 앱 부트·viewer 전에 호출: 액세스 없거나 곧 만료면 refresh */
export async function ensureValidAccessToken({ signal } = {}) {
  if (hasRenewableStoredSession(0)) return true

  const refreshToken = getRefreshToken()
  if (!refreshToken || !isRefreshTokenValid(0)) {
    invalidateSessionFromApi()
    return false
  }
  try {
    await refreshSession({ signal })
    if (!hasRenewableStoredSession(0)) {
      invalidateSessionFromApi()
      return false
    }
    return true
  } catch {
    // refreshSession 실패 시 이미 invalidateSessionFromApi 호출됨
    return false
  }
}

export async function login({ userId, password, signal }) {
  const mutation = gql`
    mutation Login($username: String!, $password: String!) {
      login(input: { username: $username, password: $password }) {
        authToken
        refreshToken
        authTokenExpiresAt
        refreshTokenExpiresAt
        message
        user {
          id
          databaseId
          username
          name
        }
      }
    }
  `
  const { data } = await apolloClient.mutate({
    mutation,
    variables: { username: userId, password },
    context: { skipAuth: true, fetchOptions: { signal } },
  })

  const payload = data?.login
  if (payload?.authToken && payload?.refreshToken) {
    saveTokensFromAuthPayload(payload)
  } else if (payload?.user) {
    invalidateSessionFromApi()
    throw new Error('로그인 응답에 토큰이 없습니다.')
  }
  return data
}

/** 서버 로그아웃 없음 — 로컬 JWT만 제거 */
export function logout() {
  invalidateSessionFromApi('logout')
}
