import {
  CAT_FORMA_PAGO,
  CAT_FORMA_PAGO_BANCARIZADO,
  CAT_FORMA_PAGO_NO_BANCARIZADO,
  CAT_USO_CFDI,
  CAT_USO_CFDI_INVESTMENTS,
} from "../_constants/ISRColumnFilters";
import { InternalTabType, TabType } from "../_types/ISRTypes";

export function getFormaPagoFilter(tab: TabType, internalTab: InternalTabType) {
  if (
    tab === "PAYMENT" ||
    tab === "CASH" ||
    (tab === "EXCLUDED" && (internalTab === "CASH" || internalTab === "PAYMENT"))
  ) {
    /* Sólo es bancarizado en las pestañas: 
       "Facturas de contado", 
       "Pagos", 
       "No considerados ISR - Facturas de contado" y 
       "No considerados ISR - Pagos" 
    */
    return CAT_FORMA_PAGO_BANCARIZADO;
  } else if (
    (tab === "EXCLUDED-PREFILLED" &&
      (internalTab === "EXCLUDED-PREFILLED-PAYMENT" ||
        internalTab === "EXCLUDED-PREFILLED-INCOMES")) ||
    (tab === "EXCLUDED" && internalTab === "EXCLUDED-INCOMES-PUE") ||
    internalTab === "EXCLUDED-PAYMENTS"
  ) {
    /* Sólo es no bancarizado en las pestañas: 
       "No considerados pre-llenado - Ingresos PUE", 
       "No considerados pre-llenado - Pagos", 
       "No considerados ISR - No considerados pre-llenado - Ingresos PUE" y 
       "No considerados ISR - No considerados pre-llenado - Pagos" 
    */
    return CAT_FORMA_PAGO_NO_BANCARIZADO;
  } else {
    return CAT_FORMA_PAGO;
  }
}

export function getUsoCFDIFilter(tab: TabType) {
  if (tab === "INVESTMENTS") {
    return CAT_USO_CFDI_INVESTMENTS;
  }
  return CAT_USO_CFDI;
}
