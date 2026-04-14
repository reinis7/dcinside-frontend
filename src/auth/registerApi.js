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
    // 이전 세션 토큰이 붙으면 백엔드 동작이 달라질 수 있어 공개 뮤테이션은 헤더 제외
    context: { skipAuth: true, fetchOptions: { signal } },
  })

  return data
}

