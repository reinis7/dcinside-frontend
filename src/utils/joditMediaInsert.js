export function mediaHtmlWithCursorLine(mediaHtml) {
  if (!mediaHtml) return '<p><br></p>'
  if (/<p>\s*<br\s*\/?>\s*<\/p>\s*$/i.test(mediaHtml)) return mediaHtml
  return `${mediaHtml}<p><br></p>`
}

export function focusCursorAfterMedia(editor) {
  if (!editor?.s || !editor?.editor) return

  const lastParagraph = editor.editor.querySelector('p:last-child')
  if (lastParagraph) {
    editor.s.setCursorIn(lastParagraph, false)
  }
  editor.s.focus()
}

export function insertMediaIntoJoditEditor(editor, mediaHtml) {
  if (!editor?.s || !editor?.editor) return false

  const html = mediaHtmlWithCursorLine(mediaHtml)
  editor.s.focus()

  const range = editor.s.createRange(false)
  range.selectNodeContents(editor.editor)
  range.collapse(false)
  editor.s.selectRange(range)
  editor.s.insertHTML(html, true)
  focusCursorAfterMedia(editor)

  return true
}
