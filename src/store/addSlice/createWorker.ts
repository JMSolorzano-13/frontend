import {createAsyncThunk} from '@reduxjs/toolkit'
import {postWorker} from '@api/ADD'
import {RootState} from '@store/store'

type Out = {
  created?: boolean
  message?: string
  status: string
}

type In = {
  workspaceId: string
}

export const createWorker = createAsyncThunk<
  Out,
  In,
  {rejectValue: string; state: RootState}
>('add/createWorker', async (_, {getState}) => {
  const {company} = getState().auth
  const {companies} = getState().company
  const findCompany = companies.find((item) => item.identifier === company)
  if (findCompany) {
    const createdWorker = await postWorker(findCompany.workspace.identifier)
    return createdWorker
  }
  return {
    created: false,
    message: `Can't be created`,
    status: 'failed',
  }
})
