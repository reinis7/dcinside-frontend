import { useCallback, useRef, useState } from 'react'
import { insertMediaIntoJoditEditor, mediaHtmlWithCursorLine } from '../../utils/joditMediaInsert'

/**
 * jodit-react는 value prop이 바뀔 때마다 editor.value를 다시 넣어 커서가 맨 앞으로 갑니다.
 * 타이핑 중에는 React state(value)를 갱신하지 않고 ref만 갱신합니다.
 * 외부 데이터 주입(수정 모드 로드 등)에만 value를 바꿉니다.
 */
export function useJoditEditorState(initialHtml = '') {
  const editorRef = useRef(null)
  const contentRef = useRef(initialHtml)
  const [seedValue, setSeedValue] = useState(initialHtml)

  const setFromExternal = useCallback((html) => {
    const next = html || ''
    contentRef.current = next
    setSeedValue(next)
  }, [])

  const syncFromEditor = useCallback(() => {
    const editor = editorRef.current
    if (editor && typeof editor.value === 'string') {
      contentRef.current = editor.value
    }
    return contentRef.current
  }, [])

  const getContent = useCallback(() => syncFromEditor(), [syncFromEditor])

  const onChange = useCallback((html) => {
    contentRef.current = html ?? ''
  }, [])

  const onBlur = useCallback((html) => {
    contentRef.current = html ?? ''
  }, [])

  const insertMediaHtml = useCallback((mediaHtml) => {
    const editor = editorRef.current
    const inserted = insertMediaIntoJoditEditor(editor, mediaHtml)
    if (!inserted) {
      // 에디터 인스턴스가 아직 없으면 seed로만 반영
      const next = `${contentRef.current || ''}${mediaHtmlWithCursorLine(mediaHtml)}`
      contentRef.current = next
      setSeedValue(next)
      return
    }
    // 에디터 DOM에 이미 삽입됨 → value seed를 건드리면 커서가 리셋되므로 ref만 동기화
    contentRef.current = editor.value
  }, [])

  return {
    editorRef,
    value: seedValue,
    onChange,
    onBlur,
    getContent,
    setFromExternal,
    insertMediaHtml,
  }
}
