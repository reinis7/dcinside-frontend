import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  const apiOrigin = env.VITE_API_ORIGIN || "http://localhost:8080";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // WordPress(GraphQL) 개발 프록시 — 프론트는 `/graphql` 동일 오리진만 사용.
        // (JWT 기본. 백엔드가 Set-Cookie를 내려도 로컬에서 쿠키 도메인 맞출 때 참고.)
        "/graphql": {
          target: apiOrigin,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: "localhost",
          cookiePathRewrite: "/",
        },
      },
    },
  };
});
