import { NewSATLogType, postGetNewSATLog, PostNewSATLogType } from "@api/sat";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store/store";

export const getNewSatLog = createAsyncThunk<
  { satLogData: NewSATLogType },
  { startDate: string; daysDifference: number },
  { rejectValue: string; state: RootState }
>("sat/getNewSatLog", async ({ startDate, daysDifference }, { rejectWithValue, getState }) => {
  const { company } = getState().auth;
  if (!company) {
    console.error("Error in getNewSatLog: no company selected");
    return rejectWithValue("Sin compañía seleccionada");
  }

  let endDateRequest = new Date();

  if (daysDifference !== 0) {
    endDateRequest = new Date(Date.now() - 3600 * 1000 * 24);
  }

  const endDateFormatted = endDateRequest.toISOString().split("T")[0];

  try {
    const payload: PostNewSATLogType = {
      companyIdentifier: company,
      startDate,
      endDate: endDateFormatted,
      daysDifference,
    };
    const response = await postGetNewSATLog(payload);
    return { satLogData: response };
  } catch (error) {
    return rejectWithValue("Error al obtener la bitácora de descargas");
  }
});
