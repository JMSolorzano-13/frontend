import http from "@api/_http";
import { ISRUrls } from "../_constants/ISRApiUrls";
import {
  ExportPayloadComplete,
  ISRCFDIsPayload,
  ISRTotalsPayload,
  ISRUpdateCFDIPayload,
  ISRUpdateDoctosPayload,
  ISRUpdatePayload,
  ResponseTotalsDeductionsComplete,
} from "../_types/ISRTypes";
import { ISRFields, ISRPaymentFields } from "../_constants/ISRCFDIs";
import { getDateMinus7Days } from "@utils/getDateMinus7Day";

import moment from "moment";
import { getNeedsPaymentFilters } from "../_utils/getISRConditions";
import { normalizeResponse, normalizeExcludedResponse } from "../_utils/normalizeResponse";
import { isPaymentColumn } from "../_utils/ISRColumnsDeductions";

type GetISRTableType = {
  company_identifier: string;
  options: SearchOptions & {
    overridePeriodDates?: boolean;
  };
};

export async function fetchISRTotals({
  company,
  period,
  isr_topTab,
  domain,
  tab,
  internalTab,
}: ISRTotalsPayload) {
  if (isr_topTab === "incomes") {
    const payload = {
      company_identifier: company,
      period: period,
    };
    const response = await http.post(ISRUrls.GET_TOTALS, payload);
    return response.data;
  }
  const isPayment = getNeedsPaymentFilters(tab, internalTab, isr_topTab);

  if (isPayment) {
    const payload = {
      domain,
      fields: ["BaseIVA16", "BaseIVA8", "BaseIVA0", "BaseIVAExento", "Neto", "RetencionesISR"],
    };
    const response = await http.post(ISRUrls.GET_TOTALS_TABS_DEDUCTIONS_PAYMENT, payload);
    return response.data;
  } else {
    const payload = {
      domain,
      fields: ["SubTotal", "DescuentoMXN", "NetoMXN", "RetencionesISRMXN"],
    };
    const response = await http.post(ISRUrls.GET_TOTALS_TABS_DEDUCTIONS, payload);
    return response.data;
  }
}

export async function fetchISRTotalsAllTabs({ company, period }: ISRTotalsPayload) {
  const payload_incomes = {
    company_identifier: company,
    period: period,
  };
  const response_incomes = await http.post(ISRUrls.GET_TOTALS, payload_incomes);
  const periodDate = moment(period).format("YYYY-MM-DD");

  const payload_deductions = {
    company_identifier: company,
    period: periodDate,
  };

  const { data } = await http.post(ISRUrls.GET_TOTALS_DEDUCTIONS, payload_deductions);

  return {
    incomes: response_incomes.data,
    totals_table_excluded: normalizeExcludedResponse(data.totals_table_excluded),
    totals_table: normalizeResponse(data.totals_table),
  };
}

export async function fetchISRTotalsDeductions({
  company,
  period,
}: ISRTotalsPayload): Promise<ResponseTotalsDeductionsComplete> {
  const periodDate = moment(period).format("YYYY-MM-DD");

  const payload = {
    company_identifier: company,
    period: periodDate,
  };
  const { data } = await http.post(ISRUrls.GET_TOTALS_DEDUCTIONS, payload);
  return {
    totals_table_excluded: normalizeExcludedResponse(data.totals_table_excluded),
    totals_table: normalizeResponse(data.totals_table),
  };
}

export async function updateISRPercentageDeductions({ company, percentage }: ISRUpdatePayload) {
  const payload = {
    percentage,
    company_identifier: company,
  };
  await http.put(ISRUrls.UPDATE_PERCENTAGE_TABS_DEDUCTIONS, payload);
  return true;
}

export async function fetchISRCFDIs({
  domain,
  limit,
  offset,
  orderBy,
  tab,
  topTab,
  internalTab,
}: ISRCFDIsPayload) {
  const isPayment = getNeedsPaymentFilters(tab, internalTab, topTab);

  if (isPayment) {
    const payload = {
      domain,
      fields: ISRPaymentFields,
      order_by: orderBy,
      limit: limit,
      offset: offset,
    };
    const response = await http.post(ISRUrls.GET_ISR_DOCTOS, payload);
    return response.data;
  } else {
    const payload = {
      domain,
      fields: ISRFields,
      order_by: orderBy,
      limit: limit,
      offset: offset,
    };
    const response = await http.post(ISRUrls.GET_ISR_CFDIS, payload);
    return response.data;
  }
}

export async function downloadISRTable({
  file_name,
  topTab,
  fields,
  domain,
  company_identifier,
  date,
  isr,
  issued,
  period,
  periodType,
  tab,
  internalTab,
  yearly,
  display_name_deductions,
}: ExportPayloadComplete) {
  const isPayment = isPaymentColumn(tab, internalTab);

  if (topTab === "incomes") {
    const payload = {
      company_identifier,
      isr,
      date,
      issued,
      period,
      periodType,
      tab,
      yearly,
      export_data: {
        file_name,
        type: "",
      },
    };

    const response = await http.post(ISRUrls.DOWNLOAD_ISR_TABLE_INCOMES, payload);
    return response;
  } else {
    if (tab === "ALL") {
      const payload = {
        period,
        company_identifier,
        yearly: false,
        issued: false,
        displayed_name: display_name_deductions,
        export_data: {
          file_name,
        },
        total_nomina: {
          domain_totales: [["company_identifier", "=", company_identifier]],
        },
      };
      const response = await http.post(ISRUrls.DOWNLOAD_ISR_TABLE_DEDUCTIONS, payload);
      return response;
    } else {
      if (isPayment) {
        const payload = {
          period,
          company_identifier,
          yearly: false,
          issued: false,
          domain,
          fields,
          displayed_name: display_name_deductions,
          export_data: {
            file_name,
          },
          total_pagos: {
            domain_totales: domain,
            fields_totales: [
              "BaseIVA16",
              "BaseIVA8",
              "BaseIVA0",
              "BaseIVAExento",
              "Neto",
              "RetencionesISR",
            ],
          },
        };
        const response = await http.post(ISRUrls.DOWNLOAD_ISR_DEDUCTIONS_PAYMENTS, payload);
        return response;
      }
      const payload = {
        period,
        company_identifier,
        yearly: false,
        issued: false,
        domain,
        fields,
        displayed_name: display_name_deductions,
        export_data: {
          file_name,
        },
        total_cfdi: {
          domain_totales: domain,
          fields_totales: ["SubTotal", "DescuentoMXN", "NetoMXN", "RetencionesISRMXN"],
        },
      };
      const response = await http.post(ISRUrls.DOWNLOAD_ISR_DEDUCTIONS_CFDI, payload);
      return response;
    }
  }
}

export async function getISRTotalIncomes(company: string, period: string) {
  const payload = {
    company_identifier: company,
    period: period,
  };
  const response = await http.post(ISRUrls.GET_TOTALS, payload);
  return response.data;
}

export async function fetchISRUpdateCFDI({
  companyIdentifier,
  cfdis,
}: ISRUpdateCFDIPayload) {
  const payload = {
    company_identifier: companyIdentifier,
    cfdis: cfdis,
  };

  const response = await http.post(ISRUrls.UPDATE_ISR_CFDI, payload);
  return response.data;
}

export async function fetchISRUpdateDoctos({ company_identifier, cfdis }: ISRUpdateDoctosPayload) {
  const payload = {
    company_identifier: company_identifier,
    cfdis: cfdis,
  };

  const response = await http.post(ISRUrls.UPDATE_ISR_DOCTOS, payload);
  return response.data;
}

export const fetISRExports = async ({ company_identifier, options }: GetISRTableType) => {
  const payload = {
    domain: [
      ["company_identifier", "=", company_identifier],
      ["export_data_type", "=", "ISR"],
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

  const response = await http.post(ISRUrls.GET_ISR_EXPORTS, payload);
  return {
    content: response.data.data as IVAExport[],
    totalRecords: response.data.total_records,
  };
};
