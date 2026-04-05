import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchSingleCFDI } from "@api/cfdi";

type Out = {
  obtainedCFDI: CFDI;
};

type In = {
  options?: SearchOptions & {
    overridePeriodDates?: boolean;
  };
};

export const getCFDI = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "cfdi/getCFDI",
  async ({ options }, { rejectWithValue, getState }) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in getCFDI: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }

    try {
      const fetchCFDI = await (await fetchSingleCFDI(company, options)).cfdis;
      const obtainedCFDI = fetchCFDI[0];

      return {
        obtainedCFDI,
      };
    } catch (error) {
      console.error("Unexpected error in getCFDI: ", error);
      return rejectWithValue("Error al obtener el CFDI");
    }
  }
);
