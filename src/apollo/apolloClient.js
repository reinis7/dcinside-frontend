import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client/core'
import { authEnsureLink } from './authEnsureLink'
import { authLink } from './authLink'
import { getGraphqlUri } from './graphqlEndpoint'

// JWT: Authorization Bearer. 쿠키 세션 불필요 시 credentials 생략 가능.
const httpLink = new HttpLink({
  uri: getGraphqlUri(),
  credentials: 'omit',
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authEnsureLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: import.meta.env.DEV,
})

