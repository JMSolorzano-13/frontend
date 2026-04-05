import { Months } from "@utils/dateHelper";
import moment from "moment";

export function managePastPeriodAndDates(periodSelected: string, isYearly: boolean) {
  const modalPeriodYear = moment.utc(periodSelected.split("-")[0]).format("YYYY-MM-DD");
  const pastPeriod = isYearly
    ? moment.utc(modalPeriodYear).subtract(1, "month").format("YYYY-MM-DD")
    : moment.utc(periodSelected).subtract(1, "month").format("YYYY-MM-DD");
  const [pastYear, pastMonth] = pastPeriod.split("-");
  const pastPeriodToDisplay = Months[parseInt(pastMonth)] + " " + pastYear;
  return pastPeriodToDisplay;
}
