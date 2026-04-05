import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@store/store";
import { getPayrollContent } from "./getPayrollContent";

interface payrollState {
  cfdiPayrollContent: PayrollDetailsModalContent | null;
  loadingPayrollContent: boolean;
  payrollContentError: string | null;
}

const initialState: payrollState = {
  cfdiPayrollContent: null,
  loadingPayrollContent: false,
  payrollContentError: null,
};

export const payrollReducer = createSlice({
  name: "payroll",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // reducersForPayrollContent
    builder.addCase(getPayrollContent.pending, (state) => {
      state.loadingPayrollContent = true;
      state.payrollContentError = null;
    });
    builder.addCase(getPayrollContent.fulfilled, (state, { payload }) => {
      state.cfdiPayrollContent = payload.nada; // change var name
      state.payrollContentError = null;
      state.loadingPayrollContent = false;
    });
    builder.addCase(getPayrollContent.rejected, (state, { payload }) => {
      state.loadingPayrollContent = false;
      state.payrollContentError = payload ?? null;
    });
  },
});

export const PayrollSelector = (state: RootState) => state.payroll;

export default payrollReducer.reducer;
