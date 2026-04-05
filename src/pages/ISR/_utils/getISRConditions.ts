import { InternalTabType, TabType, TopTabSectionType } from "../_types/ISRTypes";

export function getNeedsPaymentFilters(
  tab: TabType | undefined,
  internalTab: InternalTabType | undefined,
  topTab?: TopTabSectionType | undefined
) {
  return (
    topTab === "deductions" &&
    (tab === "PAYMENT" ||
      internalTab === "EXCLUDED-PREFILLED-PAYMENT" ||
      (tab === "EXCLUDED" && (internalTab === "PAYMENT" || internalTab === "EXCLUDED-PAYMENTS")))
  );
}

export function getTableTabSwitchCondition(tab: TabType, internalTab: InternalTabType) {
  if (tab === "DISCOUNTS" || tab === "EXCLUDED-PREFILLED") {
    return `${internalTab}`;
  } else if (tab === "EXCLUDED") {
    return `${tab}-${internalTab}`;
  } else {
    return tab;
  }
}


