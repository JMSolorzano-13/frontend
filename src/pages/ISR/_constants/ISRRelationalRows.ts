export const ISRRElationalRows = {
  "Compras y gastos facturas de contado": "CASH",
  "Compras y gastos CFDIs de pago": "PAYMENT",

  "Devoluciones, descuentos y bonificaciones facturadas": "DISCOUNTS",
  "Devoluciones, descuentos y bonificaciones en ingresos emitidos": "DISCOUNTS",
  "Devoluciones, descuentos y bonificaciones en egresos emitidos": "DISCOUNTS",

  "Compras y gastos no considerados en el pre-llenado": "EXCLUDED-PREFILLED",
  "No considerados en el pre-llenado: Ingresos PUE": "EXCLUDED-PREFILLED",
  "No considerados en el pre-llenado: Pagos": "EXCLUDED-PREFILLED",

  "Facturas de egresos recibidas por compras y gastos": "EGRESS",
  "Adquisiciones por concepto de inversiones": "INVESTMENTS",
} as const;

export const ISRRElationalRowsExpandable = {
  "Devoluciones, descuentos y bonificaciones en ingresos emitidos": "DISCOUNTS-INCOMES",
  "Devoluciones, descuentos y bonificaciones en egresos emitidos": "DISCOUNTS-EGRESS",

  "No considerados en el pre-llenado: Ingresos PUE": "EXCLUDED-PREFILLED-INCOMES",
  "No considerados en el pre-llenado: Pagos": "EXCLUDED-PREFILLED-PAYMENT",
} as const;
