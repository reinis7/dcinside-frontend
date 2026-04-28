import { gql } from '@apollo/client/core'
import { useMemo, useState } from 'react'
import JoditEditor from 'jodit-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apolloClient } from '../../apollo/apolloClient'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'
import { useAuth } from '../../auth/authContext'
import 'jodit/es2021/jodit.min.css'

const CREATE_MAIN_POST_WITH_META_INPUT_MUTATION = gql`
  mutation CreateMainPostWithMetaInput($title: String!, $content: String!, $galleryId: String!) {
    createPost(
      input: {
        title: $title
        content: $content
        status: PUBLISH
        metaInput: { gallery_id: $galleryId }
      }
    ) {
      post {
        databaseId
      }
    }
  }
`

const CREATE_MAIN_POST_WITH_META_DATA_MUTATION = gql`
  mutation CreateMainPostWithMetaData($title: String!, $content: String!, $galleryId: String!) {
    createPost(
      input: {
        title: $title
        content: $content
        status: PUBLISH
        metaData: [{ key: "gallery_id", value: $galleryId }]
      }
    ) {
      post {
        databaseId
      }
    }
  }
`

export function GallMainBoardWritePage() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthed } = useAuth()
  const galleryId = searchParams.get('id') || 'dcbest'

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const loginHref = `/sign/login?s_url=${encodeURIComponent(`/gall/board/write/?id=${galleryId}`)}`
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      autofocus: false,
      statusbar: false,
      toolbarAdaptive: false,
      toolbarButtonSize: 'small',
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      minHeight: 430,
      maxHeight: 430,
      placeholder: '내용을 입력해 주세요.',
    }),
    [],
  )

  async function handleSubmit() {
    if (!isAuthed) {
      nav(loginHref)
      return
    }
    if (!title.trim() || !content.trim()) {
      setErrorMsg('제목과 내용을 입력해주세요.')
      return
    }

    setSubmitting(true)
    setErrorMsg('')
    try {
      const variables = { title: title.trim(), content, galleryId }
      try {
        await apolloClient.mutate({
          mutation: CREATE_MAIN_POST_WITH_META_INPUT_MUTATION,
          variables,
        })
      } catch (e1) {
        const msg = firstGraphQLErrorMessage(e1) || ''
        const raw = (() => {
          try {
            return JSON.stringify(e1) || ''
          } catch {
            return ''
          }
        })()
        const shouldRetryMetaData = `${msg}\n${raw}`.includes('metaInput')
        if (!shouldRetryMetaData) throw e1
        await apolloClient.mutate({
          mutation: CREATE_MAIN_POST_WITH_META_DATA_MUTATION,
          variables,
        })
      }
      nav(`/gall/board/lists/?id=${encodeURIComponent(galleryId)}`)
    } catch (e) {
      setErrorMsg(firstGraphQLErrorMessage(e) || '글쓰기 처리 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="border border-[#3b4890] bg-white">
      <div className="border-b border-[#d5dbe6] px-3 py-2">
        <h2 className="text-[18px] font-bold text-[#232c5f]">글쓰기</h2>
        <div className="mt-0.5 text-[12px] text-[#666]">
          갤러리: <span className="font-semibold text-[#333]">{galleryId}</span>
        </div>
      </div>

      <div className="px-3 py-3">
        {!isAuthed ? (
          <div className="mb-3 rounded-sm border border-[#e5e7eb] bg-[#f9fafb] p-3 text-[12px] text-[#444]">
            로그인이 필요합니다.{' '}
            <button type="button" onClick={() => nav(loginHref)} className="font-bold text-[#2f3d8f] hover:underline">
              로그인
            </button>
          </div>
        ) : null}

        <div className="grid gap-2">
          <label className="grid gap-1">
            <span className="text-[12px] font-semibold text-[#333]">제목</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-[34px] w-full rounded-sm border border-[#cfd4dd] px-2 text-[13px] outline-none focus:border-[#3b4890]"
              placeholder="제목을 입력하세요"
              disabled={submitting}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-[12px] font-semibold text-[#333]">내용</span>
            <div className="overflow-hidden rounded-sm border border-[#cfd4dd] bg-white">
              <JoditEditor value={content} config={editorConfig} onChange={setContent} />
            </div>
          </label>

          {errorMsg ? <div className="text-[12px] font-semibold text-[#d31900]">{errorMsg}</div> : null}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => nav(`/gall/board/lists/?id=${encodeURIComponent(galleryId)}`)}
              className="h-[34px] rounded-sm border border-[#cfd4dd] bg-white px-3 text-[13px] font-semibold text-[#333]"
              disabled={submitting}
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="h-[34px] rounded-sm border border-[#2f3d8f] bg-[#3b4890] px-4 text-[13px] font-bold text-white disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

