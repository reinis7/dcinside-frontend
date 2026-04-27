import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const GALLERY_DETAIL_QUERY = gql`
  query GalleryWriteDetail($galleryId: String!) {
    dcinsideGalleryByGalleryId(galleryId: $galleryId) {
      galleryId
      title
      postName
    }
  }
`

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function GallMinorBoardWritePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const galleryId = searchParams.get('id') || 'mgallery'
  const { data } = useQuery(GALLERY_DETAIL_QUERY, {
    variables: { galleryId },
    fetchPolicy: 'network-only',
  })
  const gallery = data?.dcinsideGalleryByGalleryId ?? null
  const galleryTitle = gallery?.title ? stripHtml(gallery.title) : `${galleryId} 갤러리`
  const [title, setTitle] = useState('')
  const [nickname, setNickname] = useState('')

  const listHref = useMemo(() => `/gall/mgallery/board/lists/?id=${encodeURIComponent(galleryId)}`, [galleryId])

  return (
    <section className="border border-[#cfcfcf] bg-white">
      <div className="flex items-center justify-between border-b border-[#cfd3dc] px-3 py-2">
        <h2 className="text-[42px] leading-none font-bold tracking-[-0.02em] text-[#232c5f]">{galleryTitle}</h2>
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
        <div className="border border-[#d9d9d9]">
          <div className="grid grid-cols-[180px_180px_1fr] gap-2 border-b border-[#dedede] bg-[#f8f8f8] px-3 py-2">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="h-[34px] border border-[#cfcfcf] bg-white px-2 text-[14px]"
              placeholder="닉네임"
            />
            <input className="h-[34px] border border-[#cfcfcf] bg-white px-2 text-[14px]" placeholder="비밀번호" />
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
                {['이미지', '동영상', '디시콘', '유튜브', '외부컨텐츠', '시리즈', '투표', 'AI 이미지'].map((item) => (
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

              <div className="h-[430px] bg-white" />

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
          <button type="button" className="h-[48px] min-w-[98px] rounded border border-[#4d4d4d] bg-[#666] px-6 text-[22px] font-bold text-white" onClick={() => navigate(listHref)}>
            취소
          </button>
          <button type="button" className="h-[48px] min-w-[98px] rounded border border-[#293f90] bg-[#2f4aa0] px-6 text-[22px] font-bold text-white">
            등록
          </button>
        </div>

        <div className="mt-4">
          <Link to={listHref} className="text-[12px] text-[#334499] hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </section>
  )
}

