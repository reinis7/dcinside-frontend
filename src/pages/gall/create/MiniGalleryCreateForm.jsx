import { Link, useNavigate } from 'react-router-dom'

const MINI_LEGAL_PRIVACY = `※ '미니 갤러리 매니저'라 함은 미니 갤러리 서비스 내 각 미니 갤러리의 모든 운영권한을 갖는 '매니저'와 일부 운영권한을 갖는 '부매니저'를 말합니다.

미니 갤러리 매니저는 불필요한 개인정보를 수집하거나 처리하지 않도록 하며, 관련 법령 및 약관을 준수합니다.

1. 부정한 목적으로의 개인정보 처리 금지
금전적 이득 등을 위하여 부정한 목적으로 개인정보를 수집하거나 매매 등을 이용한 우회적인 개인정보 부정 판매 등이 적발될 경우, 디시인사이드는 관련 법령과 사이트 이용약관 및 미니 갤러리 운영원칙 등에 따라 해당 미니 갤러리에 대한 제재, 그리고 관련 법령에 따른 민형사상의 책임을 물을 수 있습니다.
2. 불필요한 개인정보에 대한 수집 및 이용 금지
불필요한 개인정보에 대한 수집, 이용을 해서는 안되며, 불가피하게 개인정보를 수집해야 하는 경우 최소한의 개인정보에 한해야 합니다. 또한, 관련 법령 및 이용약관, 운영원칙에 위배되지 않음을 합리적으로 증명할 수 있어야 합니다.
3. 개인정보의 수집 시 사전동의
개인정보를 수집하는 경우 반드시 사전에 '개인정보 항목, 수집목적, 보관기간, 개인정보의 수집을 거부할 권리 및 이로 인한 불이익'에 대해 명확히 고지하고, 정보주체(개인정보가 수집되는 다른 이용자)들의 개별 동의를 받아야 합니다.
4. 개인정보 제공의 금지
개인정보를 동의를 받아 수집한 경우라도 외부(수집한 사람을 제외한 모든 사람)에 제공하는 것은 원칙적으로 금지됩니다. 만약 외부에 제공하고자 하는 경우에는 정보주체에게 '제공받는 자, 제공하는 항목, 제공목적, 이용기간'을 명확히 고지하고 사전에 개별 동의를 받아야 합니다.
5. 주민등록번호 등 고유식별정보의 처리 금지
주민등록번호는 법령에 의하여 처리 근거가 있는 경우를 제외하고 어떤 목적으로도 처리할 수 없으며, 여권번호, 운전면허번호, 외국인 등록번호도 처리할 수 없습니다. 단, 불가피하게 처리가 필요한 경우에 한해 정보주체에게 사전에 개별 동의를 받아야 합니다.
6. 민감 정보의 처리 제한
사상/신념, 정치적 견해, 노동조합/정당의 가입/탈퇴, 건강 및 성생활 등에 관한 정보, 유전정보, 범죄경력에 관한 정보는 법령에 의하여 처리 근거가 있는 경우를 제외하고 처리할 수 없습니다. 단, 불가피하게 처리가 필요한 경우, 정보 주체로부터 사전에 개인정보 활용 동의를 반드시 받은 후 처리를 할 수 있습니다.
7. 영리 목적의 개인정보 처리 금지
상품판매, 공동구매, 수강생 모집 등 여타의 영리 목적을 목적으로 개인정보를 처리하는 것은 어떠한 경우에도 금지됩니다.
그 밖에 위에 기재하지 않은 사항은 디시인사이드 개인정보처리방침, 이용약관, 미니 갤러리 서비스 운영원칙 등에서 정한 바에 의합니다.`

const MINI_LEGAL_RULES = `※ 본 삭제 기준에 해당하는 게시물을 등록할 경우 관련 법령에 의해 민, 형사상 책임을 질 수 있습니다.
[이용제한 내용]
1. 게시물 제한
운영원칙에 어긋나는 게시물인 경우 타 이용자가 볼 수 없도록 노출이 제한됩니다.
2. 이용자 이용 정지
운영원칙에 어긋나는 행위를 한 이용자인 경우 게시물/댓글 등록 및 미니 갤러리 개설 등의 활동을 할 수 없게 이용이 일시 또는 영구 정지됩니다.
3. 매니저 해임
매니저의 장기간 부재 또는 본 운영원칙에 위반되는 내용의 게시물의 방치 등 불성실한 운영 시 매니저를 해임할 수 있습니다.
4. 미니 갤러리 접근 제한
운영원칙에 어긋나는 행위를 방치, 조장했거나 여타의 문제가 있는 경우 다른 이용자가 볼 수 없도록 미니 갤러리 접근을 일시 또는 영구적으로 제한합니다.
5. 미니 갤러리 폐쇄
운영원칙에 어긋나는 문제가 반복되거나 심대한 경우, 또는 수사기관의 요청, 불법적인 목적의 운영/개설 의도가 명확한 경우 해당 미니 갤러리는 폐쇄 조치됩니다.`

/**
 * Mini gallery (`/gall/n/create`) — 공개/비공개, `/mini/` 주소 표시, 동의 2종.
 */
export function MiniGalleryCreateForm({
  form,
  setFormField,
  backTo,
  canSubmit,
  handleCreate,
  isSubmitting,
  isTopicLoading,
  topicError,
  topicOptions,
  nameLength,
  descriptionLength,
  slugLength,
}) {
  const navigate = useNavigate()

  return (
    <section className="border border-[#d3d3d3] bg-white px-5 py-4 text-[12px]">
      <div className="flex items-center justify-between border-b-2 border-[#2f3d8f] pb-2">
        <div className="text-[26px] font-bold tracking-[-0.02em] text-[#2c2c2c]">
          <span className="text-[#2f3d8f]">미니 갤러리</span> 만들기
          <span className="ml-2 text-[13px] font-normal text-[#777]">(만들기는 6개까지 가능합니다.)</span>
        </div>
        <Link to={backTo} className="text-[12px] text-[#334499] hover:underline">
          돌아가기
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setFormField('visibility', 'public')}
          className={`rounded border-2 bg-white p-4 text-left transition-colors ${
            form.visibility === 'public' ? 'border-[#2f3d8f] bg-[#f5f8ff]' : 'border-[#ddd] hover:border-[#bbb]'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border border-[#999] bg-[#f0f0f0] text-[12px] text-[#666]">
              {form.visibility === 'public' ? '✓' : ''}
            </span>
            <div>
              <div className="text-[15px] font-bold text-[#222]">공개</div>
              <p className="mt-2 text-[12px] leading-[1.55] text-[#666]">
                누구나 갤러리를 검색할 수 있고, 글을 볼 수 있습니다.
              </p>
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setFormField('visibility', 'private')}
          className={`rounded border-2 bg-white p-4 text-left transition-colors ${
            form.visibility === 'private' ? 'border-[#2f3d8f] bg-[#f5f8ff]' : 'border-[#ddd] hover:border-[#bbb]'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border border-[#999] bg-[#f0f0f0] text-[12px] text-[#666]">
              {form.visibility === 'private' ? '✓' : ''}
            </span>
            <div>
              <div className="text-[15px] font-bold text-[#222]">비공개</div>
              <p className="mt-2 text-[12px] leading-[1.55] text-[#666]">
                검색 결과에 노출되지 않으며, 가입 회원(고정닉)만 글을 볼 수 있습니다.
              </p>
            </div>
          </div>
        </button>
      </div>

      <p className="mt-3 text-[12px] leading-[1.55] text-[#d62400]">
        ※ 공개·비공개 설정은 만들기 이후 변경할 수 없습니다. 미니 갤러리는 메인 갤러리 승격 대상이 아닙니다.
      </p>

      <div className="mt-6 border-t-2 border-[#2f3d8f] pt-4">
        <div className="grid grid-cols-[120px_1fr] border-b border-[#ebebeb]">
          <div className="px-2 py-3 font-bold text-[#555]">이름 <span className="text-[#d62400]">*</span></div>
          <div className="px-2 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={form.name}
                onChange={(e) => setFormField('name', e.target.value.slice(0, 12))}
                className="h-[32px] w-full max-w-[340px] border border-[#cfcfcf] px-2 text-[13px]"
                placeholder="미니 갤러리 이름을 간단히 넣어주세요."
              />
              <span className="inline-flex h-[32px] items-center border border-[#8b9bc9] bg-[#f5f8ff] px-3 text-[12px] font-semibold text-[#2f3d8f]">
                미니 갤러리
              </span>
              <span className="text-[12px] text-[#666]">{nameLength}/12</span>
            </div>
            <p className="mt-1 text-[12px] text-[#d62400]">※ 이름은 개설 후 7일 이내에만 1회 수정할 수 있습니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-[120px_1fr] border-b border-[#ebebeb]">
          <div className="px-2 py-3 font-bold text-[#555]">설명</div>
          <div className="px-2 py-2">
            <textarea
              value={form.description}
              onChange={(e) => setFormField('description', e.target.value.slice(0, 200))}
              className="h-[100px] w-full max-w-[620px] border border-[#cfcfcf] p-2 text-[13px]"
              placeholder="미니 갤러리에 대한 설명을 넣어주세요."
            />
            <div className="mt-1 text-right text-[12px] text-[#888]">{descriptionLength}/200</div>
          </div>
        </div>

        <div className="grid grid-cols-[120px_1fr] border-b border-[#ebebeb]">
          <div className="px-2 py-3 font-bold text-[#555]">주소 <span className="text-[#d62400]">*</span></div>
          <div className="px-2 py-2">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[13px] text-[#666]">https://gall.dcinside.com/mini/</span>
              <input
                value={form.slug}
                onChange={(e) => setFormField('slug', e.target.value.slice(0, 20))}
                className="h-[28px] w-full max-w-[200px] border border-[#cfcfcf] px-2 text-[13px]"
              />
              <span className="text-[12px] text-[#666]">{slugLength}/20</span>
            </div>
            <p className="mt-1 text-[12px] text-[#d62400]">※ 주소는 만들기 후 수정이 불가능합니다. 신중히 입력해주세요.</p>
          </div>
        </div>

        <div className="grid grid-cols-[120px_1fr] border-b border-[#ebebeb]">
          <div className="px-2 py-3 font-bold text-[#555]">카테고리 <span className="text-[#d62400]">*</span></div>
          <div className="px-2 py-2">
            <select
              value={form.topicId}
              onChange={(e) => setFormField('topicId', e.target.value)}
              className="h-[30px] min-w-[200px] border border-[#cfcfcf] bg-white px-2 text-[13px] text-[#555]"
            >
              {isTopicLoading ? <option>카테고리 불러오는 중...</option> : null}
              {topicError ? <option>카테고리 불러오기 실패</option> : null}
              {!isTopicLoading && !topicError ? <option value="">카테고리를 선택해주세요.</option> : null}
              {!isTopicLoading && !topicError
                ? topicOptions.map((topic) => (
                    <option key={topic.key} value={topic.value}>
                      {topic.label}
                    </option>
                  ))
                : null}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[#2f3d8f] pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 flex items-center gap-1 text-[13px] font-semibold text-[#444]">
              <input
                type="checkbox"
                checked={form.agreedPrivacy}
                onChange={(e) => setFormField('agreedPrivacy', e.target.checked)}
                className="h-[14px] w-[14px]"
              />
              미니 갤러리 개인정보정책에 동의합니다.
            </label>
            <textarea readOnly className="h-[280px] w-full resize-none border border-[#cfcfcf] bg-white p-2 text-[12px] leading-[1.5] text-[#555]" value={MINI_LEGAL_PRIVACY} />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-1 text-[13px] font-semibold text-[#444]">
              <input
                type="checkbox"
                checked={form.agreedRules}
                onChange={(e) => setFormField('agreedRules', e.target.checked)}
                className="h-[14px] w-[14px]"
              />
              미니 갤러리 운영원칙에 동의합니다.
            </label>
            <textarea readOnly className="h-[220px] w-full resize-none border border-[#cfcfcf] bg-white p-2 text-[12px] leading-[1.5] text-[#555]" value={MINI_LEGAL_RULES} />
          </div>
        </div>

        <ul className="mt-4 list-inside list-disc space-y-1 text-[12px] leading-[1.55] text-[#666]">
          <li>게시물의 관리 의무와 권리는 매니저(개설자)에게 있으며, 운영원칙 위반 시 갤러리 폐쇄 또는 매니저 해임이 될 수 있습니다.</li>
          <li>마지막으로 만든 날부터 7일이 지나야 추가로 갤러리를 개설할 수 있습니다.</li>
          <li>회원당 미니 갤러리는 최대 6개까지 만들 수 있습니다.</li>
        </ul>

        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            className="h-[36px] min-w-[92px] rounded border border-[#4a4a4a] bg-[#606060] px-4 text-[18px] font-bold text-white"
            disabled={isSubmitting}
            onClick={() => navigate(backTo)}
          >
            취소
          </button>
          <button
            type="button"
            className="h-[36px] min-w-[92px] rounded border border-[#253f90] bg-[#2f4aa0] px-4 text-[18px] font-bold text-white"
            disabled={!canSubmit}
            onClick={handleCreate}
          >
            {isSubmitting ? '처리 중' : '만들기'}
          </button>
        </div>
      </div>
    </section>
  )
}
