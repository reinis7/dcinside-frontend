/** Upper bound for one gallery list fetch. The posts field has no offset or totalCount. */
export const BOARD_LIST_FETCH_LIMIT = 500

export function paginateBoardRows(rows, page, pageSize) {
  const totalCount = rows.length
  const size = Math.max(1, pageSize)
  const pageCount = Math.max(1, Math.ceil(totalCount / size) || 1)
  const safePage = Math.min(Math.max(1, page), pageCount)
  const start = (safePage - 1) * size
  return {
    totalCount,
    pageCount,
    safePage,
    pageRows: rows.slice(start, start + size),
    capped: totalCount >= BOARD_LIST_FETCH_LIMIT,
  }
}

export function formatBoardTotalCount(totalCount, { loading = false, capped = false } = {}) {
  if (loading || totalCount == null) return '--'
  const label = Number(totalCount).toLocaleString('ko-KR')
  return capped ? `${label}+개` : `${label}개`
}
