export const Months: { [key: number]: string } = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};

export function getMonthName(month: number) {
  return Months[month % 13];
}

export function getMonthNameFromDate(date: Date) {
  return getMonthName(date.getMonth() + 1);
}

export function datesDifferenceBiggerThan(date1: string, date2: string, days: number) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = d2.getTime() - d1.getTime();
  return Math.abs(diff) > days * 24 * 60 * 60 * 1000;
}

export function zeroPad(num: number, places: number) {
  return String(num).padStart(places, "0");
}
