import {postEnableAutoSyncADD} from '@api/ADD'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {RootState} from '@store/store'

type Out = {
  res: string
}

type In = {
  automaticValue: boolean
}

export const setADDAutomaticSync = createAsyncThunk<
  Out,
  In,
  {rejectValue: string; state: RootState}
>(
  'add/sync/automaticSync',
  async ({automaticValue}, {rejectWithValue, getState}) => {
    const {company, rfc} = getState().auth
    if (!company || !rfc) {
      console.error('Error in getSyncSearch: no company or rfc selected')
      return rejectWithValue('Sin compañía o RFC')
    }
    try {
      const synchSearchData = await postEnableAutoSyncADD(
        company,
        automaticValue
      )
      return {res: synchSearchData.data}
    } catch (error) {
      console.error('Unexpected error in setADDAutomaticSync: ', error)
      return rejectWithValue('Error al activar la sincronización automática')
    }
  }
)
