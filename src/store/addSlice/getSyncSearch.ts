import {createAsyncThunk} from '@reduxjs/toolkit'
import {fetchSyncSearch} from '@api/ADD'
import {RootState} from '@store/store'

type Out = {
  sync: ADDSyncSearch[]
}

export const getSyncSearch = createAsyncThunk<
  Out,
  void,
  {rejectValue: string; state: RootState}
>('add/sync/search', async (_, {rejectWithValue, getState}) => {
  const {company, rfc} = getState().auth
  if (!company || !rfc) {
    console.error('Error in getSyncSearch: no company or rfc selected')
    return rejectWithValue('Sin compañía o RFC')
  }

  try {
    const synchSearchData = await fetchSyncSearch(company)
    const syncData = synchSearchData.sync
    return {
      sync: syncData,
    }
  } catch (error) {
    console.error('Unexpected error in getSyncSearch: ', error)
    return rejectWithValue('Error al obtener los Sync Search')
  }
})
