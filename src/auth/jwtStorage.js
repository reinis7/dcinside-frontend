const STORAGE_KEY = 'dcinside.auth'

/**
 * @typedef {object} StoredJwtSession
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {string|number|null|undefined} accessExpiresAt
 * @property {string|number|null|undefined} refreshExpiresAt
 */

/** @returns {StoredJwtSession | null} */
export function loadTokens() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.accessToken || !parsed?.refreshToken) return null
    return parsed
  } catch {
    return null
  }
}

/**
 * @param {object} payload — login / dcinsideRefreshToken 응답 필드
 */
export function saveTokensFromAuthPayload(payload) {
  const accessToken = payload?.authToken ?? payload?.accessToken
  const refreshToken = payload?.refreshToken
  if (!accessToken || !refreshToken) return

  const session = {
    accessToken,
    refreshToken,
    accessExpiresAt: payload?.authTokenExpiresAt ?? payload?.accessExpiresAt ?? null,
    refreshExpiresAt: payload?.refreshTokenExpiresAt ?? payload?.refreshExpiresAt ?? null,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearTokens() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getAccessToken() {
  return loadTokens()?.accessToken ?? null
}

export function getRefreshToken() {
  return loadTokens()?.refreshToken ?? null
}

/** @returns {string | null} */
export function getAuthorizationHeader() {
  const t = getAccessToken()
  return t ? `Bearer ${t}` : null
}

export function parseExpiresAtMs(value) {
  if (value == null || value === '') return null
  if (typeof value === 'number') {
    return value < 1e12 ? value * 1000 : value
  }
  const t = Date.parse(String(value))
  return Number.isFinite(t) ? t : null
}

function getAccessExpiresAtMs() {
  const raw = loadTokens()?.accessExpiresAt
  return parseExpiresAtMs(raw)
}

/** 액세스 토큰이 있고, 만료 시각이 있으면 bufferMs 전까지 유효로 봄. 만료 시각 없으면 토큰만 있으면 유효. */
export function isAccessTokenValid(bufferMs = 60_000) {
  const token = getAccessToken()
  if (!token) return false
  const exp = getAccessExpiresAtMs()
  if (exp == null) return true
  return exp - Date.now() > bufferMs
}
