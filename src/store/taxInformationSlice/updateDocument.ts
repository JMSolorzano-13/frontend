import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store/store";
import { updateTAXInformation } from "@api/information";

type Out = {
  response: any;
};

type In = {
  period: string;
};
const INFO_URLS = {
  UPDATE_DOCUMENT: "Scraper/scrap_sat_pdf",
};

export const updateDocument = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  INFO_URLS.UPDATE_DOCUMENT,
  async (_, { rejectWithValue, getState }) => {
    const { company, rfc, oldCompany } = getState().auth;
    if (!company || !rfc || !oldCompany) {
      console.error("Error in Document: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }
    try {
      const documentResponse = await updateTAXInformation(company, oldCompany, true);
      return {
        response: documentResponse,
      };
    } catch (error) {
      console.error("Unexpected error in getDocuument: ", error);
      return rejectWithValue("Error al obtener el Document");
    }
  }
);
