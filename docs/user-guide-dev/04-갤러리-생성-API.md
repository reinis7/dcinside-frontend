# 4. 갤러리 생성 API

## Query — 카테고리/타입

파일: `src/pages/gall/create/galleryCreateGraphql.js`

```graphql
query NewQuery {
  galleryTopics(first: 50) {
    edges { node { id slug databaseId name } }
  }
  galleryTypes {
    edges { node { id slug name databaseId } }
  }
}
```

## Mutation

```graphql
mutation CreateGallery($input: DCInsideCreateGalleryInput!) {
  dcinsideCreateGallery(input: $input) {
    success
    message
    galleryId
    databaseId
    slug
    status
  }
}
```

### input (프론트가 보내는 것)

| 필드 | 설명 |
|------|------|
| `name` | trim |
| `description` | trim, required 로 클라이언트 검증 |
| `slug` | lowercased |
| `reason` | 미니 외 필수; 미니는 더미 문자열 |
| `visibility` | 미니 only (`public` / `private`) |
| `gallery_type` | galleryTypes.databaseId 문자열 |
| `galleryTopicId` | 선택 카테고리 |
| `galleryId` | minor/mini 시 slug 와 동일 값 시도 |

### 응답

| 필드 | UI 사용 |
|------|---------|
| `success` | false 면 error toast |
| `message` | 실패 메시지 |
| `galleryId` / `databaseId` / `slug` | 성공 후 네비에 거의 미사용 (인덱스 복귀) |
| `status` | **UI에 미표시** (운영 심사 상태일 수 있음) |

성공 toast: `「{갤러리라벨} 생성 요청이 완료되었습니다.」` → `navigate(backTo)`.

### Schema mismatch retry

minor/mini 에서 `galleryId` 가 스키마에 없으면 `isSchemaMismatchError` 로 잡아  
`galleryId` 없는 `basePayload` 로 1회 재시도.

## 다음에 읽을 글

→ [5. 입력 검증](./05-입력-검증.md)
