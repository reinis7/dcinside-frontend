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
        // WordPress(GraphQL) 개발 서버로 프록시.
        // 프론트는 항상 같은 오리진(/graphql)만 호출하고,
        // 세션 쿠키는 credentials: 'include'로 자동 처리합니다.
        "/graphql": {
          target: apiOrigin,
          changeOrigin: true,
          secure: false,
          // 세션 쿠키를 개발 오리진(localhost)에서 유지시키기 위한 rewrite.
          // 백엔드가 Set-Cookie에 Domain을 박아 내려주면 브라우저가 localhost에 저장하지 못합니다.
          cookieDomainRewrite: "localhost",
          cookiePathRewrite: "/",
        },
      },
    },
  };
});
