import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchCFDIs } from "@api/cfdi";

type Out = {
  CFDIs: CFDI[];
};

type In = {
  options?: SearchOptions;
};

export const getPivotCFDIs = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "cfdi/getPivotCFDIs",
  async ({ options }, { rejectWithValue, getState }) => {
    const { company } = getState().auth;
    if (!company) return rejectWithValue("No company");
    const { periodDates, accumulatedDates } = getState().common;
    const periodOpts: SearchOptions = options ?? {};

    if (periodDates && accumulatedDates) {
      const pdates = periodDates.split("|");
      periodOpts.domain = [
        ["FechaFiltro", ">=", new Date(pdates[0]).toISOString().replaceAll("Z", "")],
        ["FechaFiltro", "<", new Date(pdates[1]).toISOString().replaceAll("Z", "")],
        ...(periodOpts?.domain ?? []),
      ];
    }

    periodOpts.limit = 10000;

    try {
      const periodCFDIs = await (await fetchCFDIs(company, periodOpts)).cfdis;

      return {
        CFDIs: periodCFDIs,
      };
    } catch (error) {
      return rejectWithValue("Error al obtener los CFDIs");
    }
  }
);
