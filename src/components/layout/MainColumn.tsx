import type { ReactNode } from 'react'

type MainColumnProps = {
  children?: ReactNode
}

/** 좌측 메인 컬럼 */
export function MainColumn({ children }: MainColumnProps) {
  return (
    <div className="min-w-0 flex-1 border border-gray-300 bg-white">
      {children ?? (
        <div className="border-b border-dashed border-gray-200 p-4 text-center text-gray-500">
          메인 콘텐츠
        </div>
      )}
    </div>
  )
}
