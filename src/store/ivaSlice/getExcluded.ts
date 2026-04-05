import { createAsyncThunk } from "@reduxjs/toolkit";
import { getExcluded } from "@api/iva";
import { RootState } from "../store";

type Out = {
  CFDIs: CFDI[];
  quantity: number;
};

type In = {
  tab: TabIVAType;
  options?: SearchOptions & {
    overridePeriodDates?: boolean;
  };
};

export const getExcludedCFDIs = createAsyncThunk<
  Out,
  In,
  { rejectValue: string; state: RootState }
>("iva/getExcluded", async ({ tab, options }, { rejectWithValue, getState }) => {
  const { company, rfc } = getState().auth;
  if (!company || !rfc) {
    console.error("Error in getCFDIs: no company or rfc selected");
    return rejectWithValue("Sin compañía o RFC");
  }
  const periodOpts = options ?? {};
  try {
    const periodCFDIs = await await getExcluded(company, tab, {
      ...periodOpts,
    });
    return {
      CFDIs: periodCFDIs.cfdis,
      quantity: periodCFDIs.totalRecords,
    };
  } catch (error) {
    console.error("Unexpected error in getCFDIs: ", error);
    return rejectWithValue("Error al obtener los CFDIs");
  }
});
