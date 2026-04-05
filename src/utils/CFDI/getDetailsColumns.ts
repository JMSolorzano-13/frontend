import { CFDI_Types, Tables } from "@constants/Enums";
import expandedRowColumns from "./expandedRowColumns";
import expandedPaymentRowColumns from "./expandedPaymentRowColumns";
import expandedPayrollRowColumns from "./expandedPayrollRowColumns";
import {
  CFDI_INGRESS_DETAILS_COLUMNS,
  CFDI_PAYMENT_DETAILS_COLUMNS,
  CFDI_PAYROLL_DETAILS_COLUMNS,
} from "@constants/DefaultColumns";
import { useCColumns } from "@hooks/useCColumns";

export default function getDetailsColumns(tab: CFDI_Types, moduleID: string) {
  const [detailsPaymentColumns, setDetailsPaymentColumns] = useCColumns(
    expandedPaymentRowColumns(),
    moduleID === "issued"
      ? Tables.CFDI_PAYMENT_DETAILS_ISSUED
      : Tables.CFDI_PAYMENT_DETAILS_RECEIVED,
    CFDI_PAYMENT_DETAILS_COLUMNS
  );

  const [detailsPayrollColumns, setDetailsPayrollColumns] = useCColumns(
    expandedPayrollRowColumns(),
    moduleID === "issued"
      ? Tables.CFDI_PAYROLL_DETAILS_ISSUED
      : Tables.CFDI_PAYROLL_DETAILS_RECEIVED,
    CFDI_PAYROLL_DETAILS_COLUMNS
  );

  const [detailsColumns, setDetailsColumns] = useCColumns(
    expandedRowColumns(),
    moduleID === "issued"
      ? Tables.CFDI_INGRESS_DETAILS_ISSUED
      : Tables.CFDI_INGRESS_DETAILS_RECEIVED,
    CFDI_INGRESS_DETAILS_COLUMNS
  );

  if (tab === "P") {
    return {
      detailsExpandedColumns: expandedPaymentRowColumns,
      detailsTableId:
        moduleID === "issued"
          ? Tables.CFDI_PAYMENT_DETAILS_ISSUED
          : Tables.CFDI_PAYMENT_DETAILS_RECEIVED,
      detailsDefaultColumns: CFDI_PAYMENT_DETAILS_COLUMNS,
      detailsColumns: detailsPaymentColumns,
      setDetailsColumns: setDetailsPaymentColumns,
    };
  }
  if (tab === "N") {
    return {
      detailsExpandedColumns: expandedPayrollRowColumns,
      detailsTableId:
        moduleID === "issued"
          ? Tables.CFDI_PAYROLL_DETAILS_ISSUED
          : Tables.CFDI_PAYROLL_DETAILS_RECEIVED,
      detailsDefaultColumns: CFDI_PAYROLL_DETAILS_COLUMNS,
      detailsColumns: detailsPayrollColumns,
      setDetailsColumns: setDetailsPayrollColumns,
    };
  }
  if (tab === "I") {
    return {
      detailsExpandedColumns: expandedRowColumns,
      detailsTableId:
        moduleID === "issued"
          ? Tables.CFDI_INGRESS_DETAILS_ISSUED
          : Tables.CFDI_INGRESS_DETAILS_RECEIVED,
      detailsDefaultColumns: CFDI_INGRESS_DETAILS_COLUMNS,
      detailsColumns: detailsColumns,
      setDetailsColumns: setDetailsColumns,
    };
  }

  return {
    detailsExpandedColumns: () => [],
    detailsTableId: "",
    detailsDefaultColumns: [],
    detailsColumns: [],
    setDetailsColumns: () => null,
  };
}
