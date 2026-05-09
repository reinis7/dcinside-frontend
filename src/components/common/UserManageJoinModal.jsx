import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'
import { useAuth } from '../../auth/authContext'
import { buildDcinsideGalleryListHref, galleryTypeShortLabel } from '../../utils/dcinsideGalleryLinks'

const TABS = [
  { id: 'manage', label: '운영 중 갤러리' },
  { id: 'joined', label: '가입한 갤러리' },
]

const VIEWER_MANAGED_GALLERIES = gql`
  query ViewerManagedGalleries {
    viewer {
      id
      galleries(first: 50) {
        nodes {
          databaseId
          title
          slug
          galleryTypes(first: 5) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`

function pickGalleryTitle(node) {
  const t = node?.title
  if (typeof t === 'string') return t.trim()
  if (t && typeof t === 'object' && typeof t.rendered === 'string') {
    return String(t.rendered)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return ''
}

function primaryGalleryTypeName(node) {
  const names = node?.galleryTypes?.nodes?.map((x) => x?.name).filter(Boolean) ?? []
  return names[0] ?? '메인'
}

function galleryIdForHref(node) {
  const slug = String(node?.slug ?? '').trim()
  if (slug) return slug
  const db = node?.databaseId
  if (db != null) return String(db)
  return ''
}

const CREATE_ROWS = [
  { label: '마이너갤 만들기', path: '/gall/m/create' },
  { label: '미니갤 만들기', path: '/gall/n/create' },
  { label: '인물갤 만들기', path: '/gall/p/create' },
]

export function UserManageJoinModal({ open, onClose }) {
  const navigate = useNavigate()
  const { isAuthed } = useAuth()
  const [tab, setTab] = useState('manage')

  const { data, loading, error } = useQuery(VIEWER_MANAGED_GALLERIES, {
    skip: !open || !isAuthed,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const managedNodes = data?.viewer?.galleries?.nodes ?? []
  const managedRows = useMemo(() => {
    const rows = managedNodes.map((node) => {
      const title = pickGalleryTitle(node) || '(제목 없음)'
      const typeName = primaryGalleryTypeName(node)
      const galleryId = galleryIdForHref(node)
      const href =
        galleryId !== ''
          ? buildDcinsideGalleryListHref({ galleryType: typeName, galleryId })
          : null
      return { key: node.databaseId ?? node.slug ?? title, title, typeName, href }
    })
    rows.sort((a, b) => a.title.localeCompare(b.title, 'ko'))
    return rows
  }, [managedNodes])

  useEffect(() => {
    if (!open) return
    setTab('manage')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open) return null

  const goCreate = (path) => {
    onClose()
    navigate(path)
  }

  const errMsg = error ? firstGraphQLErrorMessage(error) : ''

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-manage-join-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="배경 닫기"
        onClick={onClose}
      />
      <div className="relative z-[101] w-full max-w-[440px] border-2 border-[#2f3d8f] bg-white shadow-lg">
        <div className="flex items-stretch border-b border-[#cfcfcf]">
          <div className="flex min-w-0 flex-1 items-stretch">
            {TABS.map((t) => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={
                    active
                      ? 'relative -mb-px flex-1 border border-b-0 border-[#2f3d8f] bg-white px-3 py-2.5 text-[13px] font-bold text-[#2f3d8f]'
                      : 'flex-1 border border-transparent bg-[#e8e8e8] px-3 py-2.5 text-[13px] font-semibold text-[#555] hover:bg-[#dedede]'
                  }
                >
                  {t.label}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center border border-[#2f3d8f] bg-[#2f3d8f] text-[20px] leading-none text-white hover:bg-[#26327a]"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="px-5 pb-6 pt-8 text-[13px]" id="user-manage-join-title">
          {tab === 'manage' ? (
            <div className="grid gap-5">
              {loading ? (
                <p className="py-8 text-center text-[#666]">불러오는 중…</p>
              ) : errMsg ? (
                <p className="py-4 text-center text-[12px] text-[#d31900]">{errMsg}</p>
              ) : managedRows.length > 0 ? (
                <>
                  <ul className="grid gap-0 border border-[#e5e5e5]">
                    {managedRows.map((row) => (
                      <li key={row.key} className="border-b border-[#e5e5e5] last:border-b-0">
                        {row.href ? (
                          <Link
                            to={row.href}
                            onClick={onClose}
                            className="flex w-full items-center justify-between gap-2 px-2 py-3 text-left text-[#333] hover:bg-[#f5f7fb]"
                          >
                            <span className="min-w-0 flex-1 truncate font-medium">{row.title}</span>
                            <span className="shrink-0 rounded border border-[#cfe0ff] bg-[#eef4ff] px-1.5 py-0.5 text-[11px] text-[#2f3d8f]">
                              {galleryTypeShortLabel(row.typeName)}
                            </span>
                            <span className="shrink-0 text-[#2f3d8f]" aria-hidden="true">
                              ›
                            </span>
                          </Link>
                        ) : (
                          <div className="flex items-center justify-between gap-2 px-2 py-3 text-[#555]">
                            <span className="min-w-0 flex-1 truncate">{row.title}</span>
                            <span className="text-[11px] text-[#aaa]">링크 없음</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="text-center text-[11px] text-[#888]">내가 개설·운영 중인 갤러리입니다.</p>
                </>
              ) : (
                <p className="text-center leading-relaxed text-[#333]">
                  운영 중인 갤러리가 없습니다.
                  <br />
                  갤러리를 만들어보세요.
                </p>
              )}

              <ul className="grid gap-0 border-t border-[#e5e5e5] pt-4">
                {CREATE_ROWS.map((row) => (
                  <li key={row.path} className="border-b border-[#e5e5e5]">
                    <button
                      type="button"
                      onClick={() => goCreate(row.path)}
                      className="flex w-full items-center justify-between px-1 py-3 text-left text-[#333] hover:bg-[#f5f7fb]"
                    >
                      <span>{row.label}</span>
                      <span className="text-[#2f3d8f]" aria-hidden="true">
                        ›
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="py-6 text-center leading-relaxed text-[#333]">
              가입한 갤러리가 없습니다.
              <br />
              <span className="mt-2 block text-[11px] text-[#888]">
                가입 갤러리 목록은 서버 API 연동 후 표시할 수 있습니다.
              </span>
              <Link to="/gall" className="mt-3 inline-block text-[#3b4890] underline hover:text-[#2f3d8f]" onClick={onClose}>
                갤러리 둘러보기
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
