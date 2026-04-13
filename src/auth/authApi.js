import { gql } from '@apollo/client/core'
import { apolloClient } from '../apollo/apolloClient'
import {
  clearTokens,
  getRefreshToken,
  isAccessTokenValid,
  saveTokensFromAuthPayload,
} from './jwtStorage'

export async function fetchViewer({ signal } = {}) {
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
  const { data } = await apolloClient.query({
    query,
    fetchPolicy: 'network-only',
    context: { fetchOptions: { signal } },
  })
  return data
}

export async function refreshSession({ signal } = {}) {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

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

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { refreshToken } },
    context: { skipAuth: true, fetchOptions: { signal } },
  })

  const payload = data?.dcinsideRefreshToken
  if (payload?.authToken && payload?.refreshToken) {
    saveTokensFromAuthPayload(payload)
  } else {
    clearTokens()
  }
  return data
}

/** 앱 부트·viewer 전에 호출: 액세스 없거나 곧 만료면 refresh */
export async function ensureValidAccessToken({ signal } = {}) {
  if (isAccessTokenValid()) return true
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearTokens()
    return false
  }
  try {
    await refreshSession({ signal })
    return isAccessTokenValid()
  } catch {
    clearTokens()
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
    clearTokens()
    throw new Error('로그인 응답에 토큰이 없습니다.')
  }
  return data
}

/** 서버 로그아웃 없음 — 로컬 JWT만 제거 */
export function logout() {
  clearTokens()
}
