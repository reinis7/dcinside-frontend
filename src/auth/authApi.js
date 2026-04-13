import { gql } from '@apollo/client/core'
import { apolloClient } from '../apollo/apolloClient'

// 백엔드 스키마가 확정되면 여기만 맞추면 됩니다.
// (WPGraphQL + 커스텀 auth의 경우 login/logout/me 쿼리명이 달라질 수 있음)

export async function fetchViewer({ signal } = {}) {
  const query = gql`
    query Viewer {
      viewer {
        id
        databaseId
        username
        name
      }
    }
  `
  const { data } = await apolloClient.query({
    query,
    fetchPolicy: 'network-only',
    context: { fetchOptions: { signal } },
  })
  return data
}

export async function login({ userId, password, signal }) {
  // NOTE: 많은 WPGraphQL auth 구현은 "mutation login" 이름/입력이 다릅니다.
  // 백엔드 쪽 mutation 이름이 정해지면 맞춰서 수정하세요.
  const mutation = gql`
    mutation Login($username: String!, $password: String!) {
      login(input: { username: $username, password: $password }) {
        user {
          id
          databaseId
          username
          name
        }
      }
    }
  `
  const { data } = await apolloClient.mutate({
    mutation,
    variables: { username: userId, password },
    context: { fetchOptions: { signal } },
  })
  return data
}

export async function logout({ signal } = {}) {
  const mutation = gql`
    mutation Logout {
      logout {
        success
      }
    }
  `
  const { data } = await apolloClient.mutate({
    mutation,
    variables: {},
    context: { fetchOptions: { signal } },
  })
  return data
}

