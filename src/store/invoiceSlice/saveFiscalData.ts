import { setFiscalData } from "@api/invoice";
import { createAsyncThunk } from "@reduxjs/toolkit";

const saveFiscalData = createAsyncThunk<string, { options: invoiceData }, { rejectValue: string }>(
  "invoice/saveFiscalData",
  async ({ options }, { rejectWithValue }) => {
    try {
      await setFiscalData(options);
      return "OK";
    } catch (e: any) {
      console.error("Error in setInvoiceData: ", e);
      return rejectWithValue("Error al guardar los datos de facturación");
    }
  }
);

export default saveFiscalData;
