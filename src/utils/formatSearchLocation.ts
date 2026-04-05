function formatSearchLocation(search: string) {
  if (search.length > 3) {
    const searchArr = search.substr(1).split('&')
    if (searchArr.length > 0) {
      const searchObj: {[key: string]: string} = {}
      searchArr.forEach((s) => {
        const sPair = s.split('=')
        if (sPair.length > 1) {
          const [key, value] = sPair
          searchObj[key] = value
        }
      })
      return searchObj
    }
  }
  return {}
}

export default formatSearchLocation
