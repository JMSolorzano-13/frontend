import { saveCFDIConfig } from "@api/cfdi";
import { IVACFDIsPayloadType } from "@pages/IVA/_types/StateTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store/store";

type In = {
  uuidsToModify: IVACFDIsPayloadType;
};

export const setCFDIConfig = createAsyncThunk<void, In, { rejectValue: string; state: RootState }>(
  "cfdi/setCFDIConfig",
  async ({ uuidsToModify }, { rejectWithValue, getState }) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in setCFDIConfig: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }

    try {
      await saveCFDIConfig(company, uuidsToModify);
    } catch (error) {
      console.error("Unexpected error in setCFDIConfig", error);
      return rejectWithValue("Error al guardar la configuración del CFDI");
    }
  }
);
