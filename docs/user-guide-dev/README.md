# 개발자 가이드 (user-guide-dev)

프론트엔드·연동을 이해하려는 **개발자**용입니다.  
일반 이용자 화면 설명은 → [user-guide-general](../user-guide-general/README.md)

---

## 목차

| # | 문서 | 내용 |
|---|------|------|
| 0 | [개요](./00-개요.md) | 앱 구조, general, 이 가이드 범위 |
| 1 | [라우트 맵](./01-라우트-맵.md) | sign / gall / search URL |
| 2 | [가입·로그인](./02-가입과-로그인.md) | 단계, 검증, 등록 API 연동 |
| 3 | [갤러리 종류](./03-갤러리-종류-기술.md) | 경로 분기, type hint, 생성 필드 차이 |
| 4 | [갤러리 생성 API](./04-갤러리-생성-API.md) | `dcinsideCreateGallery`, payload, 응답 |
| 5 | [입력 검증](./05-입력-검증.md) | join / gallery create client validation |
| 6 | [승인·status](./06-승인-status.md) | UI에 status가 안 보이는 이유, 운영 안내 카피 |
| 7 | [검색·전체보기](./07-검색과-전체보기.md) | GraphQL search, type filter |
| 8 | [주요 파일 목록](./08-주요-파일.md) | 소스 경로 인덱스 |

---

## 빠른 참고

- GraphQL endpoint: 환경 변수 및 `apolloClient` 설정 참고 (`.env`)
- 생성 mutation: `src/pages/gall/create/galleryCreateGraphql.js`
- 가입 검증: `src/auth/joinValidation.js`
- 생성 검증: `src/pages/gall/create/galleryCreateValidation.js`
