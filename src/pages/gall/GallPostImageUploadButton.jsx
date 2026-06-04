import { useRef, useState } from 'react'
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

export function GallPostImageUploadButton({
  children = '이미지 첨부',
  className = '',
  disabled = false,
  onError,
  onUploaded,
  onUploadingChange,
}) {
  const inputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)

  function setUploading(nextValue) {
    setIsUploading(nextValue)
    onUploadingChange?.(nextValue)
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      onError?.('이미지 파일만 업로드할 수 있습니다.')
      return
    }

    setUploading(true)
    try {
      const media = await uploadWordpressMedia(file)
      onUploaded?.(imageHtmlFromMedia(media, file), media)
    } catch (error) {
      onError?.(error?.message || '이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className={className}
        disabled={disabled || isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? '업로드 중...' : children}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </>
  )
}
