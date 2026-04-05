import http from './_http'

/**
 * Fetch global status of the application
 * @returns the global status of the application
 */
export const fetchGlobalStatus = async (options?: {domain?: Domain}) => {
  const {data} = await http.post('/Param/search', {
    domain: options?.domain,
  })
  return data.data as GServerParam[]
}
