import {requestSync} from '@api/ADD'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {RootState} from '@store/store'

type In = {
  startDate: string
  endDate: string
}

export const syncRequest = createAsyncThunk<
  void,
  In,
  {rejectValue: string; state: RootState}
>(
  'add/sync/Request',
  async ({startDate, endDate}, {rejectWithValue, getState}) => {
    const {company, rfc} = getState().auth
    if (!company || !rfc) {
      console.error('Error in syncRequest: no company or rfc selected')
      return rejectWithValue('Sin compañía o RFC')
    }

    try {
      const requested = await requestSync(company, startDate, endDate)
      return requested
    } catch (e) {
      console.error(e)
      return rejectWithValue('Error from syncRequest')
    }
  }
)
