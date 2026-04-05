import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { updateAlerts } from "@api/user";

const saveUsersAlerts = createAsyncThunk<string, void, { rejectValue: string; state: RootState }>(
  "user/saveUsersAlerts",
  async (_, { rejectWithValue, getState }) => {
    const { oldWorkspace } = getState().auth;
    const { usersWithAlerts } = getState().user;
    if (!oldWorkspace) {
      console.error("Error in saveUsersAlerts: no workspace selected");
      return rejectWithValue("Sin workspace seleccionado");
    }

    const alerts: { [key: string]: string[] } = {};
    usersWithAlerts.forEach((user: UserWithAlerts) => {
      alerts[user.id] = user.alerts;
    });

    try {
      await updateAlerts(oldWorkspace, alerts);
      return "OK";
    } catch (e: any) {
      console.error("Unexpected error in saveUsersAlerts: ", e);
      return rejectWithValue("Error al actualizar las alertas");
    }
  }
);

export default saveUsersAlerts;
