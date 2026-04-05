import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getCompaniesOldIds } from "@rules/UserDataHelper";
import { fetchAlerts, fetchPermissions } from "@api/user";

type Out = {
  usersWithAlerts: UserWithAlerts[];
};

const getUsersAlerts = createAsyncThunk<
  Out,
  SearchOptions | undefined,
  { rejectValue: string; state: RootState }
>("user/getUsersAlerts", async (_, { rejectWithValue, getState }) => {
  const { workspace, oldWorkspace, userData } = getState().auth;
  if (!oldWorkspace || !userData) {
    console.error("Error in getUsersAlerts: no workspace or userData selected");
    return rejectWithValue("Sin workspace o userData seleccionado");
  }

  const companies = getCompaniesOldIds(userData, workspace);

  try {
    const alerts = await fetchAlerts(oldWorkspace);
    const usersP = await fetchPermissions(companies);
    const users: { [key: string]: UserWithAlerts } = {};
    usersP.forEach((u: Permission) => {
      if (!users[u.user.id]) {
        users[u.user.id] = {
          id: u.user.id,
          name: u.user.name,
          email: u.user.email,
          alerts: [],
        };
      }
    });

    const usersWithAlerts: UserWithAlerts[] = [];
    alerts.forEach((alert: Alert) => {
      if (!users[alert.user.id]) {
        users[alert.user.id] = {
          id: alert.user.id,
          email: alert.user.email,
          name: alert.user.name,
          alerts: [alert.notification_type],
        };
      } else {
        // Find the user and check if the alert is already in the alerts, if not add it
        const user = users[alert.user.id];
        const alertIndex = user.alerts.findIndex((a) => a === alert.notification_type);
        if (alertIndex === -1) {
          user.alerts.push(alert.notification_type);
        }
      }
    });

    Object.keys(users).forEach((key: string) => {
      usersWithAlerts.push(users[key]);
    });

    return {
      usersWithAlerts,
    };
  } catch (e: any) {
    console.error("Unexpected error in getUsersAlerts: ", e);
    return rejectWithValue("Error al obtener los usuarios con alertas");
  }
});

export default getUsersAlerts;
