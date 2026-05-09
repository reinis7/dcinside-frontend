/** DCInside SPA 게시판 base 경로 · 타입 정규화 (갤로그·모달 등 공통) */

export function normalizeDcinsideGalleryType(raw) {
  const s = String(raw ?? '').trim().toUpperCase()
  if (!s) return 'MAIN'
  if (s === '메인' || s === 'MAIN') return 'MAIN'
  if (s === '마이너' || s === 'MINOR') return 'MINOR'
  if (s === '미니' || s === 'MINI') return 'MINI'
  if (s === '인물' || s === 'PERSON') return 'PERSON'
  if (s.includes('인물') || s.includes('PERSON')) return 'PERSON'
  if (s.includes('미니') || s.includes('MINI')) return 'MINI'
  if (s.includes('마이너') || s.includes('MINOR')) return 'MINOR'
  return 'MAIN'
}

export function galleryTypeShortLabel(typeRaw) {
  const t = normalizeDcinsideGalleryType(typeRaw)
  if (t === 'MAIN') return '메인'
  if (t === 'MINOR') return '마이너'
  if (t === 'MINI') return '미니'
  if (t === 'PERSON') return '인물'
  return t || ''
}

export function boardBasePrefixForGalleryType(typeRaw) {
  const t = normalizeDcinsideGalleryType(typeRaw)
  if (t === 'MAIN') return '/gall/board'
  if (t === 'MINOR') return '/gall/mgallery/board'
  if (t === 'MINI') return '/gall/mini/board'
  if (t === 'PERSON') return '/gall/p/board'
  return '/gall/board'
}

export function buildDcinsidePostViewHref({ galleryType, galleryId, postDatabaseId }) {
  if (galleryId == null || String(galleryId).trim() === '') return null
  if (postDatabaseId == null) return null
  const base = boardBasePrefixForGalleryType(galleryType)
  const gid = encodeURIComponent(String(galleryId).trim())
  const no = encodeURIComponent(String(postDatabaseId))
  return `${base}/view/?id=${gid}&no=${no}`
}

export function buildDcinsideGalleryListHref({ galleryType, galleryId }) {
  if (galleryId == null || String(galleryId).trim() === '') return null
  const base = boardBasePrefixForGalleryType(galleryType)
  const gid = encodeURIComponent(String(galleryId).trim())
  return `${base}/lists/?id=${gid}`
}
