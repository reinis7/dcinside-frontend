/** Placeholder rows when GraphQL is unavailable or `.env` is not configured. */
export const SAMPLE_POSTS = [
  {
    id: 'sample-1',
    title:
      '[안내] 디시 스타일 보드 — WordPress WPGraphQL과 연결하려면 `.env`의 VITE_BACKEND_URL을 설정하세요',
    excerpt:
      '백엔드가 준비되면 최신 글이 자동으로 불러와집니다. 지금은 샘플 목록입니다.',
    date: '2026-04-08T12:00:00',
    slug: 'sample-welcome',
    link: '',
    gallery: '공지',
    isSample: true,
  },
  {
    id: 'sample-2',
    title: '샘플 글 — 실베 랭킹 느낌의 제목입니다 [42]',
    excerpt: '댓글·조회수는 WP에서 필드로 받아온 뒤 같은 레이아웃에 붙이면 됩니다.',
    date: '2026-04-08T11:30:00',
    slug: 'sample-ranking-style',
    link: '',
    gallery: '유머',
    isSample: true,
  },
  {
    id: 'sample-3',
    title: 'GraphQL 예시: posts(first:5) { nodes { title excerpt date } }',
    excerpt:
      'WPGraphQL 플러그인이 활성화된 사이트의 /graphql 엔드포인트를 가리키면 이 목록이 교체됩니다.',
    date: '2026-04-08T09:00:00',
    slug: 'sample-graphql-hint',
    link: '',
    gallery: '개발',
    isSample: true,
  },
]
