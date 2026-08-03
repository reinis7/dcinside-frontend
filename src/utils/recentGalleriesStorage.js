const STORAGE_KEY = 'dcinside:recent-galleries'
const CHANGE_EVENT = 'dcinside:recent-galleries'
export const RECENT_GALLERIES_MAX = 5

function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function notifyRecentGalleriesChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function writePayload(items) {
  const payload = {
    date: todayKey(),
    items: (items ?? []).slice(0, RECENT_GALLERIES_MAX),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // ignore quota / private mode
  }
  notifyRecentGalleriesChanged()
  return payload.items
}

/**
 * 오늘 날짜의 최근 방문만 반환. 날짜가 바뀌었으면 이전 리스트를 삭제하고 빈 배열.
 * @returns {Array<{id:string,title:string,href:string,galleryType?:string}>}
 */
export function readRecentGalleries() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
    if (parsed.date !== todayKey()) {
      // 날짜가 바뀌면 이전 큐 전부 삭제
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
    const items = Array.isArray(parsed.items) ? parsed.items : []
    return items
      .filter((x) => x && x.id)
      .map((x) => ({
        id: String(x.id),
        title: String(x.title || x.id),
        href: String(x.href || '#'),
        galleryType: x.galleryType ? String(x.galleryType) : undefined,
      }))
      .slice(0, RECENT_GALLERIES_MAX)
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    return []
  }
}

/** 최근 방문 전체 삭제 */
export function clearRecentGalleries() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  notifyRecentGalleriesChanged()
}

/** 개별 삭제 */
export function removeRecentGallery(id) {
  if (!id) return readRecentGalleries()
  const next = readRecentGalleries().filter((x) => x.id !== String(id))
  if (!next.length) {
    clearRecentGalleries()
    return []
  }
  return writePayload(next)
}

/**
 * 갤러리 방문 시 큐 앞에 추가 (최대 5개). 오늘 첫 방문이면 빈 큐에서 시작.
 * @param {{ id: string, title?: string, href: string, galleryType?: string }} entry
 */
export function pushRecentGallery(entry) {
  const id = String(entry?.id ?? '').trim()
  if (!id) return readRecentGalleries()

  const title = String(entry?.title ?? id).trim() || id
  const href = String(entry?.href ?? '#').trim() || '#'
  const galleryType = entry?.galleryType ? String(entry.galleryType) : undefined

  // readRecentGalleries()가 날짜 불일치 시 이전 리스트를 이미 지움
  const current = readRecentGalleries()
  const next = [{ id, title, href, galleryType }, ...current.filter((x) => x.id !== id)].slice(
    0,
    RECENT_GALLERIES_MAX,
  )
  return writePayload(next)
}

export function subscribeRecentGalleries(listener) {
  if (typeof window === 'undefined') return () => {}
  const onCustom = () => listener()
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY || e.key === null) listener()
  }
  window.addEventListener(CHANGE_EVENT, onCustom)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustom)
    window.removeEventListener('storage', onStorage)
  }
}
