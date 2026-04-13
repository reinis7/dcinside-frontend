import { DcIssueWidget } from './DcIssueWidget'
import { DcMediaWidget } from './DcMediaWidget'
import { LoginBox } from './LoginBox'
import { NewGalleryWidget } from './NewGalleryWidget'
import { RankingListWidget } from './RankingListWidget'

const SILBOOK: { rank: number; name: string; trend: 'up' | 'down' | 'flat' }[] = [
  { rank: 1, name: '베스트 갤러리 A', trend: 'up' },
  { rank: 2, name: '실시간 토론 갤', trend: 'down' },
  { rank: 3, name: '이슈 모음', trend: 'flat' },
  { rank: 4, name: '스포츠 중계', trend: 'up' },
  { rank: 5, name: '게임 정보', trend: 'up' },
  { rank: 6, name: '연예 화제', trend: 'down' },
  { rank: 7, name: '유머·짤', trend: 'flat' },
  { rank: 8, name: '지역 커뮤니티', trend: 'up' },
  { rank: 9, name: 'IT·개발', trend: 'down' },
  { rank: 10, name: '교육·시험', trend: 'flat' },
]

const HOT: { rank: number; name: string; trend: 'up' | 'down' | 'flat' }[] = [
  { rank: 1, name: '버츄얼 스나', trend: 'up' },
  { rank: 2, name: '흥한 갤러리 B', trend: 'up' },
  { rank: 3, name: '화제 신규 갤', trend: 'flat' },
  { rank: 4, name: '짤방 모음', trend: 'down' },
  { rank: 5, name: '정보 공유', trend: 'up' },
  { rank: 6, name: '야간 인기글', trend: 'flat' },
  { rank: 7, name: '주말 특집', trend: 'up' },
  { rank: 8, name: '방송·스트리머', trend: 'down' },
  { rank: 9, name: '만화·웹툰', trend: 'flat' },
  { rank: 10, name: '기타 토크', trend: 'up' },
]

export function HomeSidebar() {
  return (
    <>
      <LoginBox />
      <RankingListWidget title="실북갤" rows={SILBOOK} rankStyle="orange" />
      <RankingListWidget title="HOT 흥한갤" rows={HOT} rankStyle="orange" />
      <NewGalleryWidget />
      <DcMediaWidget />
      <DcIssueWidget />
    </>
  )
}
