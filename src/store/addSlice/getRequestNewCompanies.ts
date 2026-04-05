import {createAsyncThunk} from '@reduxjs/toolkit'
import {RootState} from '@store/store'
import {requestNewCompanies} from '@api/ADD'

export const getRequestNewCompanies = createAsyncThunk<
  void,
  void,
  {rejectValue: string; state: RootState}
>('add/getRequestNewCompanies', async (_, {getState}) => {
  const {workspace} = getState().auth
  await requestNewCompanies(workspace as string)
})
