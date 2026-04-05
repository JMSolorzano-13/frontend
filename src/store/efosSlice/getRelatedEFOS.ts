import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchEFOS } from "@api/efos";

type Out = {
  efos: EFOS[];
  efosCount: number;
};

type In = {
  options: SearchOptions;
};

export const getRelatedEFOS = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "efos/getRelatedEFOS",
  async ({ options }, { rejectWithValue, getState }) => {
    const { company } = getState().auth;
    if (!company) {
      console.error("Error in getRelatedEFOS: no company selected");
      return rejectWithValue("Sin compañía seleccionada");
    }

    try {
      const customDomain: Domain = [
        ["company_identifier", "=", company],
        ["cfdis.is_issued", "=", "false"],
      ];
      if (options.domain) customDomain.push(...options.domain);
      const efosData = await fetchEFOS({ ...options, domain: customDomain });

      return {
        efos: efosData.efos,
        efosCount: efosData.totalRecords,
      };
    } catch (e: any) {
      console.error("Unexpected error in getRelatedEFOS: ", e);
      return rejectWithValue("Error al obtener todos los EFOS");
    }
  }
);
