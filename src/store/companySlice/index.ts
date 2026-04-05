import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getCompanies } from "./getCompanies";

interface CompanyState {
  isFetching: boolean;
  companies: Company[];
  error: string | null;
}

const initialState: CompanyState = {
  isFetching: false,
  companies: [],
  error: null,
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    removeAllCompanies: (state) => {
      state.companies = [];
    },
  },
  extraReducers: (builder) => {
    // Get companies
    builder.addCase(getCompanies.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(getCompanies.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.companies = payload.companies;
    });
    builder.addCase(getCompanies.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.error = payload ?? null;
    });
    // End get companies
  },
});

export const companySelector = (state: RootState) => state.company;
export const { removeAllCompanies } = companySlice.actions;

export default companySlice.reducer;
