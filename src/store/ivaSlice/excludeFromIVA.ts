import { createAsyncThunk } from "@reduxjs/toolkit";
import { excludeCFDIFromIVACalculation } from "@api/iva";
import { RootState } from "@store/store";

type Out = {
  response: boolean;
};

type In = {
  cfdis: string[];
};

export const getExcludeFromIVA = createAsyncThunk<
  Out,
  In,
  { rejectValue: string; state: RootState }
>("cfdi/exclude_from_iva", async ({ cfdis }, { rejectWithValue, getState }) => {
  // TODO: This will never work because "exclude_from_iva" does not exist on CFDI slice
  const { company } = getState().auth;
  if (!company) {
    console.error("Error in Exclude from IVA: no company or rfc selected");
    return rejectWithValue("Sin compañía o RFC");
  }
  try {
    await excludeCFDIFromIVACalculation(company, cfdis);
    return {
      response: true,
    };
  } catch (error) {
    console.error("Unexpected error in getIVA: ", error);
    return rejectWithValue("Error al descargar el archivo de Excel"); // TODO: Is this for excel?
  }
});
