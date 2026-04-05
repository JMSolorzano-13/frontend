import { CFDI_Types } from "@constants/Enums";
import { RecordType, PaymentRecordType } from "./columns";

const getTotalsRows = (
  totals: CFDIsTotals | CFDIPaymentTotals | null,
  tab?: CFDI_Types
): RecordType[] | PaymentRecordType[] | undefined => {
  if (!totals) return undefined;

  if (tab && tab === "P") {
    return getPaymentsTotalRows(totals as CFDIPaymentTotals);
  }

  const { filtered, excercise } = totals as CFDIsTotals;

  const period = {
    key: 1,
    tipo: "Periodo",
    subtotal: filtered.SubTotalMXN,
    neto: filtered.NetoMXN,
    trasladoIVA: filtered.TrasladosIVAMXN,
    trasladoIEPS: filtered.TrasladosIEPSMXN,
    trasladoISR: filtered.TrasladosISRMXN,
    retencionIVA: filtered.RetencionesIVAMXN,
    retencionIEPS: filtered.RetencionesIEPSMXN,
    retencionISR: filtered.RetencionesISRMXN,
    conteoCFDI: filtered.count,
    impuestoLocal: filtered.ImpuestosRetenidos,
    descuento: filtered.DescuentoMXN,
    total: filtered.TotalMXN ?? filtered.Total,
  };

  const accumulated = {
    key: 2,
    tipo: "Acumulado",
    subtotal: excercise.SubTotalMXN,
    neto: excercise.NetoMXN,
    trasladoIVA: excercise.TrasladosIVAMXN,
    trasladoIEPS: excercise.TrasladosIEPSMXN,
    trasladoISR: excercise.TrasladosISRMXN,
    retencionIVA: excercise.RetencionesIVAMXN,
    retencionIEPS: excercise.RetencionesIEPSMXN,
    retencionISR: excercise.RetencionesISRMXN,
    conteoCFDI: excercise.count,
    impuestoLocal: excercise.ImpuestosRetenidos,
    descuento: excercise.DescuentoMXN,
    total: excercise.TotalMXN ?? excercise.Total,
  };

  return [period, accumulated];
};

export const getPayrollTotalsRows = (data: PayrollTotals | null) => {
  if (!data || !data.excercise) return undefined;
  const period: PayrollTotalsTypeWithKey = {
    key: `p_filtered_01`,
    ...data.filtered,
  };

  const accumulated: PayrollTotalsTypeWithKey = {
    key: `p_exercise_01`,
    ...data.excercise,
  };

  return [period, accumulated];
};

const getPaymentsTotalRows = (totals: CFDIPaymentTotals) => {
  const { filtered, excercise } = totals;
  const period = {
    key: 1,
    tipo: "Periodo",
    count: filtered.count,
    PaymentRelatedCount: filtered.PaymentRelatedCount,
    BaseIVA16: filtered.BaseIVA16,
    IVATrasladado16: filtered.IVATrasladado16,
    BaseIVA8: filtered.BaseIVA8,
    IVATrasladado8: filtered.IVATrasladado8,
    BaseIVA0: filtered.BaseIVA0,
    IVATrasladado0: filtered.IVATrasladado0,
    BaseIVAExento: filtered.BaseIVAExento,
    TrasladosIVA: filtered.TrasladosIVA,
    RetencionesIVA: filtered.RetencionesIVA,
    RetencionesISR: filtered.RetencionesISR,
    RetencionesIEPS: filtered.RetencionesIEPS,
    Total: filtered.Total,
    total_docto_relacionados: filtered.total_docto_relacionados,
  };

  const accumulated = {
    key: 2,
    tipo: "Acumulado",
    count: excercise.count,
    PaymentRelatedCount: excercise.PaymentRelatedCount,
    BaseIVA16: excercise.BaseIVA16,
    IVATrasladado16: excercise.IVATrasladado16,
    BaseIVA8: excercise.BaseIVA8,
    IVATrasladado8: excercise.IVATrasladado8,
    BaseIVA0: excercise.BaseIVA0,
    IVATrasladado0: excercise.IVATrasladado0,
    BaseIVAExento: excercise.BaseIVAExento,
    TrasladosIVA: excercise.TrasladosIVA,
    RetencionesIVA: excercise.RetencionesIVA,
    RetencionesISR: excercise.RetencionesISR,
    RetencionesIEPS: excercise.RetencionesIEPS,
    Total: excercise.Total,
    total_docto_relacionados: excercise.total_docto_relacionados,
  };

  return [period, accumulated];
};

export default getTotalsRows;
