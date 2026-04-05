import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { RootState } from "../store";
import { fetchCFDIMassiveExport } from "@api/cfdi";

type In = {
  options: SearchOptions & {
    overridePeriodDates?: boolean;
  };
};

export const getCFDIMassiveExport = createAsyncThunk<
  { exports: CFDIExport[]; totalRecords: number },
  In,
  { rejectValue: string; state: RootState }
>("cfdi/getCFDIMassiveExport", async ({ options }, { rejectWithValue, getState }) => {
  const { company } = getState().auth;
  if (!company) {
    console.error("Error in getCFDIExports: no company selected");
    return rejectWithValue("Sin compañía");
  }

  try {
    const cfdiExports = await await fetchCFDIMassiveExport(company, options);

    return {
      exports: cfdiExports.content,
      totalRecords: cfdiExports.totalRecords,
    };
  } catch (error) {
    console.error("Unexpected error in CFDIExports: ", error);
    message.error("Error al obtener las exportaciones de CFDI");
    return rejectWithValue("Error al obtener las exportaciones de CFDI");
  }
});
