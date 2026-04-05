import {createSlice} from '@reduxjs/toolkit'
import {RootState} from '../store'
import {getEFOS} from './getEFOS'
import {getEFOSTotals} from './getEFOSTotals'
import {getRelatedEFOS} from './getRelatedEFOS'

interface EfosState {
  isFetching: boolean
  error: string | null
  efos: EFOS[]
  efosCount: number
  efosTotals: EFOSTotals | null
  relatedEfos: EFOS[]
  relatedEfosCount: number
  relatedEfosTotals: EFOSTotals | null
  isFetchingRelatedEfos: boolean
  errorRelatedEfos: string | null
  isFetchingEfosTotals: boolean
}

const initialState: EfosState = {
  isFetching: false,
  error: null,
  efos: [],
  efosCount: 0,
  efosTotals: null,
  relatedEfos: [],
  relatedEfosCount: 0,
  relatedEfosTotals: null,
  isFetchingRelatedEfos: false,
  errorRelatedEfos: null,
  isFetchingEfosTotals: false,
}

export const efosSlice = createSlice({
  name: 'efos',
  initialState,
  reducers: {
    cleanErrors: (state) => {
      state.error = null
      state.errorRelatedEfos = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEFOS.fulfilled, (state, {payload}) => {
      state.isFetching = false
      state.efos = payload.efos
      state.efosCount = payload.efosCount
    })
    builder.addCase(getEFOS.pending, (state) => {
      state.isFetching = true
      state.error = null
    })
    builder.addCase(getEFOS.rejected, (state, {payload}) => {
      state.isFetching = false
      state.error = payload ?? null
    })

    builder.addCase(getRelatedEFOS.fulfilled, (state, {payload}) => {
      state.isFetchingRelatedEfos = false
      state.relatedEfos = payload.efos
      state.relatedEfosCount = payload.efosCount
    })
    builder.addCase(getRelatedEFOS.pending, (state) => {
      state.isFetchingRelatedEfos = true
      state.errorRelatedEfos = null
    })
    builder.addCase(getRelatedEFOS.rejected, (state, {payload}) => {
      state.isFetchingRelatedEfos = false
      state.errorRelatedEfos = payload ?? null
    })

    builder.addCase(getEFOSTotals.fulfilled, (state, {payload}) => {
      if (payload.fetchedAll) {
        state.efosTotals = payload.efosTotals
      } else {
        state.relatedEfosTotals = payload.efosTotals
      }
      state.isFetchingEfosTotals = false
    })
    builder.addCase(getEFOSTotals.pending, (state) => {
      state.error = null
      state.isFetchingEfosTotals = true
    })
    builder.addCase(getEFOSTotals.rejected, (state, {payload}) => {
      state.error = payload ?? null
      state.isFetchingEfosTotals = false
    })
  },
})

export const efosSelector = (state: RootState) => state.efos

export const {cleanErrors} = efosSlice.actions

export default efosSlice.reducer
