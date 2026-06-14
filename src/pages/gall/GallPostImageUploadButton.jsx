import { useState } from 'react'
import { uploadWordpressMedia } from '../../api/wordpressMediaApi'

function escapeHtmlAttribute(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function imageHtmlFromMedia(media, file) {
  const fallbackAlt = file?.name ? file.name.replace(/\.[^.]+$/, '') : 'uploaded image'
  const alt = escapeHtmlAttribute(media.altText || fallbackAlt)
  const src = escapeHtmlAttribute(media.sourceUrl)
  return `<p><img src="${src}" alt="${alt}" /></p>`
}

function videoHtmlFromMedia(media) {
  const src = escapeHtmlAttribute(media.sourceUrl)
  return `<p><video controls src="${src}" style="max-width: 100%; height: auto;"></video></p>`
}

function htmlFromMedia(media, file, mediaType) {
  if (mediaType === 'video') return videoHtmlFromMedia(media)
  return imageHtmlFromMedia(media, file)
}

export function GallPostImageUploadButton({
  children = '이미지 첨부',
  className = '',
  disabled = false,
  mediaType = 'image',
  onError,
  onUploaded,
  onUploadingChange,
}) {
  const [isUploading, setIsUploading] = useState(false)

  function setUploading(nextValue) {
    setIsUploading(nextValue)
    onUploadingChange?.(nextValue)
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith(`${mediaType}/`)) {
      onError?.(mediaType === 'video' ? '동영상 파일만 업로드할 수 있습니다.' : '이미지 파일만 업로드할 수 있습니다.')
      return
    }

    setUploading(true)
    try {
      const media = await uploadWordpressMedia(file)
      onUploaded?.(htmlFromMedia(media, file, mediaType), media)
    } catch (error) {
      onError?.(error?.message || (mediaType === 'video' ? '동영상 업로드에 실패했습니다.' : '이미지 업로드에 실패했습니다.'))
    } finally {
      setUploading(false)
    }
  }

  function openFilePicker() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = `${mediaType}/*`
    input.onchange = handleFileChange
    input.click()
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || isUploading}
      onClick={openFilePicker}
    >
      {isUploading ? '업로드 중...' : children}
    </button>
  )
}
