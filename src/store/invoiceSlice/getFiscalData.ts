import { fetchFiscalData } from "@api/invoice";
import { createAsyncThunk } from "@reduxjs/toolkit";

type Out = {
  fiscalData: invoiceData;
};

export const getFiscalData = createAsyncThunk<Out, void, { rejectValue: string }>(
  "invoice/getFiscalData",
  async (_, { rejectWithValue }) => {
    try {
      const { fiscalData } = await fetchFiscalData();
      return {
        fiscalData,
      };
    } catch (error) {
      console.error("Unexpected error in getFiscalData: ", error);
      return rejectWithValue("Error al obtener los datos de facturación");
    }
  }
);
