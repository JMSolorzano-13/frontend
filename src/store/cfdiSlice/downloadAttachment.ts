import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { downloadFilesFromS3, fetchAttachmentsDownloadURLs } from "@api/cfdi";

type In = {
  url: string;
  file_name: string;
  uuid: string;
};

async function handleDownloadLink(response: Response, file_name: string) {
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = file_name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const downloadAttachment = createAsyncThunk<
  void,
  In,
  { rejectValue: string; state: RootState }
>("cfdi/downloadAttachment", async ({ url, file_name, uuid }, { rejectWithValue, getState }) => {
  try {
    const { company } = getState().auth;
    if (!company) {
      console.error("Error in downloadAttachment: no company selected");
      return rejectWithValue("Sin compañía seleccionada");
    }
    const response = await downloadFilesFromS3(url);

    if (response.status === 200) {
      handleDownloadLink(response, file_name);
    } else {
      switch (response.status) {
        case 403:
          {
            const fetchDownloadURLs = await fetchAttachmentsDownloadURLs(company, uuid);
            const newURL = fetchDownloadURLs[file_name];
            const newResponse = await downloadFilesFromS3(newURL);
            if (newResponse.status === 200) {
              handleDownloadLink(newResponse, file_name);
            } else {
              throw new Error("Error al descargar el archivo adjunto");
            }
          }
          break;
        case 404:
          throw new Error("El archivo no se encuentra almacenado en el servidor (404)");
        default:
          throw new Error("Error al descargar el archivo adjunto");
      }
    }
  } catch (error: any) {
    console.error("Unexpected error in downloadAttachment: ", error);
    return rejectWithValue(
      !error.message.includes("NetworkError")
        ? error.message
        : "Error al descargar el Archivo adjunto"
    );
  }
});
