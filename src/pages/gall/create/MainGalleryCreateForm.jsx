import { MinorGalleryCreateForm } from './MinorGalleryCreateForm'

/** 메인 갤러리 만들기 — `/gall/create` */
export function MainGalleryCreateForm(props) {
  return <MinorGalleryCreateForm galleryLabel="메인 갤러리" formVariant="main" {...props} />
}
