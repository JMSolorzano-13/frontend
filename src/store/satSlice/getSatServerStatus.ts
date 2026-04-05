import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchGlobalStatus } from "@api/global";

type Out = {
  isSATServiceAvailable: boolean;
};

export const getSatServerStatus = createAsyncThunk<
  Out,
  void,
  { rejectValue: string; state: RootState }
>("sat/getSatServerStatus", async (_, { rejectWithValue }) => {
  try {
    const params = await fetchGlobalStatus({
      domain: [["name", "=", "sat_problems"]],
    });

    if (params.length !== 1) throw new Error("The param 'sat_problems' was not found");

    const mainParam = params[0];

    const isSATServiceAvailable = mainParam.value === "False";

    return {
      isSATServiceAvailable,
    };
  } catch (e: any) {
    // console.error('Unexpected error in getSatServerStatus: ', e)
    return rejectWithValue("Error al obtener el estatus del serivicio SAT");
  }
});
