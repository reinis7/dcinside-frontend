import { gql } from '@apollo/client/core'

export const GALLERY_TOPICS_QUERY = gql`
  query NewQuery {
    galleryTopics(first: 50) {
      edges {
        node {
          id
          slug
          databaseId
          name
        }
      }
    }
    galleryTypes {
      edges {
        node {
          id
          slug
          name
          databaseId
        }
      }
    }
  }
`

export const CREATE_GALLERY_MUTATION = gql`
  mutation CreateGallery($input: DCInsideCreateGalleryInput!) {
    dcinsideCreateGallery(input: $input) {
      success
      message
      galleryId
      databaseId
      slug
      status
    }
  }
`
