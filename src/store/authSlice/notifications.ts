import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getNotifications } from "@api/notifications";

type Out = {
  notifications: NotificationView
}

type In = {
  workspace: string | null
}

const viewNotifications = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "auth/viewNotifications",
  async (wo, { rejectWithValue, getState }) => {
    const { company, rfc, workspace } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in getPolicy: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }

    try {
      const notifications = await getNotifications(workspace);


      return {
        notifications,
      };
    } catch (error) {
      console.error("Unexpected error in getNotifications: ", error);
      return rejectWithValue("Error al obtener la Notificaciones");
    }
  }
);

export default viewNotifications;
