import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const TERMS_TOC = [
  '제1조 (목적)',
  '제2조 (이용자의 정의)',
  '제3조 (고정닉 신청)',
  '제4조 (서비스의 제공)',
  '제5조 (서비스의 중단 및 변경)',
  '제6조 (고정닉 탈퇴 및 자격 상실 등)',
  '제7조 (이용자에 대한 통지)',
  '제8조 (고정닉 이용자의 정보)',
  '제9조 (회사의 의무)',
  '제10조 (식별 코드 및 비밀번호에 대한 의무)',
  '제11조 (이용자의 의무)',
  '제12조 (공개 게시물의 삭제 또는 이용 제한)',
  '제13조 (저작권의 귀속 및 콘텐츠의 이용)',
  '제14조 (광고 게재 및 광고주와의 거래)',
  '제15조 (크롤링 및 인공지능 학습)',
  '제16조 (약관의 개정)',
  '제17조 (재판관할)',
  '제18조 (개정 전 고지의무)',
]

const TERMS_FULL_TEXT = `시행일: 2024년 04월 23일
이전 이용약관 보기(2024년 03월 29일 ~ 2024년 04월 22일)

제1조 (목적)
본 약관은 ㈜디시인사이드(이하 '회사')가 제공하는 디시인사이드 및 디시인사이드 관련 제반 서비스(이하 '서비스')의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (이용자의 정의)
① '이용자'란 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 '고정닉, 비고정닉 이용자'(이하 '고정닉 이용자')와 '비회원 이용자'(일명 '유동닉')를 통칭합니다.
② '고정닉 이용자'란 이용자가 홈페이지에서 '고정닉 신청'을 클릭하여 회사가 정한 가입 양식을 기입하고 '동의', '확인' 등의 버튼을 누르는 방법으로 '고정닉' 또는 '비고정닉'을 생성한 이용자를 말합니다.
③ '고정닉'이란 이용자가 기재한 문자 숫자 조합이 다른 '고정닉 이용자' 간에 중복되지 않도록 하는 것을 말하고, '비고정닉'은 이용자가 기재한 문자 숫자 조합이 다른 '비고정닉 이용자' 간에 중복이 가능하도록 하는 것을 말합니다. 고정닉 이용자는 '고정닉'과 '비고정닉'간의 전환 및 변경을 할 수 있습니다.
④ '비회원 이용자'란 '고정닉' 혹은 '비고정닉'을 신청하지 않은 상태로 회사가 제공하는 서비스를 이용하는 이용자를 말합니다. '비회원 이용자'는 이용자가 작성한 닉네임 뒤에 IP의 일부가 '(000.000)' 형태로 표기됩니다.

제3조 (고정닉 신청)
② 회사는 제1항과 같이 고정닉을 신청한 이용자가 다음 각 호에 해당하지 않는 한 이용자의 고정닉 생성을 허용합니다.
1. 등록 내용에 허위, 기재누락, 오기가 있는 경우
2. 제6조 제3항에 해당하는 고정닉 자격 제한 및 정지, 상실을 한 경험이 있었던 경우
3. 기타 고정닉 생성을 허용하는 것이 회사의 서비스 운영 및 기술상 현저히 지장이 있다고 판단되는 경우

제4조 (서비스의 제공)
① 회사는 이용자에게 아래와 같은 서비스를 제공합니다.
1. 커뮤니티 서비스 (갤러리 등)
2. 검색, 디시콘
3. 기타 회사가 자체 개발하거나 다른 회사와의 협력 계약 등을 통해 이용자들에게 제공할 일체의 서비스
② 회사는 고정닉 이용자에게 아래와 같은 서비스를 제공합니다.
1. 고정닉 이용자 전용 서비스 (갤로그 등)

제5조 (서비스의 중단 및 변경)
① 회사는 365일, 24시간 원활한 서비스 제공을 위해 최선을 다하고 있습니다. 다만, 컴퓨터 등 정보통신 설비의 보수 점검, 교체 및 고장, 통신 두절 등의 사유가 발생한 경우 일부 또는 전체 서비스의 제공을 제한하거나 중단할 수 있습니다.
또는, 제4조에서 제공하는 서비스를 운영 및 개선의 목적으로, 혹은 회사가 적절하다고 판단하는 사유에 기해 변경하거나 종료할 수 있습니다.
② 회사는 제1항에 의한 일부 서비스 제한 및 중단에 대해 예측 가능한 경우 상당 기간 전에 이를 안내하며, 예측 불가능한 경우라면 지체 없이 상세히 설명하고 안내드리겠습니다.
또한, 서비스 종료의 경우에 회사는 제7조에서 정한 방법으로 이용자에게 통지합니다.

제6조 (고정닉 탈퇴 및 자격 상실 등)
③ 고정닉 이용자가 다음 각 호의 사유에 해당하는 경우, 회사는 고정닉 이용자의 자격을 적절한 방법으로 제한 및 정지, 상실시킬 수 있습니다.
1. 고정닉 신청 시에 허위 내용을 등록한 경우
2. 다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자거래질서를 위협하는 경우
3. 서비스를 이용하여 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우

제7조 (이용자에 대한 통지)
회사가 전체 이용자에 대한 통지를 하는 경우 7일 이상 공지사항 게시판에 게시함으로써 개별 통지에 갈음할 수 있습니다.

제8조 (고정닉 이용자의 정보)
회사는 개인 정보(이름, 주민등록번호, 휴대폰 번호, 이메일 등)를 수집하지 않습니다. 단, 고정닉 신청과 서비스 이용을 위해 최소한의 이용자 정보(식별 코드, 비밀번호, 닉네임, 서비스 이용 기록, IP, 기기 정보, 불량 이용 기록, 성인 인증 값, 쿠키 등)를 수집합니다.
이용자 정보의 개별 항목은 개인정보처리방침에서 고지합니다.

제9조 (회사의 의무)
① 회사는 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 본 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하기 위해서 노력합니다.
② 회사는 이용자가 안전하고 편리하게 서비스를 이용할 수 있도록 시스템을 구축합니다.
③ 회사는 이용자가 원하지 않는 영리목적의 광고성 이메일을 발송하지 않습니다.
④ 회사는 이용자가 서비스를 이용함에 있어 회사의 고의 또는 과실로 인하여 손해를 입게 될 경우 관련 법령에 따라 이용자의 손해를 배상할 책임이 있습니다.

제10조 (고정닉 이용자의 식별 코드 및 비밀번호에 대한 의무)
① 회사가 관계법령, '개인정보보호 정책'에 의해서 그 책임을 지는 경우를 제외하고, 고정닉 신청 시 기입한 자신의 식별 코드와 비밀번호에 관한 관리 책임은 각 고정닉 이용자에게 있습니다.
② 고정닉 이용자는 자신의 식별 코드 및 비밀번호를 제3자에게 이용하게 해서는 안 됩니다.
③ 고정닉 이용자는 자신의 식별 코드 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 회사에 통보하고 회사의 안내가 있는 경우에는 그에 따라야 합니다.

제11조 (이용자의 의무)
① 이용자는 다음 각 호의 행위를 하여서는 안 됩니다.
1. 고정닉 신청 또는 변경 시 허위 내용을 등록하는 행위
2. 회사 및 제3자의 지적재산권, 저작권을 침해하거나 회사의 권리와 업무 또는 제3자의 권리와 활동을 방해하는 행위
3. 다른 이용자의 식별 코드를 도용하는 행위
4. 관련 법령에 의하여 전송 또는 게시가 금지되는 정보의 게시 또는 전송하는 행위
5. 회사의 직원 또는 서비스의 관리자를 가장하거나 타인의 명의를 도용하여 정보를 게시, 전송하는 행위
6. 컴퓨터 코드, 파일, 프로그램을 포함하고 있는 자료를 게시하거나 전송하는 행위
7. 스토킹(stalking) 등 다른 이용자를 괴롭히는 행위
8. 다른 이용자 및 제3자에 대한 개인정보를 그 동의 없이 수집, 저장, 공개하는 행위
9. 불특정 다수 대상 광고 또는 선전을 게시하거나 음란물, 청소년 유해매체물, 불법촬영물 등을 게시하는 행위
10. 회사가 제공하는 갤로그 및 관련 서비스 공지사항 규정을 위반하는 행위
11. 자동화된 수단을 활용하여 서비스 기능을 비정상적으로 이용하는 행위
12. 회사에서 허가하지 않은 자동화 수단을 이용해 고정닉 신청/로그인/콘텐츠 생성을 시도하는 행위
13. 자동화된 수단을 이용해 서비스 정보를 수집하거나 인공지능 학습 목적으로 이용하는 행위
14. 서비스 제공 취지에 부합하지 않은 방식으로 이용하거나 기술적 조치를 무력화하려는 행위

제12조 (공개 게시물의 삭제 또는 이용 제한)
① 이용자의 공개 게시물의 내용이 약관 및 법령 위반에 해당하는 경우 회사는 게시물 접근 제한, 삭제, 이용 자격 제한/정지/상실 조치를 취할 수 있습니다.

제13조 (저작권의 귀속 및 콘텐츠의 이용)
① 회사가 작성한 저작물에 대한 저작권, 기타 지적재산권은 회사에 귀속합니다.
② 이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제/전송/배포/방송 등으로 영리 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
③ 이용자가 서비스 내에 게시한 콘텐츠의 저작권은 게시한 이용자에게 귀속됩니다.

제14조 (광고 게재 및 광고주와의 거래)
① 회사는 서비스 투자 기반 확보를 위해 광고를 게재할 수 있습니다.
② 서비스를 통한 광고주의 판촉활동 참여 또는 거래로 인한 손실/손해에 대해 회사는 책임을 지지 않습니다.

제15조 (크롤링 및 인공지능 학습)
① 회사의 사전 서면 동의 없이 어떤 형태/목적으로든 본 서비스를 크롤링하는 행위는 금지됩니다.
② 회사 콘텐츠를 인공지능 학습용 데이터로 활용하려면 사전 합의가 필요합니다.

제16조 (약관의 개정)
① 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
② 이용자에게 불리한 개정 내용은 적용일자 14일 전부터 공지합니다.
③ 이용자는 변경된 약관을 거부할 권리가 있습니다.

제17조 (재판관할)
회사와 이용자 간 서비스 이용 분쟁에는 대한민국 법을 적용하며, 민사소송법상 관할 법원에 제기합니다.

제18조 (개정 전 고지의무)
본 이용약관의 내용 추가, 삭제 및 수정이 있을 경우 개정 최소 7일 전에 공지사항을 통해 사전 공지합니다.

공고일자: 2024년 04월 17일
시행일자: 2024년 04월 23일`

const PRIVACY_FULL_TEXT = `시행일: 2025년 09월 15일
이전 개인정보처리방침 보기(2023년 12월 27일 ~ 2025년 09월 14일)

1. 개인정보의 수집 목적 및 이용 목적
회사는 고정닉 신청 및 서비스 이용을 위해 이용자의 정보를 최소한으로 수집합니다.
서비스 이용에 따른 이용자 식별, 불량 고정닉 이용자의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 만 14세 미만 아동 식별 시 법정대리인 정보 및 동의 여부 확인, 불만 처리, 민원처리, 고지사항 전달, 개인 맞춤 서비스 등에 이용됩니다.

2. 개인정보 수집 항목 및 수집 방법
<고정닉 신청 시>
- 식별 코드, 비밀번호, 닉네임, 만 14세 미만의 경우 법정대리인 정보(DI값)
<서비스 이용 시>
- 서비스 이용 기록, IP 주소, 기기 정보, 불량 이용 기록, 성인 인증 값, 쿠키 등
<서비스 이용 시 기기 정보 상세>
- PC웹: OS 및 브라우저 버전 정보
- 모바일웹: OS 및 브라우저 버전 정보
- 앱: 푸시 알림 전송을 위한 기기별 고유 식별자

개별 서비스 이용 시 선택항목
- 게시물 신고: 문의/답변 포함 개인정보, 침해 신고 시 신분증/위임장 정보 등
- 불법촬영물 신고: 이메일, 이름(기관/단체명)
- 자기 게시물접근배제 신고: 이메일, 신분증 사본(생년월일) 등
- 이벤트 응모 및 경품 배송: 식별 코드, 닉네임, 이메일, 이름, 휴대폰 번호, 주소
- 디시 로터리 당첨: 통장 사본, 신분증 사본
- 디시콘샵 등록: 제작자 닉네임, IP 주소

3. 개인정보 수집에 대한 동의
회사는 고정닉 신청 시 최소한의 정보 수집 항목에 대한 동의를 받고 있으며, 동의 체크 시 정보 수집에 동의한 것으로 간주합니다.

4. 개인정보의 제공 및 위탁
회사는 사전 동의 없이 이용자 정보를 외부에 제공하지 않습니다.
다만 법령 근거 또는 이용자의 생명/안전에 급박한 위험이 확인되는 경우 예외적으로 제공할 수 있습니다.

5. 개인정보 열람, 정정
고정닉 이용자 정보의 열람 및 정정은 로그인 후 '고정닉 정보' 메뉴에서 직접 수행할 수 있습니다.

6. 개인정보의 보유 및 이용기간
고정닉 신청일부터 탈퇴 시까지 보관 및 이용합니다.
내부 방침 및 관계법령에 따라 일정 기간 보관 후 파기할 수 있습니다.

7. 개인정보의 파기절차 및 방법
목적 달성 후 별도 DB로 이동해 보관 기준에 따라 파기합니다.
전자적 파일은 복구 불가능한 기술적 방법으로 삭제합니다.

8. 개인정보 보관 및 보호를 위한 기술적, 관리적 대책
비밀번호 보호, 접근 권한 최소화, 백신 및 보안 시스템 운영, 담당자 교육 등으로 이용자 정보를 보호합니다.

9. 만 14세 미만 아동의 개인정보
법정대리인 동의 확인 목적 범위에서만 수집/이용하며, 확인 후 즉시 폐기합니다.

10. 고정닉 이용자 및 법정대리인의 권리와 행사방법
이용자 또는 법정대리인은 본인/아동 정보 조회, 수정, 탈퇴를 요청할 수 있습니다.

11. 개인정보 자동 수집 장치의 설치와 운영 및 거부에 관한 사항
회사는 맞춤형 서비스 제공을 위해 쿠키를 사용할 수 있으며 브라우저 설정에서 거부할 수 있습니다.
구글 애널리틱스를 통한 로그 분석 및 앱 사용 시 일부 정보 수집이 있을 수 있습니다.

12. 개인정보보호 책임자에 관한 사항
개인정보보호 책임자 및 담당자를 지정하고 문의 창구를 운영합니다.

13. 권익침해 구제방법
개인정보분쟁조정위원회, 개인정보침해신고센터 등 관련 기관을 통해 구제를 요청할 수 있습니다.

14. 개정 전 고지의무
개인정보처리방침 변경 시 최소 7일(중요 변경은 14일) 전에 공지합니다.

공고일자: 2025년 09월 15일
시행일자: 2025년 09월 15일`

export function SignJoinAgreePage() {
  const [joinType, setJoinType] = useState('over14')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [openPrivacyOptional, setOpenPrivacyOptional] = useState(false)

  const agreeAll = useMemo(() => agreeTerms && agreePrivacy, [agreeTerms, agreePrivacy])
  const canNext = agreeAll

  const onToggleAll = (checked) => {
    setAgreeTerms(checked)
    setAgreePrivacy(checked)
  }

  const privacyPurpose = [
    '서비스 이용에 따른 이용자 식별, 불량 고정닉 이용자의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인',
    '만 14세 미만 아동 식별 시 법정대리인 정보 및 동의 여부 확인',
    '불만 처리, 민원처리, 고지사항 전달, 기타 의사소통을 위한 절차 및 이벤트, 개인 맞춤 서비스, 연령별 서비스, 인구통계학적 분석 등 정보의 전달을 위한 절차에 이용',
  ]

  const privacyItemsBlocks = [
    {
      title: '<고정닉 신청 시>',
      lines: [
        '식별 코드, 비밀번호, 닉네임, 만 14세 미만의 경우 법정대리인 정보(DI값(이하 ‘중복확인정보’))',
        '* 식별 코드: 회사가 부여하는 랜덤 코드로 개인을 특정할 수 없는 문자열입니다.',
        '* 닉네임: 이용자가 정할 수 있고 항시 변경할 수 있습니다.',
      ],
    },
    {
      title: '<서비스 이용 시>',
      lines: [
        '서비스 이용과정에서 아래와 같은 정보가 자동으로 생성될 수 있습니다.',
        '- 서비스 이용 기록, IP 주소, 기기 정보, 불량 이용 기록, 성인 인증 값, 쿠키 등',
        '※ 쿠키는 해당 브라우저 또는 기기 등에서 수집하는 것으로 회사가 수집하는 것은 아닙니다.',
      ],
    },
    {
      title: '<서비스 이용 시 기기 정보 상세>',
      lines: [
        '- PC웹: Window, Mac 등 OS 버전 및 웹 브라우저(Chrome, Safari 등) 버전 정보',
        '- 모바일웹: 단말기 OS 버전 및 웹 브라우저(Chrome, Safari 등) 버전 정보',
        '- 앱: 댓글 알림 등 푸시 알림 전송(구글 FCM: Firebase Cloud Message 서비스 사용)을 위한 기기별 고유 식별자',
      ],
    },
  ]

  const privacyPeriod = [
    '고정닉 탈퇴 시 파기 처리',
    '11개월 동안 로그인 기록이 없는 고정닉은 자동 탈퇴 처리',
  ]

  const privacyFootnotes = [
    '개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 동의 거부 시 고정닉 신청이 제한됩니다.',
    '서비스 제공을 위해서 필요한 최소한의 이용자 정보이므로 동의를 하셔야 서비스 이용이 가능합니다.',
    '이 외 서비스 이용 시 별도 동의를 통해 추가 정보 수집이 있을 수 있습니다.',
  ]

  const privacyOptionalRows = [
    {
      service: '게시물 신고',
      item: '이용자의 문의/답변 내용에 포함된 개인정보, 저작권/개인정보 침해 신고 시 사업자등록증 사본/신분증 사본(생년월일)/위임장 정보(대리인 정보) 등\n※ ‘6. 개인정보의 보유 및 이용기간’ 참고',
    },
    {
      service: '불법촬영물 등 신고',
      item: '이메일, 이름(기관, 단체명)\n※ 관련 법령에 따라 3년간 보관합니다.',
    },
    {
      service: '자기 게시물접근배제 신고',
      item: '이메일, 첨부파일에 작성한 이름, 신분증 사본(생년월일), 사망사실증명서(유족인 경우), 가족관계증명서(유족인 경우)\n※ 조치 결과 안내 후 즉각 파기',
    },
    {
      service: '이벤트 응모 및 경품 배송',
      item: '식별 코드, 닉네임, 이메일, 이름, 휴대폰 번호, 주소\n※ 이벤트 종료 및 경품 배송 후 즉시 파기',
    },
    {
      service: '디시 로터리당첨',
      item: '상금: 통장 사본, 신분증(주민등록증 또는 운전면허증) 사본\n상품권: 신분증(주민등록증 또는 운전면허증) 사본\n※ 경품 제공 및 세금 신고 후 즉시 파기',
    },
    {
      service: '디시콘샵에서 디시콘을 등록',
      item: '제작자 닉네임, IP 주소\n※ 고정닉 탈퇴 시 즉각 파기',
    },
  ]

  return (
    <section className="mx-auto w-[900px] text-[15px] text-[#333]">
      <ol className="mb-6 mt-2 grid grid-cols-4 overflow-hidden rounded border border-[#a8a8a8] bg-[#9f9f9f] text-white">
        <li className="bg-white py-3 text-center font-semibold text-[#273589]">약관 동의</li>
        <li className="py-3 text-center">기본 정보 입력</li>
        <li className="py-3 text-center">보안 코드 발급</li>
        <li className="py-3 text-center">고정닉 신청 완료</li>
      </ol>

      <h2 className="border-b border-[#b8b8b8] pb-2 font-bold text-[#273589]">약관동의</h2>

      <div className="mt-3 grid grid-cols-2 border-y border-[#b8b8b8] text-center font-semibold">
        <button
          type="button"
          className={`border-r border-[#b8b8b8] border-b-[2px] py-2 ${
            joinType === 'over14' ? 'border-b-[#273589] text-[#273589]' : 'border-b-transparent text-[#666]'
          }`}
          onClick={() => setJoinType('over14')}
        >
          고정닉 신청(만 14세 이상)
        </button>
        <button
          type="button"
          className={`border-b-[2px] py-2 ${
            joinType === 'under14' ? 'border-b-[#273589] text-[#273589]' : 'border-b-transparent text-[#666]'
          }`}
          onClick={() => setJoinType('under14')}
        >
          만 14세 미만
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={agreeAll} onChange={(e) => onToggleAll(e.target.checked)} className="h-3 w-3" />
          <span className="font-semibold">전체 동의하기</span>
        </label>

        <div>
          <label className="mb-2 flex items-center gap-2">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="h-3 w-3" />
            <span>
              [필수] 디시인사이드 이용약관{' '}
              <a href="https://nstatic.dcinside.com/dc/w/policy/policy_index.html" target="_blank" rel="noreferrer" className="text-[#666] hover:underline">
                전체
              </a>
            </span>
          </label>

          <div className="max-h-[280px] overflow-auto border border-[#d8d8d8] bg-white px-4 py-3 text-[12px] leading-5">
            <p className="mb-2 text-[#666]">본 이용약관의 목차는 아래와 같습니다.</p>
            <ol className="mb-3 grid grid-cols-2 gap-x-8 gap-y-1 text-[#b0120a]">
              {TERMS_TOC.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <div className="mb-3 border-t border-[#e5e5e5]" />
            <pre className="whitespace-pre-wrap font-sans">{TERMS_FULL_TEXT}</pre>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} className="h-3 w-3" />
              <span>
                [필수] 개인정보 수집 및 이용{' '}
                <a
                  href="https://nstatic.dcinside.com/dc/w/policy/privacy_index.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#666] hover:underline"
                >
                  전체 &gt;
                </a>
              </span>
            </label>
            <a
              href="https://nstatic.dcinside.com/dc/w/policy/privacy_young.html"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-[#bdbdbd] bg-[#f3f3f3] px-2 py-1 text-[12px] text-[#444] hover:bg-white"
            >
              쉬운버전
            </a>
          </div>

          <p className="mb-2 text-[12px] text-[#666]">
            개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 동의 거부 시 고정닉 신청이 제한됩니다.
          </p>

          <div className="border border-[#cfcfcf] bg-white">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f3f3f3] text-[#333]">
                  <th className="w-[210px] border border-[#d8d8d8] px-2 py-3 font-semibold">구분</th>
                  <th className="border border-[#d8d8d8] px-2 py-3 font-semibold">필수 수집</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border border-[#d8d8d8] px-2 py-3 align-middle font-normal text-[#333]">
                    개인정보 수집 및 이용 목적
                  </th>
                  <td className="border border-[#d8d8d8] px-3 py-3 align-top text-[#333]">
                    <ul className="list-none space-y-1">
                      {privacyPurpose.map((t) => (
                        <li key={t}>- {t}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th className="border border-[#d8d8d8] px-2 py-3 align-middle font-normal text-[#333]">
                    개인정보 수집 항목
                  </th>
                  <td className="border border-[#d8d8d8] px-3 py-3 align-top text-[#333]">
                    {privacyItemsBlocks.map((b) => (
                      <div key={b.title} className="mb-3">
                        <p className="font-semibold">{b.title}</p>
                        <div className="mt-1 space-y-1">
                          {b.lines.map((line) => (
                            <p key={line} className="whitespace-pre-wrap">
                              {line.startsWith('-') || line.startsWith('*') || line.startsWith('※') ? line : `- ${line}`}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="mt-2 flex justify-center">
                      <button
                        type="button"
                        className="rounded border border-[#bdbdbd] bg-[#f3f3f3] px-3 py-1 text-[12px] text-[#333] hover:bg-white"
                        onClick={() => setOpenPrivacyOptional(true)}
                      >
                        개별 서비스 이용 시 선택항목 &gt;
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className="border border-[#d8d8d8] px-2 py-3 align-middle font-normal text-[#333]">보유 및 이용 기간</th>
                  <td className="border border-[#d8d8d8] px-3 py-3 align-top text-[#333]">
                    <ul className="list-none space-y-1">
                      {privacyPeriod.map((t) => (
                        <li key={t}>- {t}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="px-3 py-3 text-[12px] text-[#333]">
              <ul className="list-none space-y-1">
                {privacyFootnotes.map((t) => (
                  <li key={t}>* {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {openPrivacyOptional && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 py-10"
          role="dialog"
          aria-modal="true"
          aria-label="개별 서비스 이용 시 선택항목"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpenPrivacyOptional(false)
          }}
        >
          <div className="w-full max-w-[760px] border border-[#bdbdbd] bg-white shadow-lg">
            <div className="flex items-start justify-between px-4 py-3">
              <p className="text-[13px] leading-5 text-[#333]">
                서비스 내용에 따라 필요한 정보가 추가로 수집될 수 있습니다.
                <br />
                해당 법령에 따라 이용 후 파기합니다.
              </p>
              <button
                type="button"
                className="ml-4 inline-flex h-7 w-7 items-center justify-center text-[18px] leading-none text-[#333]"
                aria-label="닫기"
                onClick={() => setOpenPrivacyOptional(false)}
              >
                ×
              </button>
            </div>

            <div className="px-4 pb-4">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#f3f3f3]">
                    <th className="w-[140px] border border-[#d8d8d8] px-2 py-2 font-semibold text-[#333]">
                      서비스 내용
                    </th>
                    <th className="border border-[#d8d8d8] px-2 py-2 font-semibold text-[#333]">선택항목</th>
                  </tr>
                </thead>
                <tbody>
                  {privacyOptionalRows.map((row) => (
                    <tr key={row.service}>
                      <th className="border border-[#d8d8d8] px-2 py-3 align-middle font-normal text-[#333]">
                        {row.service}
                      </th>
                      <td className="border border-[#d8d8d8] px-3 py-3 align-top text-[#333]">
                        <p className="whitespace-pre-wrap">{row.item}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        {canNext ? (
          <Link
            className="inline-flex h-[28px] min-w-[56px] items-center justify-center rounded-sm border border-[#5f5f5f] bg-[#6c6c6c] px-4 text-[12px] font-semibold text-white"
            to="/sign/join/info"
          >
            다음
          </Link>
        ) : (
          <button
            type="button"
            className="inline-flex h-[28px] min-w-[56px] items-center justify-center rounded-sm border border-[#b1b1b1] bg-[#d8d8d8] px-4 text-[12px] text-[#8a8a8a]"
            disabled
          >
            다음
          </button>
        )}
      </div>
    </section>
  )
}
