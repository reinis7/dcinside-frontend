/** 식별 코드: 영문/숫자 시작, 영문·숫자·-·_ 만, 3~20자 */
export const USERNAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{2,19}$/

/** 닉네임: 앞뒤 공백 제외 2~20자 */
export const NICKNAME_PATTERN = /^.{2,20}$/

/** 비밀번호: 8자 이상 */
export const PASSWORD_MIN_LENGTH = 8

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * @param {string} username
 * @returns {string} 오류 메시지, 통과 시 ''
 */
export function validateUsername(username) {
  const value = String(username ?? '').trim()
  if (!value) return '식별 코드를 입력해 주세요.'
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)) {
    return '식별 코드에는 한글을 사용할 수 없습니다. 영문/숫자만 입력해 주세요.'
  }
  if (!USERNAME_PATTERN.test(value)) {
    return '식별 코드는 영문/숫자로 시작하고, 영문·숫자·-·_ 만 사용해 3~20자로 입력해 주세요.'
  }
  return ''
}

/**
 * @param {string} password
 * @returns {string}
 */
export function validatePassword(password) {
  const value = String(password ?? '')
  if (!value) return '비밀번호를 입력해 주세요.'
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`
  }
  return ''
}

/**
 * @param {string} nickname
 * @returns {string}
 */
export function validateNickname(nickname) {
  const value = String(nickname ?? '').trim()
  if (!value) return '닉네임을 입력해 주세요.'
  if (!NICKNAME_PATTERN.test(value)) {
    return '닉네임은 2~20자로 입력해 주세요.'
  }
  return ''
}

/**
 * 이메일은 선택. 값이 있을 때만 형식 검사.
 * @param {string} email
 * @returns {string}
 */
export function validateEmailOptional(email) {
  const value = String(email ?? '').trim()
  if (!value) return ''
  if (!EMAIL_PATTERN.test(value)) {
    return '이메일 형식이 올바르지 않습니다.'
  }
  return ''
}

/**
 * 가입 정보 일괄 검증
 * @param {{ username?: string, userId?: string, password?: string, nickname?: string, email?: string }} form
 * @returns {string}
 */
export function validateJoinForm(form) {
  const username = form?.username ?? form?.userId ?? ''
  return (
    validateUsername(username) ||
    validatePassword(form?.password) ||
    validateNickname(form?.nickname) ||
    validateEmailOptional(form?.email) ||
    ''
  )
}
