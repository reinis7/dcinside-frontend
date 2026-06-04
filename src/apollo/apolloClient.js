import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client/core'
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'
import { authEnsureLink } from './authEnsureLink'
import { authLink } from './authLink'
import { getGraphqlUri } from './graphqlEndpoint'

// JWT: Authorization Bearer. 쿠키 세션 불필요 시 credentials 생략 가능.
const uploadLink = new UploadHttpLink({
  uri: getGraphqlUri(),
  credentials: 'omit',
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authEnsureLink, authLink, uploadLink]),
  cache: new InMemoryCache(),
  connectToDevTools: import.meta.env.DEV,
})

