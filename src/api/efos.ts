import { EFOSFields } from "../constants/Fields";
import http from "./_http";

export const fetchEFOS = async (options: SearchOptions) => {
  const { domain, orderBy, search, limit, offset } = options;

  const payloadOperations = {
    domain,
    order_by: orderBy,
    fuzzy_search: search,
    fields: EFOSFields,
  };

  const payloadAll = {
    limit,
    offset,
    ...payloadOperations,
  };
  const res = await http.post("/EFOS/search", domain ? payloadOperations : payloadAll);
  const content = res.data;

  return {
    efos: content.data as EFOS[],
    nextPage: content.next_page,
    totalRecords: content.total_records,
  };
};

export const fetchEFOSTotals = async (options: SearchOptions) => {
  const { domain, search } = options;

  const payload = {
    domain,
    fuzzy_search: search,
    fields: ["no"]
  };

  const res = await http.post("/EFOS/resume", payload);
  const content = res.data;

  return content as EFOSTotals;
};
