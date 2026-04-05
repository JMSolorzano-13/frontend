import { ResponseTotalsDeductionsComplete } from "../_types/ISRTypes";

export default function getCurrentDataDeductions(data: ResponseTotalsDeductionsComplete | null) {
  const excluded_prefilled = data
    ? data.totals_table.find(
        (value) => value.concepto === "Compras y gastos no considerados en el pre-llenado"
      )
    : null;

  const discounts = data
    ? data.totals_table.find(
        (value) => value.concepto === "Devoluciones, descuentos y bonificaciones facturadas"
      )
    : null;

  return {
    cash: data
      ? data.totals_table.find((value) => value.concepto === "Compras y gastos facturas de contado")
          ?.conteoCFDIs
      : 0,
    payments: data
      ? data.totals_table.find((value) => value.concepto === "Compras y gastos CFDIs de pago")
          ?.conteoCFDIs
      : 0,
    discounts: discounts ? discounts.conteoCFDIs : 0,
    discounts_incomes: discounts?.concepts
      ? discounts?.concepts.find(
          (value) =>
            value.concepto === "Devoluciones, descuentos y bonificaciones en ingresos emitidos"
        )?.conteoCFDIs
      : 0,
    discounts_egress: discounts?.concepts
      ? discounts?.concepts.find(
          (value) =>
            value.concepto === "Devoluciones, descuentos y bonificaciones en egresos emitidos"
        )?.conteoCFDIs
      : 0,
    excluded_prefilled: excluded_prefilled ? excluded_prefilled.conteoCFDIs : 0,
    excluded_prefilled_incomes: excluded_prefilled?.concepts
      ? excluded_prefilled?.concepts.find(
          (value) => value.concepto === "No considerados en el pre-llenado: Ingresos PUE"
        )?.conteoCFDIs
      : 0,
    excluded_prefilled_payments: excluded_prefilled?.concepts
      ? excluded_prefilled?.concepts.find(
          (value) => value.concepto === "No considerados en el pre-llenado: Pagos"
        )?.conteoCFDIs
      : 0,
    egress: data
      ? data.totals_table.find(
          (value) => value.concepto === "Facturas de egresos recibidas por compras y gastos"
        )?.conteoCFDIs
      : 0,
    investments: data
      ? data.totals_table.find(
          (value) => value.concepto === "Adquisiciones por concepto de inversiones"
        )?.conteoCFDIs
      : 0,
    excluded_tab_cash: data
      ? data.totals_table_excluded.find(
          (value) => value.concepto === "Compras y gastos facturas de contado"
        )?.conteoCFDIs
      : 0,
    excluded_tab_payment: data
      ? data.totals_table_excluded.find(
          (value) => value.concepto === "Compras y gastos CFDIs de pago"
        )?.conteoCFDIs
      : 0,
    excluded_tab_incomes: data
      ? data.totals_table_excluded.find(
          (value) =>
            value.concepto === "Devoluciones, descuentos y bonificaciones en ingresos emitidos"
        )?.conteoCFDIs
      : 0,
    excluded_tab_excluded_egress: data
      ? data.totals_table_excluded.find(
          (value) =>
            value.concepto === "Devoluciones, descuentos y bonificaciones en egresos emitidos"
        )?.conteoCFDIs
      : 0,
    excluded_tab_incomes_pue: data
      ? data.totals_table_excluded.find(
          (value) => value.concepto === "No considerados en el pre-llenado: Ingresos PUE"
        )?.conteoCFDIs
      : 0,
    excluded_tab_excluded_payment: data
      ? data.totals_table_excluded.find(
          (value) => value.concepto === "No considerados en el pre-llenado: Pagos"
        )?.conteoCFDIs
      : 0,
    excluded_tab_egress: data
      ? data.totals_table_excluded.find(
          (value) => value.concepto === "Facturas de egresos recibidas por compras y gastos"
        )?.conteoCFDIs
      : 0,
    excluded: [
      data?.totals_table_excluded.find(
        (value) =>
          value.concepto === "Devoluciones, descuentos y bonificaciones en ingresos emitidos"
      )?.conteoCFDIs ?? 0,

      data?.totals_table_excluded.find(
        (value) =>
          value.concepto === "Devoluciones, descuentos y bonificaciones en egresos emitidos"
      )?.conteoCFDIs ?? 0,

      data?.totals_table_excluded.find(
        (value) => value.concepto === "No considerados en el pre-llenado: Ingresos PUE"
      )?.conteoCFDIs ?? 0,

      data?.totals_table_excluded.find(
        (value) => value.concepto === "No considerados en el pre-llenado: Pagos"
      )?.conteoCFDIs ?? 0,

      data?.totals_table_excluded.find(
        (value) => value.concepto === "Compras y gastos facturas de contado"
      )?.conteoCFDIs ?? 0,

      data?.totals_table_excluded.find(
        (value) => value.concepto === "Compras y gastos CFDIs de pago"
      )?.conteoCFDIs ?? 0,

      data?.totals_table_excluded.find(
        (value) => value.concepto === "Facturas de egresos recibidas por compras y gastos"
      )?.conteoCFDIs ?? 0,
    ].reduce((sum, current) => sum + current, 0),
  };
}
