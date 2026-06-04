import { wordpressRestRequest } from './wordpressRestApi'

function stripHtml(html) {
  if (!html) return ''
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

async function fetchUsernamesById(authorIds) {
  const ids = [...new Set(authorIds.filter(Boolean))]
  if (ids.length === 0) return {}

  try {
    const users = await wordpressRestRequest('/users', {
      params: {
        include: ids,
        per_page: Math.min(ids.length, 100),
      },
    })
    return Object.fromEntries(
      (Array.isArray(users) ? users : []).map((user) => [
        Number(user.id),
        user.slug || user.username || user.name || '',
      ]),
    )
  } catch {
    return {}
  }
}

export async function fetchWordpressComments(postDatabaseId) {
  const comments = await wordpressRestRequest('/comments', {
    params: {
      post: postDatabaseId,
      per_page: 100,
      order: 'asc',
      orderby: 'date',
    },
  })
  const nodes = Array.isArray(comments) ? comments : []
  const usernamesById = await fetchUsernamesById(nodes.map((comment) => comment.author))

  return nodes.map((comment) => ({
    id: comment.id,
    authorId: comment.author || null,
    authorName: usernamesById[Number(comment.author)] || comment.author_slug || comment.author_name || '익명',
    content: comment.content?.rendered || comment.content?.raw || '',
    date: comment.date,
    plainContent: stripHtml(comment.content?.rendered || comment.content?.raw || ''),
  }))
}

export async function createWordpressComment({ postDatabaseId, content }) {
  const payload = await wordpressRestRequest('/comments', {
    auth: true,
    method: 'POST',
    body: {
      post: postDatabaseId,
      content,
    },
  })

  if (!payload?.id) throw new Error('댓글 등록에 실패했습니다.')
  return payload
}
