import moment from "moment";
import { getDatesDomainType } from "../_types/ISRTypes";
import { getNeedsPaymentFilters } from "./getISRConditions";

export default function getDatesDomain(values: getDatesDomainType) {
  const { date, topTab, tab, periodType, internalTab } = values;
  let dateToUse = "";
  if (date) {
    dateToUse = date.split("T")[0];
  }

  const periodPlusOneMonth = moment(dateToUse).add(1, "M").format("YYYY-MM-DD");
  const periodPlusOneYear = moment(dateToUse).add(1, "y").format("YYYY-MM-DD");

  // Default periodDomain when its a month period
  let periodDomain: DomainItem[] = [
    ["FechaFiltro", ">=", `${dateToUse}T00:00:00.000`],
    ["FechaFiltro", "<", `${periodPlusOneMonth}T00:00:00.000`],
  ];

  const isPayment = getNeedsPaymentFilters(tab, internalTab, topTab);

  if (isPayment) {
    periodDomain = [
      ["FechaPago", ">=", `${dateToUse}T00:00:00.000`],
      ["FechaPago", "<", `${periodPlusOneMonth}T00:00:00.000`],
    ];
  }

  // periodDomain when its a year
  if (periodType && periodType === "year") {
    periodDomain = [
      ["FechaFiltro", ">=", `${dateToUse}T00:00:00.000`],
      ["FechaFiltro", "<", `${periodPlusOneYear}T00:00:00.000`],
    ];
  }

  // periodDomain when its a month and exercise period
  if (periodType && periodType === "month" && topTab.includes("exercise")) {
    periodDomain = [
      ["FechaFiltro", ">=", `${dateToUse.split("-")[0]}-01-01T00:00:00.000`],
      ["FechaFiltro", "<", `${periodPlusOneMonth}T00:00:00.000`],
    ];
  }

  return periodDomain;
}
