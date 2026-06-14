export function resolveGallBoardBase(pathname) {
  if (pathname.includes('/gall/mgallery/board/')) return 'mgallery'
  if (pathname.includes('/gall/mini/board/')) return 'mini'
  if (pathname.includes('/gall/p/board/') || pathname.includes('/gall/person/board/')) return 'p'
  return 'board'
}

export function gallBoardListHref(boardBase, galleryId) {
  if (boardBase === 'board') return `/gall/board/lists/?id=${encodeURIComponent(galleryId)}`
  return `/gall/${boardBase}/board/lists/?id=${encodeURIComponent(galleryId)}`
}

export function gallBoardWriteHref(boardBase, galleryId, postNo) {
  const query = `id=${encodeURIComponent(galleryId)}`
  const editSuffix = postNo ? `&no=${encodeURIComponent(String(postNo))}` : ''
  if (boardBase === 'board') return `/gall/board/write/?${query}${editSuffix}`
  return `/gall/${boardBase}/board/write/?${query}${editSuffix}`
}
