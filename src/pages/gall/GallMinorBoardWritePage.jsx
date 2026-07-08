import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import JoditEditor from 'jodit-react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import 'jodit/es2021/jodit.min.css'
import { useAuth } from '../../auth/authContext'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'
import {
  canUserEditPost,
  GALL_POST_EDIT_QUERY,
  stripPostTitleHtml,
  updatePostById,
} from '../../api/gallPostApi'
import { apolloClient } from '../../apollo/apolloClient'
import { InlineLoader } from '../../components/common/Loader'
import { gallBoardViewHref } from '../../utils/gallBoardPaths'
import { GallPostImageUploadButton } from './GallPostImageUploadButton'
import { useJoditMediaInsert } from './useJoditMediaInsert'

const GALLERY_DETAIL_QUERY = gql`
  query GalleryWriteDetail($galleryId: String!) {
    dcinsideGalleryByGalleryId(galleryId: $galleryId) {
      galleryId
      title
      postName
    }
  }
`

function buildCreatePostMutation(variant) {
  if (variant === 'metaInput') {
    return gql`
      mutation CreatePostWithGalleryId($title: String!, $content: String!, $galleryId: String!) {
        createPost(
          input: {
            title: $title
            content: $content
            status: PUBLISH
            metaInput: { gallery_id: $galleryId }
          }
        ) {
          post {
            id
            databaseId
          }
        }
      }
    `
  }
  if (variant === 'metaDataArray') {
    return gql`
      mutation CreatePostWithGalleryId($title: String!, $content: String!, $galleryId: String!) {
        createPost(
          input: {
            title: $title
            content: $content
            status: PUBLISH
            metaData: [{ key: "gallery_id", value: $galleryId }]
          }
        ) {
          post {
            id
            databaseId
          }
        }
      }
    `
  }
  if (variant === 'customGalleryIdField') {
    return gql`
      mutation CreatePostWithGalleryId($title: String!, $content: String!, $galleryId: String!) {
        createPost(
          input: {
            title: $title
            content: $content
            status: PUBLISH
            galleryId: $galleryId
          }
        ) {
          post {
            id
            databaseId
          }
        }
      }
    `
  }
  return gql`
    mutation CreatePostSimple($title: String!, $content: String!) {
      createPost(input: { title: $title, content: $content, status: PUBLISH }) {
        post {
          id
          databaseId
        }
      }
    }
  `
}

function isSchemaMismatchError(message) {
  if (!message) return false
  return /Cannot query field|Unknown type|Unknown argument|not defined by type|did you mean|InputObject/i.test(message)
}

const CREATE_MINOR_POST_MUTATION = gql`
  mutation CreateMinorPostWithGalleryId($title: String!, $content: String!, $galleryId: String!) {
    dcinsideCreateMinorPostWithGalleryId(input: { title: $title, content: $content, galleryId: $galleryId }) {
      success
      message
      databaseId
    }
  }
`

async function createPostWithGalleryIdFallback({ title, content, galleryId }) {
  // Try multiple schema variants (metaInput -> metaData -> custom field -> plain).
  const variants = ['metaInput', 'metaDataArray', 'customGalleryIdField', 'simple']
  let lastErr = null
  for (const variant of variants) {
    try {
      const mutation = buildCreatePostMutation(variant === 'simple' ? 'simple' : variant)
      const variables = variant === 'simple' ? { title, content } : { title, content, galleryId }
      const { data } = await apolloClient.mutate({ mutation, variables })
      const post = data?.createPost?.post ?? null
      if (!post?.databaseId && !post?.id) {
        throw new Error('게시글 등록에 실패했습니다.')
      }
      return post
    } catch (err) {
      const msg = firstGraphQLErrorMessage(err)
      if (!isSchemaMismatchError(msg)) throw err
      lastErr = err
    }
  }
  throw lastErr || new Error('게시글 등록에 실패했습니다.')
}

async function createMinorPostWithGalleryId({ title, content, galleryId }) {
  const { data } = await apolloClient.mutate({
    mutation: CREATE_MINOR_POST_MUTATION,
    variables: { title, content, galleryId },
  })
  const payload = data?.dcinsideCreateMinorPostWithGalleryId
  if (!payload?.success) {
    throw new Error(payload?.message || '게시글 등록에 실패했습니다.')
  }
  return payload
}

async function createGalleryPost({ boardBase, title, content, galleryId }) {
  // Keep restricted mutation for minor/mini only, but fall back to createPost variants for everything else
  // (and also for minor/mini when the custom mutation isn't available).
  if (boardBase === 'mgallery' || boardBase === 'mini') {
    try {
      return await createMinorPostWithGalleryId({ title, content, galleryId })
    } catch (e) {
      const msg = firstGraphQLErrorMessage(e)
      if (!isSchemaMismatchError(msg)) throw e
      return await createPostWithGalleryIdFallback({ title, content, galleryId })
    }
  }
  return await createPostWithGalleryIdFallback({ title, content, galleryId })
}

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function GallMinorBoardWritePage() {
  const navigate = useNavigate()
  const loc = useLocation()
  const [searchParams] = useSearchParams()
  const { viewer, isAuthed } = useAuth()
  const galleryId = searchParams.get('id') || 'mgallery'
  const postNo = searchParams.get('no') || ''
  const isEditMode = /^\d+$/.test(postNo)
  const boardBase = loc.pathname.includes('/gall/mini/')
    ? 'mini'
    : loc.pathname.includes('/gall/p/') || loc.pathname.includes('/gall/person/')
      ? 'p'
      : 'mgallery'
  const { data, loading: isGalleryLoading } = useQuery(GALLERY_DETAIL_QUERY, {
    variables: { galleryId },
    fetchPolicy: 'network-only',
  })
  const gallery = data?.dcinsideGalleryByGalleryId ?? null
  const galleryTitle = gallery?.title ? stripHtml(gallery.title) : `${galleryId} 갤러리`
  const {
    data: editData,
    loading: isEditLoading,
    error: editQueryError,
  } = useQuery(GALL_POST_EDIT_QUERY, {
    variables: { id: postNo },
    skip: !isEditMode,
    fetchPolicy: 'network-only',
  })
  const editPost = editData?.post ?? null
  const canEdit = !isEditMode || canUserEditPost(editPost, viewer)
  const editInitializedRef = useRef(false)
  const [title, setTitle] = useState('')
  const [nickname, setNickname] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const { editorRef, insertMediaHtml } = useJoditMediaInsert(setHtmlContent)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMediaUploading, setIsMediaUploading] = useState(false)

  const listHref = useMemo(() => `/gall/${boardBase}/board/lists/?id=${encodeURIComponent(galleryId)}`, [boardBase, galleryId])
  const viewHref = useMemo(
    () => (isEditMode ? gallBoardViewHref(boardBase, galleryId, postNo) : listHref),
    [boardBase, galleryId, isEditMode, listHref, postNo],
  )
  const displayName = viewer?.username || viewer?.name || ''
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

  useEffect(() => {
    if (!displayName) return
    setNickname(displayName)
  }, [displayName])

  useEffect(() => {
    editInitializedRef.current = false
  }, [postNo])

  useEffect(() => {
    if (!editPost || editInitializedRef.current) return
    editInitializedRef.current = true
    setTitle(stripPostTitleHtml(editPost.title))
    setHtmlContent(editPost.content || '')
  }, [editPost])

  async function handleSubmit() {
    if (isSubmitting) return
    if (isMediaUploading) {
      toast.warning('미디어 업로드가 끝난 후 등록해 주세요.')
      return
    }
    if (!isAuthed) {
      navigate(`/sign/login?s_url=${encodeURIComponent(`${loc.pathname}${loc.search}`)}`)
      return
    }
    if (isEditMode && isEditLoading) {
      toast.warning('게시글을 불러오는 중입니다.')
      return
    }
    if (isEditMode && editQueryError) {
      toast.error(firstGraphQLErrorMessage(editQueryError))
      return
    }
    if (isEditMode && editPost && !canEdit) {
      toast.error('수정 권한이 없습니다.')
      return
    }
    const trimmedTitle = title.trim()
    const trimmedContent = htmlContent.trim()
    if (!trimmedTitle || !trimmedContent) {
      toast.warning('제목과 내용을 입력해 주세요.')
      return
    }
    setIsSubmitting(true)
    try {
      if (isEditMode) {
        await updatePostById({ postId: editPost.id, title: trimmedTitle, content: trimmedContent })
        toast.success('게시글이 수정되었습니다.')
        navigate(viewHref)
      } else {
        await createGalleryPost({ boardBase, title: trimmedTitle, content: trimmedContent, galleryId: String(galleryId) })
        toast.success('게시글이 등록되었습니다.')
        navigate(listHref)
      }
    } catch (err) {
      toast.error(firstGraphQLErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="border border-[#cfcfcf] bg-white">
      <div className="flex items-center justify-between border-b border-[#cfd3dc] px-3 py-2">
        <h2 className="text-[42px] leading-none font-bold tracking-[-0.02em] text-[#232c5f]">
          {isGalleryLoading ? <InlineLoader label="갤러리 불러오는 중..." /> : galleryTitle}
        </h2>
        <div className="flex items-center gap-2 text-[12px] text-[#666]">
          <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
            연관 갤러리
          </a>
          <span className="text-[#bbb]">|</span>
          <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
            갤주소 복사
          </a>
          <span className="text-[#bbb]">|</span>
          <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
            이용안내
          </a>
        </div>
      </div>

      <div className="p-5">
        {isEditMode && isEditLoading ? (
          <div className="mb-4 text-[13px] text-[#666]">
            <InlineLoader label="게시글 불러오는 중..." />
          </div>
        ) : null}
        {isEditMode && editQueryError ? (
          <div className="mb-4 rounded border border-[#f0caca] bg-[#fff5f5] px-3 py-2 text-[13px] text-[#c62828]">
            {firstGraphQLErrorMessage(editQueryError)}
          </div>
        ) : null}
        {isEditMode && editPost && !canEdit ? (
          <div className="mb-4 rounded border border-[#f0caca] bg-[#fff5f5] px-3 py-2 text-[13px] text-[#c62828]">
            수정 권한이 없습니다.
          </div>
        ) : null}
        <div className="border border-[#d9d9d9]">
          <div className="grid grid-cols-[180px_1fr] gap-2 border-b border-[#dedede] bg-[#f8f8f8] px-3 py-2">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="h-[34px] border border-[#cfcfcf] bg-white px-2 text-[14px]"
              placeholder="닉네임"
              readOnly={Boolean(displayName)}
            />
            <div className="flex items-center gap-3 text-[15px] text-[#444]">
              <span className="inline-flex rounded-full bg-[#2f3d8f] px-3 py-1 text-white">일반</span>
              <span>실베</span>
              <span>영상</span>
              <span>베스트</span>
              <span>후기</span>
              <span>문학</span>
              <span>띵곡</span>
              <span>신곡</span>
              <span>공지</span>
            </div>
          </div>

          <div className="border-b border-[#dedede] px-3 py-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-[38px] w-full border border-[#cfcfcf] bg-white px-2 text-[16px]"
              placeholder="제목을 입력해 주세요."
            />
          </div>

          <div className="px-3 py-2 text-[12px] text-[#666]">
            <div>※ 쉬운 비밀번호를 입력하면 타인의 수정, 삭제가 쉽습니다.</div>
            <div>※ 음란물, 차별, 비하, 혐오 및 초상권/저작권 침해 게시물은 제재될 수 있습니다.</div>
          </div>

          <div className="px-3 pb-3 pt-2">
            <div className="border border-[#d9d9d9] bg-[#fafafa]">
              <div className="flex items-center gap-1 border-b border-[#e5e5e5] px-2 py-1">
                <GallPostImageUploadButton
                  className="h-[28px] border border-[#d2d2d2] bg-white px-3 text-[13px] text-[#444] disabled:opacity-60"
                  disabled={isSubmitting}
                  onError={(message) => toast.error(message)}
                  onUploadingChange={setIsMediaUploading}
                  onUploaded={(mediaHtml) => {
                    insertMediaHtml(mediaHtml)
                    toast.success('이미지가 본문에 추가되었습니다.')
                  }}
                >
                  이미지
                </GallPostImageUploadButton>
                <GallPostImageUploadButton
                  className="h-[28px] border border-[#d2d2d2] bg-white px-3 text-[13px] text-[#444] disabled:opacity-60"
                  disabled={isSubmitting}
                  mediaType="video"
                  onError={(message) => toast.error(message)}
                  onUploadingChange={setIsMediaUploading}
                  onUploaded={(mediaHtml) => {
                    insertMediaHtml(mediaHtml)
                    toast.success('동영상이 본문에 추가되었습니다.')
                  }}
                >
                  동영상
                </GallPostImageUploadButton>
                {['디시콘', '유튜브', '외부컨텐츠', '시리즈', '투표', 'AI 이미지'].map((item) => (
                  <button key={item} type="button" className="h-[28px] border border-[#d2d2d2] bg-white px-3 text-[13px] text-[#444]">
                    {item}
                  </button>
                ))}
                <label className="ml-auto flex items-center gap-1 text-[12px] text-[#666]">
                  <input type="checkbox" className="h-3.5 w-3.5" />
                  HTML
                </label>
              </div>

              <div className="border-b border-[#e5e5e5] px-2 py-1 text-[13px] text-[#444]">
                맑은 고딕 · 12 · 가 · 표 · 목록 · 링크
              </div>

              <div className="bg-white">
                <JoditEditor ref={editorRef} value={htmlContent} config={editorConfig} onChange={setHtmlContent} />
              </div>

              <div className="flex items-center border-t border-[#e5e5e5] bg-[#fafafa] p-2">
                <input
                  className="h-[36px] flex-1 border border-[#d6d6d6] bg-white px-2 text-[13px]"
                  placeholder="AI 이미지 간단 등록(이미지 업로드 또는 프롬프트를 입력해 주세요)"
                />
                <button type="button" className="ml-2 h-[36px] border border-[#5f6788] bg-[#6b7398] px-4 text-[14px] font-semibold text-white">
                  등록(30회)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="h-[28px] min-w-[68px] rounded border border-[#4d4d4d] bg-[#666] px-3 text-[13px] font-bold text-white" onClick={() => navigate(viewHref)}>
            취소
          </button>
          <button
            type="button"
            className="h-[28px] min-w-[68px] rounded border border-[#293f90] bg-[#2f4aa0] px-3 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSubmit}
            disabled={isSubmitting || isMediaUploading || (isEditMode && (isEditLoading || !canEdit))}
          >
            {isMediaUploading ? '업로드중' : isSubmitting ? (isEditMode ? '수정중' : '등록중') : isEditMode ? '수정' : '등록'}
          </button>
        </div>

        <div className="mt-4">
          <Link to={viewHref} className="text-[12px] text-[#334499] hover:underline">
            {isEditMode ? '글보기로 돌아가기' : '목록으로 돌아가기'}
          </Link>
        </div>
      </div>
    </section>
  )
}

