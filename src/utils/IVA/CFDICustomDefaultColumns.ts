import {
  CFDI_EGRESS_ISSUED_DEFAULT_COLUMNS,
  CFDI_EGRESS_RECEIVED_DEFAULT_COLUMNS,
  CFDI_INGRESS_ISSUED_DEFAULT_COLUMNS,
  CFDI_INGRESS_RECEIVED_DEFAULT_COLUMNS,
  CFDI_ISSUED_DEFAULT_COLUMNS,
  CFDI_PAYMENT_ISSUED_DEFAULT_COLUMNS,
  CFDI_PAYMENT_RECEIVED_DEFAULT_COLUMNS,
  CFDI_PAYROLL_ISSUED_DEFAULT_COLUMNS,
  CFDI_PAYROLL_RECEIVED_DEFAULT_COLUMNS,
  CFDI_RECEIVED_DEFAULT_COLUMNS,
} from "@constants/DefaultColumns";
import { CFDI_Types } from "@constants/Enums";
import { useBasicPlan } from "@hooks/useBasicPlan";
import { IS_SIIGO } from "@utils/SIIGO/Global";

const defaultIssuedColumnsPerTab = {
  I: CFDI_INGRESS_ISSUED_DEFAULT_COLUMNS,
  E: CFDI_EGRESS_ISSUED_DEFAULT_COLUMNS,
  T: CFDI_ISSUED_DEFAULT_COLUMNS,
  N: CFDI_PAYROLL_ISSUED_DEFAULT_COLUMNS,
  P: CFDI_PAYMENT_ISSUED_DEFAULT_COLUMNS,
};

export function getDefaultIssuedColumns(tab: CFDI_Types): TableLayout {
  const { isDownloadPlan } = useBasicPlan();

  if (isDownloadPlan && tab === "I" && IS_SIIGO) {
    return defaultIssuedColumnsPerTab.I.filter((tab) => tab.column !== 'paid_by.UUID' && tab.column !== 'active_egresos.Total' && tab.column !== 'balance' && tab.column !== 'cfdi_related.uuid_origin')
  }

  return defaultIssuedColumnsPerTab[tab];
}

const defaultReceivedColumnsPerTab = {
  I: CFDI_INGRESS_RECEIVED_DEFAULT_COLUMNS,
  E: CFDI_EGRESS_RECEIVED_DEFAULT_COLUMNS,
  T: CFDI_RECEIVED_DEFAULT_COLUMNS,
  N: CFDI_PAYROLL_RECEIVED_DEFAULT_COLUMNS,
  P: CFDI_PAYMENT_RECEIVED_DEFAULT_COLUMNS,
};

export function getDefaultReceivedColumns(tab: CFDI_Types): TableLayout {
  const { isDownloadPlan } = useBasicPlan();

  if (isDownloadPlan && tab === "I" && IS_SIIGO) {
    return defaultReceivedColumnsPerTab.I.filter((tab) => tab.column !== 'paid_by.UUID' && tab.column !== ' active_egresos.Total' && tab.column !== 'balance' && tab.column !== 'cfdi_related.uuid_origin')
  }

  return defaultReceivedColumnsPerTab[tab];
}
