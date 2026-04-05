import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { deleteSingleAttachment } from "@api/cfdi";

type In = {
  uuid: string;
  file_name: string;
};

export const deleteAttachment = createAsyncThunk<
  void,
  In,
  { rejectValue: string; state: RootState }
>("cfdi/deleteAttachment", async ({ uuid, file_name }, { rejectWithValue, getState }) => {
  const { company } = getState().auth;

  if (!company) {
    console.error("Error in deleteAttachment: no company or rfc selected");
    return rejectWithValue("Sin compañía o RFC");
  }

  try {
    const response = await deleteSingleAttachment(company, uuid, file_name);
    console.info("Attachment deleted successfully: ", response);
  } catch (error: any) {
    console.error("Unexpected error in deleteAttachment: ", error);
    const errorMapping: { [key: string]: string } = {
      "Request failed with status code 500": "Error al eliminar el archivo adjunto",
    };
    return rejectWithValue(errorMapping[error.message] || "Error al eliminar el Archivo adjunto");
  }
});
