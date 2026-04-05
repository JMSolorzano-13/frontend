import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSatConfig } from "../../api/sat";
import { RootState } from "../store";

type Out = {
  rfc: string;
  expires: string;
};

export const getSatConfig = createAsyncThunk<Out, void, { rejectValue: string; state: RootState }>(
  "sat/getSatConfig",
  async (_, { rejectWithValue, getState }) => {
    const { company } = getState().auth;
    if (!company) {
      console.error("Error in getSatConfig: no company selected");
      return rejectWithValue("Sin compañía seleccionada");
    }
    try {
      const { rfc, expires } = await fetchSatConfig(company);

      return {
        rfc,
        expires,
      };
    } catch (e: any) {
      console.error("Unexpected error in getSatConfig: ", e);
      return rejectWithValue("Error al obtener la configuración de SAT");
    }
  }
);
