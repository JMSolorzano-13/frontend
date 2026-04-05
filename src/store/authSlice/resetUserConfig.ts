import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchConfig, saveNewConfig } from "../../api/config";
import { DEFAULT_USER_CONFIG } from "../../constants/Extra";
import { RootState } from "../store";

type In =
  | {
      clear: boolean;
    }
  | undefined;

const resetUserConfig = createAsyncThunk<UserConfig, In, { rejectValue: string; state: RootState }>(
  "auth/resetUserConfig",
  async (options, { rejectWithValue, getState }) => {
    const { company } = getState().auth;
    if (!company) {
      console.error("Error in resetUserConfig: no company selected");
      return rejectWithValue("Sin compañía seleccionada");
    }

    try {
      let newConfig: UserConfig = DEFAULT_USER_CONFIG;
      if (options && options.clear) {
        await saveNewConfig(company, newConfig);
      } else {
        const newConfigStr = await fetchConfig(company);

        const getTrueKeys = (data: NewWidgets): string[] => {
          const trueKeys: string[] = [];

          for (const key in data) {
            if (data[key as keyof NewWidgets]) {
              trueKeys.push(key);
            }
          }

          return trueKeys;
        };
        const parsedConfig = newConfigStr;
        const result = getTrueKeys(parsedConfig.dashboardIds as unknown as NewWidgets);
        newConfig = { ...parsedConfig, dashboardIds: [...result] } as UserConfig;
      }

      if (!newConfig.tableColumns) {
        newConfig.tableColumns = {};
      }
      return newConfig;
    } catch (e: any) {
      console.error("Unexpected error in resetUserConfig: ", e);
      return rejectWithValue("Error al obtener configuración");
    }
  }
);

export default resetUserConfig;
