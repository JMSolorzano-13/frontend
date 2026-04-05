export const getNominalDataToRender = (data: {
  datos: Record<
    string,
    { vigentes: number; cancelados: number; subtotal_mxn: number; descuento_mxn: number }
  >;
  total: { vigentes: number; cancelados: number; subtotal_mxn: number; descuento_mxn: number };
}): NominalData[] => {
  const monthNames: Record<string, string> = {
    "1": "Enero",
    "2": "Febrero",
    "3": "Marzo",
    "4": "Abril",
    "5": "Mayo",
    "6": "Junio",
    "7": "Julio",
    "8": "Agosto",
    "9": "Septiembre",
    "10": "Octubre",
    "11": "Noviembre",
    "12": "Diciembre",
  };

  const { datos, total } = data;

  return [
    {
      mes: "Total anual",
      cancelados: total.cancelados,
      vigentes: total.vigentes,
      subtotal_mxn: total.subtotal_mxn,
      descuento_mxn: total.descuento_mxn,
      ingresos_netos: total.subtotal_mxn - total.descuento_mxn,
    },
    ...Object.entries(datos).map(([key, value]) => ({
      mes: monthNames[key],
      cancelados: value.cancelados,
      vigentes: value.vigentes,
      subtotal_mxn: value.subtotal_mxn,
      descuento_mxn: value.descuento_mxn,
      ingresos_netos: value.subtotal_mxn - value.descuento_mxn,
    })),
  ];
};
