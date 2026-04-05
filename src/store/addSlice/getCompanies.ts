import {createAsyncThunk} from '@reduxjs/toolkit'
import {RootState} from '@store/store'
import {fetchCompanies} from '@api/ADD'

type Out = {
  companies: ADDCompanyTypes[]
}

export const getADDCompanies = createAsyncThunk<
  Out,
  void,
  {rejectValue: string; state: RootState}
>('add/getCompanies', async (_, {getState}) => {
  const {workspace, company} = getState().auth
  const {companies} = getState().company
  const findCompany = companies.find((item) => item.identifier === company)
  const fetchPastoCompanies = await fetchCompanies(
    workspace as string,
    findCompany?.rfc as string
  )
  return {companies: fetchPastoCompanies as ADDCompanyTypes[]}
})
