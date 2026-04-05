import http from "./_http";
import { IVACFDIFields } from "../constants/Fields";
import { getDateMinus7Days } from "@utils/getDateMinus7Day";
import { numberPagination } from "@utils/global/numberPagination";
import { DoctoRelacionadosFields } from "@pages/IVA/_constants/DoctoRelacionadosFields";

const IVA_URLS = {
  GET_IVA: "CFDI/get_iva",
  EXPORT_IVA_TABLES: "CFDI/export_iva",
  GET_IVA_EXPORTS: "Export/search",
  EXCLUDE_FROM_CALCULATION: "CFDI/exclude_from_iva",
  GET_EXCLUDED: "/CFDI/search",
};

type ExportIVATableType = {
  period: string;
  yearly: boolean;
  iva: IVAAPITYPE;
  issued: boolean;
  company_identifier: string;
  export_exception?: string;
  file_name: string;
  domain?: DomainItem;
  order_by?: string;
};

type GetIVATableType = {
  company_identifier: string;
  options: SearchOptions & {
    overridePeriodDates?: boolean;
  };
};

export const getIVAForDashboard = async (
  companyIdentifier: string,
  { period, fuzzy_search }: { period: string; fuzzy_search: string }
) => {
  const payload = {
    company_identifier: companyIdentifier,
    period,
    fuzzy_search,
  };
  const response = await http.post(IVA_URLS.GET_IVA, payload);
  return response.data as IVAResponse;
};

export const exportIVATable = async ({
  company_identifier,
  file_name,
  ...rest
}: ExportIVATableType) => {
  const payload = {
    company_identifier,
    ...rest,
    export_data: {
      file_name,
      type: rest.issued
        ? "export-iva"
        : !rest.issued && rest.iva === "p_tra"
        ? "iva-doctos"
        : "export-iva",
    },
  };
  const response = await http.post(IVA_URLS.EXPORT_IVA_TABLES, payload);
  return response.data;
};

export const fetIVAExports = async ({ company_identifier, options }: GetIVATableType) => {
  const payload = {
    domain: [
      ["company_identifier", "=", company_identifier],
      ["export_data_type", "=", "IVA"],
    ],
    fields: [
      "created_at",
      "expiration_date",
      "start",
      "end",
      "displayed_name",
      "url",
      "state",
      "external_request",
    ],
    order_by: options.orderBy,
    offset: options.offset,
    limit: options.limit,
  };

  payload.domain.push(["created_at", ">=", getDateMinus7Days()]);

  const response = await http.post(IVA_URLS.GET_IVA_EXPORTS, payload);
  return {
    content: response.data.data as IVAExport[],
    totalRecords: response.data.total_records,
  };
};

export const excludeCFDIFromIVACalculation = async (companyId: string, cfdis: string[]) => {
  const payload = {
    company_identifier: companyId,
    data: cfdis,
  };
  const response = await http.post(IVA_URLS.EXCLUDE_FROM_CALCULATION, payload);
  return response;
};

export const getExcluded = async (
  companyIdentifier: string | undefined,
  tab: TabIVAType,
  options?: SearchOptions
) => {
  const payload = options?.period
    ? {
        domain: [["company_identifier", "=", companyIdentifier], ...(options?.domain ?? [])],
        order_by: options?.orderBy,
        fuzzy_search: options?.search,
        limit: options?.limit ?? numberPagination,
        offset: options?.offset ?? 0,
        period: options?.period ?? "",
        yearly: options?.yearly ?? false,
        fields: [...IVACFDIFields, ...(options?.fields ?? [])],
        is_issued: options?.isIssued ?? false,
        date_field: "FechaFiltro",
      }
    : {
        domain: [["company_identifier", "=", companyIdentifier], ...(options?.domain ?? [])],
        order_by: options?.orderBy,
        fuzzy_search: options?.search,
        limit: options?.limit ?? numberPagination,
        offset: options?.offset ?? 0,
        fields: [...IVACFDIFields, ...(options?.fields ?? [])],
      };

  const res = await http.post("/CFDI/search_iva", payload);

  const content = res.data;

  return {
    cfdis: content.data as CFDI[],
    hasNextPage: content.next_page as boolean,
    totalRecords: content.total_records as number,
  };
};

function handleOrderBy(orderBy: string | undefined) {
  if (orderBy?.includes(".")) {
    return `${orderBy} identifier desc`;
  } else if (orderBy && orderBy.length > 0) {
    return `${orderBy} identifier desc`;
  } else {
    return `FechaPago asc  identifier desc`;
  }
}

export const fetchDoctoRelacionados = async (companyIdentifier: string, options: SearchOptions) => {
  const basicDomain: DomainItem[] = [
    ["company_identifier", "=", companyIdentifier],
    ["is_issued", "=", false],
  ];
  if (options.domain) {
    basicDomain.push(...options.domain);
  }

  const orderBy = handleOrderBy(options.orderBy);

  const payload = {
    domain: [...basicDomain],
    fields: DoctoRelacionadosFields,
    limit: options.limit || 0,
    offset: options.offset || 0,
    order_by: orderBy,
    fuzzy_search: options.search,
  };
  const res = await http.post("/DoctoRelacionado/search", payload);
  const content = res.data;
  return {
    doctoRelacionados: content.data,
    hasNextPage: content.next_page,
    totalRecords: content.total_records,
  };
};

export const fetchSetExclude = async (jsonBody: {
  company_identifier: string;
  cfdis: {company_identifier: string, UUID: string, ExcludeFromISR: boolean}[];
}) => {
  await http.post("/DoctoRelacionado/update", jsonBody);
};

export const fetchIVAWidgetTotals = async (companyIdentifier: string, period: string) => {
  const payload = {
    company_identifier: companyIdentifier,
    period,
  };
  const response = await http.post("/CFDI/get_iva_all", payload);
  return response.data as IVAWidgetData;
};
