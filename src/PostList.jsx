import { useEffect, useState } from 'react'
import { SAMPLE_POSTS } from './samplePosts.js'
import {
  fetchRecentPosts,
  isPlaceholderBackendUrl,
} from './wpgraphql.js'

const backendUrl = import.meta.env.VITE_BACKEND_URL

function formatTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function PostList() {
  const backendConfigured = !isPlaceholderBackendUrl(backendUrl)

  const [posts, setPosts] = useState(SAMPLE_POSTS)
  const [source, setSource] = useState('sample')
  const [loading, setLoading] = useState(() => backendConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!backendConfigured) {
      return
    }

    let cancelled = false

    fetchRecentPosts(backendUrl)
      .then((list) => {
        if (cancelled) return
        setError(null)
        if (list.length) {
          setPosts(list)
          setSource('wordpress')
        } else {
          setPosts(SAMPLE_POSTS)
          setSource('sample')
        }
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Request failed')
        setPosts(SAMPLE_POSTS)
        setSource('sample')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [backendConfigured])

  return (
    <section className="post-board" aria-labelledby="post-board-title">
      <div className="post-board__head">
        <h2 id="post-board-title">최신 글</h2>
        <span className="post-board__meta">
          {loading && '불러오는 중…'}
          {!loading && source === 'wordpress' && 'WordPress'}
          {!loading && source === 'sample' && '샘플'}
        </span>
      </div>
      {error && (
        <p className="post-board__error" role="status">
          GraphQL 요청 실패: {error}. 샘플 글을 표시합니다. (CORS·URL 확인)
        </p>
      )}
      <ul className="post-board__list">
        {posts.map((p, i) => (
          <li key={p.id} className="post-board__row">
            <span className="post-board__num">{i + 1}</span>
            <div className="post-board__main">
              <a
                href={
                  p.isSample
                    ? `#${p.slug}`
                    : p.link || `/${p.slug}`
                }
                className="post-board__title"
                {...(p.link && !p.isSample
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
                onClick={(e) => p.isSample && e.preventDefault()}
              >
                {p.title}
              </a>
              {p.excerpt ? (
                <p className="post-board__excerpt">{p.excerpt}</p>
              ) : null}
            </div>
            <span className="post-board__gallery">{p.gallery}</span>
            <time className="post-board__time" dateTime={p.date}>
              {formatTime(p.date)}
            </time>
          </li>
        ))}
      </ul>
    </section>
  )
}
