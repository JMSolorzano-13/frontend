import { createAsyncThunk } from "@reduxjs/toolkit";
import { getEfosPeriods } from "../common/getEfosPeriods";
import { getPeriods } from "../common/getPeriods";
import { RootState } from "../store";
import { fetchSATQuerySummary } from "@api/sat";

type Out = {
  satLog: SATQuerySingleData[];
  satLogCount: number;
  newLatestDownload: string | null;
};

type In = {
  offset: number;
  limit?: number;
  orderBy?: string;
  downloadType?: string;
  requestType?: string;
  states?: string[];
};

export const getSatLog = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "sat/getSatLog",
  async (
    { offset, limit, orderBy, downloadType, requestType, states },
    { rejectWithValue, getState, dispatch }
  ) => {
    const { company } = getState().auth;
    const { latestDownload } = getState().sat;
    if (!company) {
      console.error("Error in getSatLog: no company selected");
      return rejectWithValue("Sin compañía seleccionada");
    }

    try {
      const { satLog, satLogCount } = await fetchSATQuerySummary(company, {
        limit,
        offset,
        orderBy,
        downloadType,
        requestType,
        states,
      });

      let newLatest = null;
      if (satLog.length > 0) {
        newLatest = new Date(`${satLog[0].end}Z`);
        if (latestDownload) {
          const latestDownloadDate = new Date(latestDownload);
          newLatest.setMilliseconds(0);
          if (newLatest > latestDownloadDate) {
            localStorage.setItem("latestDownload", newLatest.toUTCString());
            dispatch(getPeriods());
            dispatch(getEfosPeriods());
          }
        } else {
          localStorage.setItem("latestDownload", newLatest.toUTCString());
          dispatch(getPeriods());
          dispatch(getEfosPeriods());
        }
      }

      return {
        satLog,
        satLogCount,
        newLatestDownload: newLatest ? newLatest.toUTCString() : null,
      };
    } catch (e: any) {
      console.error("Unexpected error in getSatLog: ", e);
      return rejectWithValue("Error al obtener la bitácora de SATSync");
    }
  }
);
