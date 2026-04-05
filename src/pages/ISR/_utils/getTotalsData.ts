import {
  ISRTotalsRecordType,
  ISRTotalsResponseType,
  ISRTotalsResponseTypeDedcutions,
  TabType,
  TopTabSectionType,
} from "../_types/ISRTypes";
import getCurrentData from "./getCurrentData";
import getPeriodToDisplay from "./getPeriodToDisplay";

export default function getTotalsData(
  tab: TabType,
  topTab: TopTabSectionType,
  data: ISRTotalsResponseType | ISRTotalsResponseTypeDedcutions | null,
  date: string | null,
  periodType: string | null
): ISRTotalsRecordType[] {
  const currentData = getCurrentData(topTab, data as any);
  const periods = getPeriodToDisplay(date, periodType);
  const periodToDisplay = topTab.includes("year")
    ? `${periods.exerciseDate}`
    : `${periods.periodDate}`;
  const cashInvoice: ISRTotalsRecordType = {
    key: 1,
    context: "Facturas de contado",
    period: periodToDisplay,
    qty: currentData?.invoice_pue.qty ?? 0,
    baseIVA16: currentData?.invoice_pue.BaseIVA16 ?? 0,
    baseIVA8: currentData?.invoice_pue.BaseIVA8 ?? 0,
    baseIVA0: currentData?.invoice_pue.BaseIVA0 ?? 0,
    baseExemptIVA: currentData?.invoice_pue.BaseIVAExento ?? 0,
    totalISR: currentData?.invoice_pue.total ?? 0,
    ISRHoldings: currentData?.invoice_pue.RetencionesISRMXN ?? 0,
  };
  const paymentInvoice: ISRTotalsRecordType = {
    key: 2,
    context: "CFDI de pagos",
    period: periodToDisplay,
    qty: currentData?.payments.qty ?? 0,
    baseIVA16: currentData?.payments.BaseIVA16 ?? 0,
    baseIVA8: currentData?.payments.BaseIVA8 ?? 0,
    baseIVA0: currentData?.payments.BaseIVA0 ?? 0,
    baseExemptIVA: currentData?.payments.BaseIVAExento ?? 0,
    totalISR: currentData?.payments.total ?? 0,
    ISRHoldings: currentData?.payments.RetencionesISRMXN ?? 0,
  };

  const totals: ISRTotalsRecordType = {
    key: 3,
    context: "Total",
    period: "",
    qty: "",
    baseIVA16: "",
    baseIVA8: "",
    baseIVA0: "",
    baseExemptIVA: "",
    totalISR: currentData?.total ?? 0,
    ISRHoldings:
      (currentData?.payments.RetencionesISRMXN ?? 0) +
      (currentData?.invoice_pue.RetencionesISRMXN ?? 0),
  };

  switch (tab) {
    case "ALL":
      return [cashInvoice, paymentInvoice, totals];
    case "CASH":
      return [cashInvoice];
    case "PAYMENT":
      return [paymentInvoice];
    default:
      return [];
  }
}
