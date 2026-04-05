import { transformFillEmptyDays } from "@utils/dataTransformers";
import { SATQuerySummaryFields } from "../constants/Fields";
import http from "./_http";
import moment from "moment";

export const fetchSATQuerySummary = async (
  companyIdentifier: string | undefined,
  options?: {
    states?: string[];
    limit?: number;
    offset?: number;
    orderBy?: string;
    downloadType?: string;
    requestType?: string;
  }
) => {
  const domain: Domain = [["company_identifier", "=", companyIdentifier]];

  if (options?.states && options?.states.length > 0) {
    domain.push(["state", "in", options.states]);
  }
  if (options?.downloadType) {
    domain.push(["download_type", "=", options.downloadType]);
  }
  if (options?.requestType) {
    domain.push(["request_type", "=", options.requestType]);
  }

  const payload = {
    domain,
    fields: SATQuerySummaryFields,
    order_by: options?.orderBy ?? "created_at desc",
    limit: options?.limit ?? 10,
    offset: options?.offset ?? 0,
  };

  const response = await http.post("/SATQuery/search", payload);
  const { data, total_records } = response.data;

  return {
    satLog: data,
    satLogCount: total_records,
  };
};

export const fetchSatConfig = async (companyId: string) => {
  const payload = {
    company_identifier: companyId,
  };

  const response = await http.post("/Company/get_cer", payload);
  const config = response.data;

  return {
    rfc: config.rfc as string,
    expires: config.not_after as string,
  };
};

export const uploadSatConfig = (
  companyIdentifier: string | null,
  cerData: string,
  keyData: string,
  password: string
) => {
  return new Promise((resolve, reject) => {
    const payload = {
      company_identifier: companyIdentifier,
      cer: cerData,
      key: keyData,
      pas: password,
    };
    http
      .post("/Company/upload_cer", payload)
      .then((response) => {
        resolve(response.data.state);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

interface PostSATManualSyncType {
  companyIdentifier: string;
}

interface ManualSyncResponseType {
  status: string;
  message: string;
  canRequest: boolean;
  lastManualSync: string | null;
  lastSync: string | null;
  allProcessed: boolean;
}

// reason
export async function postSATManualSyncStatus({ companyIdentifier }: PostSATManualSyncType) {
  const payload = {
    company_identifier: companyIdentifier,
  };
  try {
    const response = await http.post("/SATQuery/can_manual_request", payload);
    //
    const { data } = response;
    const res: ManualSyncResponseType = {
      ...data,
      status: data.status,
      message: data.reason ? data.reason : "",
      canRequest: data.can_request,
      lastManualSync: data.last_manual_sync_requested,
      lastSync: data.last_sync_processed,
      allProcessed: data.all_cfdis_processed,
    };
    return res;
  } catch (error) {
    throw new Error("Error on manual sync");
  }
}

// Manual petition
export async function postSATManualSync({ companyIdentifier }: PostSATManualSyncType) {
  const payload = {
    company_identifier: companyIdentifier,
  };
  try {
    const response = await http.post("/SATQuery/manual", payload);
    const { data } = response;
    return {
      ...data,
      status: data.status,
      message: data.reason ? data.reason : "",
    };
  } catch (error) {
    throw new Error("Error on manual sync");
  }
}

// Manual petition All
export async function postSATManualSyncAll() {
  try {
    const payload = {
      end: moment().format('YYYY-MM-DD'),
      start: moment().subtract(6, 'months').format('YYYY-MM-DD')
    }
    const {data} = await http.post("/SATQuery/massive_scrap", payload);
    return data
  } catch (error) {
    throw new Error("Error on manual sync");
  }
}

// New SAT LOG Types Section
export interface PostNewSATLogType {
  companyIdentifier: string;
  status?: string;
  startDate: string;
  endDate: string;
  daysDifference: number;
}

// Possible values from status log
// type SingleLongDayTypeStatus = 'INCOMPLETE' | 'COMPLETE' | 'SUBSTITUTES'

export interface SingleLogDayType {
  date: string;
  status: string;
  issued: {
    total: number;
    processed: number;
  };
  received: {
    total: number;
    processed: number;
  };
}
export interface HistoricLogType {
  start: string;
  end: string;
  status: string;
  issued: {
    total: number;
    processed: number;
  };
  received: {
    total: number;
    processed: number;
  };
}

export interface NewSATLogType {
  days: SingleLogDayType[];
  historic: HistoricLogType;
}

// Called when we load the page or refresh
export async function postGetNewSATLog({
  companyIdentifier,
  startDate,
  endDate,
  daysDifference,
}: PostNewSATLogType) {
  const payload = {
    company_identifier: companyIdentifier,
    status: "",
    start: startDate,
    end: endDate,
  };
  try {
    const response = await http.post("/SATQuery/log", payload);
    const data = response.data as NewSATLogType;
    const filledDays = transformFillEmptyDays(data.days, daysDifference);
    return {
      ...data,
      days: filledDays,
    };
  } catch (error) {
    throw new Error("Error on get new SAT Log");
  }
}
