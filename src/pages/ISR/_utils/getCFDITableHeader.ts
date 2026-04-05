import { TabType, InternalTabType } from '../_types/ISRTypes';

// | "ALL"
// | "CASH"
// | "PAYMENT"
// | "EXCLUDED"
// | "MOVED"
// | "EXCLUDED-PREFILLED"
// | "DISCOUNTS"
// | "EGRESS"
// | "INVESTMENTS";
export function getCFDITableHeaderDeductions(tab: TabType, internalTab: InternalTabType): string {
  const tabNameInternal = internalTab ? internalTab : tab;

  const CFDITableHeaders = {
    MOVED: "CFDIs reasignados de ISR",
    ALL: "Totales",
    CASH: "Facturas de contado",
    PAYMENT: `Pagos`,
    DISCOUNTS:
      tabNameInternal === "DISCOUNTS-INCOMES"
        ? "Devoluciones, descuentos y bonificaciones en ingresos emitidos"
        : "Devoluciones, descuentos y bonificaciones en egresos emitidos",
    EGRESS: " Egresos recibidos",
    INVESTMENTS: "Inversiones",
    "EXCLUDED-PREFILLED":
      tabNameInternal === "EXCLUDED-PREFILLED-INCOMES"
        ? "No considerados pre-llenado - Ingresos PUE"
        : "No considerados pre-llenado - Pagos",
    EXCLUDED:
      tabNameInternal === "CASH"
        ? "  Facturas de contado no considerados en el cálculo del ISR"
        : tabNameInternal === "PAYMENT"
          ? "  Pagos no considerados en el cálculo del ISR"
          : internalTab === "EXCLUDED-INCOMES"
            ? "  Devoluciones, descuentos y bonificaciones en ingresos emitidos no considerados en el cálculo del ISR"
            : internalTab === "EXCLUDED-EGRESS"
              ? "   Devoluciones, descuentos y bonificaciones en egresos emitidos no considerados en el cálculo del ISR"
              : internalTab === "EXCLUDED-INCOMES-PUE"
                ? "   No considerados pre-llenado - Ingresos PUE no considerados en el cálculo del ISR"
                : internalTab === "EXCLUDED-PAYMENTS"
                  ? "  No considerados pre-llenado - Pagos no considerados en el cálculo del ISR"
                  : internalTab === "EGRESS"
                    ? "   Egresos Recibidos no considerados en el cálculo del ISR"
                    : "",

  };

  return CFDITableHeaders[tab] ?? "CFDIs";
}

export function getCFDITableHeader(tab: TabType): string {

  const CFDITableHeaders = {
    ALL: "CFDIs",
    CASH: "CFDIs",
    PAYMENT: "CFDIs",
    EXCLUDED: "CFDIs no considerados en el cálculo del ISR",
    MOVED: "CFDIs reasignados de ISR",
    "EXCLUDED-PREFILLED": "No considerados pre-llenado",
    DISCOUNTS: "Dev., desctos. y bonif. emitidos dddd",
    EGRESS: "Egresos recibidos",
    INVESTMENTS: "Inversiones",

  };

  return CFDITableHeaders[tab] ?? "CFDIs";
}
