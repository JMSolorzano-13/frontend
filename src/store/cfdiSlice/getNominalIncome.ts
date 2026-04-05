import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getNominalDataToRender } from "@pages/Dashboard/widgets/NominalIncome/getDataToRender";
import { fetchNominalIncome } from "@api/cfdi";

type Out = {
  nominalIncomeData: NominalData[] | null;
};

type In = {
  company: string;
  date: string;
};

export const getNominalIncome = createAsyncThunk<
  Out,
  In,
  { rejectValue: string; state: RootState }
>("cfdi/getNominalIncome", async ({ company, date }, { rejectWithValue }) => {
  if (!company || !date) {
    console.error("Error in getNominalIncome: no company or rfc selected");
    return rejectWithValue("Sin compañía o RFC");
  }
  try {
    const nominalIncome = await fetchNominalIncome(company, date);

    return {
      nominalIncomeData: getNominalDataToRender(nominalIncome.nominalIncomeData),
    };
  } catch (error: any) {
    console.error("Error in getNominalIncome:", error);
    return rejectWithValue(error);
  }
});
