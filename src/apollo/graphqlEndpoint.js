/**
 * GraphQL HTTP 엔드포인트 (세션 쿠키 유지용)
 *
 * - 기본: "/graphql" → 같은 오리진(또는 Vite 프록시)으로 요청 → credentials 포함 시 쿠키 전송
 * - 크로스 도메인: .env 에 VITE_GRAPHQL_URI=https://백엔드도메인/graphql
 *   → 서버는 CORS에서 Access-Control-Allow-Credentials: true + 정확한 Origin,
 *     쿠키는 보통 SameSite=None; Secure (HTTPS) 필요
 */
export function getGraphqlUri() {
  const fromEnv = import.meta.env.VITE_GRAPHQL_URI?.trim()
  if (fromEnv) return fromEnv
  return '/graphql'
}
