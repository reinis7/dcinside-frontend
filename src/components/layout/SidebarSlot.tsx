import type { ReactNode } from 'react'

type SidebarSlotProps = {
  children?: ReactNode
}

/** 우측 사이드바 영역 (로그인, 랭킹, 배너 등은 이후 단계에서 채움) */
export function SidebarSlot({ children }: SidebarSlotProps) {
  return (
    <aside
      className="w-full shrink-0 space-y-2 border border-gray-300 bg-white p-1 lg:w-[300px]"
      aria-label="사이드바"
    >
      {children ?? (
        <div className="border border-dashed border-gray-300 p-4 text-center text-gray-500">
          사이드바
        </div>
      )}
    </aside>
  )
}
