import moment from "moment";
import {
  FetchDoctosType,
  FetchFDIsType,
  TState,
  updateIVACFDIPayloadType,
} from "../_types/StateTypes";
import { TableMeta } from "@hooks/useTableMeta";
import { RelatedDocto } from "../_types/RelatedDocsTable";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { getLoadCFDIPayload } from "../_utils/getLoadCFDIPayload";
import { isPeriodEqual } from "../_utils";
import { manageFilters } from "../_utils/getUpdateIVADomain";

export function loadIVAData(
  periodDates: string | null,
  tempSearch: string,
  cfdi: {
    ivaCFDIs: { cfdis: CFDI[]; totals: CFDIsTotals | null; quantity: number };
    isFetching: boolean;
    IVAExportBanner: boolean;
    updateSucceded: boolean;
    setPaymentSucceded: boolean;
  },
  actions: {
    fetchIVA: (period: string, fuzzy_search: string) => void;
    fetchIVAFuzzy: (period: string, fuzzy_search: string) => void;
    fetchCFDIs: ({ ...rest }: FetchFDIsType) => void;
    fetchDoctoRelacionados: ({ ...rest }: FetchDoctosType) => void;
    getExcludedCFDIs: (tab: TabIVAType, options: SearchOptions) => void;
    closeBanner: () => void;
    setCFDIConfig: (uuids: updateIVACFDIPayloadType) => void;
  },
  datesDifference: boolean,
  setPeriodSelected: (period: string) => void
) {
  if (
    periodDates ||
    (cfdi.updateSucceded && periodDates) ||
    (cfdi.setPaymentSucceded && periodDates)
  ) {
    const periodDatesList = periodDates.split("|")[0];
    const ivaDate = periodDatesList.split("T");
    const dateToSend = datesDifference
      ? moment(ivaDate[0]).add(11, "months").format("YYYY-MM-DD")
      : ivaDate[0];
    actions.fetchIVA(dateToSend, tempSearch);
    setPeriodSelected(periodDatesList);
  }
}

export function loadIVADataFuzzy(
  periodDates: string | null,
  tempSearch: string,
  cfdi: {
    ivaCFDIs: { cfdis: CFDI[]; totals: CFDIsTotals | null; quantity: number };
    isFetching: boolean;
    IVAExportBanner: boolean;
    updateSucceded: boolean;
    setPaymentSucceded: boolean;
  },
  actions: {
    fetchIVA: (period: string, fuzzy_search: string) => void;
    fetchIVAFuzzy: (period: string, fuzzy_search: string) => void;
    fetchCFDIs: ({ ...rest }: FetchFDIsType) => void;
    fetchDoctoRelacionados: ({ ...rest }: FetchDoctosType) => void;
    getExcludedCFDIs: (tab: TabIVAType, options: SearchOptions) => void;
    closeBanner: () => void;
    setCFDIConfig: (uuids: updateIVACFDIPayloadType) => void;
  },
  datesDifference: boolean,
  setPeriodSelected: (period: string) => void
) {
  if (
    periodDates ||
    (cfdi.updateSucceded && periodDates) ||
    (cfdi.setPaymentSucceded && periodDates)
  ) {
    const periodDatesList = periodDates.split("|")[0];
    const ivaDate = periodDatesList.split("T");
    const dateToSend = datesDifference
      ? moment(ivaDate[0]).add(11, "months").format("YYYY-MM-DD")
      : ivaDate[0];
    actions.fetchIVAFuzzy(dateToSend, tempSearch);
    setPeriodSelected(periodDatesList);
  }
}

export function loadCFDIs(
  periodDates: string | null,
  cfdi: {
    ivaCFDIs: { cfdis: CFDI[]; totals: CFDIsTotals | null; quantity: number };
    isFetching: boolean;
    IVAExportBanner: boolean;
    updateSucceded: boolean;
    setPaymentSucceded: boolean;
  },
  actions: {
    fetchIVA: (period: string, fuzzy_search: string) => void;
    fetchIVAFuzzy: (period: string, fuzzy_search: string) => void;
    fetchCFDIs: ({ ...rest }: FetchFDIsType) => void;
    fetchDoctoRelacionados: ({ ...rest }: FetchDoctosType) => void;
    getExcludedCFDIs: (tab: TabIVAType, options: SearchOptions) => void;
    closeBanner: () => void;
    setCFDIConfig: (uuids: updateIVACFDIPayloadType) => void;
  },
  topTab: TState,
  tab: TabIVAType,
  parseTableMeta: <T>(tableMeta: TableMeta<T>) => {
    orderBy: string;
    limit: number;
    offset: number;
  },
  doctosTableMeta: TableMeta<RelatedDocto>,
  type: string,
  datesDifference: boolean,
  IVASection: "creditable" | "transferred",
  tableMeta: TableMeta<IVACFDI>,
  tempSearch: string
) {
  const isDoctoRelacionado = topTab.includes("creditable") && tab === "CREDIT";

  const { orderBy, limit, offset } = isDoctoRelacionado
    ? parseTableMeta<RelatedDocto>(doctosTableMeta)
    : parseTableMeta<IVACFDI>(tableMeta);

  const currentPeriod = new URLSearchParams(location.search).get("period")?.split("-");
  const areEqual = isPeriodEqual(periodDates, currentPeriod, datesDifference);
  if (type && periodDates && areEqual && cfdi.updateSucceded && cfdi.setPaymentSucceded) {
    const options = getLoadCFDIPayload(
      periodDates,
      datesDifference,
      type,
      cfdi.updateSucceded,
      cfdi.setPaymentSucceded,
      tab,
      IVASection
    );

    const optionsForAllTab: SearchOptions = {
      ...options,
      limit: limit,
      offset: offset,
      orderBy: orderBy,
    };
    const newDomain = manageFilters(tableMeta.filters);
    const isExcluded =
      (topTab.includes("transferred") && tab === "MOVED") ||
      (topTab.includes("transferred") && tab === "EXCLUDED");
    const newOptions =
      newDomain && optionsForAllTab.domain ? [...optionsForAllTab.domain, ...newDomain] : undefined;

    isDoctoRelacionado
      ? actions.fetchDoctoRelacionados({
          dates: periodDates,
          options: { limit: limit, offset: offset, search: tempSearch, orderBy },
        })
      : actions.fetchCFDIs({
          module: "iva",
          type: type as any,
          forIVA: true,
          ivaTab: tab,
          options:
            tab === "ALL" || isExcluded
              ? {
                  ...optionsForAllTab,
                  domain: newOptions ? newOptions : optionsForAllTab.domain,
                  search: tempSearch,
                  filters: tableMeta.filters,
                }
              : {
                  limit: limit,
                  offset: offset,
                  orderBy: orderBy,
                  domain: optionsForAllTab.domain,
                  search: tempSearch,
                  filters: tableMeta.filters,
                },
        });
  }
}
