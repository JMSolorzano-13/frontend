import { Months } from "@utils/dateHelper";

export default function getDatesAreEqual(
  currentSelectedDate: string | null,
  periodType: string | null
) {
  const currentPeriod = new URLSearchParams(location.search).get("period");

  if (currentSelectedDate) {
    const dateSplitted = currentSelectedDate.split("T")[0];
    const [year, month] = dateSplitted.split("-");
    const currentDate =
      periodType === "month" ? `${year}-${Months[parseInt(month)].toLowerCase()}` : `${year}`;
    if (currentDate === currentPeriod) {
      return true;
    } else {
      return false;
    }
  }
}
