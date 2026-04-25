import { ApolloLink } from '@apollo/client/core'
import { getAccessToken } from '../auth/jwtStorage'

/** context.skipAuth === true 이면 Authorization 미부착 (리프레시 등) */
export const authLink = new ApolloLink((operation, forward) => {
  operation.setContext((prev) => {
    if (prev.skipAuth) return prev
    const token = getAccessToken()
    return {
      ...prev,
      headers: {
        ...prev.headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    }
  })
  return forward(operation)
})
