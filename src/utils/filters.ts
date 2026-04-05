import _ from 'lodash'

export const isIn = (search: string, value: string | null) => {
  if (value === null) return false
  return value.toUpperCase().indexOf(search) > -1
}

export const filterCFDIs = (search: string, cfdis: CFDI[]) => {
  const s = search.toUpperCase()
  return _.filter(cfdis, (cfdi) => {
    return (
      isIn(s, cfdi.NombreEmisor) ||
      isIn(s, cfdi.RfcEmisor) ||
      isIn(s, cfdi.NombreReceptor) ||
      isIn(s, cfdi.RfcReceptor)
    )
  })
}

export const filterUsers = (search: string, users: UserWithPermissions[]) => {
  const s = search.toUpperCase()
  return _.filter(users, (user) => {
    return isIn(s, user.name) || isIn(s, user.email)
  })
}
