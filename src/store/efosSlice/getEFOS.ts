import { fetchEFOS } from "@api/efos";
import { createAsyncThunk } from "@reduxjs/toolkit";

type Out = {
  efos: EFOS[];
  efosCount: number;
};

type In = {
  options: SearchOptions;
};

export const getEFOS = createAsyncThunk<Out, In, { rejectValue: string }>(
  "efos/getEFOS",
  async ({ options }, { rejectWithValue }) => {
    try {
      const efosData = await fetchEFOS(options);

      return {
        efos: efosData.efos,
        efosCount: efosData.totalRecords,
      };
    } catch (e: any) {
      console.error("Unexpected error in getEFOS: ", e);
      return rejectWithValue("Error al obtener todos los EFOS");
    }
  }
);
