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

/**
 * 브라우저·Apollo·서버에서 흔한 영문 오류 문구를 한국어로 변환합니다.
 * @param {string} raw
 * @returns {string}
 */
export function localizeErrorMessage(raw) {
  const plain = stripHtml(String(raw ?? ''))
    .replace(/^Error:\s*/i, '')
    .replace(/^ApolloError:\s*/i, '')
    .replace(/^TypeError:\s*/i, '')
    .trim()
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

  if (
    /^failed to fetch$/i.test(plain) ||
    /failed to fetch/i.test(plain) ||
    /networkerror when attempting to fetch resource/i.test(plain) ||
    /network request failed/i.test(plain) ||
    /load failed/i.test(plain) ||
    /fetch failed/i.test(plain) ||
    /^network\s*error$/i.test(plain) ||
    /networkerror/i.test(plain) ||
    /err_connection|econnrefused|enotfound|econnreset/i.test(plain)
  ) {
    return '서버에 연결하지 못했습니다. 네트워크 상태를 확인해 주세요.'
  }

  if (
    /the user aborted a request/i.test(plain) ||
    /aborterror/i.test(plain) ||
    /^aborted$/i.test(plain) ||
    /request aborted/i.test(plain) ||
    /signal is aborted without reason/i.test(plain) ||
    /The operation was aborted/i.test(plain)
  ) {
    return '요청이 취소되었습니다.'
  }

  if (/timeout|timed?\s*out|etimedout/i.test(plain)) {
    return '요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
  }

  if (/cors|access-control-allow-origin/i.test(plain)) {
    return '보안 정책으로 요청이 차단되었습니다. 잠시 후 다시 시도해 주세요.'
  }

  if (/unauthorized|unauthenticated/i.test(plain)) {
    return '로그인이 필요하거나 세션이 만료되었습니다.'
  }

  if (/forbidden|permission denied|access denied/i.test(plain)) {
    return '이 작업을 수행할 권한이 없습니다.'
  }

  if (/gallery not found/i.test(plain)) {
    return '갤러리를 찾을 수 없습니다.'
  }

  if (/post not found|comment not found/i.test(plain)) {
    return '요청한 게시물/댓글을 찾을 수 없습니다.'
  }

  if (/^not found$/i.test(plain) || /^404(\s|$)/i.test(plain)) {
    return '요청한 정보를 찾을 수 없습니다.'
  }

  if (/bad gateway/i.test(plain) || /^502(\s|$)/i.test(plain)) {
    return '서버 게이트웨이 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
  }

  if (/service unavailable/i.test(plain) || /^503(\s|$)/i.test(plain)) {
    return '서비스를 일시적으로 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.'
  }

  if (/gateway timeout/i.test(plain) || /^504(\s|$)/i.test(plain)) {
    return '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
  }

  if (/internal server error/i.test(plain) || /^500(\s|$)/i.test(plain)) {
    return '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
  }

  if (/^request failed$/i.test(plain) || /request failed with status code/i.test(plain)) {
    return '요청에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  }

  if (/failed to load|loading chunk|chunkloaderror/i.test(plain)) {
    return '페이지 일부를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.'
  }

  if (/json\.parse|unexpected token|unexpected end of (json|input)/i.test(plain)) {
    return '서버 응답을 해석하지 못했습니다. 잠시 후 다시 시도해 주세요.'
  }

  const requiredLocalized = localizeRequiredFieldMessage(plain)
  if (requiredLocalized) return requiredLocalized

  const fieldLabel = localizeFieldLabel(plain)
  if (fieldLabel && /\bis (?:not |in)?valid\b/i.test(plain)) {
    return `${fieldLabel} 값이 올바르지 않습니다.`
  }
  if (fieldLabel && /\balready exists\b|\bis taken\b|\bduplicate\b/i.test(plain)) {
    return `이미 사용 중인 ${fieldLabel}입니다.`
  }
  if (fieldLabel && /\btoo (?:long|short)\b|\bmust be (?:at least|between|no more than)\b/i.test(plain)) {
    return `${fieldLabel} 길이를 확인해 주세요.`
  }

  // 영문만으로 된 짧은 실패/검증 문구
  if (/^[A-Za-z][A-Za-z0-9 .,'"_\-/:]{0,120}$/.test(plain)) {
    if (/fail|error|unable|cannot|could not|invalid|denied|required|missing/i.test(plain)) {
      return '요청 처리 중 오류가 발생했습니다.'
    }
  }

  return plain
}

const FIELD_LABELS = {
  description: '설명',
  name: '이름',
  title: '제목',
  slug: '주소(ID)',
  galleryid: '갤러리 ID',
  gallery_id: '갤러리 ID',
  reason: '개설 이유',
  topic: '카테고리',
  gallerytopicid: '카테고리',
  gallery_topic_id: '카테고리',
  gallerytopic: '카테고리',
  gallerytype: '갤러리 유형',
  gallery_type: '갤러리 유형',
  visibility: '공개 설정',
  password: '비밀번호',
  username: '식별 코드',
  nickname: '닉네임',
  email: '이메일',
  content: '내용',
  captcha: '캡차',
  captchaid: '캡차',
  captchaanswer: '캡차 답',
  securitycode: '보안 코드',
}

function localizeFieldLabel(raw) {
  const key = String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
  return FIELD_LABELS[key] || ''
}

/** "description is required." / "Field description is required" 등 */
function localizeRequiredFieldMessage(plain) {
  const patterns = [
    /^field\s+["']?(.+?)["']?\s+is\s+required\.?$/i,
    /^the\s+(.+?)\s+field\s+is\s+required\.?$/i,
    /^missing\s+(?:required\s+)?(?:field\s+)?["']?(.+?)["']?\.?$/i,
    /^["']?(.+?)["']?\s+must\s+not\s+be\s+(?:empty|blank)\.?$/i,
    /^(.+?)\s+is\s+required\.?$/i,
  ]

  const requiredHints = {
    description: '설명을 입력해 주세요.',
    name: '이름을 입력해 주세요.',
    title: '제목을 입력해 주세요.',
    slug: '주소(ID)를 입력해 주세요.',
    galleryid: '갤러리 ID를 입력해 주세요.',
    gallery_id: '갤러리 ID를 입력해 주세요.',
    reason: '개설 이유를 입력해 주세요.',
    topic: '카테고리를 선택해 주세요.',
    gallerytopicid: '카테고리를 선택해 주세요.',
    gallery_topic_id: '카테고리를 선택해 주세요.',
    gallerytopic: '카테고리를 선택해 주세요.',
    gallerytype: '갤러리 유형을 선택해 주세요.',
    gallery_type: '갤러리 유형을 선택해 주세요.',
    visibility: '공개 설정을 선택해 주세요.',
    password: '비밀번호를 입력해 주세요.',
    username: '식별 코드를 입력해 주세요.',
    nickname: '닉네임을 입력해 주세요.',
    email: '이메일을 입력해 주세요.',
    content: '내용을 입력해 주세요.',
    captcha: '캡차 답을 입력해 주세요.',
    captchaid: '캡차를 다시 불러와 주세요.',
    captchaanswer: '캡차 답을 입력해 주세요.',
    securitycode: '보안 코드를 입력해 주세요.',
  }

  for (const re of patterns) {
    const m = plain.match(re)
    if (!m?.[1]) continue
    const key = String(m[1])
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
    if (requiredHints[key]) return requiredHints[key]
    const label = localizeFieldLabel(m[1])
    if (label) return `${label}을(를) 입력해 주세요.`
    return '필수 항목을 입력해 주세요.'
  }

  if (/^this field is required\.?$/i.test(plain) || /^required\.?$/i.test(plain)) {
    return '필수 항목을 입력해 주세요.'
  }

  return ''
}

function pickRawGraphQLErrorMessage(err) {
  if (err == null) return ''
  if (typeof err === 'string') return err

  if (CombinedGraphQLErrors.is(err)) {
    const msg = err.errors?.[0]?.message
    if (typeof msg === 'string' && msg.trim()) return msg
  }

  const graphQLErrors = err?.graphQLErrors
  if (Array.isArray(graphQLErrors) && graphQLErrors.length > 0) {
    const msg = graphQLErrors[0]?.message
    if (typeof msg === 'string' && msg.trim()) return msg
  }

  const networkError = err?.networkError
  if (networkError) {
    const nested =
      networkError?.result?.errors?.[0]?.message ||
      networkError?.cause?.message ||
      networkError?.message
    if (typeof nested === 'string' && nested.trim()) return nested
  }

  const causeMsg = err?.cause?.message
  if (typeof causeMsg === 'string' && causeMsg.trim()) return causeMsg

  const msg = err?.message
  if (typeof msg === 'string' && msg.trim()) return msg

  // 일부 환경에서 message 없이 toString만 "Failed to fetch"인 경우
  try {
    const asText = String(err)
    if (asText && asText !== '[object Object]') {
      return asText.replace(/^\[object \w+\]$/, '').trim()
    }
  } catch {
    // ignore
  }

  return ''
}

/**
 * Apollo Client 4는 GraphQL 오류를 `CombinedGraphQLErrors`로 넘깁니다.
 * 구버전 `graphQLErrors` 필드도 함께 처리합니다.
 */
export function firstGraphQLErrorMessage(err) {
  const localized = localizeErrorMessage(pickRawGraphQLErrorMessage(err))
  if (localized) return localized

  return '요청 처리 중 오류가 발생했습니다.'
}
