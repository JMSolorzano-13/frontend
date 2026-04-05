import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@store/store";
import { ISRState } from "../_types/ISRStateTypes";
import {
  ISRCFDIResponseType,
  ISRCFDIsPayload,
  ISRTotalsPayload,
  ISRTotalsResponseType,
  ISRTotalsResponseTypeDedcutions,
  ISRUpdateCFDIPayload,
  ISRUpdatePayload,
  ResponseTotalsAll,
  ResponseTotalsDeductionsComplete,
} from "../_types/ISRTypes";

const ISRInitialState: ISRState = {
  ISRTotals: null,
  ISRTotalsDeductions: null,
  ISRTotalsDeductionsTable: null,
  fetchingTotals: false,
  fetchingTotalsDeductions: false,
  fetchingTotalsDeductionsTabs: false,
  ISRTotalsError: "",
  ISRCFDIs: [],
  ISRTotalCFDIs: 0,
  fetchingCFDIs: false,
  ISRCFDIsError: "",
  isFetchingISRExports: false,
  showISRExportBanner: false,
  updateSucceded: false,
  isUpdatingCFDI: false,
  updateCFDIError: "",
  percentage: false,
};

export const ISRSlice = createSlice({
  name: "isr",
  initialState: ISRInitialState,
  reducers: {
    // TODO: Remove this
    /* eslint-disable @typescript-eslint/no-unused-vars */
    getISRTotalsAction: (state, payload: PayloadAction<ISRTotalsPayload>) => {
      /* eslint-enable @typescript-eslint/no-unused-vars */
      state.fetchingTotals = true;
      state.ISRTotalsError = "";
      state.fetchingTotalsDeductions = true;
    },
    /* eslint-disable @typescript-eslint/no-unused-vars */
    getISRTotalsSuccessAction: (
      state,
      { payload: data }: PayloadAction<ISRTotalsResponseType | ISRTotalsResponseTypeDedcutions>
    ) => {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      state.fetchingTotals = false;
      state.ISRTotals = data;
      state.fetchingTotalsDeductions = false;
    },
    getISRTotalsDeduccionsTabsSuccessAction: (
      state,
      { payload: data }: PayloadAction<ISRTotalsResponseType | ISRTotalsResponseTypeDedcutions>
    ) => {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      state.fetchingTotals = false;
      state.ISRTotalsDeductions = data;
      state.fetchingTotalsDeductions = false;
    },

    /* eslint-disable @typescript-eslint/no-unused-vars */
    getISRTotalsDeductionsAction: (state, payload: PayloadAction<ISRTotalsPayload>) => {
      /* eslint-enable @typescript-eslint/no-unused-vars */
      state.fetchingTotals = true;
      state.ISRTotalsError = "";
      state.fetchingTotalsDeductions = true;
      state.fetchingTotalsDeductionsTabs = true;
    },
    getISRTotalsDeductionsSuccessAction: (
      state,
      { payload: data }: PayloadAction<ResponseTotalsDeductionsComplete>
    ) => {
      state.fetchingTotals = false;
      state.ISRTotalsDeductionsTable = data;
      state.fetchingTotalsDeductions = false;
      state.fetchingTotalsDeductionsTabs = false;
    },
    getISRTotalsErrorAction: (state, { payload: error }: PayloadAction<string>) => {
      state.fetchingCFDIs = false;
      state.ISRTotalsError = error;
      state.fetchingTotalsDeductions = false;
      state.fetchingTotalsDeductionsTabs = false;
    },
    /* eslint-disable @typescript-eslint/no-unused-vars */
    getISRCFDIsAction: (state, payload: PayloadAction<ISRCFDIsPayload>) => {
      /* eslint-enable @typescript-eslint/no-unused-vars */
      state.fetchingCFDIs = true;
      state.ISRCFDIsError = "";
    },
    getISRCFDIsSuccessAction: (state, { payload: data }: PayloadAction<ISRCFDIResponseType>) => {
      state.fetchingCFDIs = false;
      state.ISRCFDIs = data.data;
      state.ISRTotalCFDIs = data.total_records;
    },
    getISRCFDIsErrorAction: (state, { payload: error }: PayloadAction<string>) => {
      state.fetchingCFDIs = false;
      state.ISRCFDIsError = error;
      state.fetchingTotals = false;
    },
    exportISRTable: (state) => {
      state.isFetchingISRExports = true;
      state.showISRExportBanner = false;
    },
    exportISRTableSuccess: (state) => {
      state.isFetchingISRExports = false;
      state.showISRExportBanner = true;
    },
    exportISRTableError: (state) => {
      state.isFetchingISRExports = false;
      state.showISRExportBanner = false;
    },
    /* eslint-disable @typescript-eslint/no-unused-vars */
    updateISRCFDIAction: (state, { payload: data }: PayloadAction<ISRUpdateCFDIPayload>) => {
      /* eslint-enable @typescript-eslint/no-unused-vars */
      state.updateSucceded = false;
      state.isUpdatingCFDI = true;
      state.updateCFDIError = "";
    },
    updateISRCFDISuccessAction: (state) => {
      state.updateSucceded = true;
      state.isUpdatingCFDI = false;
    },
    updateISRCFDIErrorAction: (state, { payload: error }: PayloadAction<string>) => {
      state.updateSucceded = false;
      state.isUpdatingCFDI = false;
      state.updateCFDIError = error;
    },
    closeISRExportBanner: (state) => {
      state.showISRExportBanner = false;
    },
    updateISRPercentageDeductionsAction: (state, { payload }: PayloadAction<ISRUpdatePayload>) => {
      state.percentage = payload.company ? true : false;
      state.fetchingTotals = true;
    },
    getISRTotalsAllSuccessAction: (state, { payload }: PayloadAction<ResponseTotalsAll>) => {
      state.fetchingTotals = false;
      state.ISRTotals = payload.incomes;
      state.ISRTotalsDeductionsTable = {
        totals_table_excluded: payload.totals_table_excluded,
        totals_table: payload.totals_table,
      };
    },
    updateISRDoctosAction: (state) => {
      state.updateSucceded = false;
    },
    updateISRDoctosSuccessAction: (state) => {
      state.updateSucceded = true;
      state.isUpdatingCFDI = false;
    },
    updateISRDoctosErrorAction: (state, { payload: error }: PayloadAction<string>) => {
      state.updateSucceded = false;
      state.isUpdatingCFDI = false;
      state.updateCFDIError = error;
    },
  },
});

export const {
  getISRTotalsAction,
  getISRTotalsSuccessAction,
  getISRTotalsDeductionsAction,
  getISRTotalsDeduccionsTabsSuccessAction,
  getISRTotalsDeductionsSuccessAction,
  getISRTotalsErrorAction,
  getISRCFDIsAction,
  getISRCFDIsSuccessAction,
  getISRCFDIsErrorAction,
  updateISRCFDIAction,
  updateISRCFDISuccessAction,
  updateISRCFDIErrorAction,
  exportISRTable,
  closeISRExportBanner,
  updateISRPercentageDeductionsAction,
  updateISRDoctosAction,
  updateISRDoctosSuccessAction,
  updateISRDoctosErrorAction,
} = ISRSlice.actions;

export default ISRSlice.reducer;
export const ISRSelector = (state: RootState) => state.isr;
