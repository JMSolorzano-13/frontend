import { buildIVADomain, buildMovedIVA, buildNotConsiderIVA } from "@utils/domains";
import * as UTILS from "../_utils";

export function getLoadCFDIPayload(
  periodDates: string | null,
  datesDifference: boolean,
  type: string,
  updateSucceded: boolean,
  setPaymentSucceded: boolean,
  tab: TabIVAType,
  IVASection: "transferred" | "creditable"
) {
  const currentPeriod = new URLSearchParams(location.search).get("period")?.split("-");
  const areEqual = UTILS.isPeriodEqual(periodDates, currentPeriod, datesDifference);
  const yearly = UTILS.isYearly(periodDates);
  if (
    (type && periodDates && areEqual) ||
    (updateSucceded && periodDates) ||
    (setPaymentSucceded && periodDates)
  ) {
    const pdates = periodDates.split("|");
    const periodToSend = yearly
      ? `${pdates[0].split("T")[0].split("-")[0]}-12-01`
      : pdates[0].split("T")[0];
    let domain: Domain = [];
    if (tab === "EXCLUDED") {
      domain = buildNotConsiderIVA(IVASection, pdates);
    } else if (tab === "MOVED") {
      domain = buildMovedIVA(IVASection, pdates);
    } else {
      domain = buildIVADomain(tab, pdates, IVASection, datesDifference, datesDifference);
    }

    const optionsForAllTab: SearchOptions = {
      period: periodToSend,
      yearly: datesDifference,
      isIssued: IVASection === "transferred",
      domain,
    };
    return optionsForAllTab;
  }
  return {} as SearchOptions;
}
