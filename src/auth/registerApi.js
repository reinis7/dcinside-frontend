import { gql } from '@apollo/client/core'
import { apolloClient } from '../apollo/apolloClient'

export async function registerUser({
  username,
  password,
  email,
  nickname,
  agreedTerms,
  agreedPrivacy,
  agreedMarketing,
  securityCode,
  signal,
}) {
  const mutation = gql`
    mutation Register($input: DCInsideRegisterUserInput!) {
      dcinsideRegisterUser(input: $input) {
        success
        message
        userId
        databaseId
        username
        name
      }
    }
  `

  const variables = {
    input: {
      username,
      password,
      email,
      nickname,
      agreedTerms,
      agreedPrivacy,
      agreedMarketing,
      securityCode,
    },
  }

  const { data } = await apolloClient.mutate({
    mutation,
    variables,
    context: { fetchOptions: { signal } },
  })

  return data
}

