import { Months } from "@utils/dateHelper";

export function managePeriodToDisplay(periodSelected: string, IsYearly: boolean) {
  let periodToDisplay = "";
  if (periodSelected) {
    const [year, month] = periodSelected.split("-");
    const monthNumber = parseInt(month);
    if (IsYearly) {
      periodToDisplay = year;
    } else {
      periodToDisplay = Months[monthNumber] + " " + year;
    }
  }
  return periodToDisplay;
}
