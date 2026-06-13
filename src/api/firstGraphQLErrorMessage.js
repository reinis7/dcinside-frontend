import { CombinedGraphQLErrors } from '@apollo/client/errors'

function decodeHtmlEntities(text) {
  if (!text) return ''
  if (typeof document === 'undefined') {
    return text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
  }
  const el = document.createElement('textarea')
  el.innerHTML = text
  return el.value
}

function stripHtml(html) {
  if (!html) return ''
  const plain = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return decodeHtmlEntities(plain)
}

function normalizeGraphQLErrorMessage(raw) {
  const plain = stripHtml(raw).replace(/^Error:\s*/i, '').trim()
  if (!plain) return ''

  if (
    /username .* is not registered/i.test(plain) ||
    /password you entered .* is incorrect/i.test(plain) ||
    /unknown username/i.test(plain) ||
    /incorrect password/i.test(plain) ||
    /invalid username/i.test(plain) ||
    /authentication failed/i.test(plain)
  ) {
    return '식별 코드 또는 비밀번호가 올바르지 않습니다.'
  }

  return plain
}

function pickRawGraphQLErrorMessage(err) {
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

  return ''
}

/**
 * Apollo Client 4는 GraphQL 오류를 `CombinedGraphQLErrors`로 넘깁니다.
 * 구버전 `graphQLErrors` 필드도 함께 처리합니다.
 */
export function firstGraphQLErrorMessage(err) {
  const normalized = normalizeGraphQLErrorMessage(pickRawGraphQLErrorMessage(err))
  if (normalized) return normalized

  return '요청 처리 중 오류가 발생했습니다.'
}
