import { MinorGalleryCreateForm } from './MinorGalleryCreateForm'

/** 인물(유명인) 갤러리 만들기 — `/gall/p/create` */
export function PersonGalleryCreateForm(props) {
  return <MinorGalleryCreateForm galleryLabel="인물 갤러리" formVariant="person" {...props} />
}
