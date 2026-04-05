import {createSlice} from '@reduxjs/toolkit'
import {RootState} from '../store'
import {getFiscalData} from './getFiscalData'
import {getRegimeCatalogue} from './getRegimeCatalogue'
import saveFiscalData from './saveFiscalData'

interface invoiceState {
  regimeCatalogueError: string | null
  saveInvoiceError: string | null
  fiscalDataError: string | null
  isFetchingRegimeCatalogue: boolean
  isFetchingFiscalData: boolean
  regimeCatalogue: regimeCatalogue | undefined
  needsReload: boolean
  fiscalData: invoiceData | null
}

const initialState: invoiceState = {
  regimeCatalogueError: null,
  saveInvoiceError: null,
  fiscalDataError: null,
  isFetchingRegimeCatalogue: false,
  isFetchingFiscalData: false,
  regimeCatalogue: undefined,
  needsReload: false,
  fiscalData: null,
}

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRegimeCatalogue.fulfilled, (state, {payload}) => {
      state.isFetchingRegimeCatalogue = false
      state.regimeCatalogue = payload.taxRegimeCatalogue
    })
    builder.addCase(getRegimeCatalogue.pending, (state) => {
      state.isFetchingRegimeCatalogue = true
      state.regimeCatalogueError = null
    })
    builder.addCase(getRegimeCatalogue.rejected, (state, {payload}) => {
      state.isFetchingRegimeCatalogue = false
      state.regimeCatalogueError = payload ?? null
    })
    builder.addCase(saveFiscalData.fulfilled, (state) => {
      state.needsReload = false
    })
    builder.addCase(saveFiscalData.pending, (state) => {
      state.saveInvoiceError = null
    })
    builder.addCase(saveFiscalData.rejected, (state, {payload}) => {
      state.saveInvoiceError = payload ?? null
      state.needsReload = true
    })
    builder.addCase(getFiscalData.fulfilled, (state, {payload}) => {
      state.isFetchingFiscalData = false
      state.fiscalData = payload.fiscalData
    })
    builder.addCase(getFiscalData.pending, (state) => {
      state.isFetchingFiscalData = true
      state.fiscalDataError = null
    })
    builder.addCase(getFiscalData.rejected, (state, {payload}) => {
      state.isFetchingFiscalData = false
      state.fiscalDataError = payload ?? null
    })
  },
})

export const invoiceSelector = (state: RootState) => state.invoice

export default invoiceSlice.reducer
