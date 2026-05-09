import { ApolloLink } from '@apollo/client/core'
import { Observable } from 'rxjs'
import { getRefreshToken } from '../auth/jwtStorage'

/**
 * 인증이 필요한 요청 전에 액세스 토큰을 검사하고, 만료·곧 만료면 리프레시합니다.
 * skipAuth 작업(로그인·리프레시)은 건너뜁니다. authApi는 동적 import로 apolloClient 순환 참조를 피합니다.
 */
export const authEnsureLink = new ApolloLink((operation, forward) => {
  const ctx = operation.getContext()
  if (ctx.skipAuth) return forward(operation)

  if (!getRefreshToken()) return forward(operation)

  const signal = ctx.fetchOptions?.signal

  return new Observable((observer) => {
    let sub
    let cancelled = false

    import('../auth/authApi')
      .then(({ ensureValidAccessToken }) => ensureValidAccessToken({ signal }))
      .then((ok) => {
        if (cancelled) return
        if (!ok) {
          observer.error(Object.assign(new Error('세션이 만료되었습니다.'), { name: 'SessionExpiredError' }))
          return
        }
        sub = forward(operation).subscribe({
          next: (v) => observer.next(v),
          error: (e) => observer.error(e),
          complete: () => observer.complete(),
        })
      })
      .catch((e) => {
        if (!cancelled) observer.error(e)
      })

    return () => {
      cancelled = true
      sub?.unsubscribe()
    }
  })
})
