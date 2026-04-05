export default function getPeriodToSend(periodType: string | null, selectedDate: string | null) {
  // const initialDate = selectedDate ? selectedDate.split("T")[0] : "-";
  let periodToSend = selectedDate;
  if (periodType === "month") {
    periodToSend = selectedDate?.split("T")[0] ?? null;
  } else {
    periodToSend = `${periodToSend?.split("-")[0]}-12-01`;
  }
  return periodToSend;
}
