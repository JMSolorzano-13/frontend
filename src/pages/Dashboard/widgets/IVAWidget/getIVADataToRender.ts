const monthNames: Record<string, string> = {
  "01": "Enero",
  "02": "Febrero",
  "03": "Marzo",
  "04": "Abril",
  "05": "Mayo",
  "06": "Junio",
  "07": "Julio",
  "08": "Agosto",
  "09": "Septiembre",
  "10": "Octubre",
  "11": "Noviembre",
  "12": "Diciembre",
};

export const getIVAPeriodData = (report: IVAWidgetData, rfc: string): IvaPeriodWidget[] => {
  const isRFCMoral = rfc && rfc.length === 12;

  const periodData = Object.entries(report)
    .sort(([monthA], [monthB]) => parseInt(monthA) - parseInt(monthB))
    .map(([month, data]) => {
      const cred = data.period.creditable;
      const tran = data.period.transferred;

      return {
        mes: monthNames[month] ?? month,
        iva_trasladado: tran.total,
        iva_acreditado: cred.total,
        iva_a_cargo: data.period.diff,
        retenciones_iva: isRFCMoral
          ? cred.i_tra.RetencionesIVAMXN + cred.p_tra.RetencionesIVAMXN
          : tran.i_tra.RetencionesIVAMXN + tran.p_tra.RetencionesIVAMXN,
      };
    });

  const totales = periodData.reduce<IvaPeriodWidget>(
    (acc, curr) => ({
      mes: "Totales",
      iva_trasladado: acc.iva_trasladado + curr.iva_trasladado,
      iva_acreditado: acc.iva_acreditado + curr.iva_acreditado,
      iva_a_cargo: acc.iva_a_cargo + curr.iva_a_cargo,
      retenciones_iva: acc.retenciones_iva + curr.retenciones_iva,
    }),
    {
      mes: "Totales",
      iva_trasladado: 0,
      iva_acreditado: 0,
      iva_a_cargo: 0,
      retenciones_iva: 0,
    }
  );

  return [totales, ...periodData];
};

export const getIVATrasladadoData = (report: IVAWidgetData): IvaTrasladadoWidget[] => {
  const periodData = Object.entries(report)
    .sort(([monthA], [monthB]) => parseInt(monthA) - parseInt(monthB))
    .map(([month, data]) => {
      const tran = data.period.transferred;
      return {
        mes: monthNames[month] ?? month,
        conteo_cfdis: tran.i_tra.qty + tran.p_tra.qty,
        base_16: tran.i_tra.BaseIVA16 + tran.p_tra.BaseIVA16,
        base_8: tran.i_tra.BaseIVA8 + tran.p_tra.BaseIVA8,
        base_0: tran.i_tra.BaseIVA0 + tran.p_tra.BaseIVA0,
        base_exento: tran.i_tra.BaseIVAExento + tran.p_tra.BaseIVAExento,
        trasladado_16: tran.i_tra.IVATrasladado16 + tran.p_tra.IVATrasladado16,
        trasladado_8: tran.i_tra.IVATrasladado8 + tran.p_tra.IVATrasladado8,
        trasladado_total: tran.i_tra.total + tran.p_tra.total,
        retenciones_iva: tran.i_tra.RetencionesIVAMXN + tran.p_tra.RetencionesIVAMXN,
      };
    });

  const totales = periodData.reduce(
    (acc, curr) => {
      acc.conteo_cfdis += curr.conteo_cfdis;
      acc.base_16 += curr.base_16;
      acc.base_8 += curr.base_8;
      acc.base_0 += curr.base_0;
      acc.base_exento += curr.base_exento;
      acc.trasladado_16 += curr.trasladado_16;
      acc.trasladado_8 += curr.trasladado_8;
      acc.trasladado_total += curr.trasladado_total;
      acc.retenciones_iva += curr.retenciones_iva;
      return acc;
    },
    {
      mes: "Totales",
      conteo_cfdis: 0,
      base_16: 0,
      base_8: 0,
      base_0: 0,
      base_exento: 0,
      trasladado_16: 0,
      trasladado_8: 0,
      trasladado_total: 0,
      retenciones_iva: 0,
    }
  );

  return [totales, ...periodData];
};

export const getIVAAcreditableData = (report: IVAWidgetData): IvaAcreditableWidget[] => {
  const periodData = Object.entries(report)
    .sort(([monthA], [monthB]) => parseInt(monthA) - parseInt(monthB))
    .map(([month, data]) => {
      const cred = data.period.creditable;
      return {
        mes: monthNames[month] ?? month,
        conteo_cfdis: cred.i_tra.qty + cred.p_tra.qty,
        base_16: cred.i_tra.BaseIVA16 + cred.p_tra.BaseIVA16,
        base_8: cred.i_tra.BaseIVA8 + cred.p_tra.BaseIVA8,
        base_0: cred.i_tra.BaseIVA0 + cred.p_tra.BaseIVA0,
        base_exento: cred.i_tra.BaseIVAExento + cred.p_tra.BaseIVAExento,
        acreditable_16: cred.i_tra.IVATrasladado16 + cred.p_tra.IVATrasladado16,
        acreditable_8: cred.i_tra.IVATrasladado8 + cred.p_tra.IVATrasladado8,
        acreditable_total: cred.i_tra.total + cred.p_tra.total,
        retenciones_iva: cred.i_tra.RetencionesIVAMXN + cred.p_tra.RetencionesIVAMXN,
      };
    });

  const totales = periodData.reduce(
    (acc, curr) => {
      acc.conteo_cfdis += curr.conteo_cfdis;
      acc.base_16 += curr.base_16;
      acc.base_8 += curr.base_8;
      acc.base_0 += curr.base_0;
      acc.base_exento += curr.base_exento;
      acc.acreditable_16 += curr.acreditable_16;
      acc.acreditable_8 += curr.acreditable_8;
      acc.acreditable_total += curr.acreditable_total;
      acc.retenciones_iva += curr.retenciones_iva;
      return acc;
    },
    {
      mes: "Totales",
      conteo_cfdis: 0,
      base_16: 0,
      base_8: 0,
      base_0: 0,
      base_exento: 0,
      acreditable_16: 0,
      acreditable_8: 0,
      acreditable_total: 0,
      retenciones_iva: 0,
    }
  );

  return [totales, ...periodData];
};
