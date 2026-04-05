export const generatePeriodTree = (date: string) => {
  const startDate = new Date(date);
  const currentDate = new Date();
  const startYear = startDate.getUTCFullYear();
  const currentYear = currentDate.getUTCFullYear();
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const generateYearObject = (year: number) => {
    const children = [];
    const startMonth = year === startYear ? startDate.getMonth() : 0;
    const endMonth = year === currentYear ? currentDate.getMonth() : 11;

    for (let month = endMonth; month >= startMonth; month--) {
      const monthStart = new Date(Date.UTC(year, month, 1)).toISOString();
      const monthEnd = new Date(Date.UTC(year, month + 1, 1)).toISOString();
      const yearStart = new Date(Date.UTC(year, 0, 1)).toISOString();

      children.push({
        title: `${year} - ${monthNames[month]}`,
        value: `${monthStart}|${monthEnd}|${yearStart}`,
      });
    }
    return {
      title: year.toString(),
      value: `${new Date(Date.UTC(year, 0, 1)).toISOString()}|${new Date(
        Date.UTC(year + 1, 0, 1)
      ).toISOString()}`,
      children,
    };
  };

  const periodTree = [];
  for (let year = currentYear; year >= startYear; year--) {
    periodTree.push(generateYearObject(year));
  }

  return periodTree;
};
