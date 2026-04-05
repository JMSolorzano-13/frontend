import { ISRPeriodSectionType, ISRTotalsResponseType, TopTabSectionType } from "../_types/ISRTypes";

export default function getCurrentData(
  topTab: TopTabSectionType,
  data: ISRTotalsResponseType | null
): ISRPeriodSectionType | undefined {
  switch (true) {
    case topTab.includes("incomes"):
      return data?.period?.incomes;

    default:
      return {
        invoice_pue: {
          BaseIVA0: 0,
          BaseIVA8: 0,
          BaseIVA16: 0,
          BaseIVAExento: 0,
          qty: 0,
          RetencionesISRMXN: 0,
          total: 0,
        },
        payments: {
          BaseIVA0: 0,
          BaseIVA8: 0,
          BaseIVA16: 0,
          BaseIVAExento: 0,
          qty: 0,
          RetencionesISRMXN: 0,
          total: 0,
        },
        excluded_qty: 0,
        qty: 0,
        total: 0,
      };
  }
}
