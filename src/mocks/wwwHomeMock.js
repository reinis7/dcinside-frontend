function mulberry32(seed) {
  let t = seed >>> 0
  return function rand() {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)]
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function makeTime(rand) {
  const h = Math.floor(rand() * 24)
  const m = Math.floor(rand() * 60)
  return `${pad2(h)}:${pad2(m)}`
}

function makeTitle(rand) {
  const a = [
    '싱글벙글',
    '주말사이 터진',
    '기묘한',
    '얼탱얼탱',
    '와들와들',
    '속보',
    '단독',
    '실시간',
    '스압',
    '펌',
    '후기',
  ]
  const b = [
    '난리난 핫이슈',
    '근황',
    '레전드',
    '진실',
    '논란',
    '이유',
    '요약',
    '정리',
    '사진',
    '썰',
    'manhwa',
    'jpg',
    'webp',
  ]
  const c = ['zip', '…', 'ㅋㅋㅋㅋ', 'ㄷㄷㄷ', 'v2', '완)', 'part.3', '1탄', '2탄']
  return `${pick(rand, a)} ${pick(rand, b)} ${pick(rand, c)}`.replace(/\s+/g, ' ').trim()
}

function makeGalleryName(rand) {
  const names = [
    '리그 오브 레전드',
    '만화',
    '한화 이글스',
    '인터넷방송',
    '두산 베어스',
    '승리의 여신 니케',
    '메이플스토리',
    '기타 국내 드라마',
    '삼성 라이온즈',
    '우울증',
    '이슈',
    '주식',
    '부동산',
    '디지털 사진',
    '싱글벙글 지구촌',
    '카툰-연재',
    '미국 주식',
    '군사',
  ]
  return pick(rand, names)
}

function makeTag(rand) {
  const tags = ['가상인물', '유튜버/스트리머', '정치인', '연예인', '문화/예술', '국내야구', '게임', '스포츠']
  return pick(rand, tags)
}

function makePostId(i) {
  return 420000 + i
}

export function buildWwwHomeMock({ seed = 1337 } = {}) {
  const rand = mulberry32(seed)

  // realtime best: 10 pages * 20 = 200 items
  const realtimeBest = Array.from({ length: 200 }, (_, i) => {
    const postNo = makePostId(i)
    return {
      id: `rtb_${postNo}`,
      title: makeTitle(rand),
      gallery: makeGalleryName(rand),
      time: makeTime(rand),
      commentCount: Math.floor(rand() * 900),
      href: `/gall/board/view/?id=dcbest&no=${postNo}`,
      // local placeholder image
      thumb: '/snapshot/nstatic.dcinside.com/dc/w/images/img_none1.jpg',
    }
  })

  const conceptCategories = [
    { id: 'game', label: '게임' },
    { id: 'enter', label: '연예/방송' },
    { id: 'sports', label: '스포츠' },
    { id: 'travel', label: '여행/음식/생물' },
    { id: 'hobby', label: '취미/생활' },
  ]

  // concept posts: 6 pages * 6 galleries * 6 posts each (per category) -> large enough
  const conceptPostsByCategory = Object.fromEntries(
    conceptCategories.map((c) => {
      const posts = Array.from({ length: 6 * 6 * 6 }, (_, i) => ({
        id: `${c.id}_cp_${i}`,
        gallery: `${makeGalleryName(rand)} 갤러리`,
        title: makeTitle(rand),
        href: `/gall/board/view/?id=${c.id}&no=${makePostId(i + 600)}`,
      }))
      return [c.id, posts]
    }),
  )

  function buildRankingList(baseLabel, total = 100) {
    return Array.from({ length: total }, (_, idx) => ({
      id: `${baseLabel}_${idx + 1}`,
      rank: idx + 1,
      name: makeGalleryName(rand),
      tag: makeTag(rand),
      deltaDir: rand() < 0.28 ? 'down' : rand() < 0.62 ? 'same' : 'up',
      delta: Math.floor(rand() * 30) + 1,
      href: `/gall/board/lists/?id=${baseLabel}${idx + 1}`,
    }))
  }

  const rankings = {
    silbuk: {
      main: buildRankingList('sil_main', 100),
      minor: buildRankingList('sil_minor', 100),
      mini: buildRankingList('sil_mini', 100),
      person: buildRankingList('sil_person', 100),
    },
    hot: {
      main: buildRankingList('hot_main', 100),
      minor: buildRankingList('hot_minor', 100),
      mini: buildRankingList('hot_mini', 100),
      person: buildRankingList('hot_person', 100),
    },
    new: {
      main: buildRankingList('new_main', 100),
      minor: buildRankingList('new_minor', 100),
      mini: buildRankingList('new_mini', 100),
      person: buildRankingList('new_person', 100),
    },
  }

  const media = Array.from({ length: 8 }, (_, i) => ({
    id: `media_${i + 1}`,
    title: makeTitle(rand),
    href: `/media/view/?no=${makePostId(i + 2000)}`,
    thumb: '/snapshot/nstatic.dcinside.com/dc/w/images/img_none1.jpg',
  }))

  const dcissue = Array.from({ length: 10 }, (_, i) => ({
    id: `dcissue_${i + 1}`,
    title: makeTitle(rand),
    href: `/issue/view/?no=${makePostId(i + 3000)}`,
    thumb: '/snapshot/nstatic.dcinside.com/dc/w/images/img_none1.jpg',
  }))

  return {
    stats: {
      yesterdayPosts: 1014073,
      yesterdayComments: 2732164,
      totalGalleries: 93851,
    },
    realtimeBest,
    conceptCategories,
    conceptPostsByCategory,
    rankings,
    media,
    dcissue,
  }
}

