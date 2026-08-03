import { localizeErrorMessage } from './api/firstGraphQLErrorMessage.js'

const QUERY = `
  query RecentPosts($first: Int = 8) {
    posts(
      first: $first
      where: { orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        title
        excerpt
        date
        slug
        link
        categories {
          nodes {
            name
          }
        }
      }
    }
  }
`

function stripHtml(html) {
  if (!html) return ''
  const t = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return t
}

function formatWpPosts(nodes) {
  return nodes.map((n) => ({
    id: n.id,
    title: n.title ?? '',
    excerpt: stripHtml(n.excerpt),
    date: n.date ?? '',
    slug: n.slug ?? '',
    link: n.link ?? '',
    gallery: n.categories?.nodes?.[0]?.name ?? '게시판',
    isSample: false,
  }))
}

/**
 * @param {string} endpoint
 * @param {number} [first]
 */
export async function fetchRecentPosts(endpoint, first = 8) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { first } }),
  })
  if (!res.ok) {
    throw new Error(`요청에 실패했습니다. (HTTP ${res.status})`)
  }
  const json = await res.json()
  if (json.errors?.length) {
    throw new Error(
      json.errors.map((e) => localizeErrorMessage(e.message) || e.message).join('; ') ||
        '요청 처리 중 오류가 발생했습니다.',
    )
  }
  const nodes = json.data?.posts?.nodes ?? []
  return formatWpPosts(nodes)
}

export function isPlaceholderBackendUrl(url) {
  if (!url || typeof url !== 'string') return true
  const u = url.toLowerCase()
  return (
    u.includes('your-wordpress') ||
    u.includes('example.com') ||
    u.trim() === ''
  )
}
