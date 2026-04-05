import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getADDCompanies } from "./getCompanies";
import { createWorker } from "./createWorker";
import { getCFDIsForAdd } from "./getCFDIsForAdd";
import { getSyncSearch } from "./getSyncSearch";
import { syncRequest } from "./syncRequest";
import { getAvailableEzaudita } from "./getAvailableEzaudita";
import { getAvailableADD } from "./getAvailableAdd";
import { getCanceledADD } from "./getCanceledAdd";
import { getCanceledEzaudita } from "./getCanceledEzaudita";
import { getAvailableCanNotBeSend } from "./getAvailableCanNotBeSend";
import { getAvailableCanBeSend } from "./getAvailableCanBeSend";
import { getCanceledCanBeSend } from "./getCanceledCanBeSend";
import { getCanceledCanNotBeSend } from "./getCanceledCanNotBeSend";
import { setADDAutomaticSync } from "./setADDAutomaticSync";
import { getMetadataSyncRequest } from "./getMetadataSyncRequest";

interface ADDState {
  companies: ADDCompanyTypes[];
  companiesIsFetching: boolean;
  CFDIs: ADDCFDI[];
  companiesError: boolean;
  CFDIsError: boolean;
  syncSearch: ADDSyncSearch[];
  syncSearchError: boolean;
  syncSearchLoading: boolean;
  totalCFDIs: number;
  loadingCFDIs: boolean;
  addSyncRequested: boolean;
  addSyncError: boolean;
  availableEzaudita: CFDIsTotals | null;
  availableEzauditaError: boolean;
  availableCanBeSend: CFDIsTotals | null;
  availableCanBeSendError: boolean;
  availableCanNotBeSend: CFDIsTotals | null;
  availableCanNotBeSendError: boolean;
  availableAdd: CFDIsTotals | null;
  availableAddError: boolean;
  canceledEzaudita: CFDIsTotals | null;
  canceledEzauditaError: boolean;
  canceledAdd: CFDIsTotals | null;
  canceledAddError: boolean;
  canceledCanBeSend: CFDIsTotals | null;
  canceledCaBeSendError: boolean;
  canceledCanNotBeSend: CFDIsTotals | null;
  canceledCanNotBeSendError: boolean;
  isLoadingADDAutomaticSetter: boolean;
  addAutomaticError: string | null;
  loadingMetadataSync: boolean;
  metadataSyncError: string | null;
  loadingTotals: boolean;
}

const initialState: ADDState = {
  companies: [],
  companiesIsFetching: false,
  CFDIs: [],
  companiesError: false,
  CFDIsError: false,
  syncSearch: [],
  syncSearchError: false,
  syncSearchLoading: false,
  totalCFDIs: 0,
  loadingCFDIs: false,
  addSyncRequested: false,
  addSyncError: false,
  availableEzaudita: null,
  availableEzauditaError: false,
  availableCanBeSend: null,
  availableCanBeSendError: false,
  availableCanNotBeSend: null,
  availableCanNotBeSendError: false,
  availableAdd: null,
  availableAddError: false,
  canceledEzaudita: null,
  canceledEzauditaError: false,
  canceledAdd: null,
  canceledAddError: false,
  canceledCanBeSend: null,
  canceledCaBeSendError: false,
  canceledCanNotBeSend: null,
  canceledCanNotBeSendError: false,
  isLoadingADDAutomaticSetter: false,
  addAutomaticError: null,
  loadingMetadataSync: false,
  metadataSyncError: null,
  loadingTotals: false,
};

export const addSlice = createSlice({
  name: "add",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getADDCompanies.pending, (state) => {
      state.companiesIsFetching = true;
    });
    builder.addCase(getADDCompanies.fulfilled, (state, { payload }) => {
      state.companies = payload.companies;
      state.companiesError = false;
      state.companiesIsFetching = false;
    });
    builder.addCase(getADDCompanies.rejected, (state) => {
      state.companies = [];
      state.companiesError = true;
      state.companiesIsFetching = false;
    });
    builder.addCase(createWorker.fulfilled, (state) => {
      state.companies = { ...state.companies };
    });
    builder.addCase(getCFDIsForAdd.fulfilled, (state, { payload }) => {
      state.CFDIs = payload.CFDIs;
      state.totalCFDIs = payload.total;
      state.CFDIsError = false;
      state.loadingCFDIs = false;
    });
    builder.addCase(getCFDIsForAdd.pending, (state) => {
      state.loadingCFDIs = true;
      state.CFDIsError = false;
    });
    builder.addCase(getCFDIsForAdd.rejected, (state) => {
      state.CFDIs = [];
      state.CFDIsError = true;
      state.loadingCFDIs = false;
    });
    builder.addCase(getSyncSearch.fulfilled, (state, { payload }) => {
      state.syncSearch = payload.sync;
      state.syncSearchError = false;
      state.syncSearchLoading = false;
    });
    builder.addCase(getSyncSearch.pending, (state) => {
      state.syncSearchLoading = true;
    });
    builder.addCase(getSyncSearch.rejected, (state) => {
      state.syncSearch = [];
      state.syncSearchError = true;
      state.syncSearchLoading = false;
    });
    builder.addCase(syncRequest.fulfilled, (state) => {
      state.addSyncRequested = true;
      state.addSyncError = false;
    });
    builder.addCase(syncRequest.rejected, (state) => {
      state.addSyncRequested = false;
      state.addSyncError = true;
    });

    // TODO: ADD Custom loaders for every case
    // Available Ezaudita Section
    builder.addCase(getAvailableEzaudita.fulfilled, (state, { payload }) => {
      state.loadingTotals = false;
      state.availableEzaudita = payload.totals;
      state.availableEzauditaError = false;
    });
    builder.addCase(getAvailableEzaudita.pending, (state) => {
      state.loadingTotals = true;
      state.availableEzauditaError = false;
    });
    builder.addCase(getAvailableEzaudita.rejected, (state) => {
      state.loadingTotals = false;
      state.availableEzaudita = null;
      state.availableEzauditaError = true;
    });

    // AvaiLable ADD Section
    builder.addCase(getAvailableADD.fulfilled, (state, { payload }) => {
      state.availableAdd = payload.totals;
      state.availableAddError = false;
    });
    builder.addCase(getAvailableADD.rejected, (state) => {
      state.availableAdd = null;
      state.availableAddError = true;
    });

    // Available Can Be Send Section
    builder.addCase(getAvailableCanBeSend.fulfilled, (state, { payload }) => {
      state.availableCanBeSend = payload.totals;
      state.availableCanBeSendError = false;
    });
    builder.addCase(getAvailableCanBeSend.rejected, (state) => {
      state.availableCanBeSend = null;
      state.availableCanBeSendError = true;
    });

    // Available Can Not Be Send Section
    builder.addCase(getAvailableCanNotBeSend.fulfilled, (state, { payload }) => {
      state.availableCanNotBeSend = payload.totals;
      state.availableCanNotBeSendError = false;
    });
    builder.addCase(getAvailableCanNotBeSend.rejected, (state) => {
      state.availableCanNotBeSend = null;
      state.availableCanNotBeSendError = true;
    });

    // Canceled Can Be Send Section
    builder.addCase(getCanceledCanBeSend.fulfilled, (state, { payload }) => {
      state.canceledCanBeSend = payload.totals;
      state.canceledCaBeSendError = false;
    });
    builder.addCase(getCanceledCanBeSend.rejected, (state) => {
      state.canceledCanBeSend = null;
      state.canceledCaBeSendError = true;
    });

    // Canceled Can Not Be Send Section
    builder.addCase(getCanceledCanNotBeSend.fulfilled, (state, { payload }) => {
      state.canceledCanNotBeSend = payload.totals;
      state.canceledCanNotBeSendError = false;
    });
    builder.addCase(getCanceledCanNotBeSend.rejected, (state) => {
      state.canceledCanNotBeSend = null;
      state.canceledCanNotBeSendError = true;
    });

    // Canceled ADD Section
    builder.addCase(getCanceledADD.fulfilled, (state, { payload }) => {
      state.canceledAdd = payload.totals;
      state.canceledAddError = false;
    });
    builder.addCase(getCanceledADD.rejected, (state) => {
      state.canceledAdd = null;
      state.canceledAddError = true;
    });

    // Canceled Ezaudita Section
    builder.addCase(getCanceledEzaudita.fulfilled, (state, { payload }) => {
      state.canceledEzaudita = payload.totals;
      state.canceledEzauditaError = false;
    });
    builder.addCase(getCanceledEzaudita.rejected, (state) => {
      state.canceledEzaudita = null;
      state.canceledEzauditaError = true;
    });

    builder.addCase(setADDAutomaticSync.fulfilled, (state) => {
      state.isLoadingADDAutomaticSetter = false;
    });
    builder.addCase(setADDAutomaticSync.pending, (state) => {
      state.isLoadingADDAutomaticSetter = true;
    });
    builder.addCase(setADDAutomaticSync.rejected, (state, { payload }) => {
      state.isLoadingADDAutomaticSetter = false;
      state.addAutomaticError = payload ?? null;
    });
    builder.addCase(getMetadataSyncRequest.fulfilled, (state) => {
      state.loadingMetadataSync = false;
    });
    builder.addCase(getMetadataSyncRequest.pending, (state) => {
      state.loadingMetadataSync = true;
    });
    builder.addCase(getMetadataSyncRequest.rejected, (state, { payload }) => {
      state.metadataSyncError = payload ?? null;
      state.loadingMetadataSync = false;
    });
  },
});

export const addSelector = (state: RootState) => state.add;
export default addSlice.reducer;

// export const addSelector = (state:RootState) => state
