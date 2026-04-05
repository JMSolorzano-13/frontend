import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { postSATManualSync, postSATManualSyncStatus, postSATManualSyncAll } from "@api/sat";

// On button press
export const getManualSync = createAsyncThunk<
  { message: string; status: string },
  void,
  { rejectValue: string; state: RootState }
>("sat/getManualSync", async (_, { rejectWithValue, getState }) => {
  const { company } = getState().auth;
  if (!company) {
    console.error("Error in getLastSync: no company selected");
    return rejectWithValue("Sin compañía seleccionada");
  }
  try {
    const response = await postSATManualSync({
      companyIdentifier: company,
    });
    return response;
  } catch (error) {
    return rejectWithValue(`Error al sincronizar manualmente`);
  }
});

export const getManualSyncAll = createAsyncThunk<
  { message: string; status: string },
  void,
  { rejectValue: string; state: RootState }
>("sat/getManualSyncAll", async (_, { rejectWithValue, getState }) => {
  const { company } = getState().auth;
  if (!company) {
    console.error("Error in getLastSync: no company selected");
    return rejectWithValue("Sin compañía seleccionada");
  }
  try {
    const response = await postSATManualSyncAll();
    return response;
  } catch (error) {
    return rejectWithValue(`Error al sincronizar manualmente`);
  }
});

interface manualSyncStatusInType {
  message: string | undefined;
  status: string;
  canRequest: boolean;
  lastManualSync: string | null;
  lastSync: string | null;
  allProcessed: boolean;
  differenceDay: number;
}

// On Sat Sync load
export const getManualSyncStatus = createAsyncThunk<
  manualSyncStatusInType,
  void,
  { rejectValue: string; state: RootState }
>("sat/getManualSyncStatus", async (_, { rejectWithValue, getState }) => {
  const { company } = getState().auth;

  if (!company) {
    console.error("Error in getLastSync: no company selected");
    return rejectWithValue("Sin compañía seleccionada");
  }
  try {
    const response = await postSATManualSyncStatus({
      companyIdentifier: company,
    });

    let daysDifference = 1;

    if (response.lastManualSync !== null) {
      const dateToday = new Date();
      const manualSyncDate = new Date(response.lastManualSync);
      let days = dateToday.getTime() - manualSyncDate.getTime();
      // const oneDay = 1000 * 3600 * 24
      days =
        dateToday.getDate() === manualSyncDate.getDate()
          ? 0
          : dateToday.getDate() - manualSyncDate.getDate();
      daysDifference = days;
    }

    return { ...response, differenceDay: daysDifference };
  } catch (error) {
    return rejectWithValue(`Error al obtener el estatus de sincronización manual`);
  }
});
