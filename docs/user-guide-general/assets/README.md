# 미디어 자산 (user-guide-general)

# 미디어 자산 안내 (스크린샷 · 동영상 · 다이어그램)

유저 가이드의 그림과 영상은 모두 이 폴더 아래를 사용합니다.

```
assets/
  diagrams/      # 설명용 그림 (이미 포함)
  screenshots/   # 실제 화면 캡처 (PNG 권장) + SVG 자리표시자
  videos/        # 따라하기 영상 스크립트 + MP4 + HTML 플레이스홀더
```

---

## 다이어그램 (포함됨)

| 파일 | 쓰인 문서 |
|------|-----------|
| `diagrams/signup-steps.png` | 소개, 회원가입 |
| `diagrams/gallery-types-compare.png` | 갤러리 종류 비교 |
| `diagrams/gallery-approval-flow.png` | 개설 승인 |

---

## 스크린샷 규칙

1. **해상도:** 가로 1280px 이상 권장 (브라우저 창 전체 또는 해당 영역)
2. **형식:** `PNG` (문서에는 `.svg` 자리표시자가 링크되어 있음 → 실사진이 준비되면 **같은 번호의 `.png`로 바꾸고** md 링크를 `.png`로 수정하거나, SVG를 PNG로 교체)
3. **개인정보:** 실제 비밀번호·이메일이 보이지 않게 가리기
4. **파일 이름:** 아래 표를 **그대로** 사용 (문서와 경로가 맞춰져 있음)

| 파일명 | 촬영할 화면 | 관련 문서 |
|--------|-------------|-----------|
| `01-header-overview.png` | 헤더 전체 (메뉴·검색·로그인) | 01 |
| `02-recent-visits.png` | 최근 방문 줄 | 01 |
| `10-join-agree.png` | `/sign/join/agree` | 02 |
| `11-join-info.png` | `/sign/join/info` | 02 |
| `12-join-security.png` | `/sign/join/security` | 02 |
| `13-join-done.png` | `/sign/join/done` | 02 |
| `20-login.png` | `/sign/login` | 03 |
| `30-gall-index.png` | `/gall` 인덱스 | 05 |
| `31-gallery-allview.png` | 「갤러리 전체보기」 패널 연 상태 | 05 |
| `40-search-query.png` | `/search/q?keyword=...` | 06 |
| `50-mini-create.png` | `/gall/n/create` | 07 |
| `51-approval-waiting.png` | 생성 요청 완료 토스트 또는 안내 | 08 |
| `60-board-list.png` | 게시글 목록 | 09 |
| `61-board-view.png` | 글 보기 | 09 |
| `62-board-write.png` | 글쓰기 | 09 |

현재는 각 이름에 대응하는 **SVG 자리표시자**가 있어, 가이드를 열어보면 “여기에 스크린샷을 넣으세요” 안내가 보입니다.  
실사진을 찍은 뒤:

```bash
# 예: 미니 만들기 화면을 캡처한 뒤
cp ~/Pictures/mini-create.png docs/user-guide-general/assets/screenshots/50-mini-create.png
```

그리고 해당 md에서 `50-mini-create.svg` → `50-mini-create.png` 로 링크만 바꾸면 됩니다.

### 빠른 촬영 팁 (Linux)

- 영역 캡처: `gnome-screenshot -a` 또는 `flameshot gui`
- 브라우저 개발자도구로 창 크기 1280×800 고정 후 촬영하면 문서마다 크기가 일정해집니다.

---

## 동영상 규칙

| 파일 | 내용 | 길이 목표 |
|------|------|-----------|
| `01-signup-login.mp4` | 가입 4단계 + 로그인 | 3~5분 |
| `02-gallery-types-tour.mp4` | 메인→마이너→미니→인물 메뉴 투어 | 3~4분 |
| `03-search-allview.mp4` | 통합검색 + 전체보기 | 2~4분 |
| `04-create-mini-and-approval.mp4` | 미니 만들기 + 승인 안내 설명 | 4~6분 |

각 영상마다:

- `0N-....md` — **한국어 나레이션/촬영 스크립트**
- `0N-....placeholder.html` — MP4가 없을 때 브라우저로 볼 수 있는 안내 페이지
- `0N-....mp4` — 실제 녹화 파일 (추가해 주세요)

녹화 권장: 1280×720, 마이크 나레이션 또는 화면 자막(한글).

---

## 체크리스트

스크린샷

- [ ] 01, 02 헤더·최근방문
- [ ] 10~13 가입
- [ ] 20 로그인
- [ ] 30, 31 인덱스·전체보기
- [ ] 40 통합검색
- [ ] 50, 51 만들기·승인
- [ ] 60~62 목록·보기·쓰기

동영상

- [ ] 01 가입·로그인
- [ ] 02 갤 종류 투어
- [ ] 03 검색
- [ ] 04 미니 만들기·승인
