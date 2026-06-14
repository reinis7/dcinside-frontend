import { gql } from '@apollo/client/core'
import { apolloClient } from '../apollo/apolloClient'
import { firstGraphQLErrorMessage } from './firstGraphQLErrorMessage'

/** Post detail for gallery board view page */
export const GALL_POST_VIEW_QUERY = gql`
  query GallPostView($id: ID!, $galleryId: String!) {
    post(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      date
      title
      content
      commentCount
      commentStatus
      dcinsideGalleryId
      writer
      headText
      viewCount
      recommendCount
      hasRecommended
      author {
        node {
          databaseId
          name
          username
        }
      }
    }
    galleryPosts: dcinsidePostsByGalleryId(galleryId: $galleryId, first: 200) {
      databaseId
      writer
      headText
      viewCount
      recommendCount
    }
  }
`

const INCREMENT_POST_VIEW_MUTATION = gql`
  mutation DcinsideIncrementPostView($input: DCInsideIncrementPostViewInput!) {
    dcinsideIncrementPostView(input: $input) {
      success
      viewCount
    }
  }
`

const RECOMMEND_POST_MUTATION = gql`
  mutation DcinsideRecommendPost($input: DCInsideRecommendPostInput!) {
    dcinsideRecommendPost(input: $input) {
      success
      recommendCount
      hasRecommended
      alreadyRecommended
    }
  }
`

const DELETE_POST_MUTATION = gql`
  mutation DeletePost($id: ID!) {
    deletePost(input: { id: $id, forceDelete: true }) {
      deletedId
    }
  }
`

function isSchemaMismatchError(message) {
  if (!message) return false
  return /Cannot query field|Unknown type|Unknown argument|not defined by type|Did you mean/i.test(message)
}

export function findGalleryPostStats(galleryPosts, databaseId) {
  if (!databaseId || !Array.isArray(galleryPosts)) return null
  return galleryPosts.find((item) => Number(item?.databaseId) === Number(databaseId)) ?? null
}

export async function incrementPostView({ galleryId, databaseId, signal }) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: INCREMENT_POST_VIEW_MUTATION,
      variables: { input: { galleryId, databaseId: Number(databaseId) } },
      context: { skipAuth: true, fetchOptions: { signal } },
    })
    return data?.dcinsideIncrementPostView ?? null
  } catch (err) {
    if (isSchemaMismatchError(firstGraphQLErrorMessage(err))) return null
    throw err
  }
}

export async function recommendPost({ galleryId, databaseId, signal }) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: RECOMMEND_POST_MUTATION,
      variables: { input: { galleryId, databaseId: Number(databaseId) } },
      context: { fetchOptions: { signal } },
    })
    return data?.dcinsideRecommendPost ?? null
  } catch (err) {
    if (isSchemaMismatchError(firstGraphQLErrorMessage(err))) return null
    throw err
  }
}

export async function deletePostById(postId, { signal } = {}) {
  const { data } = await apolloClient.mutate({
    mutation: DELETE_POST_MUTATION,
    variables: { id: postId },
    context: { fetchOptions: { signal } },
  })
  return data?.deletePost ?? null
}

export function getPostActionErrorMessage(err) {
  return firstGraphQLErrorMessage(err)
}
