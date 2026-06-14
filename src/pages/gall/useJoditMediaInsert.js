import { useCallback, useRef } from 'react'
import { focusCursorAfterMedia, insertMediaIntoJoditEditor, mediaHtmlWithCursorLine } from '../../utils/joditMediaInsert'

export function useJoditMediaInsert(setContent) {
  const editorRef = useRef(null)

  const insertMediaHtml = useCallback(
    (mediaHtml) => {
      const editor = editorRef.current
      const inserted = insertMediaIntoJoditEditor(editor, mediaHtml)
      if (!inserted) {
        setContent((prev) => `${prev || ''}${mediaHtmlWithCursorLine(mediaHtml)}`)
        return
      }

      setContent(editor.value)

      // Restoring cursor after React re-syncs the editor value.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          focusCursorAfterMedia(editor)
        })
      })
    },
    [setContent],
  )

  return { editorRef, insertMediaHtml }
}
