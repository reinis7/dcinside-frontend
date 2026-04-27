import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'

const HOT_MINOR = [
  '지지직',
  '니케',
  '미국 주식',
  '퓨처스리그',
  '블루 아카이브',
  '미국 농구',
  '던파',
  '아이온2',
  '보겸',
  'MLB(메이저리그)',
]

const NEW_MINOR = [
  ['브랜드드 시티 AFC', 'asdfmovie(애니메이션)'],
  ['종문의 기원', '이승민(프로게이머)'],
  ['중병 웹이브스', '디그 잇'],
  ['유튜브백셀', '루더스 호수대이큇스...'],
  ['고도 장가 FC', '강라온(모델)'],
  ['버터덕', 'FTK(윤희왕)'],
]

const TICKER_ITEMS = ['충격 마이너 갤러리', 'KFC', '2026 탑스 올...', '복학요사 시즌2', '모털택시 시즌 3', '이경일 둘 이 블...']

const GALLERY_COLUMNS = [
  ['여자아이돌 음악', 'QWER(밴드)', '한국 여자아이돌', 'NMIXX(엔믹스)', '위버스', '프로미스나인', '솔가열', '픽 엔 믹스', '케이팝(K-POP)', '안씨의 유튜브', '아일릿', '에스파 걸 그룹', '아카라이브 채널', '일본 여자 아이돌'],
  ['노지선', '큰코 서부키', '이새울', '김채원', '여자아이돌 위버스', '프로미스나인 리얼리티', '워넌', '르세라핌(tripleS)', 'STAYC(스테이씨)', '방지민(프로미스나인)', '최예나', '이채영(프로미스나인)', '로쏘빌란', '변우석'],
  ['프로젝트걸그룹', '미야야키 사쿠라', '레드벨벳의 팬 얼', '이찬원', '골때리는 그녀들 시티...', '이서연', '더걸그룹', '아다마다지', '시타요 미유', '박지현(가수)', '더구지 나츠키', 'killkilli(키키)', 'HYNN(박혜원)', '지우'],
  ['뉴진스', '혜원', '릴리 M', '장원영', '피프티피프티 유튜브', '장규리', '주안 사', '러블리즈 리얼리티', '임용웅', '아워윙 운아', '프로미스나인 뽀카', '이채연', '조추리', '레이틴시'],
  ['설윤', '김민주', '이달의 소녀', '구호전', '류준열 브이라이브', '설현', '나강나고 있어연프롤...', '쏘이정', '진혜성', '지수', '세이미너입', '홍은채', '오쾌원(CLASSY)', '이시연'],
  ['이준호', '김동현', '신혜선', '도경수', '기타 걸그룹', '송가인 유튜브', '방탄소년단 지민', '엔믹스 브이라이브', '조유리(재월)짯째나', '꼬꼬미', '카즈하(르세라핌)', '강하린', 'K (아이랜드)', 'XdnaryHeroes'],
  ['최립우', '이와타타 사토', '리즈(아이브)', '이승우 유튜브', '안유진', '권은비', '김홍빈', 'AKMU 브이라이브', '분 이노우에', 'NEW', '플레이어(flareU)', '분 이노우에', '악 아이브 아이브 유튜...', '강라온(모델)'],
]

function MinorCreateButton({ onClick, isBusy = false }) {
  return (
    <button
      type="button"
      className={`inline-flex h-[30px] items-center justify-center rounded-full border border-[#ef9f00] bg-[#f3b100] px-4 text-[15px] font-bold leading-none text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] ${
        isBusy ? 'cursor-wait opacity-80' : 'cursor-pointer'
      }`}
      onClick={onClick}
      disabled={isBusy}
    >
      마이너 갤러리 만들기
    </button>
  )
}

export function GallMinorIndexPage() {
  const navigate = useNavigate()
  const { isAuthed, isLoading, viewer, logout } = useAuth()

  const handleCreate = () => {
    if (isLoading) return
    if (!isAuthed) {
      const ok = confirm('로그인 후 이용할 수 있습니다.\n로그인 페이지로 이동할까요?')
      if (!ok) return
      navigate('/sign/login?s_url=%2Fgall%2Fm%2Fcreate')
      return
    }
    navigate('/gall/m/create')
  }

  const displayName = viewer?.username || viewer?.name || '회원'

  return (
    <section className="grid gap-2 text-[12px]">
      <div className="grid grid-cols-[1fr_300px] gap-2">
        <div className="border border-[#d3d3d3] bg-white px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[17px] font-semibold tracking-[-0.02em] text-[#222]">
              누구나 개설할 수 있는 <span className="text-[#3b4890]">마이너 갤러리</span>를 만들어보세요.
            </div>
            <MinorCreateButton onClick={handleCreate} isBusy={isLoading} />
          </div>
        </div>

        <aside className="border border-[#3b4890] bg-white">
          {isAuthed ? (
            <>
              <div className="flex items-center justify-between border-b border-[#dedede] px-3 py-1">
                <div className="flex min-w-0 items-center gap-1 text-[18px] font-bold tracking-[-0.01em] text-[#1f3b8f]">
                  <span className="truncate">{displayName}님</span>
                  <span className="text-[15px] text-[#233f95]">›</span>
                </div>
                <button
                  type="button"
                  className="h-[30px] rounded-[4px] border border-[#243f93] bg-[#2f4aa0] px-3 text-[13px] font-bold text-white"
                  onClick={logout}
                >
                  로그아웃
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 py-1.5 text-[12px] font-semibold text-[#222]">
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  갤로그
                </a>
                <span className="text-[#bbb]">|</span>
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  즐겨찾기
                </a>
                <span className="text-[#bbb]">|</span>
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  운영
                </a>
                <span className="text-[#bbb]">|</span>
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  스크랩
                </a>
                <span className="text-[#bbb]">|</span>
                <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                  알림
                </a>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/sign/login?s_url=%2Fgall%2Fm"
                className="block border-b border-[#dedede] px-3 py-2 text-[14px] font-bold tracking-[-0.02em] text-[#3b4890] hover:underline"
              >
                로그인해 주세요.
              </Link>
              <div className="flex items-center justify-center gap-3 py-2 text-[12px] font-semibold text-[#222]">
                <span>갤찾기</span>
                <span className="text-[#bbb]">|</span>
                <span>스크랩</span>
                <span className="text-[#bbb]">|</span>
                <span>알림</span>
              </div>
            </>
          )}
        </aside>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-2">
        <div className="border border-[#3b4890] bg-white">
          <div className="grid grid-cols-2">
            <div className="border-r border-[#d7d7d7] p-2">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="text-[15px] font-bold">
                  <span className="mr-1 text-[#ff3f00]">HOT</span>
                  <span className="text-[#222]">종합 마이너 갤러리</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#3b4890]">
                  <button
                    type="button"
                    className="h-[18px] rounded-full border border-[#c8d1ef] bg-[#f4f7ff] px-2 text-[11px] leading-none"
                  >
                    전체 순위
                  </button>
                  <button type="button" className="h-[18px] w-[18px] rounded-full border border-[#c8c8c8] text-[10px] leading-none">
                    ◀
                  </button>
                  <button type="button" className="h-[18px] w-[18px] rounded-full border border-[#c8c8c8] text-[10px] leading-none">
                    ▶
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[12px] leading-[1.35] text-[#444]">
                {HOT_MINOR.map((name, idx) => (
                  <a key={name} href="#" className="truncate hover:underline" onClick={(e) => e.preventDefault()}>
                    <span className="mr-1.5 inline-flex h-4 w-4 items-center justify-center bg-[#ffa500] text-[11px] font-bold text-white">
                      {idx + 1}
                    </span>
                    {name}
                  </a>
                ))}
              </div>
            </div>

            <div className="p-2">
              <div className="mb-1.5 text-[14px] font-bold whitespace-nowrap">
                <span className="mr-1 text-[#ff4700]">NEW</span>
                <span className="text-[#222]">신설 마이너 갤러리</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[12px] leading-[1.35] text-[#444]">
                {NEW_MINOR.map(([left, right]) => (
                  <div key={left} className="contents">
                    <a href="#" className="truncate hover:underline" onClick={(e) => e.preventDefault()}>
                      {left}
                    </a>
                    <a href="#" className="truncate hover:underline" onClick={(e) => e.preventDefault()}>
                      {right}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-[#d7d7d7] px-2 py-1.5 text-[12px] text-[#555]">
            {TICKER_ITEMS.map((item, idx) => (
              <a
                key={`${item}_${idx}`}
                href="#"
                className={
                  idx === 0
                    ? 'truncate font-semibold text-[#d31900] hover:underline'
                    : 'truncate hover:underline'
                }
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            ))}
            <a href="#" className="ml-auto text-[11px] text-[#444] hover:underline" onClick={(e) => e.preventDefault()}>
              더보기 ▶
            </a>
          </div>
        </div>

        <div className={isAuthed ? 'border border-[#e3e6ef] bg-gradient-to-br from-[#f4f6f9] via-[#fdfefe] to-white' : ''} />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="h-[22px] rounded-full bg-[#2f3d8f] px-3 text-[12px] font-bold text-white"
          onClick={() => navigate('/gall')}
        >
          갤러리 전체보기
        </button>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="rounded-full bg-[#2f3d8f] px-3 py-[2px] text-[11px] font-bold text-white">실시간 북적 갤러리</span>
          <span className="inline-flex h-4 w-4 items-center justify-center bg-[#ff9f00] text-[10px] font-bold text-white">6</span>
          <span className="font-semibold text-[#444]">미국 주식</span>
        </div>
      </div>

      <div className="border border-[#3b4890] bg-white">
        <div className="flex items-center justify-between border-b border-[#d9d9d9] px-3 py-2">
          <div className="text-[13px]">
            <span className="font-bold text-[#3b4890]">연예</span>
            <span className="ml-1 text-[#888]">(8504)</span>
          </div>
          <button type="button" className="h-4 w-4 border border-[#cfcfcf] bg-[#f6f6f6]" aria-label="정렬">
            ▼
          </button>
        </div>
        <div className="grid grid-cols-7">
          {GALLERY_COLUMNS.map((column, colIdx) => (
            <ul key={colIdx} className="min-h-[360px] border-r border-[#ececec] px-3 py-2 last:border-r-0">
              {column.map((name) => (
                <li key={name} className="truncate py-[1px] text-[12px] leading-[1.45] text-[#444]">
                  <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}

