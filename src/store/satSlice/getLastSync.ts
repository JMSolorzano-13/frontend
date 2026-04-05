import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchSATQuerySummary } from "@api/sat";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";

type Out = {
  issuedMetadataStatus: string;
  issuedMetadataLastSync: string | null;
  receivedMetadataStatus: string;
  receivedMetadataLastSync: string | null;
};

export const getLastSync = createAsyncThunk<Out, void, { rejectValue: string; state: RootState }>(
  "sat/getLastSync",
  async (_, { rejectWithValue, getState }) => {
    const { company } = getState().auth;
    if (!company) {
      console.error("Error in getLastSync: no company selected");
      return rejectWithValue("Sin compañía seleccionada");
    }

    try {
      const issuedMetadata = await fetchSATQuerySummary(company, {
        limit: 1,
        states: ["TO_DOWNLOAD", "DOWNLOADED", "PROCESSED"],
        downloadType: "ISSUED",
        orderBy: "end desc",
        requestType: "METADATA",
      });
      const receivedMetadata = await fetchSATQuerySummary(company, {
        limit: 1,
        states: ["TO_DOWNLOAD", "DOWNLOADED", "PROCESSED"],
        downloadType: "RECEIVED",
        orderBy: "end desc",
        requestType: "METADATA",
      });

      if (issuedMetadata.satLog.length === 0 && receivedMetadata.satLog.length === 0)
        return rejectWithValue("No SAT queries");

      let iStatus = "Sin procesos";
      let iLastSync: string | null = null;
      let rStatus = "Sin procesos";
      let rLastSync: string | null = null;

      if (issuedMetadata.satLog.length > 0) {
        const lastIssuedQuery = issuedMetadata.satLog[0];
        iLastSync = formatDisplay(lastIssuedQuery.end, DisplayType.TIMEZONE) as string;
        if (lastIssuedQuery.state === "sended") {
          iStatus = "Sincronizando";
          iLastSync = null;
        }
      }

      if (receivedMetadata.satLog.length > 0) {
        const lastReceivedQuery = receivedMetadata.satLog[0];
        rLastSync = formatDisplay(lastReceivedQuery.end, DisplayType.TIMEZONE) as string;
        if (lastReceivedQuery.state === "sended") {
          rStatus = "Sincronizando";
          rLastSync = null;
        }
      }

      return {
        issuedMetadataStatus: iStatus,
        issuedMetadataLastSync: iLastSync,
        receivedMetadataStatus: rStatus,
        receivedMetadataLastSync: rLastSync,
      };
    } catch (e: any) {
      console.error("Unexpected error in getLastSync: ", e);
      return rejectWithValue("Error al obtener última actualización del SAT");
    }
  }
);
