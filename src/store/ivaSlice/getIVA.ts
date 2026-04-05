import { createAsyncThunk } from "@reduxjs/toolkit";
import { getIVAForDashboard } from "@api/iva";
import { RootState } from "@store/store";

type Out = {
  response: IVAResponse;
};

type In = {
  payload: {
    period: string;
    fuzzy_search: string;
  };
};

export const getIVA = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "cfdi/get_iva",
  async ({ payload: { period, fuzzy_search } }, { rejectWithValue, getState }) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in getIVA: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }
    try {
      const ivaResponse = await getIVAForDashboard(company, { period, fuzzy_search });
      return {
        response: ivaResponse,
      };
    } catch (error) {
      console.error("Unexpected error in getIVA: ", error);
      return rejectWithValue("Error al obtener el IVA");
    }
  }
);
