function editSearchParams(
  searchParams: string,
  paramsToEdit: {key: string; value: string | null | undefined}[],
  options?: {baseUrl: string}
) {
  const searchObj = new URLSearchParams(searchParams)
  paramsToEdit.forEach((p) => {
    if (p.value !== undefined && p.value !== null && p.value !== '') {
      searchObj.set(p.key, p.value)
    } else {
      searchObj.delete(p.key)
    }
  })
  const search = searchObj.toString()
  const url = options?.baseUrl ?? ''
  return `${url}?${search}`
}

export default editSearchParams
