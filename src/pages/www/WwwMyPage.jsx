import { Link } from 'react-router-dom'

export function WwwMyPage() {
  return (
    <section>
      <h2>www 마이 페이지</h2>
      <p>현재는 보호 로직 없이 라우팅 뼈대 확인용 페이지입니다.</p>
      <p>
        <Link to="/www">/www로 돌아가기</Link>
      </p>
    </section>
  )
}
