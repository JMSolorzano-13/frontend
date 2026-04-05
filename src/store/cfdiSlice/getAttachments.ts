import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchAttachmentsDownloadURLs, fetchSingleAttachments } from "@api/cfdi";

type Out = {
  obtainedCFDI: Attachment[];
};

type In = {
  uuid: string | null;
  options?: SearchOptions & {
    overridePeriodDates?: boolean;
  };
};

export const getAttachments = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "cfdi/getAttachments",
  async ({ options, uuid }, { rejectWithValue, getState }) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in getPolicy: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }

    try {
      const fetchCFDI = await (await fetchSingleAttachments(company, options)).cfdis;
      const obtainedCFDI: Attachment[] = fetchCFDI;

      if (uuid) {
        const fetchDownloadURLs = await fetchAttachmentsDownloadURLs(company, uuid);
        const downloadFileNames = Object.keys(fetchDownloadURLs);

        obtainedCFDI.forEach((attachment) => {
          if (downloadFileNames.includes(attachment.file_name)) {
            attachment.url = fetchDownloadURLs[attachment.file_name];
          } else {
            attachment.url = "";
          }
        });
      }

      return {
        obtainedCFDI,
      };
    } catch (error) {
      console.error("Unexpected error in getAttachments: ", error);
      return rejectWithValue("Error al obtener la Archivos evidencias");
    }
  }
);
