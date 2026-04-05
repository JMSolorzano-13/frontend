import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { formatDatesWithOperators } from "@utils/domains";
import { fetchEFOSTotals } from "@api/efos";

type Out = {
  efosTotals: EFOSTotals;
  fetchedAll: boolean;
};

type In = {
  options: SearchOptions & { fetchAll: boolean };
};

export const getEFOSTotals = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "efos/getEFOSTotals",
  async ({ options }, { rejectWithValue, getState }) => {
    const { company } = getState().auth;
    if (!company) {
      console.error("Error in getEFOSTotals: no company selected");
      return rejectWithValue("Sin compañía seleccionada");
    }

    try {
      const customDomain: Domain = [];

      if (options) {
        options.domain = formatDatesWithOperators(options.domain ?? []);
      }

      if (options.domain) customDomain.push(...options.domain);
      if (!options.fetchAll) {
        customDomain.push(
          ["company_identifier", "=", company],
          ["cfdis.is_issued", "=", "false"]
        );
      }
      const efosTotals = await fetchEFOSTotals({ ...options, domain: customDomain });

      return {
        efosTotals,
        fetchedAll: options.fetchAll,
      };
    } catch (e: any) {
      console.error("Unexpected error in getEFOSTotals: ", e);
      return rejectWithValue("Error al obtener todos los EFOS");
    }
  }
);
