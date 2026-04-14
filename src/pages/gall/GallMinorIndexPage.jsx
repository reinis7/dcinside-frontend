import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'

export function GallMinorIndexPage() {
  const navigate = useNavigate()
  const { isAuthed } = useAuth()

  return (
    <section className="rounded border border-[#d3d3d3] bg-white p-4">
      <button
        type="button"
        className="inline-flex h-[28px] items-center justify-center rounded-sm border border-[#5f5f5f] bg-[#6c6c6c] px-3 text-[12px] font-semibold text-white"
        onClick={() => {
          if (!isAuthed) {
            const ok = confirm('로그인 후 이용할 수 있습니다.\n로그인 페이지로 이동할까요?')
            if (!ok) return
            navigate('/sign/login?s_url=%2Fgall%2Fm%2Fcreate')
            return
          }
          navigate('/gall/m/create')
        }}
      >
        갤러리 만들기
      </button>
    </section>
  )
}

