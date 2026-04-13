import { getGraphqlUri } from '../apollo/graphqlEndpoint'

function normalizeGraphQLError(payload) {
  const message =
    payload?.errors?.map((e) => e.message).filter(Boolean).join('\n') ||
    payload?.message ||
    '요청 처리 중 오류가 발생했습니다.'
  const err = new Error(message)
  err.graphQLErrors = payload?.errors ?? []
  return err
}

export async function gqlRequest({ query, variables, signal }) {
  const res = await fetch(getGraphqlUri(), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query, variables }),
    signal,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(`HTTP ${res.status} ${res.statusText}${text ? `\n${text}` : ''}`)
    err.status = res.status
    throw err
  }

  const json = await res.json()
  if (json?.errors?.length) throw normalizeGraphQLError(json)
  return json?.data
}

