export function firstGraphQLErrorMessage(err) {
  // ApolloError: err.graphQLErrors[0].message
  const graphQLErrors = err?.graphQLErrors
  if (Array.isArray(graphQLErrors) && graphQLErrors.length > 0) {
    const msg = graphQLErrors[0]?.message
    if (typeof msg === 'string' && msg.trim()) return msg
  }

  // Some servers wrap errors differently
  const msg = err?.message
  if (typeof msg === 'string' && msg.trim()) return msg

  return '요청 처리 중 오류가 발생했습니다.'
}

