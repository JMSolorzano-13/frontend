import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { fetIVAExports } from "@api/iva";
import { RootState } from "../store";
import { fetISRExports } from "@pages/ISR/_api/ISRApi";

type In = {
  options: SearchOptions & {
    overridePeriodDates?: boolean;
  };
  isr?: boolean;
};

export const getIVAExport = createAsyncThunk<
  { exports: IVAExport[]; totalRecords: number },
  In,
  { rejectValue: string; state: RootState }
>("cfdi/getIVAExports", async ({ options, isr = false }, { rejectWithValue, getState }) => {
  const { company } = getState().auth;
  if (!company) {
    console.error("Error in getCFDIExports: no company selected");
    return rejectWithValue("Sin compañía");
  }

  try {
    let cfdiExports;
    if (isr) {
      cfdiExports = await await fetISRExports({ company_identifier: company, options });
    } else {
      cfdiExports = await await fetIVAExports({ company_identifier: company, options });
    }

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
