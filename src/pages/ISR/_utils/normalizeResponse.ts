import { TabTotalsResponseRow, TabTotalsResponseRowBefore } from "../_types/ISRTypes";

const ORDERED_CONCEPTS = [
  "Gastos de nómina gravada",
  "Gastos de nómina exenta",
  "Gastos de nómina exenta deducible",
  "Gastos de nómina deducibles",
  "Compras y gastos facturas de contado",
  "Compras y gastos CFDIs de pago",
  "Devoluciones, descuentos y bonificaciones facturadas",
  "Compras y gastos no considerados en el pre-llenado",
  "Facturas de egresos recibidas por compras y gastos",
  "Compras y gastos",
  "Deducciones autorizadas sin inversiones",
  "Adquisiciones por concepto de inversiones",
];

const conceptos: Record<string, string> = {
  "gastos de nomina gravada": "Gastos de nómina gravada",
  "gastos de nomina exenta": "Gastos de nómina exenta",
  "gastos de nomina exenta deducible": "Gastos de nómina exenta deducible",
  "gastos de nomina deducibles": "Gastos de nómina deducibles",
  "compras y gastos facturas de contado": "Compras y gastos facturas de contado",
  "compras y gastos cfdi de pagos": "Compras y gastos CFDIs de pago",
  "devoluciones, descuentos y bonificaciones facturadas":
    "Devoluciones, descuentos y bonificaciones facturadas",
  "devoluciones, descuentos y bonificaciones en ingresos emitidos":
    "Devoluciones, descuentos y bonificaciones en ingresos emitidos",
  "devoluciones, descuentos y bonificaciones en egresos emitidos":
    "Devoluciones, descuentos y bonificaciones en egresos emitidos",
  "compras y gastos": "Compras y gastos",
  "compras y gastos no considerados en el pre llenado":
    "Compras y gastos no considerados en el pre-llenado",
  "no considerados en el pre llenado ingresos pue":
    "No considerados en el pre-llenado: Ingresos PUE",
  "no considerados en el pre llenado pagos": "No considerados en el pre-llenado: Pagos",
  "adquisiciones por concepto de inversiones": "Adquisiciones por concepto de inversiones",
  "deducciones autorizadas (sin inversiones)": "Deducciones autorizadas sin inversiones",
  "facturas de egresos recibidas por compras y gastos":
    "Facturas de egresos recibidas por compras y gastos",
};

const checkConcept = (concepto: string): string => {
  const clave = concepto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return conceptos[clave] || concepto;
};

export const normalizeResponse = (data: TabTotalsResponseRowBefore[]): TabTotalsResponseRow[] => {
  const normalized = data.map((row) => {
    const conceptoCorregido = checkConcept(row.Concepto);

    const isPlus =
      conceptoCorregido === "Gastos de nómina gravada" ||
      conceptoCorregido === "Gastos de nómina exenta deducible" ||
      conceptoCorregido === "Compras y gastos facturas de contado" ||
      conceptoCorregido === "Compras y gastos CFDIs de pago" ||
      conceptoCorregido === "Devoluciones, descuentos y bonificaciones facturadas" ||
      conceptoCorregido === "Compras y gastos no considerados en el pre-llenado";

    const isNeutral =
      conceptoCorregido === "Gastos de nómina exenta" ||
      conceptoCorregido === "Adquisiciones por concepto de inversiones";

    const isBlack =
      conceptoCorregido === "Gastos de nómina deducibles" ||
      conceptoCorregido === "Compras y gastos" ||
      conceptoCorregido === "Deducciones autorizadas sin inversiones";

    const isEqual = isBlack;

    return {
      concepto: conceptoCorregido,
      conteoCFDIs: row.ConteoCFDIs,
      importe: row.Importe,
      deducible: row.porcentaje,
      isr_cargo: row.isr_cargo,
      concepts: row.concepts ? normalizeConcepts(row.concepts) : undefined,
      isEqual,
      isPlus,
      isNeutral,
      isBlack,
    };
  });

  return ORDERED_CONCEPTS.flatMap((key) => normalized.filter((item) => item.concepto === key));
};

export const normalizeConcepts = (data: TabTotalsResponseRowBefore[]): TabTotalsResponseRow[] => {
  return data.map((row) => {
    const conceptoCorregido = checkConcept(row.Concepto);

    const isPlus =
      conceptoCorregido === "Gastos de nómina gravada" ||
      conceptoCorregido === "Gastos de nómina exenta deducible" ||
      conceptoCorregido === "Compras y gastos facturas de contado" ||
      conceptoCorregido === "Compras y gastos CFDIs de pago" ||
      conceptoCorregido === "Devoluciones, descuentos y bonificaciones facturadas" ||
      conceptoCorregido === "Compras y gastos no considerados en el pre-llenado";

    const isNeutral =
      conceptoCorregido === "Gastos de nómina exenta" ||
      conceptoCorregido === "Adquisiciones por concepto de inversiones";

    const isBlack =
      conceptoCorregido === "Gastos de nómina deducibles" ||
      conceptoCorregido === "Compras y gastos" ||
      conceptoCorregido === "Deducciones autorizadas sin inversiones";

    const isEqual = isBlack;

    return {
      concepto: conceptoCorregido,
      conteoCFDIs: row.ConteoCFDIs,
      importe: row.Importe,
      deducible: row.porcentaje,
      isr_cargo: row.isr_cargo,
      isEqual,
      isPlus,
      isNeutral,
      isBlack,
    };
  });
};


export const normalizeExcludedResponse = (
  data: { Concepto: string; ConteoCFDIs: number }[]
): TabTotalsResponseRow[] => {
  return data.map((row) => {
    const conceptoCorregido = checkConcept(row.Concepto);

    const isPlus =
      conceptoCorregido === "Gastos de nómina gravada" ||
      conceptoCorregido === "Gastos de nómina exenta deducible" ||
      conceptoCorregido === "Compras y gastos facturas de contado" ||
      conceptoCorregido === "Compras y gastos CFDIs de pago" ||
      conceptoCorregido === "Devoluciones, descuentos y bonificaciones facturadas" ||
      conceptoCorregido === "Compras y gastos no considerados en el pre-llenado";

    const isNeutral =
      conceptoCorregido === "Gastos de nómina exenta" ||
      conceptoCorregido === "Adquisiciones por concepto de inversiones";

    const isBlack =
      conceptoCorregido === "Gastos de nómina deducibles" ||
      conceptoCorregido === "Compras y gastos" ||
      conceptoCorregido === "Deducciones autorizadas sin inversiones";

    const isEqual = isBlack;

    return {
      concepto: conceptoCorregido,
      conteoCFDIs: row.ConteoCFDIs,
      importe: undefined,
      deducible: undefined,
      isr_cargo: undefined,
      concepts: undefined,
      isEqual,
      isPlus,
      isNeutral,
      isBlack,
    };
  });
};