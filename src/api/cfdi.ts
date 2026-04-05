import { ADD_CFDI_Types, CFDI_Types } from "@constants/Enums";
import { IVACFDIFields } from "../constants/Fields";
import http from "./_http";
import { IVACFDIsPayloadType } from "@pages/IVA/_types/StateTypes";
import {
  bankedValues,
  paymentBankedValues,
  getAnyValuesDomain,
  attachmentValues,
} from "@utils/CFDI/advSelections";
import { getDateMinus7Days } from "@utils/getDateMinus7Day";
import { numberPagination } from "@utils/global/numberPagination";
import { Module, type } from "@constants/Extra";

const CFDI_URLS = {
  SAVE_CFDI: "/CFDI/update",
  PAYROLL_TOTALS: "/CFDI/resume",
};

const handleFormaPagov2 = (
  options: SearchOptions | undefined,
  TipoDeComprobante: CFDI_Types | ADD_CFDI_Types | undefined,
  module?: string
): DomainItem[] => {
  const updatedDomain: DomainItem[] =
    options?.domain?.map((i) => {
      const field = i[0];
      const value = i[2] ?? "";

      if (field === "FormaPagov2") {
        if (TipoDeComprobante) {
          if (TipoDeComprobante === "P") {
            return paymentBankedValues[value.toString()];
          } else {
            return bankedValues[value.toString()];
          }
        } else {
          return bankedValues[value.toString()];
        }
      }
      if (
        field === "cfdi_related" ||
        field === "polizas" ||
        (field === "paid_by" && !module?.includes("validation"))
      ) {
        return getAnyValuesDomain(value, field);
      }
      if (field === "attachments_count") {
        return attachmentValues[value.toString()];
      }
      return i;
    }) ?? [];

  return updatedDomain;
};

export const fetchCFDIs = async (
  companyIdentifier: string | undefined,
  options?: SearchOptions,
  type?: CFDI_Types
) => {
  const updatedDomain = handleFormaPagov2(options, type);
  const payload = {
    domain: [["company_identifier", "=", companyIdentifier], ...updatedDomain],
    order_by: options?.orderBy ? `${options?.orderBy}, "UUID" asc` : options?.orderBy,
    fuzzy_search: options?.search,
    limit: options?.limit ?? numberPagination,
    offset: options?.offset ?? 0,
    fields: options?.fields ?? [],
  };
  payload.domain = payload.domain.filter((domain) => domain);
  const res = await http.post("/CFDI/search", payload, { timeout: 65_000 });
  const content = res.data;

  return {
    cfdis: content.data as CFDI[],
    hasNextPage: content.next_page as boolean,
    totalRecords: content.total_records as number,
  };
};

export const fetchCFDIsForIVA = async (
  companyIdentifier: string | undefined,
  options?: SearchOptions,
  tabIva?: TabIVAType
) => {
  const filters = options?.filters;
  let payload = options?.period
    ? {
        domain: [["company_identifier", "=", companyIdentifier], ...(options?.domain ?? [])],
        order_by: options?.orderBy,
        fuzzy_search: options?.search,
        limit: options?.limit ?? numberPagination,
        offset: options?.offset ?? 0,
        period: options?.period ?? "",
        yearly: options?.yearly ?? false,
        is_issued: options?.isIssued ?? true,
        fields: [...IVACFDIFields, ...(options?.fields ?? [])],
      }
    : {
        domain: [["company_identifier", "=", companyIdentifier], ...(options?.domain ?? [])],
        order_by: options?.orderBy,
        fuzzy_search: options?.search,
        limit: options?.limit ?? numberPagination,
        offset: options?.offset ?? 0,
        is_issued: options?.isIssued ?? true,
        fields: [...IVACFDIFields, ...(options?.fields ?? [])],
      };
  if (tabIva !== "MOVED" && tabIva !== "EXCLUDED") {
    payload.domain.push(["ExcludeFromIVA", "!=", true]);
  }
  if (tabIva === "MOVED" || tabIva === "EXCLUDED" || tabIva === "ALL") {
    payload = {
      ...payload,
      date_field: "FechaFiltro",
    } as any;
  }

  if (!options?.isIssued && (tabIva === "MOVED" || tabIva === "ALL")) {
    const dates: string[] = [];
    payload.domain.forEach((item) => {
      if (item[0] === "FechaFiltro") {
        dates.push(`${item[2]?.toLocaleString().split("T")[0]}`);
      }
    });

    payload.period = dates[0];
  }

  if (!options?.isIssued && tabIva === "EXCLUDED") {
    const dates: string[] = [];
    payload.domain.forEach((item) => {
      if (item[0] === "FechaFiltro") {
        dates.push(`${item[2]?.toLocaleString().split("T")[0]}T00:00:00.000`);
      }
    });
    payload.domain = [];

    (payload.domain as unknown as ComplexDomainItem).push(
      ["company_identifier", "=", companyIdentifier],
      filters["UsoCFDIReceptor"] && ["UsoCFDIReceptor", "in", filters["UsoCFDIReceptor"]],
      filters["FormaPago"] && ["FormaPago", "in", filters["FormaPago"]],
      filters["MetodoPago"] && ["MetodoPago", "in", filters["MetodoPago"]],
      filters["TipoDeComprobante"]
        ? ["TipoDeComprobante", "in", filters["TipoDeComprobante"]]
        : ["TipoDeComprobante", "in", ["I", "E"]],
      ["Estatus", "=", true],
      ["is_issued", "=", false],
      ["TipoDeComprobante", "in", ["I", "E"]],
      ["ExcludeFromIVA", "=", true],
      ["PaymentDate", ">=", dates[0]],
      ["PaymentDate", "<", dates[1]],
      ["Version", "=", "4.0"]
    );
    payload.domain = payload.domain.filter((domain) => domain);
    payload.fields = [];
  }

  if (!options?.isIssued && tabIva === "ALL") {
    const dates: string[] = [];
    payload.domain.forEach((item) => {
      if (item[0] === "FechaFiltro") {
        dates.push(`${item[2]?.toLocaleString().split("T")[0]}T00:00:00.000`);
      }
    });
    payload.domain = [];

    (payload.domain as unknown as ComplexDomainItem).push(
      ["company_identifier", "=", companyIdentifier],
      filters["UsoCFDIReceptor"] && ["UsoCFDIReceptor", "in", filters["UsoCFDIReceptor"]],
      filters["FormaPago"] && ["FormaPago", "in", filters["FormaPago"]],
      filters["MetodoPago"] && ["MetodoPago", "in", filters["MetodoPago"]],
      filters["TipoDeComprobante"]
        ? ["TipoDeComprobante", "in", filters["TipoDeComprobante"]]
        : ["TipoDeComprobante", "in", ["I", "E"]],
      ["Estatus", "=", true],
      ["is_issued", "=", false],
      ["TipoDeComprobante", "in", ["I", "E"]],
      ["ExcludeFromIVA", "=", false],
      ["PaymentDate", ">=", dates[0]],
      ["PaymentDate", "<", dates[1]],
      ["Version", "=", "4.0"]
    );
    payload.domain = payload.domain.filter((domain) => domain);
    payload.fields = [];
  }

  const res = await http.post(
    !options?.isIssued && (tabIva === "EXCLUDED" || tabIva === "ALL")
      ? "/CFDIExcluded/search"
      : tabIva !== "ALL" && tabIva !== "MOVED"
        ? "/CFDI/search"
        : "/CFDI/search_iva",
    payload
  );
  const content = res.data;

  return {
    cfdis: content.data as CFDI[],
    hasNextPage: content.next_page as boolean,
    totalRecords: content.total_records as number,
  };
};

// se queda de momento con company_id
export const fetchPeriod = async (companyIdentifier: string, isEfos?: boolean) => {
  const payload = {
    domain: [["FechaFiltro", "!=", null]],
    company_identifier: companyIdentifier,
  };

  if (isEfos) {
    payload.domain.push(["efos", "=", "any"]);
  }

  const res = await http.post("/CFDI/get_by_period", payload);
  const content = res.data;

  return {
    periods: content as RawPeriods,
  };
};

export const fetchTotals = async (
  companyIdentifier: string | undefined,
  options: SearchOptions,
  module?: string,
  extraValue?: any
) => {
  const updatedDomain = handleFormaPagov2(options, extraValue?.TipoDeComprobante, module);
  const TipoDeComprobante = extraValue ? { TipoDeComprobante: extraValue.TipoDeComprobante } : null;

  const findCFDI = options.domain
    ?.find((op): op is [string, string, keyof typeof type] => op[0] === "TipoDeComprobante")?.[2]
    ?.toString() as keyof typeof type;
  const findIssued = options.domain?.find((op) => op[0] === "Estatus")?.[2];

  const findModule = module as keyof typeof Module;
  const moduleValue = Module[findModule] ?? "ADD";

  const payload = {
    domain: [["company_identifier", "=", companyIdentifier], ...updatedDomain],
    fuzzy_search: options.search,
    log: `IX_${moduleValue}_${type[findCFDI || ""] || "Todos"}_${
      findIssued === true ? "Vigentes" : findIssued === false ? "Cancelados" : "Todos"
    }`,
    ...TipoDeComprobante,
  };
  payload.domain = payload.domain.filter((domain) => domain);
  const res = await http.post("/CFDI/resume", payload);
  const content = res.data as CFDIsTotals;

  return {
    totals: content,
  };
};

export const fetchCFDICount = async (
  companyIdentifier: string | undefined,
  options: SearchOptions,
  cfdiType?: CFDI_Types | undefined
) => {
  const updatedDomain = handleFormaPagov2(options, cfdiType);
  const payload = {
    domain: [["company_identifier", "=", companyIdentifier], ...updatedDomain],
    fuzzy_search: options.search,
  };
  payload.domain = payload.domain.filter((domain) => domain);
  const res = await http.post("/CFDI/get_count_cfdis", payload);
  const cfdiCount = res.data as CFDICount;

  return {
    count: cfdiCount,
  };
};

export const fetchMassiveExport = async (
  companyIdentifier: string | undefined,
  options: SearchOptions,
  fieldsToExport: string[],
  type: CFDI_Types | ADD_CFDI_Types,
  seccionType: string | null,
  exportType = "",
  file_name?: string
) => {
  const updatedDomain = handleFormaPagov2(options, type);

  let payload = {};
  if ((type === "N" || type === "P") && seccionType !== "ADD" && !exportType) {
    const fields = fieldsToExport.filter((field) => field !== "active_egresos.Total");
    payload = {
      domain: [["company_identifier", "=", companyIdentifier], ...(updatedDomain ?? [])],
      fuzzy_search: options.search,
      format: options.format,
      fields: fields,
      TipoDeComprobante: type,
      export_data: {
        file_name: file_name,
        type: "",
      },
    };
  } else if ((exportType && type === "P") || (exportType && type === "N")) {
    const fields = fieldsToExport.filter((field) => field !== "active_egresos.Total");
    payload = {
      domain: [["company_identifier", "=", companyIdentifier], ...(updatedDomain ?? [])],
      fuzzy_search: options.search,
      format: options.format,
      fields: fields,
      TipoDeComprobante: type,
      export_type: fields,
      export_data: {
        file_name: file_name,
        type: exportType,
      },
    };
  } else if (type === "I") {
    let fields: string[] = fieldsToExport;

    if (
      fieldsToExport.includes("active_egresos.Total") &&
      fieldsToExport.includes("cfdi_related.uuid_origin")
    ) {
      fields = fieldsToExport
        .filter((field) => field !== "active_egresos.Total")
        .map((field) =>
          field === "cfdi_related.uuid_origin" ? "uuid_total_egresos_relacionados" : field
        );
    }

    if (
      fieldsToExport.includes("active_egresos.Total") &&
      !fieldsToExport.includes("cfdi_related.uuid_origin")
    ) {
      fields = fieldsToExport.map((field) =>
        field === "active_egresos.Total" ? "total_relacionados_single" : field
      );
    }

    payload = {
      domain: [["company_identifier", "=", companyIdentifier], ...(updatedDomain ?? [])],
      fuzzy_search: options.search,
      format: options.format,
      fields,
      export_data: {
        file_name: file_name,
        type: "",
      },
    };
  } else {
    const fields = fieldsToExport.filter((field) => field !== "active_egresos.Total");

    payload = {
      domain: [["company_identifier", "=", companyIdentifier], ...(updatedDomain ?? [])],
      fuzzy_search: options.search,
      format: options.format,
      fields: fields,
      export_data: {
        file_name: file_name,
        type: exportType,
      },
    };
  }
  const res = await http.post("CFDI/massive_export", payload);
  const massiveExport = res.data as MassiveExportResponse;
  return {
    exportResponse: massiveExport,
  };
};

export const fetchCFDIMassiveExport = async (
  companyIdentifier: string | undefined,
  options: SearchOptions & {
    overridePeriodDates?: boolean;
  }
) => {
  const payload = {
    domain: [
      ["company_identifier", "=", companyIdentifier],
      ["export_data_type", "=", "CFDI"],
    ],
    fields: [
      "created_at",
      "identifier",
      "url",
      "expiration_date",
      // "company_id",
      "start",
      "end",
      "cfdi_type",
      "state",
      "format",
      "download_type",
    ],
    limit: options.limit,
    order_by: options.orderBy,
    offset: options.offset,
  };
  if (options.domain && options.domain.length > 0) {
    payload.domain.push(...(options.domain as any));
  }

  payload.domain.push(["created_at", ">=", getDateMinus7Days()]);

  const res = await http.post("/Export/search", payload);
  const exportData = res.data.data as CFDIExport[];
  return {
    content: exportData,
    totalRecords: res.data.total_records,
  };
};

// Function to save CFDI ExcludeFromIVA config
export const saveCFDIConfig = async (
  companyIdentifier: string,
  uuidsToModify: IVACFDIsPayloadType
) => {
  const payload = {
    company_identifier: companyIdentifier,
    cfdis: uuidsToModify,
  };
  const res = await http.post(CFDI_URLS.SAVE_CFDI, payload);
  const response = res.data.data as CFDIExport[];
  return response;
};

export const fetchPayrollTotals = async (
  companyIdentifier: string | undefined,
  options: SearchOptions
) => {
  const findIssued = options.domain?.find((op) => op[0] === "Estatus")?.[2];

  const payload = {
    domain: [["company_identifier", "=", companyIdentifier], ...(options.domain ?? [])],
    fuzzy_search: options.search,
    log: `IX_Nominas_${findIssued ? "Vigentes" : "Cancelados"}`,
    TipoDeComprobante: "N",
  };
  payload.domain = payload.domain.filter((domain) => domain);

  const res = await http.post(CFDI_URLS.PAYROLL_TOTALS, payload);
  const content = res.data as PayrollTotals;

  const structureData: PayrollTotals = {
    filtered: { type: "Periodo", ...content.filtered },
    excercise: { type: "Acumulado", ...content.excercise },
  };
  return structureData;
};

// CFDI payroll modal call
export const fetchPayrollModalContent = async () => {
  const res = await http.post("/CFDI/search");
  const payrollContent = res.data;
  return payrollContent;
};

export const saveCFDIPaymentDate = async (
  companyIdentifier: string,
  cfdiUUID: string,
  newPaymentDate: string,
  is_issued: boolean
) => {
  const dataToSend: IVACFDIsPayloadType = [];
  dataToSend.push({
    UUID: cfdiUUID,
    PaymentDate: newPaymentDate,
    is_issued: is_issued,
  });

  const payload = {
    company_identifier: companyIdentifier,
    cfdis: dataToSend,
  };
  return await http.post(CFDI_URLS.SAVE_CFDI, payload);
};

export const fetchSingleCFDI = async (
  companyIdentifier: string | undefined,
  options?: SearchOptions
) => {
  const payload: Record<string, unknown> = {
    domain: [["company_identifier", "=", companyIdentifier], ...(options?.domain ?? [])],
    limit: 1,
    fields: [...(options?.fields ?? [])],
  };
  if (options?.orderBy) {
    payload.order_by = options.orderBy;
  }

  const res = await http.post("/CFDI/search", payload, { timeout: 65_000 });
  const content = res.data;

  return {
    cfdis: content.data as CFDI[],
    hasNextPage: content.next_page as boolean,
    totalRecords: content.total_records as number,
  };
};

export const fetchSinglePolicy = async (
  companyIdentifier: string | undefined,
  options?: SearchOptions
) => {
  const payload = {
    domain: [["company_identifier", "=", companyIdentifier], ...(options?.domain ?? [])],
    limit: 1,
    fields: [...(options?.fields ?? [])],
  };

  const res = await http.post("/Poliza/search", payload, { timeout: 65_000 });
  const content = res.data;

  return {
    cfdis: content.data as Poliza[],
    hasNextPage: content.next_page as boolean,
    totalRecords: content.total_records as number,
  };
};

export const fetchSingleAttachments = async (
  companyIdentifier: string | undefined,
  options?: SearchOptions
) => {
  const payload = {
    domain: [["company_identifier", "=", companyIdentifier], ...(options?.domain ?? [])],
    fields: options?.fields ?? [],
  };

  const res = await http.post(`/Attachment/search`, payload, { timeout: 65_000 });
  const content = res.data;

  return {
    cfdis: content?.data as Attachment[],
    hasNextPage: content.next_page as boolean,
    totalRecords: content.total_records as number,
  };
};

export const fetchAttachmentsDownloadURLs = async (companyIdentifier: string, uuid: string) => {
  const res = await http.get(`/Attachment/${companyIdentifier}/${uuid}`);
  return res.data;
};

export interface FilesFormat {
  file_name: string;
  size: number;
  content_hash: string;
}

export const uploadSingleAttachments = async (
  filesFormat: FilesFormat[],
  companyIdentifier: string | undefined,
  uuid: string | null
) => {
  const res = await http.post(
    `/Attachment/${companyIdentifier}/${uuid}`,
    { items: filesFormat },
    { timeout: 65_000 }
  );
  const urlMap = res.data as Record<string, string>;

  return {
    urlMap,
  };
};

export const deleteSingleAttachment = async (
  companyIdentifier: string | undefined,
  uuid: string | null,
  fileName: string
) => {
  const res = await http.delete(
    `/Attachment/${companyIdentifier}/${uuid}/${encodeURIComponent(fileName)}`
  );

  return res.data;
};

export const uploadFilesToS3 = async (files: File[], urlMap: Record<string, string>) => {
  await Promise.all(
    files.map(async (file) => {
      const uploadUrl = urlMap[file.name];
      if (!uploadUrl) throw new Error(`No se encontró una URL para ${file.name}`);
      const blob = new Blob([file], { type: "" });
      const res = await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error subiendo ${file.name}: ${res.status} ${text}`);
      }
    })
  );
};

export const downloadFilesFromS3 = async (downloadUrl: string) => {
  const res = await fetch(downloadUrl, { method: "GET" });
  return res;
};

export const fetchNominalIncome = async (company: string | undefined, date?: string) => {
  const arrayDate = date?.split("|") || "";

  const dateString = arrayDate[1] || "";
  const anio = new Date(dateString).getFullYear();
  let mes = new Date(dateString).getMonth() + 1;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  if (arrayDate.length === 2 && mes !== currentMonth && anio === currentYear) {
    mes = new Date().getMonth() + 1;
  }

  const res = await http.get(`CFDI/${company}/emitidos/ingresos/${anio}/${mes}/resumen`);
  const data = res.data as NominalIncomeData;

  return {
    nominalIncomeData: data,
  };
};
