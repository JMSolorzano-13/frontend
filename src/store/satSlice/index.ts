import { createSlice } from "@reduxjs/toolkit";
import { NewSATLogType } from "@api/sat";
import { RootState } from "../store";
import { getLastSync } from "./getLastSync";
import { getManualSync, getManualSyncAll, getManualSyncStatus } from "./getManualSync";
import { getSatConfig } from "./getSatConfig";
import { getSatLog } from "./getSatLog";
import { getSatServerStatus } from "./getSatServerStatus";
import { getNewSatLog } from "./getNewSatLog";

function guessState({
  message = "",
  status,
}: {
  status: string;
  message: string;
}): ManualStatusType {
  if (message.includes("does not have permission")) {
    return { status: "error", message: "No fue posible realizar la descarga." };
  }
  if (message.includes("has reached the maximum number of manual syncs per day")) {
    return {
      status: "busy",
      message:
        "Se alcanzó el límite de 2 descargas manuales por día; espera a mañana para solicitar otra descarga.",
    };
  }
  if (message.includes("does not have certificates or its workspace is not active")) {
    return {
      status: "busy",
      message:
        "La cuenta está inactiva; es necesario contratar o renovar tu suscripción y verificar que tu e.firma (FIEL) esté vigente.",
    };
  }
  if (status === "ok") {
    return { status: "available", message: "ok" };
  }
  return { status: "available", message: "ok" };
}

type ManualStatusType = {
  status: "busy" | "error" | "available";
  message: string;
};

interface SatState {
  isFetching: boolean;
  isLoading: boolean;
  syncError: string | null;
  configError: string | null;
  newSatLogError: string | null;
  issuedMetadataStatus: string;
  issuedMetadataLastSync: string | null;
  receivedMetadataStatus: string;
  receivedMetadataLastSync: string | null;
  currentConfig: {
    rfc: string;
    expires: string;
  } | null;
  satLog: SATQuerySingleData[];
  satLogCount: number;
  satLogError: string | null;
  satLogFetching: boolean;
  isSATServiceAvailable: boolean;
  satBannerClosed: boolean;
  latestDownload: string | null;
  manualSync: {
    status: "busy" | "error" | "available";
    lastSync: number;
    errorMessage: string;
    canRequest: boolean;
    lastManualSyncDate: string | null;
    lastSyncDate: string | null;
    allProcessed: boolean;
  };
  newSatLog: NewSATLogType;
  fetchingNewSatLog: boolean;
  fetchingSatManualSync: boolean;
  differenceDaySinceManualSync: number;
}

const latestDownload = localStorage.getItem("latestDownload") ?? null;

const initialState: SatState = {
  isFetching: false,
  isLoading: false,
  syncError: null,
  configError: null,
  newSatLogError: null,
  issuedMetadataStatus: "Sin datos",
  issuedMetadataLastSync: null,
  receivedMetadataStatus: "Sin datos",
  receivedMetadataLastSync: null,
  currentConfig: null,
  satLog: [],
  satLogCount: 0,
  satLogError: null,
  satLogFetching: false,
  isSATServiceAvailable: true,
  satBannerClosed: false,
  latestDownload,
  manualSync: {
    status: "available",
    lastSync: Date.now(),
    errorMessage: "",
    canRequest: true,
    lastManualSyncDate: null,
    lastSyncDate: null,
    allProcessed: false,
  },
  newSatLog: {
    days: [],
    historic: {
      start: "",
      end: "",
      status: "",
      issued: {
        total: 0,
        processed: 0,
      },
      received: {
        total: 0,
        processed: 0,
      },
    },
  },
  fetchingNewSatLog: false,
  fetchingSatManualSync: false,
  differenceDaySinceManualSync: 1,
};

export const satSlice = createSlice({
  name: "sat",
  initialState,
  reducers: {
    clearSyncError(state) {
      state.syncError = null;
    },
    clearConfigError(state) {
      state.configError = null;
    },
    closeBanner(state) {
      state.satBannerClosed = true;
    },
    setLoading(state) {
      state.isLoading = !state.isLoading;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLastSync.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.issuedMetadataStatus = payload.issuedMetadataStatus;
      state.issuedMetadataLastSync = payload.issuedMetadataLastSync;
      state.receivedMetadataStatus = payload.receivedMetadataStatus;
      state.receivedMetadataLastSync = payload.receivedMetadataLastSync;
    });
    builder.addCase(getLastSync.pending, (state) => {
      state.isFetching = true;
      state.syncError = null;
      state.issuedMetadataStatus = "Cargando...";
      state.issuedMetadataLastSync = null;
      state.receivedMetadataStatus = "Cargando...";
      state.receivedMetadataLastSync = null;
    });
    builder.addCase(getLastSync.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.issuedMetadataStatus = "- - -";
      state.receivedMetadataStatus = "- - -";
      state.syncError = payload ?? null;
    });

    builder.addCase(getSatConfig.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.currentConfig = payload;
    });
    builder.addCase(getSatConfig.pending, (state) => {
      state.isFetching = true;
      state.configError = null;
    });
    builder.addCase(getSatConfig.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.configError = payload ?? null;
      state.currentConfig = null;
    });

    builder.addCase(getSatLog.fulfilled, (state, { payload }) => {
      state.satLog = payload.satLog;
      state.satLogCount = payload.satLogCount;
      state.latestDownload = payload.newLatestDownload;
      state.satLogFetching = false;
    });
    builder.addCase(getSatLog.pending, (state) => {
      state.satLogError = null;
      state.satLogFetching = true;
    });
    builder.addCase(getSatLog.rejected, (state, { payload }) => {
      state.satLogError = payload ?? null;
      state.satLogFetching = false;
    });

    builder.addCase(getSatServerStatus.fulfilled, (state, { payload }) => {
      state.isSATServiceAvailable = payload.isSATServiceAvailable;
    });
    builder.addCase(getSatServerStatus.rejected, (state) => {
      state.isSATServiceAvailable = true;
    });
    // Manual Sync Section
    builder.addCase(getManualSync.fulfilled, (state) => {
      state.manualSync.status = "busy";
      state.manualSync.lastSync = Date.now();
      state.manualSync.canRequest = false;
    });

    builder.addCase(getManualSync.rejected, (state) => {
      state.manualSync.status = "error";
      state.manualSync.errorMessage = "";
    });
    // Manual Sync ALL Section
    builder.addCase(getManualSyncAll.fulfilled, (state) => {
      state.manualSync.status = "busy";
      state.manualSync.lastSync = Date.now();
      state.manualSync.canRequest = false;
    });

    builder.addCase(getManualSyncAll.rejected, (state) => {
      state.manualSync.status = "error";
      state.manualSync.errorMessage = "";
    });
    // Manual Sync Status
    builder.addCase(getManualSyncStatus.fulfilled, (state, { payload }) => {
      const { status, message } = guessState({
        ...payload,
        message: payload.message ? payload.message : "",
      });
      state.manualSync.status = status;
      state.manualSync.errorMessage = message;
      state.manualSync.canRequest = payload.canRequest;
      state.fetchingSatManualSync = false;
      state.manualSync.lastManualSyncDate = payload.lastManualSync;
      state.manualSync.lastSyncDate = payload.lastSync;
      state.manualSync.allProcessed = payload.allProcessed;
      state.differenceDaySinceManualSync = payload.differenceDay;
    });
    builder.addCase(getManualSyncStatus.pending, (state) => {
      state.fetchingSatManualSync = true;
    });
    // New SAT Log data
    builder.addCase(getNewSatLog.fulfilled, (state, { payload }) => {
      state.newSatLog = payload.satLogData;
      state.fetchingNewSatLog = false;
    });
    builder.addCase(getNewSatLog.pending, (state) => {
      state.fetchingNewSatLog = true;
      state.newSatLogError = null;
    });
    builder.addCase(getNewSatLog.rejected, (state, { payload }) => {
      state.fetchingNewSatLog = false;
      state.newSatLogError = payload ?? null;
    });
  },
});

export const { clearSyncError, clearConfigError, closeBanner, setLoading } = satSlice.actions;
export const satSelector = (state: RootState) => state.sat;

export default satSlice.reducer;
