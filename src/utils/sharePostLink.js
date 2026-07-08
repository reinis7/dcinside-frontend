export async function copyPostLinkToClipboard(url) {
  if (!url) {
    throw new Error('복사할 주소가 없습니다.')
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url)
    return
  }

  if (typeof document === 'undefined') {
    throw new Error('클립보드 복사를 지원하지 않는 환경입니다.')
  }

  const textarea = document.createElement('textarea')
  textarea.value = url
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)

  if (!copied) {
    throw new Error('클립보드 복사에 실패했습니다.')
  }
}

export async function sharePostLink({ url, title } = {}) {
  if (!url) {
    throw new Error('공유할 주소가 없습니다.')
  }

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    await navigator.share({
      title: title || document.title,
      url,
    })
    return 'shared'
  }

  await copyPostLinkToClipboard(url)
  return 'copied'
}
