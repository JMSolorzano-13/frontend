import { CompanyFields } from "../constants/Fields";
import http from "./_http";

export const fetchCompanies = async (
  company_ids: number[],
  options?: SearchOptions,
  fields?: string[]
) => {
  const payload = {
    domain: [["id", "in", company_ids], ...(options?.domain ?? [])],
    order_by: options?.orderBy,
    fuzzy_search: options?.search,
    limit: options?.limit !== undefined ? options.limit : 10,
    offset: options?.offset !== undefined ? options.offset : 0,
    fields: fields ?? CompanyFields,
  };
  // Testing auto deploy
  const res = await http.post("/Company/search", payload);
  const content = res.data;
  
  return content.data as Company[];
};

export const createCompany = async (
  workspaceId: string,
  workspaceOldId: number,
  values: { base64Cert: string; base64Key: string; password: string }
) => {
  const payload = {
    workspace_identifier: workspaceId,
    workspace_id: workspaceOldId,
    cer: values.base64Cert,
    key: values.base64Key,
    pas: values.password,
  };

  const res = await http.post("/Company", payload);
  const content = res.data;

  return content as Company[];
};

export const updateCompaniesNotifications = async (
  companiesIds: string[],
  notifications: { [key: string]: string[] }
) => {
  const payload = {
    ids: companiesIds,
    values: notifications,
  };

  const res = await http.put("/Company", payload);
  const content = res.data;

  return content;
};
