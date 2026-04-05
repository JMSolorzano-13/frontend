import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchSinglePolicy } from "@api/cfdi";

type Out = {
  obtainedCFDI: Poliza;
};

type In = {
  options?: SearchOptions & {
    overridePeriodDates?: boolean;
  };
};

export const getPolicy = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "cfdi/getPolicy",
  async ({ options }, { rejectWithValue, getState }) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in getPolicy: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }

    try {
      const fetchCFDI = await (await fetchSinglePolicy(company, options)).cfdis;
      const obtainedCFDI = fetchCFDI[0] as Poliza;

      return {
        obtainedCFDI,
      };
    } catch (error) {
      console.error("Unexpected error in getPolicy: ", error);
      return rejectWithValue("Error al obtener la Póliza");
    }
  }
);
