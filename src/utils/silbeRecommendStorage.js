const STORAGE_PREFIX = 'dcinside:silbe-recommended'

function storageKey(viewerId) {
  return `${STORAGE_PREFIX}:${viewerId || 'guest'}`
}

export function hasLocalSilbeRecommended(viewerId, postDatabaseId) {
  if (!postDatabaseId) return false
  try {
    const raw = localStorage.getItem(storageKey(viewerId))
    const ids = JSON.parse(raw || '[]')
    return Array.isArray(ids) && ids.includes(String(postDatabaseId))
  } catch {
    return false
  }
}

export function markLocalSilbeRecommended(viewerId, postDatabaseId) {
  if (!postDatabaseId) return
  try {
    const raw = localStorage.getItem(storageKey(viewerId))
    const ids = Array.isArray(JSON.parse(raw || '[]')) ? JSON.parse(raw || '[]') : []
    if (!ids.includes(String(postDatabaseId))) {
      ids.push(String(postDatabaseId))
      localStorage.setItem(storageKey(viewerId), JSON.stringify(ids))
    }
  } catch {
    // ignore storage failures
  }
}
