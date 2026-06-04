import { gql } from '@apollo/client/core'
import { apolloClient } from '../apollo/apolloClient'
import { wordpressRestRequest } from './wordpressRestApi'

const COMMENT_AUTHOR_USERS_QUERY = gql`
  query CommentAuthorUsers($include: [Int]) {
    users(first: 100, where: { include: $include }) {
      nodes {
        databaseId
        username
        nicename
        nickname
        name
        slug
      }
    }
  }
`

function stripHtml(html) {
  if (!html) return ''
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

async function fetchUsernamesById(authorIds) {
  const ids = [...new Set(authorIds.filter(Boolean))]
  if (ids.length === 0) return {}

  try {
    const { data } = await apolloClient.query({
      query: COMMENT_AUTHOR_USERS_QUERY,
      variables: { include: ids.map(Number) },
      fetchPolicy: 'network-only',
    })
    const users = data?.users?.nodes ?? []
    const namesById = Object.fromEntries(
      users.map((user) => [
        Number(user.databaseId),
        user.username || user.nicename || user.nickname || user.name || user.slug || '',
      ]),
    )
    if (Object.keys(namesById).length > 0) return namesById
  } catch {
    // Fall through to REST lookup.
  }

  try {
    const users = await wordpressRestRequest('/users', {
      params: {
        _fields: ['id', 'display_name', 'name', 'username', 'nicename', 'user_nicename', 'slug'],
        include: ids,
        per_page: Math.min(ids.length, 100),
      },
    })
    return Object.fromEntries(
      (Array.isArray(users) ? users : []).map((user) => [
        Number(user.id),
        user.username || user.nicename || user.user_nicename || user.display_name || user.name || user.slug || '',
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
    authorName: usernamesById[Number(comment.author)] || comment.author_name || comment.author_slug || '익명',
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
