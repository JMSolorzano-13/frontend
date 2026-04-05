import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getIVA } from "./getIVA";
import { getExcludeFromIVA } from "./excludeFromIVA";
import { getExcludedCFDIs } from "./getExcluded";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { RelatedDocto } from "@pages/IVA/_types/RelatedDocsTable";
import { getIVADashboard } from "./getIVADashboard";

interface IVAState {
  isFetching: boolean;
  response: IVAResponse | undefined;
  error: null | string;
  exportFile: {
    isFetching: boolean;
    response: any;
    error: null | string;
  };
  exclude: {
    isFetching: boolean;
    response: boolean;
    error: null | string;
  };
  excludedFromCalculation: {
    isFetching: boolean;
    response: {
      cfdis: IVACFDI[] | CFDI[];
      quantity: number;
    };
    error: null | string;
  };
  isFetchingTotals: boolean;
  isFetchingDoctos: boolean;
  doctoRelacionados: RelatedDocto[];
  totalDoctoRelacionados: number;
  excludeDoctosSucceded: boolean;
  ivaPeriodData: IvaPeriodWidget[] | null;
  ivaTrasladadoData: IvaTrasladadoWidget[] | null;
  ivaAcreditableData: IvaAcreditableWidget[] | null;
  isIVAWidgetFetching: boolean;
}

const initialState: IVAState = {
  isFetching: false,
  response: undefined,
  error: null,
  exportFile: {
    isFetching: false,
    response: null,
    error: null,
  },
  exclude: {
    isFetching: false,
    response: false,
    error: null,
  },
  excludedFromCalculation: {
    isFetching: false,
    response: {
      cfdis: [],
      quantity: 0,
    },
    error: null,
  },
  isFetchingTotals: false,
  isFetchingDoctos: false,
  doctoRelacionados: [],
  totalDoctoRelacionados: 0,
  excludeDoctosSucceded: true,
  ivaPeriodData: null,
  ivaTrasladadoData: null,
  ivaAcreditableData: null,
  isIVAWidgetFetching: false,
};

export const IVAReducer = createSlice({
  name: "iva",
  initialState,
  reducers: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    fetch_action_fuzzy: (state, payload) => {
      /* eslint-enable @typescript-eslint/no-unused-vars */
      state.isFetchingTotals = true;
      state.error = null;
    },
    fetchIVASuccess_fuzzy: (state, payload) => {
      state.isFetchingTotals = false;
      state.error = null;
      state.response = {
        exercise: {
          creditable: payload.payload.exercise.creditable,
          diff: payload.payload.exercise.diff,
          transferred: payload.payload.exercise.transferred,
        },
        period: {
          creditable: {
            credit_notes: payload.payload.period.creditable.credit_notes,
            excluded_qty: payload.payload.period.creditable.excluded_qty,
            moved_qty: payload.payload.period.creditable.moved_qty,
            i_tra: payload.payload.period.creditable.i_tra,
            p_tra: payload.payload.period.creditable.p_tra,
            qty: payload.payload.period.creditable.qty,
            prev_i_ret: payload.payload.period.creditable.prev_i_ret,
            prev_p_ret: payload.payload.period.creditable.prev_p_ret,
            total: state.response?.period.creditable.total || 0,
          },
          diff: state.response?.period.diff || 0,
          transferred: {
            credit_notes: payload.payload.period.transferred.credit_notes,
            excluded_qty: payload.payload.period.transferred.excluded_qty,
            moved_qty: payload.payload.period.transferred.moved_qty,
            i_tra: payload.payload.period.transferred.i_tra,
            p_tra: payload.payload.period.transferred.p_tra,
            qty: payload.payload.period.transferred.qty,
            prev_i_ret: payload.payload.period.transferred.prev_i_ret,
            prev_p_ret: payload.payload.period.transferred.prev_p_ret,
            total: state.response?.period.transferred.total || 0,
          },
        },
      };
    },
    fetchIVAErrors_fuzzy: (state, payload) => {
      state.isFetchingTotals = false;
      state.error = payload.payload;
      // state.response = undefined;
    },
    fetch_action: (state) => {
      /* eslint-enable @typescript-eslint/no-unused-vars */
      state.isFetchingTotals = true;
      state.error = null;
    },
    fetchIVASuccess: (state, payload) => {
      state.isFetchingTotals = false;
      state.error = null;
      state.response = payload.payload;
    },
    fetchIVAErrors: (state, payload) => {
      state.isFetchingTotals = false;
      state.error = payload.payload;
      // state.response = undefined;
    },
    fetchDoctoRelacionadosAction: (state) => {
      state.isFetchingDoctos = true;
    },
    fetchDoctoRelacionadosSuccessAction: (state, { payload }) => {
      state.error = null;
      state.isFetchingDoctos = false;
      state.doctoRelacionados = payload.doctoRelacionados;
      state.totalDoctoRelacionados = payload.totalRecords;
    },
    fetchDoctoRelacionadosErrorAction: (state, { payload }) => {
      state.error = payload;
      state.doctoRelacionados = [];
      state.totalDoctoRelacionados = 0;
      state.isFetchingDoctos = false;
    },
    fetchExcludeDoctosAction: (state) => {
      state.excludeDoctosSucceded = false;
    },
    fetchExcludeDoctosSuccessAction: (state) => {
      state.error = null;
      state.excludeDoctosSucceded = true;
    },
    fetchExcludeDoctosErrorAction: (state, { payload }) => {
      state.error = payload;
      state.excludeDoctosSucceded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getIVA.pending, (state) => {
      state.isFetching = true;
      state.error = null;
      state.response = undefined;
    });
    builder.addCase(getIVA.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.error = payload as string;
      state.response = undefined;
    });
    builder.addCase(getIVA.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.error = null;
      state.response = payload.response;
    });
    builder.addCase(getExcludeFromIVA.pending, (state) => {
      state.exclude.isFetching = true;
      state.exclude.error = null;
    });
    builder.addCase(getExcludeFromIVA.fulfilled, (state) => {
      state.exclude.isFetching = false;
      state.exclude.error = null;
      state.exclude.response = true;
    });
    builder.addCase(getExcludeFromIVA.rejected, (state, { payload }) => {
      state.exclude.isFetching = false;
      state.exclude.error = payload as string;
      state.exclude.response = true;
    });
    builder.addCase(getExcludedCFDIs.pending, (state) => {
      state.excludedFromCalculation.isFetching = true;
      state.excludedFromCalculation.error = null;
    });
    builder.addCase(getExcludedCFDIs.fulfilled, (state, { payload }) => {
      state.excludedFromCalculation.isFetching = false;
      state.excludedFromCalculation.response = {
        cfdis: payload.CFDIs,
        quantity: payload.quantity,
      };
    });
    builder.addCase(getIVADashboard.fulfilled, (state, { payload }) => {
      state.ivaPeriodData = payload.ivaPeriodData;
      state.ivaTrasladadoData = payload.ivaTrasladadoData;
      state.ivaAcreditableData = payload.ivaAcreditableData;
      state.isIVAWidgetFetching = false;
    });
    builder.addCase(getIVADashboard.pending, (state) => {
      state.isIVAWidgetFetching = true;
      state.ivaPeriodData = null;
      state.ivaTrasladadoData = null;
      state.ivaAcreditableData = null;
    });
    builder.addCase(getIVADashboard.rejected, (state) => {
      state.isIVAWidgetFetching = false;
      state.ivaPeriodData = null;
      state.ivaTrasladadoData = null;
      state.ivaAcreditableData = null;
    });
  },
});

export const ivaSelector = (state: RootState) => state.iva;

export default IVAReducer.reducer;
