import { CombinedGraphQLErrors } from '@apollo/client/errors'

export const DUPLICATE_GALLERY_ADDRESS_MESSAGE = '이미 사용 중인 갤러리 주소입니다.'

function collectMessages(messages, value) {
  if (typeof value !== 'string') return
  const trimmed = value.trim()
  if (trimmed) messages.push(trimmed)
}

function collectGraphQLErrors(messages, errors) {
  if (!Array.isArray(errors)) return
  for (const error of errors) collectMessages(messages, error?.message)
}

/** True when dcinsideCreateGallery rejected the address with the exact UserError message. */
export function isDuplicateGalleryAddressError(err) {
  if (!err || typeof err !== 'object') return false
  const messages = []
  if (CombinedGraphQLErrors.is(err)) collectGraphQLErrors(messages, err.errors)
  collectGraphQLErrors(messages, err.graphQLErrors)
  collectGraphQLErrors(messages, err.errors)
  collectGraphQLErrors(messages, err.networkError?.result?.errors)
  collectMessages(messages, err.message)
  return messages.includes(DUPLICATE_GALLERY_ADDRESS_MESSAGE)
}
