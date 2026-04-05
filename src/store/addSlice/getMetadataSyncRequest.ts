import {postRequestMetadataSync} from '@api/ADD'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {RootState} from '@store/store'

export const getMetadataSyncRequest = createAsyncThunk<
  void,
  void,
  {rejectValue: string; state: RootState}
>('add/sync/metadataSyncRequest', async (_, {rejectWithValue, getState}) => {
  const {company, rfc} = getState().auth
  if (!company && !rfc) {
    console.error('Error in getMetadataSyncRequest: no company or rfc selected')
    return rejectWithValue('Sin compañía o RFC')
  }

  try {
    const requestMetadataSync = await postRequestMetadataSync(company)
    return requestMetadataSync.data
  } catch (error) {
    console.error('Unexpected error in getMetadataSyncRequest: ', error)
    return rejectWithValue('Error al solicitar la sincronización de metadata')
  }
})
