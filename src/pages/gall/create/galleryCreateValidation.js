/** 갤러리 주소(slug): 영문 소문자/숫자/_/- , 2~20자 */
export const GALLERY_SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{1,19}$/

/**
 * @param {string} name
 * @param {{ max?: number, label?: string }} [opts]
 * @returns {string}
 */
export function validateGalleryName(name, { max = 12, label = '이름' } = {}) {
  const value = String(name ?? '').trim()
  if (!value) return `${label}을(를) 입력해 주세요.`
  if (value.length > max) return `${label}은(는) ${max}자 이내로 입력해 주세요.`
  return ''
}

/**
 * @param {string} description
 * @param {{ required?: boolean, max?: number }} [opts]
 * @returns {string}
 */
export function validateGalleryDescription(description, { required = true, max = 200 } = {}) {
  const value = String(description ?? '').trim()
  if (required && !value) return '설명을 입력해 주세요.'
  if (value.length > max) return `설명은 ${max}자 이내로 입력해 주세요.`
  return ''
}

/**
 * @param {string} slug
 * @returns {string}
 */
export function validateGallerySlug(slug) {
  const value = String(slug ?? '').trim()
  if (!value) return '주소를 입력해 주세요.'
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)) {
    return '주소에는 한글을 사용할 수 없습니다. 영문 소문자/숫자만 입력해 주세요.'
  }
  if (/[A-Z]/.test(value)) {
    return '주소는 영문 소문자만 사용할 수 있습니다.'
  }
  if (!GALLERY_SLUG_PATTERN.test(value)) {
    return '주소는 영문 소문자/숫자로 시작하고, 영문 소문자·숫자·-·_ 만 사용해 2~20자로 입력해 주세요.'
  }
  return ''
}

/**
 * @param {string} topicId
 * @returns {string}
 */
export function validateGalleryTopic(topicId) {
  if (!String(topicId ?? '').trim()) return '카테고리를 선택해 주세요.'
  return ''
}

/**
 * @param {string} reason
 * @param {{ required?: boolean }} [opts]
 * @returns {string}
 */
export function validateGalleryReason(reason, { required = true } = {}) {
  if (!required) return ''
  if (!String(reason ?? '').trim()) return '개설 이유를 입력해 주세요.'
  return ''
}

/**
 * @param {{ name: string, description: string, slug: string, topicId: string, reason?: string, agreedPrivacy: boolean, agreedRules: boolean, agreedPromoteToMain?: boolean, visibility?: string }} form
 * @param {{ isMini?: boolean, isMain?: boolean, requirePromoteAgree?: boolean, galleryTypeReady?: boolean }} opts
 * @returns {{ fieldErrors: Record<string, string>, firstError: string }}
 */
export function validateGalleryCreateForm(form, opts = {}) {
  const {
    isMini = false,
    isMain = false,
    requirePromoteAgree = !isMini && !isMain,
    galleryTypeReady = true,
  } = opts

  const fieldErrors = {
    name: validateGalleryName(form?.name),
    description: validateGalleryDescription(form?.description, { required: true }),
    slug: validateGallerySlug(form?.slug),
    topicId: validateGalleryTopic(form?.topicId),
    reason: validateGalleryReason(form?.reason, { required: !isMini }),
    agreedPrivacy: form?.agreedPrivacy ? '' : '개인정보정책에 동의해 주세요.',
    agreedRules: form?.agreedRules ? '' : '운영원칙에 동의해 주세요.',
    agreedPromoteToMain:
      !requirePromoteAgree || form?.agreedPromoteToMain ? '' : '메인 갤러리 승격 관련 안내에 동의해 주세요.',
    galleryType: galleryTypeReady ? '' : '갤러리 유형 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
  }

  const order = [
    'name',
    'description',
    'slug',
    'topicId',
    'reason',
    'agreedPrivacy',
    'agreedRules',
    'agreedPromoteToMain',
    'galleryType',
  ]
  const firstError = order.map((key) => fieldErrors[key]).find(Boolean) || ''

  return { fieldErrors, firstError }
}
