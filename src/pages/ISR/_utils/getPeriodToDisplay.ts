import { getMonthName } from "@utils/dateHelper";

export default function getPeriodToDisplay(date: string | null, periodType: string | null) {
  let periodDate = "";
  let exerciseDate = "";

  if (date) {
    const periodSplitted = date.split("-");

    if (periodType === "month") {
      const month = getMonthName(Number(periodSplitted[1]));
      periodDate = `${month} ${periodSplitted[0]}`;
      exerciseDate = periodSplitted[0];
    }

    if (periodType === "year") {
      periodDate = "";
      exerciseDate = periodSplitted[0];
    }
  }

  return { periodDate, exerciseDate };
}
