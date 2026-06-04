import { ensureValidAccessToken } from '../auth/authApi'
import { getAuthorizationHeader } from '../auth/jwtStorage'

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '')
}

export function getWordpressRestBaseUri() {
  const fromEnv = import.meta.env.VITE_WORDPRESS_REST_URI?.trim()
  if (fromEnv) return trimTrailingSlash(fromEnv)

  const graphqlUri = import.meta.env.VITE_GRAPHQL_URI?.trim() || '/graphql'
  if (graphqlUri.startsWith('/')) return '/wp-json/wp/v2'

  try {
    const url = new URL(graphqlUri)
    return `${url.origin}/wp-json/wp/v2`
  } catch {
    return '/wp-json/wp/v2'
  }
}

export function buildWordpressRestUrl(path, params) {
  const normalizedPath = String(path || '').startsWith('/') ? path : `/${path}`
  const url = `${getWordpressRestBaseUri()}${normalizedPath}`
  if (!params) return url

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') continue
    if (Array.isArray(value)) searchParams.set(key, value.join(','))
    else searchParams.set(key, String(value))
  }
  const query = searchParams.toString()
  return query ? `${url}?${query}` : url
}

export async function wordpressRestRequest(path, { auth = false, body, headers, method = 'GET', params } = {}) {
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (auth) {
    const hasValidAccess = await ensureValidAccessToken()
    if (!hasValidAccess) throw new Error('로그인이 필요합니다.')

    const authHeader = getAuthorizationHeader()
    if (!authHeader) throw new Error('로그인이 필요합니다.')
    requestHeaders.Authorization = authHeader
  }

  if (body && !(body instanceof FormData) && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const response = await fetch(buildWordpressRestUrl(path, params), {
    method,
    headers: requestHeaders,
    credentials: 'include',
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  })

  const payload = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(payload?.message || `WordPress REST 요청에 실패했습니다. (${response.status})`)
  }
  return payload
}
