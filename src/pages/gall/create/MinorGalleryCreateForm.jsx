import { Link, useNavigate } from 'react-router-dom'

/**
 * 마이너·메인·인물 갤러리 만들기 공통 레이아웃.
 * `formVariant`: **minor** `/gall/m/create`, **main** `/gall/create`, **person** `/gall/p/create`
 */
export function MinorGalleryCreateForm({
  galleryLabel,
  formVariant = 'minor',
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
  reasonLength,
}) {
  const navigate = useNavigate()
  const showPromoteToMain = formVariant !== 'main'

  const aside =
    formVariant === 'main' ? (
      <>
        <div className="mb-1 font-bold text-[#2f3d8f]">메인 갤러리 안내</div>
        <p>메인 갤러리는 검색·통합 서비스에 노출되는 공식 주제 공간입니다. 신청 내용 심사 후 개설이 확정됩니다.</p>
        <p>주제·명칭이 운영 기준에 맞지 않으면 반려될 수 있으며, 중복 주제는 개설이 제한될 수 있습니다.</p>
        <div className="mt-2 font-bold text-[#2f3d8f]">유의 사항</div>
        <p>간결하고 주제를 잘 나타내는 이름을 입력해 주세요. 주소는 개설 후 변경할 수 없습니다.</p>
      </>
    ) : formVariant === 'person' ? (
      <>
        <div className="mb-1 font-bold text-[#2f3d8f]">인물 갤러리 안내</div>
        <p>특정 유명인(실존 인물)을 주제로 한 갤러리입니다. 동일 인물·유사 주제의 중복 개설은 제한될 수 있습니다.</p>
        <p>실명·초상권 등 관련 법령과 커뮤니티 가이드를 준수해 주세요.</p>
        <div className="mt-2 font-bold text-[#2f3d8f]">유의 사항</div>
        <p>인물명은 공식적으로 통용되는 표기를 사용하고, 운영진 안내에 따라 수정 요청이 있을 수 있습니다.</p>
      </>
    ) : (
      <>
        <div className="mb-1 font-bold text-[#2f3d8f]">승격 안내</div>
        <p>영화, 드라마 등 일부 {galleryLabel}는 심사 후 메인 갤러리로 승격됩니다.</p>
        <p>승격 여부는 전적으로 회사에 의해 결정되며, 승격 시 매니저 권한은 회수됩니다.</p>
        <div className="mt-2 font-bold text-[#2f3d8f]">유의 사항</div>
        <p>미인 갤러리 승격을 위해서 간결하고 정확한 단어형 이름을 입력하셔야 합니다.</p>
        <p>
          중복 주제의 미인 갤러리가 있을 경우 승격이 불가능합니다.
          <a href="#" className="ml-1 text-[#d62400] underline" onClick={(e) => e.preventDefault()}>
            자세히보기
          </a>
        </p>
      </>
    )

  const nameHintSecond =
    formVariant === 'main' ? (
      <div>※ 심사 기준에 맞지 않는 이름·주제는 반려될 수 있습니다.</div>
    ) : formVariant === 'person' ? (
      <div>※ 동일 인물을 주제로 한 갤러리가 이미 있으면 개설이 제한될 수 있습니다.</div>
    ) : (
      <div>※ 동일한 주제의 {galleryLabel}는 개설이 불가능합니다.</div>
    )

  return (
    <section className="border border-[#d3d3d3] bg-white px-5 py-4 text-[12px]">
      <div className="flex items-center justify-between border-b-2 border-[#2f3d8f] pb-2">
        <div className="text-[32px] font-bold tracking-[-0.02em] text-[#2c2c2c]">
          {galleryLabel} <span className="text-[#2f3d8f]">만들기</span>
          <span className="ml-2 text-[13px] font-normal text-[#777]">(만들기는 6개까지 가능합니다.)</span>
        </div>
        <Link to={backTo} className="text-[12px] text-[#334499] hover:underline">
          돌아가기
        </Link>
      </div>

      <div className="mt-5">
        <div className="pl-12">
          <div className="text-[39px] font-bold leading-tight">
            <span className="text-[#d62400]">{galleryLabel}는?</span>
          </div>
          <div className="mt-1 text-[39px] font-bold leading-tight text-[#111]">
            누구나 갤러리를 개설할 수 있습니다. 갤러리의 운영 권한 및 의무가 개설자에게 부여됩니다.
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_340px] gap-4 border border-[#f0e9f4] bg-[#fdfaff] px-5 py-5">
          <div className="h-[235px]" />
          <aside className="self-start bg-[#f3f3f3] p-4 text-[13px] leading-[1.55] text-[#444]">{aside}</aside>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_285px] border-b border-[#ebebeb]">
        <div className="mt-3 border-t-2 border-[#2f3d8f]">
          <div className="grid grid-cols-[120px_1fr] border-b border-[#ebebeb]">
            <div className="px-2 py-3 font-bold text-[#555]">이름 <span className="text-[#d62400]">*</span></div>
            <div className="px-2 py-2">
              <div className="flex items-center gap-2">
                <input
                  value={form.name}
                  onChange={(e) => setFormField('name', e.target.value.slice(0, 12))}
                  className="h-[32px] w-full max-w-[340px] border border-[#cfcfcf] px-2 text-[13px]"
                  placeholder={`${galleryLabel} 이름을 간단히 넣어주세요.`}
                />
                <button type="button" className="h-[32px] border border-[#8b9bc9] bg-[#f5f8ff] px-3 text-[12px] font-semibold text-[#2f3d8f]">
                  {galleryLabel}
                </button>
                <span className="text-[12px] text-[#666]">{nameLength}/12</span>
              </div>
              <div className="mt-1 text-[12px] leading-[1.45] text-[#d62400]">
                <div>※ 이름은 7월 부, 1월 1회만 수정할 수 있습니다.</div>
                {nameHintSecond}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] border-b border-[#ebebeb]">
            <div className="px-2 py-3 font-bold text-[#555]">설명</div>
            <div className="px-2 py-2">
              <textarea
                value={form.description}
                onChange={(e) => setFormField('description', e.target.value.slice(0, 200))}
                className="h-[78px] w-full max-w-[620px] border border-[#cfcfcf] p-2 text-[13px]"
                placeholder={`${galleryLabel}에 대한 설명을 넣어주세요.`}
              />
              <div className="mt-1 text-right text-[12px] text-[#888]">{descriptionLength}/200</div>
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] border-b border-[#ebebeb]">
            <div className="px-2 py-3 font-bold text-[#555]">주소 <span className="text-[#d62400]">*</span></div>
            <div className="px-2 py-2">
              <div className="flex items-center gap-1">
                <span className="text-[13px] text-[#666]">https://gall.dcinside.com/</span>
                <input
                  value={form.slug}
                  onChange={(e) => setFormField('slug', e.target.value.slice(0, 20))}
                  className="h-[28px] w-full max-w-[220px] border border-[#cfcfcf] px-2 text-[13px]"
                />
                <span className="text-[12px] text-[#666]">{slugLength}/20</span>
              </div>
              <div className="mt-1 text-[12px] text-[#d62400]">※ 주소는 만들기 후 수정이 불가능합니다. 신중히 입력해주세요.</div>
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] border-b border-[#ebebeb]">
            <div className="px-2 py-3 font-bold text-[#555]">카테고리 <span className="text-[#d62400]">*</span></div>
            <div className="px-2 py-2">
              <select
                value={form.topicId}
                onChange={(e) => setFormField('topicId', e.target.value)}
                className="h-[30px] w-[175px] border border-[#cfcfcf] bg-white px-2 text-[13px] text-[#555]"
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

          <div className="grid grid-cols-[120px_1fr]">
            <div className="px-2 py-3 font-bold text-[#555]">개설이유 <span className="text-[#d62400]">*</span></div>
            <div className="px-2 py-2">
              <input
                value={form.reason}
                onChange={(e) => setFormField('reason', e.target.value.slice(0, 100))}
                className="h-[30px] w-full max-w-[620px] border border-[#cfcfcf] px-2 text-[13px]"
                placeholder="운영자에게 전달되는 메시지입니다."
              />
              <span className="ml-2 text-[12px] text-[#666]">{reasonLength}/100</span>
              <div className="mt-1 text-[12px] leading-[1.45] text-[#666]">
                <div>※ {galleryLabel} 개설 이름, 설명, 주소, 개설 이유에 따라 승인 또는 반려될 수 있습니다.</div>
                <div>※ 개설 승인, 반려는 평일 점심~저녁 시간에 처리됩니다.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-l border-[#ebebeb] bg-[#f3f3f3] px-2 py-2">
          <div className="mb-1 text-[13px] font-bold text-[#d62400]">예시</div>
          <div className="flex items-center gap-1">
            <input
              readOnly
              value="커피"
              className="h-[28px] w-full border border-[#cfcfcf] bg-[#ffffff] px-2 text-[12px] text-[#555]"
            />
            <button
              type="button"
              disabled
              className="h-[28px] cursor-default border border-[#8b9bc9] bg-[#f5f8ff] px-2 text-[11px] font-semibold text-[#2f3d8f]"
            >
              {galleryLabel}
            </button>
          </div>
          <div className="mt-2 h-[60px] border border-[#ddd] bg-[#ffffff] p-2 text-[12px] text-[#666]">커피에 관한 소소한 이야기들</div>
          <div className="mt-1 text-right text-[12px] text-[#888]">21/200</div>
        </div>
      </div>

      <div className="mt-5 border-t border-[#2f3d8f] pt-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 flex items-center gap-1 text-[13px] font-semibold text-[#444]">
              <input
                type="checkbox"
                checked={form.agreedPrivacy}
                onChange={(e) => setFormField('agreedPrivacy', e.target.checked)}
                className="h-[14px] w-[14px]"
              />
              {galleryLabel} 개인정보정책에 동의합니다.
            </label>
            <textarea
              readOnly
              className="h-[132px] w-full resize-none border border-[#cfcfcf] bg-white p-2 text-[12px] leading-[1.5] text-[#555]"
              value={`※ '${galleryLabel} 매니저'라 함은 ${galleryLabel} 서비스 내 각 ${galleryLabel}의 모든 운영권한을 갖는 '매니저 일부 운영권한을 갖는 '부매니저'를 말합니다.
${galleryLabel} 매니저는 불필요한 개인정보를 수집하거나 처리하지 않도록 하며, 관련 법령 및 약관을 준수합니다.

1. 부정한 목적으로 개인정보 처리 금지
근접 접속 등을 의한 부정한 목적의 개인정보 수집처리나 매매 등을 이용한 유출은 엄격히 금지되며, 적발 시 이용제한 조치 됩니다.`}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-1 text-[13px] font-semibold text-[#444]">
              <input
                type="checkbox"
                checked={form.agreedRules}
                onChange={(e) => setFormField('agreedRules', e.target.checked)}
                className="h-[14px] w-[14px]"
              />
              {galleryLabel} 운영원칙에 동의합니다.
            </label>
            <textarea
              readOnly
              className="h-[132px] w-full resize-none border border-[#cfcfcf] bg-white p-2 text-[12px] leading-[1.5] text-[#555]"
              value={`${galleryLabel} 서비스는 이용자분들이 직접 만들고 운영하는 커뮤니티 공간으로 모든 이용자들은 아래 운영원칙을 준수해야 합니다.

[모든 이용자가 지켜야 하는 원칙]
모든 이용자는 미디어를 매개체로 만든 정상적인 활동을 해주셔야 합니다.
${galleryLabel} 서비스에 등록한 모든 콘텐츠의 저작권은 게시한 이용자 본인에게 있으며, 이로 인해 발생하는 문제에 대해서는 해당 게시물을 게시한 이용자에게 책임이 있습니다.`}
            />
          </div>
        </div>

        {showPromoteToMain ? (
          <div className="mt-3">
            <label className="flex items-center gap-1 text-[13px] font-semibold text-[#444]">
              <input
                type="checkbox"
                checked={form.agreedPromoteToMain}
                onChange={(e) => setFormField('agreedPromoteToMain', e.target.checked)}
                className="h-[14px] w-[14px]"
              />
              메인 갤러리 승격에 동의합니다.
            </label>
            <p className="mt-1 text-[12px] text-[#888]">
              신청하신 {galleryLabel}는 디시인사이드의 판단에 따라 메인 갤러리로 승격되고, 매니저 권한이 회수됩니다.
            </p>
          </div>
        ) : null}

        <div className="mt-4 border-t border-dashed border-[#d9d9d9] pt-4 text-[12px] text-[#666]">
          · 게시물의 관리 의무와 권리는 매니저(개설자)에게 있으며, 운영원칙을 위반한 경우 폐쇄 또는 매니저 해임이 될 수 있습니다.(음란물, 불량 게시물, 상업적 게시물, 댓글의 방치 등)
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
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
