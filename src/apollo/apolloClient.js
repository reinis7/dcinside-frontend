import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client/core'
import { authLink } from './authLink'
import { getGraphqlUri } from './graphqlEndpoint'

// JWT: Authorization Bearer. 쿠키 세션 불필요 시 credentials 생략 가능.
const httpLink = new HttpLink({
  uri: getGraphqlUri(),
  credentials: 'omit',
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

