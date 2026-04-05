import { setCompany } from "@api/ADD";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store/store";

type Out = {
  response: {
    message: string;
    saved: boolean;
  };
};

type In = {
  pastoCompanyId: string;
};

export const updateCompany = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "add/updateCompany",
  async (_, { getState }) => {
    const { company } = getState().auth;
    const updatedCompany = await setCompany(company as string, _.pastoCompanyId);
    return updatedCompany;
  }
);
