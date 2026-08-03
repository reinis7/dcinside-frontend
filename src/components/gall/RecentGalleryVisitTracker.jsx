import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { useEffect, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { resolveGallBoardBase, gallBoardListHref } from '../../utils/gallBoardPaths'
import { pushRecentGallery } from '../../utils/recentGalleriesStorage'

const RECENT_GALLERY_LOOKUP = gql`
  query RecentGalleryVisitLookup($galleryId: String!) {
    dcinsideGalleryByGalleryId(galleryId: $galleryId) {
      galleryId
      postName
      title
    }
  }
`

function stripHtml(html) {
  if (!html) return ''
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function isGallBoardPath(pathname) {
  return /\/gall\/(?:board|mgallery\/board|mini\/board|p\/board|person\/board|ngallery\/board)\/(lists|view|write)/.test(
    pathname,
  )
}

/** 갤러리 게시판(목록/보기/쓰기) 진입 시 최근 방문 큐에 기록 */
export function RecentGalleryVisitTracker() {
  const loc = useLocation()
  const [searchParams] = useSearchParams()
  const galleryId = String(searchParams.get('id') ?? '').trim()
  const onBoard = isGallBoardPath(loc.pathname)
  const boardBase = resolveGallBoardBase(loc.pathname)
  const lastKeyRef = useRef('')

  const { data } = useQuery(RECENT_GALLERY_LOOKUP, {
    skip: !onBoard || !galleryId,
    variables: { galleryId },
    fetchPolicy: 'cache-first',
    errorPolicy: 'ignore',
  })

  useEffect(() => {
    if (!onBoard || !galleryId) return

    const lookedUp = data?.dcinsideGalleryByGalleryId
    const titleFromApi = stripHtml(lookedUp?.title)
    // API 실패 시에도 id로 일단 기록 (제목은 이후 갱신)
    const title = titleFromApi || galleryId
    const href = gallBoardListHref(boardBase, galleryId)
    const key = `${galleryId}|${title}|${href}`
    if (lastKeyRef.current === key) return
    lastKeyRef.current = key

    pushRecentGallery({
      id: galleryId,
      title,
      href,
      galleryType: boardBase,
    })
  }, [onBoard, galleryId, boardBase, data])

  return null
}
