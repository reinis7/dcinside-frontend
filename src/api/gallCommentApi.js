import { gql } from '@apollo/client/core'
import { apolloClient } from '../apollo/apolloClient'
import { firstGraphQLErrorMessage } from './firstGraphQLErrorMessage'

const POST_COMMENTS_QUERY = gql`
  query GallPostComments($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      comments(first: 100) {
        nodes {
          id
          databaseId
          content
          date
          dcinsideCommentType
          dcinsideWithRecommend
          author {
            node {
              name
              ... on User {
                databaseId
                username
              }
            }
          }
        }
      }
    }
  }
`

const CREATE_COMMENT_MUTATION = gql`
  mutation CreateGalleryComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      success
      comment {
        id
        databaseId
        dcinsideWithRecommend
      }
    }
  }
`

const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteGalleryComment($id: ID!) {
    deleteComment(input: { id: $id, forceDelete: true }) {
      deletedId
    }
  }
`

function stripHtml(html) {
  if (!html) return ''
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function mapCommentNode(comment) {
  const authorNode = comment?.author?.node
  return {
    id: comment.id,
    databaseId: comment.databaseId,
    authorId: authorNode?.databaseId ?? null,
    authorName:
      authorNode?.username ||
      authorNode?.name ||
      stripHtml(authorNode?.name) ||
      '익명',
    content: comment.content || '',
    date: comment.date,
    plainContent: stripHtml(comment.content || ''),
    commentType: comment.dcinsideCommentType || 'general',
    withRecommend: Boolean(comment.dcinsideWithRecommend),
  }
}

export async function fetchGalleryPostComments(postDatabaseId) {
  const { data } = await apolloClient.query({
    query: POST_COMMENTS_QUERY,
    variables: { id: String(postDatabaseId) },
    fetchPolicy: 'network-only',
  })
  const nodes = data?.post?.comments?.nodes ?? []
  return nodes.map(mapCommentNode)
}

export async function createGalleryComment({ postDatabaseId, content, withRecommend = false }) {
  const { data } = await apolloClient.mutate({
    mutation: CREATE_COMMENT_MUTATION,
    variables: {
      input: {
        commentOn: Number(postDatabaseId),
        content,
        dcinsideWithRecommend: withRecommend,
      },
    },
  })

  const payload = data?.createComment
  if (!payload?.success || !payload?.comment?.databaseId) {
    throw new Error('댓글 등록에 실패했습니다.')
  }
  return payload.comment
}

export async function deleteGalleryComment(commentId) {
  const { data } = await apolloClient.mutate({
    mutation: DELETE_COMMENT_MUTATION,
    variables: { id: commentId },
  })
  if (!data?.deleteComment?.deletedId) {
    throw new Error('댓글 삭제에 실패했습니다.')
  }
  return data.deleteComment
}

export function getCommentActionErrorMessage(err) {
  return firstGraphQLErrorMessage(err)
}
