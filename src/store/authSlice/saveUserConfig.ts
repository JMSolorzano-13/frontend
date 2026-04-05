import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { RootState } from "../store";
import { saveNewConfig } from "@api/config";

const saveUserConfig = createAsyncThunk<
  UserConfig,
  void,
  { rejectValue: string; state: RootState }
>("auth/saveUserConfig", async (_, { rejectWithValue, getState }) => {
  const { config, company } = getState().auth;

  if (!company) {
    console.error("Error in saveUserConfig: no company selected");
    return rejectWithValue("Sin compañía seleccionada");
  }

  try {
    if (Array.isArray(config.dashboardIds)) {
      const widgets: string[] = [
        "totals",
        "linecharttotals",
        "nominal-income",
        "improved-IVA",
        "featuredTopic",
      ];

      const newWidgets: { [key: string]: boolean } = {};

      widgets.forEach((widget) => {
        if (
          config.dashboardIds &&
          Array.isArray(config.dashboardIds) &&
          config.dashboardIds.includes(widget)
        ) {
          newWidgets[widget] = true;
        } else {
          newWidgets[widget] = false;
        }
      });
      const newConfig = await saveNewConfig(company, { ...config, dashboardIds: newWidgets });
      message.success("Configuración guardada exitosamente");

      const getTrueKeys = (data: { [key: string]: boolean }): string[] => {
        const trueKeys: string[] = [];

        for (const key in data) {
          if (data[key]) {
            trueKeys.push(key);
          }
        }

        return trueKeys;
      };

      const result = getTrueKeys(newWidgets);

      return { ...JSON.parse(newConfig), dashboardIds: [...result] } as UserConfig;
    } else {
      const newConfig = await saveNewConfig(company, config);
      message.success("Configuración guardada exitosamente");
      return JSON.parse(newConfig) as UserConfig;
    }
  } catch (e: any) {
    console.error("Unexpected error in saveUserConfig: ", e);
    return rejectWithValue("Error al guardar configuración");
  }
});

export default saveUserConfig;
