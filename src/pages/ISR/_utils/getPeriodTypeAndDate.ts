import moment from "moment";

export default function getPeriodTypeAndDate(periodDates: string | null) {
  if (periodDates) {
    const dateSplitted = periodDates?.split("|");
    const datesDifference = Math.abs(
      moment(dateSplitted[0]).diff(moment(dateSplitted[1]), "months")
    );
    return {
      periodType: datesDifference > 1 ? "year" : "month",
      selectedDate: dateSplitted[0],
    };
  }

  return {
    periodType: null,
    selectedDate: null,
  };
}
