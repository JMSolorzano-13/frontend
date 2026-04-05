import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchCompanies } from "@api/company";
import { getAllCompaniesOldIds } from "@rules/UserDataHelper";

type Out = {
  companies: Company[];
  isCOI: boolean;
};

export const getCompanies = createAsyncThunk<
  Out,
  SearchOptions | undefined,
  { rejectValue: string; state: RootState }
>("cfdi/getCompanies", async (options, { rejectWithValue, getState }) => {
  const { userData } = getState().auth;

  try {
    const companies = await fetchCompanies(getAllCompaniesOldIds(userData), {
      limit: options?.limit ?? 10000,
      ...options,
    });

    const processedCompanies = companies.map((company: Company) => {
      const pCompany = {
        ...company,
        emails_to_send_efos: company.emails_to_send_efos,
        emails_to_send_errors: company.emails_to_send_errors,
        emails_to_send_canceled: company.emails_to_send_canceled,
      };
      return pCompany;
    });

    return {
      companies: processedCompanies as Company[],
      isCOI: true,
    };
  } catch (e: any) {
    console.error("Unexpected error in getCompanies: ", e);
    return rejectWithValue("Error al obtener las Compañías");
  }
});
