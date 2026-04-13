import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client/core'
import { getGraphqlUri } from './graphqlEndpoint'

// 세션 쿠키: 반드시 credentials: 'include' (백엔드 가이드 A)
const httpLink = new HttpLink({
  uri: getGraphqlUri(),
  credentials: 'include',
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

