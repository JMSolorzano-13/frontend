import http from "./_http";
import { ADDSynchSearchFields } from "../constants/Fields";
import { ADD_CFDI_Types } from "@constants/Enums";
import { numberPagination } from "@utils/global/numberPagination";

const ADD_URLS = {
  CREATE_WORKER: "/Pasto/Worker",
  GET_COMPANIES: "Pasto/Company/search",
  UPDATE_COMPANY: "/Company",
  SYNC_SEARCH: "/Pasto/Sync/search",
  CFDI_SEARCH: "/CFDI/search",
  SYNC_REQUEST: "/Pasto/Sync",
  PASTO_REQUEST_NEW_COMPANIES: "Pasto/Company/request_new",
  ENABLE_AUTO_SYNC: "/Pasto/Sync/enable_auto_sync",
  REQUEST_METADATA_SYNC: "/Pasto/Sync/create_metadata_sync_request",
  RESET_ADD_STEP: "/Pasto/ResetLicense",
};

export const postWorker = async (workspaceId: string) => {
  const payload = {
    workspace_identifier: workspaceId,
  };
  const response = await http.post(ADD_URLS.CREATE_WORKER, payload);
  return response.data;
};

export const fetchCompanies = async (workspaceId: string, rfc: string) => {
  const payload = {
    domain: [
      ["workspace_identifier", "=", workspaceId],
      ["rfc", "=", rfc],
    ],
    fields: ["pasto_company_id", "workspace_identifier", "name", "alias", "rfc", "bdd", "system"],
  };
  const response = await http.post(ADD_URLS.GET_COMPANIES, payload);
  return response.data.data as ADDCompanyTypes[];
};

export const setCompany = async (companyIdentifier: string, pastoCompanyId: string) => {
  const payload = {
    ids: [companyIdentifier],
    values: { pasto_company_identifier: pastoCompanyId },
  };

  const response = await http.put(ADD_URLS.UPDATE_COMPANY, payload);

  return response.data;
};

function handleAction(item: ADDCFDI) {
  if (!item.add_exists && item.from_xml && !item.Estatus) {
    return "Both";
  }
  if (!item.add_exists && item.from_xml) {
    return "Send";
  }
  if (item.add_exists && !item.Estatus) {
    return "Cancel";
  }
  return "None";
}

export const fetchCFDIsForADD = async (
  companyIdentifier: string | undefined,
  type: ADD_CFDI_Types,
  options?: SearchOptions
) => {
  const payload = {
    domain: [["company_identifier", "=", companyIdentifier], ...(options?.domain ?? [])],
    order_by: options?.orderBy,
    fuzzy_search: options?.search,
    limit: options?.limit ?? numberPagination,
    offset: options?.offset ?? 0,
    fields: [...(options?.fields ?? [])],
  };

  payload.fields = [...payload.fields, "Estatus", "FechaCancelacion"];
  const res = await http.post(ADD_URLS.CFDI_SEARCH, payload);
  const content = res.data;
  let resMapped = content;
  resMapped = content.data.map((item: ADDCFDI) => ({
    ...item,
    action: handleAction(item),
  }));
  return {
    cfdis: resMapped as ADDCFDI[],
    hasNextPage: content.next_page as boolean,
    totalRecords: content.total_records as number,
  };
};

export const fetchSyncSearch = async (
  companyIdentifier: string | undefined,
  options?: SearchOptions
) => {
  let payload = {};
  payload = {
    domain: [["company_identifier", "=", companyIdentifier], ...(options?.domain ?? [])],
    order_by: options?.orderBy,
    fuzzy_search: options?.search,
    limit: options?.limit ?? 1000,
    offset: options?.offset ?? 0,
    fields: [...ADDSynchSearchFields, ...(options?.fields ?? [])],
  };

  const res = await http.post(ADD_URLS.SYNC_SEARCH, payload);
  const content = res.data;
  return {
    sync: content.data as ADDSyncSearch[],
    hasNextPage: content.next_page as boolean,
  };
};

export const requestSync = async (
  companyIdentifier: string | undefined,
  startDate: string,
  endDate: string
) => {
  const payload = {
    company_identifier: companyIdentifier,
    start: startDate,
    end: endDate,
  };

  const res = await http.post(ADD_URLS.SYNC_REQUEST, payload);
  console.info(res);
};

export const requestNewCompanies = async (workspaceIdentifier: string) => {
  const payload = {
    workspace_identifier: workspaceIdentifier,
  };
  const res = await http.post(ADD_URLS.PASTO_REQUEST_NEW_COMPANIES, payload);
  return res;
};

export const postEnableAutoSyncADD = async (companyIdentifier: string, isActive: boolean) => {
  const payload = {
    company_identifier: companyIdentifier,
    add_auto_state: isActive,
  };
  const res = await http.post(ADD_URLS.ENABLE_AUTO_SYNC, payload);
  return res;
};

export const postRequestMetadataSync = async (companyIdentifier: string | null) => {
  const payload = {
    company_identifier: companyIdentifier,
  };
  const res = await http.post(ADD_URLS.REQUEST_METADATA_SYNC, payload);
  return res;
};

export const postResetADDStep = async (licenseKey: string) => {
  const payload = {
    license_key: licenseKey,
  };
  const res = await http.post(ADD_URLS.RESET_ADD_STEP, payload);
  return res;
};
