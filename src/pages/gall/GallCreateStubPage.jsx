import { useQuery } from '@apollo/client/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'
import { apolloClient } from '../../apollo/apolloClient'
import { MainGalleryCreateForm } from './create/MainGalleryCreateForm'
import { MinorGalleryCreateForm } from './create/MinorGalleryCreateForm'
import { MiniGalleryCreateForm } from './create/MiniGalleryCreateForm'
import { PersonGalleryCreateForm } from './create/PersonGalleryCreateForm'
import { CREATE_GALLERY_MUTATION, GALLERY_TOPICS_QUERY } from './create/galleryCreateGraphql'
import {
  backToFromPath,
  createTopicKeyFromPathname,
  galleryLabelFromTopicKey,
  galleryTypeHintFromPath,
  isBranchCreatePath,
  titleFromPath,
} from './create/galleryCreatePaths'

export function GallCreateStubPage() {
  const loc = useLocation()
  const navigate = useNavigate()
  const createTopicKey = createTopicKeyFromPathname(loc.pathname)
  const title = useMemo(() => titleFromPath(loc.pathname), [loc.pathname])
  const backTo = useMemo(() => backToFromPath(loc.pathname), [loc.pathname])
  const isGalleryBranchCreate = isBranchCreatePath(loc.pathname)
  const isMinorCreatePath = createTopicKey === 'minor'
  const isMiniCreatePath = createTopicKey === 'mini'
  const isMainCreatePath = createTopicKey === 'main'
  const galleryLabel = createTopicKey ? galleryLabelFromTopicKey(createTopicKey) : '갤러리'

  const [showMinorNotice, setShowMinorNotice] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    slug: '',
    topicId: '',
    reason: '',
    visibility: 'public',
    agreedPrivacy: false,
    agreedRules: false,
    agreedPromoteToMain: false,
  })

  const { data: topicData, loading: isTopicLoading, error: topicError } = useQuery(GALLERY_TOPICS_QUERY, {
    skip: !isGalleryBranchCreate,
  })

  const topicOptions = useMemo(() => {
    const edges = topicData?.galleryTopics?.edges ?? []
    return edges
      .map((edge) => edge?.node)
      .filter((node) => node?.name)
      .map((node) => ({
        key: node.slug || String(node.databaseId || node.id),
        value: String(node.databaseId || node.slug || node.id),
        label: node.name,
      }))
  }, [topicData])

  const selectedGalleryTypeDatabaseId = useMemo(() => {
    const typeHint = galleryTypeHintFromPath(loc.pathname)
    const edges = topicData?.galleryTypes?.edges ?? []
    const nodes = edges.map((edge) => edge?.node).filter(Boolean)
    const matched = nodes.find((node) => {
      const slug = String(node?.slug || '').toLowerCase()
      const name = String(node?.name || '')
      if (!typeHint) return false
      if (slug.includes(typeHint)) return true
      if (typeHint === '마이너' && (slug.includes('minor') || name.includes('마이너'))) return true
      if (typeHint === '미니' && (slug.includes('mini') || name.includes('미니'))) return true
      if (typeHint === '인물' && (slug.includes('person') || name.includes('인물'))) return true
      if (typeHint === '메인' && (slug.includes('main') || name.includes('메인'))) return true
      return name.includes(typeHint)
    })
    return matched?.databaseId ? String(matched.databaseId) : ''
  }, [loc.pathname, topicData])

  const nameLength = form.name.length
  const descriptionLength = form.description.length
  const slugLength = form.slug.length
  const reasonLength = form.reason.length

  const canSubmit =
    form.name.trim().length > 0 &&
    form.slug.trim().length > 0 &&
    form.topicId.trim().length > 0 &&
    (isMiniCreatePath || form.reason.trim().length > 0) &&
    form.agreedPrivacy &&
    form.agreedRules &&
    (isMiniCreatePath || isMainCreatePath || form.agreedPromoteToMain) &&
    selectedGalleryTypeDatabaseId.length > 0 &&
    !isSubmitting

  function setFormField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleCreate() {
    if (!canSubmit) {
      window.alert('필수 입력/동의 항목을 확인해 주세요.')
      return
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      slug: form.slug.trim(),
      reason: isMiniCreatePath ? '미니 갤러리 개설' : form.reason.trim(),
      gallery_type: selectedGalleryTypeDatabaseId,
      galleryTopicId: String(form.topicId).trim(),
    }

    setIsSubmitting(true)
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_GALLERY_MUTATION,
        variables: { input: payload },
      })
      const result = data?.dcinsideCreateGallery
      if (!result?.success) {
        throw new Error(result?.message || '갤러리 생성에 실패했습니다.')
      }
      window.alert(`${galleryLabel} 생성 요청이 완료되었습니다.`)
      navigate(backTo)
    } catch (err) {
      window.alert(firstGraphQLErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!isMinorCreatePath) return
    const storageKey = 'dcinside.gall.m.create.notice.v1'
    const alreadyShown = localStorage.getItem(storageKey) === '1'
    if (!alreadyShown) {
      setShowMinorNotice(true)
      localStorage.setItem(storageKey, '1')
    }
  }, [isMinorCreatePath])

  const branchFormProps = {
    form,
    setFormField,
    backTo,
    canSubmit,
    handleCreate,
    isSubmitting,
    isTopicLoading,
    topicError,
    topicOptions,
    nameLength,
    descriptionLength,
    slugLength,
  }

  return (
    <>
      {showMinorNotice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-[560px] border-4 border-[#2d418f] bg-white p-6 text-[#333]">
            <div className="mb-3 text-center text-[20px] font-bold tracking-[-0.02em] text-[#2d418f]">신청 시 유의 사항</div>

            <div className="space-y-3 text-[12px] leading-[1.5]">
              <div>
                <div className="mb-1 text-[14px] font-bold text-[#111]">중복 주제는 개설 불가</div>
                <p>동일한 주제의 마이너 갤러리가 이미 존재할 경우 개설 신청이 반려됩니다.</p>
                <p>신청 전에 갤러리명 검색하여 중복 주제를 확인할 수 있습니다.</p>
                <p>
                  ※ 미니 갤러리는 중복 주제 개설이 가능합니다.{' '}
                  <Link to="/gall/n/create" className="text-[#777] underline hover:text-[#444]">
                    미니 갤러리 개설하기
                  </Link>
                </p>
              </div>

              <div>
                <div className="mb-1 text-[14px] font-bold text-[#111]">마이너 갤러리 승격 안내</div>
                <p>영화, 드라마 등의 마이너 갤러리는 심사 후 메인 갤러리로 승격됩니다.</p>
                <p>승격 여부는 전적으로 회사에 의해 결정되며, 승격 시 매니저 권한은 회수됩니다.</p>
              </div>
            </div>

            <div className="mt-5 text-center">
              <button
                type="button"
                className="h-[32px] min-w-[74px] rounded border border-[#253f90] bg-[#2f4aa0] px-3 text-[14px] font-bold text-white"
                onClick={() => setShowMinorNotice(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isGalleryBranchCreate ? (
        createTopicKey === 'mini' ? (
          <MiniGalleryCreateForm {...branchFormProps} />
        ) : createTopicKey === 'main' ? (
          <MainGalleryCreateForm {...branchFormProps} reasonLength={reasonLength} />
        ) : createTopicKey === 'person' ? (
          <PersonGalleryCreateForm {...branchFormProps} reasonLength={reasonLength} />
        ) : createTopicKey === 'minor' ? (
          <MinorGalleryCreateForm {...branchFormProps} galleryLabel={galleryLabel} formVariant="minor" reasonLength={reasonLength} />
        ) : null
      ) : (
        <section className="rounded border border-[#d3d3d3] bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-[16px] font-semibold">{title}</div>
            <Link to={backTo} className="text-[12px] text-[#334499] hover:underline">
              돌아가기
            </Link>
          </div>
          <div className="mt-3 text-[12px] text-[#666]">기초 틀만 남겨둔 상태입니다. (다시 설계 후 구현 예정)</div>
        </section>
      )}
    </>
  )
}
