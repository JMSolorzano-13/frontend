import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store/store";
import { getTAXInformation } from "@api/information";

type Out = {
  response: any;
};

type In = {
  period: string;
};

const INFO_URLS = {
  GET_DOCUMENT: "Scraper/get_pdf_files",
};

export const getDocument = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  INFO_URLS.GET_DOCUMENT,
  async (_, { rejectWithValue, getState }) => {
    const { company, oldCompany, rfc } = getState().auth;
    if (!company || !rfc || !oldCompany) {
      console.error("Error in Document: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }
    try {
      const documentResponse = await getTAXInformation(company, oldCompany, true, rfc);
      return {
        response: documentResponse,
      };
    } catch (error) {
      console.error("Unexpected error in getDocuument: ", error);
      return rejectWithValue("Error al obtener el Document");
    }
  }
);

export const getDocumentRetry = createAsyncThunk<
  Out,
  In,
  { rejectValue: string; state: RootState }
>(INFO_URLS.GET_DOCUMENT, async (_, { rejectWithValue, getState }) => {
  const { company, rfc, oldCompany } = getState().auth;
  if (!company || !rfc || !oldCompany) {
    console.error("Error in Document: no company or rfc selected");
    return rejectWithValue("Sin compañía o RFC");
  }
  try {
    const documentResponse = await getTAXInformation(company, oldCompany, true, rfc);
    return {
      response: documentResponse,
    };
  } catch (error) {
    console.error("Unexpected error in getDocuument: ", error);
    return rejectWithValue("Error al obtener el Document");
  }
});
