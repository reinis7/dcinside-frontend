/**
 * GraphQL HTTP 엔드포인트
 *
 * - 기본: "/graphql" → 같은 오리진 또는 Vite 프록시
 * - 인증: JWT는 Authorization: Bearer (authLink / jwtStorage)
 * - 크로스 도메인: VITE_GRAPHQL_URI 로 절대 URL — CORS에 맞게 Origin·메서드·헤더 허용
 */
export function getGraphqlUri() {
  const fromEnv = import.meta.env.VITE_GRAPHQL_URI?.trim()
  if (fromEnv) return fromEnv
  return '/graphql'
}
