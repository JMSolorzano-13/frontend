import React from "react";
import { ColumnsType } from "antd/lib/table";
import { SorterResult } from "antd/lib/table/interface";
import { CFDI_Types, Tables } from "@constants/Enums";
import getDataColumns from "@utils/CFDI/dataColumns";
import { useCColumns } from "../useCColumns";
import payrollDataColumns from "@utils/CFDI/payrollColumns";
import { UpdateUUIDsType } from "@pages/IVA/_types/StateTypes";
import { GlobalToken } from "antd";
import { IS_SIIGO } from "@utils/SIIGO/Global";

export default function useCFDICColumns(
  module: CFDIModule,
  defaultColumns: TableLayout,
  sorter: SorterResult<CFDI>[],
  tab: CFDI_Types,
  token: GlobalToken,
  setUUIDsToModify?: (state: UpdateUUIDsType) => void,
  uuidsToModify?: UpdateUUIDsType
): {
  [key: string]: {
    columns: ColumnsType<CFDI>;
    setColumns: React.Dispatch<React.SetStateAction<ColumnsType<CFDI>>>;
    tableId: string;
  };
} {
  let ingressTable = Tables.CFDI_ISSUED_INGRESS;
  let egressTable = Tables.CFDI_ISSUED_EGRESS;
  let transferTable = Tables.CFDI_ISSUED_TRANSFER;
  let payrollTable = Tables.CFDI_ISSUED_PAYROLL;
  let paymentTable = Tables.CFDI_ISSUED_PAYMENT;
  if (module === "received") {
    ingressTable = IS_SIIGO ? Tables.SIIGO_CFDI_RECEIVED_INGRESS : Tables.CFDI_RECEIVED_INGRESS;
    egressTable = Tables.CFDI_RECEIVED_EGRESS;
    transferTable = Tables.CFDI_RECEIVED_TRANSFER;
    payrollTable = Tables.CFDI_RECEIVED_PAYROLL;
    paymentTable = Tables.CFDI_RECEIVED_PAYMENT;
  } else if (module === "efos") {
    ingressTable = Tables.CFDI_EFOS_INGRESS;
    egressTable = Tables.CFDI_EFOS_EGRESS;
    transferTable = Tables.CFDI_EFOS_TRANSFER;
    payrollTable = Tables.CFDI_EFOS_PAYROLL;
    paymentTable = Tables.CFDI_EFOS_PAYMENT;
  }

  const [ingressColumns, setIngressColumns] = useCColumns(
    getDataColumns({ module, sorter, tab, setUUIDsToModify, uuidsToModify, token }),
    ingressTable,
    defaultColumns
  );

  const [egressColumns, setEgressColumns] = useCColumns(
    getDataColumns({ module, sorter, tab, token }),
    egressTable,
    defaultColumns
  );

  const [transferColumns, setTransferColumns] = useCColumns(
    getDataColumns({ module, sorter, tab, token }),
    transferTable,
    defaultColumns
  );

  const [payrollColumns, setPayrollColumns] = useCColumns(
    payrollDataColumns({ module, sorter, tab }),
    payrollTable,
    defaultColumns
  );

  const [paymentColumns, setPaymentColumns] = useCColumns(
    getDataColumns({ module, sorter, tab, token }),
    paymentTable,
    defaultColumns
  );

  return {
    I: {
      columns: ingressColumns,
      setColumns: setIngressColumns,
      tableId: ingressTable,
    },
    E: {
      columns: egressColumns,
      setColumns: setEgressColumns,
      tableId: egressTable,
    },
    T: {
      columns: transferColumns,
      setColumns: setTransferColumns,
      tableId: transferTable,
    },
    N: {
      columns: payrollColumns,
      setColumns: setPayrollColumns,
      tableId: payrollTable,
    },
    P: {
      columns: paymentColumns,
      setColumns: setPaymentColumns,
      tableId: paymentTable,
    },
  };
}
