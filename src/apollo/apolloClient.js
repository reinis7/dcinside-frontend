import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client/core'

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'include',
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

