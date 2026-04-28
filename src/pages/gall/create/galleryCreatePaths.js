/** Route-driven gallery creation branch: main (/gall/create), minor (m), mini (n), person (p). */
export function createTopicKeyFromPathname(pathname) {
  if (pathname === '/gall/create') return 'main'
  if (pathname === '/gall/m/create') return 'minor'
  if (pathname === '/gall/n/create') return 'mini'
  if (pathname === '/gall/p/create') return 'person'
  return null
}

export function isBranchCreatePath(pathname) {
  return createTopicKeyFromPathname(pathname) != null
}

export function titleFromPath(pathname) {
  if (pathname === '/gall/create') return '갤러리 만들기'
  if (pathname === '/gall/m/create') return '마이너 갤러리 만들기'
  if (pathname === '/gall/n/create') return '미니 갤러리 만들기'
  if (pathname === '/gall/p/create') return '인물 갤러리 만들기'
  return '갤러리 만들기'
}

export function backToFromPath(pathname) {
  if (pathname === '/gall/m/create') return '/gall/m'
  if (pathname === '/gall/n/create') return '/gall/n'
  if (pathname === '/gall/p/create') return '/gall/p'
  return '/gall'
}

/** Korean hint used to match `galleryTypes` from the API. */
export function galleryTypeHintFromPath(pathname) {
  if (pathname === '/gall/create') return '메인'
  if (pathname === '/gall/m/create') return '마이너'
  if (pathname === '/gall/n/create') return '미니'
  if (pathname === '/gall/p/create') return '인물'
  return null
}

export function galleryLabelFromTopicKey(topicKey) {
  if (topicKey === 'main') return '메인 갤러리'
  if (topicKey === 'mini') return '미니 갤러리'
  if (topicKey === 'person') return '인물 갤러리'
  if (topicKey === 'minor') return '마이너 갤러리'
  return '갤러리'
}
