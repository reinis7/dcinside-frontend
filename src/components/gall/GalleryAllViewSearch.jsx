import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { firstGraphQLErrorMessage } from '../../api/firstGraphQLErrorMessage'
import { buildDcinsideGalleryListHref } from '../../utils/dcinsideGalleryLinks'

const CONSONANTS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

const DEFAULT_CATEGORIES = [
  '연예',
  '취미',
  '디지털/IT',
  '음악',
  '국내방송',
  '건강/심리',
  '교통/운송',
  '여행/풍경',
  '해외방송',
  '생물',
  '교육',
  '밀리터리',
  '게임',
  '금융/재테크',
  '공무원',
  '패션',
  '스포츠',
  '생활',
  '수능',
  '쇼핑/장터',
  '음식',
  '학술',
  '성공/계발',
  '만화/애니',
  '대학',
  '직업/인물',
]

const CHO_LIST = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

const CHO_TO_SIMPLE = {
  ㄱ: 'ㄱ',
  ㄲ: 'ㄱ',
  ㄴ: 'ㄴ',
  ㄷ: 'ㄷ',
  ㄸ: 'ㄷ',
  ㄹ: 'ㄹ',
  ㅁ: 'ㅁ',
  ㅂ: 'ㅂ',
  ㅃ: 'ㅂ',
  ㅅ: 'ㅅ',
  ㅆ: 'ㅅ',
  ㅇ: 'ㅇ',
  ㅈ: 'ㅈ',
  ㅉ: 'ㅈ',
  ㅊ: 'ㅊ',
  ㅋ: 'ㅋ',
  ㅌ: 'ㅌ',
  ㅍ: 'ㅍ',
  ㅎ: 'ㅎ',
}

const SEARCH_GALLERIES_BY_KEYWORD = gql`
  query SearchGalleriesByKeyword($keyword: String!, $first: Int = 60) {
    galleries(first: $first, where: { search: $keyword }) {
      nodes {
        databaseId
        slug
        title
        galleryTypes(first: 5) {
          nodes {
            name
          }
        }
      }
    }
  }
`

function getInitialConsonant(text) {
  const ch = String(text ?? '').trim().charAt(0)
  if (!ch) return null
  const code = ch.charCodeAt(0)
  if (code >= 0xac00 && code <= 0xd7a3) {
    const cho = CHO_LIST[Math.floor((code - 0xac00) / 588)]
    return CHO_TO_SIMPLE[cho] ?? cho
  }
  if (/[ㄱ-ㅎ]/.test(ch)) return CHO_TO_SIMPLE[ch] ?? ch
  return null
}

function startsWithLatin(text) {
  return /^[A-Za-z]/.test(String(text ?? '').trim())
}

function stripHtml(html) {
  if (!html) return ''
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function normalizeTypeName(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return ''
  if (s === '메인' || /^main$/i.test(s)) return '메인'
  if (s === '마이너' || /^minor$/i.test(s)) return '마이너'
  if (s === '미니' || /^mini$/i.test(s)) return '미니'
  if (s === '인물' || /^person$/i.test(s)) return '인물'
  return s
}

function galleryMatchesType(node, galleryTypeName) {
  const want = normalizeTypeName(galleryTypeName)
  if (!want) return true
  const names = (node?.galleryTypes?.nodes ?? []).map((n) => normalizeTypeName(n?.name)).filter(Boolean)
  if (!names.length) return false
  return names.includes(want)
}

function useDebouncedValue(value, delayMs = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

function dedupeByKey(rows) {
  const seen = new Set()
  const out = []
  for (const row of rows) {
    const id = String(row.key ?? '').trim()
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push(row)
  }
  return out
}

/**
 * 갤러리 전체보기 검색 오버레이
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   galleries?: Array<{key:string,label:string,href:string,topicName?:string}>,
 *   recommended?: Array<{key:string,title:string,href:string}>,
 *   categories?: string[],
 *   galleryTypeName?: string,
 * }} props
 */
export function GalleryAllViewSearch({
  open,
  onClose,
  galleries = [],
  recommended = [],
  categories = DEFAULT_CATEGORIES,
  galleryTypeName = '메인',
}) {
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [activeConsonant, setActiveConsonant] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const debouncedQuery = useDebouncedValue(query.trim(), 250)
  const typeName = normalizeTypeName(galleryTypeName) || '메인'

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActiveConsonant(null)
    setActiveCategory(null)
    const t = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [open, onClose])

  const { data: searchData, loading: searchLoading, error: searchError } = useQuery(SEARCH_GALLERIES_BY_KEYWORD, {
    skip: !open || !debouncedQuery,
    variables: { keyword: debouncedQuery, first: 60 },
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  })

  const apiHits = useMemo(() => {
    if (!debouncedQuery) return []
    const rows = []
    for (const node of searchData?.galleries?.nodes ?? []) {
      if (!galleryMatchesType(node, typeName)) continue
      const slug = String(node?.slug ?? '').trim()
      const label = stripHtml(node?.title) || slug
      if (!label) continue
      const id = slug || String(node?.databaseId ?? '')
      const href = buildDcinsideGalleryListHref({ galleryType: typeName, galleryId: id }) || '#'
      rows.push({
        key: `api_${node?.databaseId ?? id}`,
        label,
        href,
        topicName: undefined,
      })
    }
    return rows
  }, [searchData, debouncedQuery, typeName])

  const resultLabel = useMemo(() => {
    if (query.trim()) return query.trim()
    if (activeCategory) return activeCategory
    if (activeConsonant === 'A-Z') return 'A - Z'
    if (activeConsonant) return activeConsonant
    return ''
  }, [query, activeCategory, activeConsonant])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = galleries

    if (activeCategory) {
      list = list.filter((g) => g.topicName === activeCategory)
    }

    if (activeConsonant === 'A-Z') {
      list = list.filter((g) => startsWithLatin(g.label))
    } else if (activeConsonant) {
      list = list.filter((g) => getInitialConsonant(g.label) === activeConsonant)
    }

    if (q) {
      const localHits = list.filter((g) => {
        const label = String(g.label ?? '').toLowerCase()
        const href = String(g.href ?? '').toLowerCase()
        return label.includes(q) || href.includes(q)
      })
      // 텍스트 검색은 API(해당 갤 타입만) + 로컬(이미 타입 스코프) 병합
      return dedupeByKey([...apiHits, ...localHits])
    }

    if (!activeCategory && !activeConsonant) return []
    return list
  }, [galleries, query, activeCategory, activeConsonant, apiHits])

  const waitingForSearch = Boolean(query.trim()) && (query.trim() !== debouncedQuery || searchLoading)

  if (!open) return null

  return (
    <div
      ref={rootRef}
      className="absolute left-0 top-full z-50 mt-1 flex w-[min(920px,calc(100vw-24px))] overflow-hidden border border-[#3b4890] bg-white text-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
      role="dialog"
      aria-label="갤러리 전체보기 검색"
    >
      <div className="flex w-[42%] min-w-[300px] flex-col border-r border-[#3b4890]">
        <div className="bg-[#3b4890] px-3 py-2.5">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveConsonant(null)
                setActiveCategory(null)
              }}
              placeholder="갤러리 검색"
              className="h-[30px] w-full border border-[#8a96c8] bg-white px-2.5 text-[13px] text-[#222] outline-none placeholder:text-[#999]"
              autoComplete="off"
            />
          </form>
        </div>

        <div className="border-b border-dashed border-[#c8c8c8] px-3 py-2.5">
          <div className="flex flex-wrap gap-[3px]">
            {CONSONANTS.map((cho) => {
              const active = activeConsonant === cho
              return (
                <button
                  key={cho}
                  type="button"
                  className={
                    active
                      ? 'flex h-[26px] w-[26px] items-center justify-center border border-[#3b4890] bg-[#3b4890] text-[12px] font-bold text-white'
                      : 'flex h-[26px] w-[26px] items-center justify-center border border-[#d0d0d0] bg-white text-[12px] text-[#333] hover:border-[#3b4890] hover:text-[#3b4890]'
                  }
                  onClick={() => {
                    setActiveConsonant((prev) => (prev === cho ? null : cho))
                    setActiveCategory(null)
                    setQuery('')
                  }}
                >
                  {cho}
                </button>
              )
            })}
            <button
              type="button"
              className={
                activeConsonant === 'A-Z'
                  ? 'flex h-[26px] items-center justify-center border border-[#3b4890] bg-[#3b4890] px-2 text-[11px] font-bold text-white'
                  : 'flex h-[26px] items-center justify-center border border-[#d0d0d0] bg-white px-2 text-[11px] text-[#333] hover:border-[#3b4890] hover:text-[#3b4890]'
              }
              onClick={() => {
                setActiveConsonant((prev) => (prev === 'A-Z' ? null : 'A-Z'))
                setActiveCategory(null)
                setQuery('')
              }}
            >
              A - Z
            </button>
          </div>
        </div>

        <div className="flex-1 px-3 py-2.5">
          <div className="mb-2 text-[11px] font-bold text-[#555]">카테고리 정렬</div>
          <div className="grid grid-cols-4 gap-x-2 gap-y-1.5">
            {categories.map((cat) => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  className={
                    active
                      ? 'truncate text-left text-[12px] font-bold text-[#3b4890] underline'
                      : 'truncate text-left text-[12px] text-[#333] hover:text-[#3b4890] hover:underline'
                  }
                  onClick={() => {
                    setActiveCategory((prev) => (prev === cat ? null : cat))
                    setActiveConsonant(null)
                    setQuery('')
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] px-3 py-2">
          <div className="min-w-0 truncate text-[13px] text-[#333]">
            <span className="font-bold text-[#3b4890]">[{resultLabel}]</span>
            <span className="ml-1">의 검색결과</span>
          </div>
          <button
            type="button"
            className="flex h-6 w-6 shrink-0 items-center justify-center text-[18px] leading-none text-[#666] hover:text-[#222]"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
          <div className="min-h-[160px] flex-1 overflow-y-auto border border-[#d9d9d9] bg-white">
            {waitingForSearch ? (
              <div className="flex h-full min-h-[160px] items-center justify-center text-[12px] text-[#999]">검색 중…</div>
            ) : filtered.length ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 p-2.5">
                {filtered.map((g) => (
                  <li key={g.key} className="min-w-0 truncate">
                    <a href={g.href} className="text-[12px] text-[#333] hover:underline" title={g.label}>
                      {g.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-1 px-3 text-center text-[12px] text-[#999]">
                <div>
                  {resultLabel ? '검색 결과가 없습니다.' : '검색어 또는 카테고리를 선택하세요.'}
                </div>
                {searchError ? <div className="text-[#d31900]">검색 요청 실패: {firstGraphQLErrorMessage(searchError)}</div> : null}
              </div>
            )}
          </div>

          <div>
            <div className="mb-1.5 text-[13px] font-bold text-[#333]">추천갤러리</div>
            <div className="min-h-[120px] overflow-y-auto border border-[#d9d9d9] bg-white">
              {recommended.length ? (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 p-2.5">
                  {recommended.map((g) => (
                    <li key={g.key} className="min-w-0 truncate">
                      <a href={g.href} className="text-[12px] text-[#333] hover:underline" title={g.title}>
                        {g.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex h-full min-h-[120px] items-center justify-center text-[12px] text-[#999]">
                  추천 갤러리가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
