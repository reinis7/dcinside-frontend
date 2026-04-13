import type { ReactNode } from 'react'
import { MainColumn } from './MainColumn'
import { MainNavigation } from './MainNavigation'
import { SidebarSlot } from './SidebarSlot'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { SubNavigation } from './SubNavigation'

type LayoutProps = {
  /** 좌측 메인 영역 */
  main?: ReactNode
  /** 우측 사이드바 */
  sidebar?: ReactNode
  /** 2단 아래 전체 너비 (공지·사이트맵, 하단 유틸 등) */
  belowColumns?: ReactNode
}

/**
 * 디시인사이드 메인 페이지 골격: 상단 헤더·GNB·최근방문 → 2단(메인+사이드) → 푸터
 */
export function Layout({ main, sidebar, belowColumns }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <MainNavigation />
      <SubNavigation />

      <div className="mx-auto max-w-site px-2 py-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
          <MainColumn>{main}</MainColumn>
          <SidebarSlot>{sidebar}</SidebarSlot>
        </div>
      </div>

      {belowColumns != null && (
        <div className="mx-auto max-w-site px-2 pb-2">{belowColumns}</div>
      )}

      <SiteFooter />
    </div>
  )
}
