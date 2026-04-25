import { CombinedGraphQLErrors } from '@apollo/client/errors'

/**
 * Apollo Client 4는 GraphQL 오류를 `CombinedGraphQLErrors`로 넘깁니다.
 * 구버전 `graphQLErrors` 필드도 함께 처리합니다.
 */
export function firstGraphQLErrorMessage(err) {
  if (CombinedGraphQLErrors.is(err)) {
    const msg = err.errors?.[0]?.message
    if (typeof msg === 'string' && msg.trim()) return msg
  }

  const graphQLErrors = err?.graphQLErrors
  if (Array.isArray(graphQLErrors) && graphQLErrors.length > 0) {
    const msg = graphQLErrors[0]?.message
    if (typeof msg === 'string' && msg.trim()) return msg
  }

  const msg = err?.message
  if (typeof msg === 'string' && msg.trim()) return msg

  return '요청 처리 중 오류가 발생했습니다.'
}
