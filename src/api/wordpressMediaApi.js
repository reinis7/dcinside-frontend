import { getAuthorizationHeader } from '../auth/jwtStorage'
import { ensureValidAccessToken } from '../auth/authApi'
import { firstGraphQLErrorMessage, localizeErrorMessage } from './firstGraphQLErrorMessage'
import { buildWordpressRestUrl } from './wordpressRestApi'

function getUploadEndpoint() {
  const explicitEndpoint = import.meta.env.VITE_WORDPRESS_MEDIA_URI?.trim()
  if (explicitEndpoint) return explicitEndpoint
  return buildWordpressRestUrl('/media')
}

function pickMediaUrl(media) {
  return media?.source_url || media?.media_details?.sizes?.full?.source_url || media?.guid?.rendered || ''
}

async function uploadMediaWithRest(file) {
  const authHeader = getAuthorizationHeader()
  if (!authHeader) throw new Error('미디어 업로드는 로그인이 필요합니다.')

  const formData = new FormData()
  formData.append('file', file, file.name)

  let response
  try {
    response = await fetch(getUploadEndpoint(), {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        Accept: 'application/json',
      },
      credentials: 'include',
      body: formData,
    })
  } catch (err) {
    throw new Error(firstGraphQLErrorMessage(err) || '서버에 연결하지 못했습니다. 네트워크 상태를 확인해 주세요.')
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        localizeErrorMessage(payload?.message) ||
          '미디어 업로드 권한이 없습니다. WordPress REST 미디어 API가 현재 로그인 토큰을 인증하지 못하고 있습니다.',
      )
    }
    throw new Error(
      localizeErrorMessage(payload?.message) || `미디어 업로드에 실패했습니다. (${response.status})`,
    )
  }

  const url = pickMediaUrl(payload)
  if (!url) throw new Error('업로드된 미디어 주소를 찾을 수 없습니다.')

  return {
    id: payload?.id ?? null,
    sourceUrl: url,
    altText: payload?.alt_text || '',
    title: payload?.title?.rendered || file.name,
  }
}

export async function uploadWordpressMedia(file) {
  if (!file) throw new Error('업로드할 미디어를 선택해 주세요.')

  const hasValidAccess = await ensureValidAccessToken()
  if (!hasValidAccess) throw new Error('미디어 업로드는 로그인이 필요합니다.')

  return await uploadMediaWithRest(file)
}
