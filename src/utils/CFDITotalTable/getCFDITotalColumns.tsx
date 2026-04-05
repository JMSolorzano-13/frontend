import {
  CFDI_PAYMENTS_TOTALS_COLUMNS,
  CFDI_TOTALS_DEFAULT_COLUMNS,
  CFDI_TOTALS_PAYROLL_COLUMNS,
} from "@constants/DefaultColumns";
import { CFDI_Types, Tables } from "@constants/Enums";
import { useCColumns } from "@hooks/useCColumns";
import payrollTotalColumns from "@utils/CFDI/PayrollTotalColumns";
import columns, { paymentsColumns } from "@utils/CFDI/columns";

const defaultTotalColumns = columns;

export default function getCFDITotalColumns(tab: CFDI_Types, module: CFDIModule) {
  const issuedColumnOptions = {
    I: useCColumns(defaultTotalColumns, Tables.CFDI_ISSUED_TOTALS, CFDI_TOTALS_DEFAULT_COLUMNS),
    E: useCColumns(defaultTotalColumns, Tables.CFDI_ISSUED_TOTALS, CFDI_TOTALS_DEFAULT_COLUMNS),
    T: useCColumns(defaultTotalColumns, Tables.CFDI_ISSUED_TOTALS, CFDI_TOTALS_DEFAULT_COLUMNS),
    N: useCColumns(
      payrollTotalColumns,
      Tables.CFDI_ISSUED_PAYROLL_TOTALS,
      CFDI_TOTALS_PAYROLL_COLUMNS
    ),
    P: useCColumns(
      paymentsColumns,
      Tables.CFDI_ISSUED_PAYMENT_TOTALS,
      CFDI_PAYMENTS_TOTALS_COLUMNS
    ),
  };

  const receivedColumnOptions = {
    I: useCColumns(defaultTotalColumns, Tables.CFDI_RECEIVED_TOTALS, CFDI_TOTALS_DEFAULT_COLUMNS),
    E: useCColumns(defaultTotalColumns, Tables.CFDI_RECEIVED_TOTALS, CFDI_TOTALS_DEFAULT_COLUMNS),
    T: useCColumns(defaultTotalColumns, Tables.CFDI_RECEIVED_TOTALS, CFDI_TOTALS_DEFAULT_COLUMNS),
    N: useCColumns(
      payrollTotalColumns,
      Tables.CFDI_RECEIVED_PAYROLL_TOTALS,
      CFDI_TOTALS_PAYROLL_COLUMNS
    ),
    P: useCColumns(
      paymentsColumns,
      Tables.CFDI_RECEIVED_PAYMENT_TOTALS,
      CFDI_PAYMENTS_TOTALS_COLUMNS
    ),
  };
  let columns;
  if (module === "issued") {
    [columns] = issuedColumnOptions[tab];
  } else if (module === "received") {
    [columns] = receivedColumnOptions[tab];
  }
  return columns;
}

export function getCFDIPayrollColumns(module: CFDIModule) {
  const issued = useCColumns<PayrollTotalsTypeWithKey>(
    payrollTotalColumns,
    Tables.CFDI_ISSUED_PAYROLL_TOTALS,
    CFDI_TOTALS_PAYROLL_COLUMNS
  );

  const received = useCColumns<PayrollTotalsTypeWithKey>(
    payrollTotalColumns,
    Tables.CFDI_RECEIVED_PAYROLL_TOTALS,
    CFDI_TOTALS_PAYROLL_COLUMNS
  );

  let columns;
  if (module === "issued") {
    [columns] = issued;
  } else {
    [columns] = received;
  }
  return columns;
}
