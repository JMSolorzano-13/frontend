import { TabType } from "../_types/ISRTypes";

export const getISRStatusButton = (
  tab: TabType,
  ISRCFDIs: any[],
  ISRTotalsDeductionsTable: any
) => {
  if (tab === "ALL") {
    const value = ISRTotalsDeductionsTable?.find(
      (value: { concepto: string }) => value?.concepto === "Deducciones autorizadas sin inversiones"
    )?.importe;
    if (value !== 0) {
      return false;
    }
    return true;
  }
  if (ISRCFDIs.length === 0) {
    return true;
  }
  return false;
};
