export const formatWidgetDate = (input: string): string => {
  const meses: Record<string, string> = {
    enero: "01",
    febrero: "02",
    marzo: "03",
    abril: "04",
    mayo: "05",
    junio: "06",
    julio: "07",
    agosto: "08",
    septiembre: "09",
    octubre: "10",
    noviembre: "11",
    diciembre: "12",
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

  if (input.includes("-")) {
    const [anio, mesTexto] = input.split("-");
    const mes = meses[mesTexto.toLowerCase()];
    return `${anio}-${mes}-01`;
  }

  if (Number(input) === currentYear) {
    return `${input}-${currentMonth}-01`;
  }

  return `${input}-12-01`;
};
