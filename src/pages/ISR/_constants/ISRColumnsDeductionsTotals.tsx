import { ColumnsType } from "antd/lib/table";
import { ISRTotalColumnsType } from "../_types/ISRTypes";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";

// {"ConteoCFDIs":123.123,"SubTotal":443.3312,"DescuentoMXN":48934.34,"NetoMXN":0,"RetencionesISRMXN":323.223}
export default function ISRTotalColumnsDeductionsTotals({ tab, internalTab }: ISRTotalColumnsType) {
  const allColumns: ColumnsType<any> = [
    {
      title: "Conteo de CFDIs",
      dataIndex: "ConteoCFDIs",
      key: "ConteoCFDIs",
    },
    {
      title: "Subtotal",
      dataIndex: "SubTotal",
      key: "SubTotal",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Descuentos",
      dataIndex: "DescuentoMXN",
      key: "DescuentoMXN",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Neto",
      dataIndex: "NetoMXN",
      key: "NetoMXN",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Retenciones ISR",
      dataIndex: "RetencionesISRMXN",
      key: "RetencionesISRMXN",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Base IVA 16",
      dataIndex: "BaseIVA16",
      key: "BaseIVA16",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Base IVA 8",
      dataIndex: "BaseIVA8",
      key: "BaseIVA8",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Base IVA 0",
      dataIndex: "BaseIVA0",
      key: "BaseIVA0",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Base IVA Exento",
      dataIndex: "BaseIVAExento",
      key: "BaseIVAExento",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Neto",
      dataIndex: "Neto",
      key: "Neto",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Retenciones ISR",
      dataIndex: "RetencionesISR",
      key: "RetencionesISR",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
  ];

  function getColumnsByTab(values: ISRTotalColumnsType) {
    const { tab, internalTab } = values;
    const columns = allColumns;
    const columnsToReturn = columns;
    if (tab === "PAYMENT") {
      return columnsToReturn.filter((column) => {
        if (column.key) {
          return [
            "ConteoCFDIs",
            "BaseIVA16",
            "BaseIVA8",
            "BaseIVA0",
            "BaseIVAExento",
            "Neto",
            "RetencionesISR",
          ].includes(String(column.key));
        }
      });
    } else if (internalTab !== "EXCLUDED-PREFILLED-PAYMENT") {
      return columnsToReturn.filter((column) => {
        if (column.key) {
          return [
            "ConteoCFDIs",
            "SubTotal",
            "DescuentoMXN",
            "NetoMXN",
            "RetencionesISRMXN",
          ].includes(String(column.key));
        }
      });
    } else {
      return columnsToReturn.filter((column) => {
        if (column.key) {
          return [
            "ConteoCFDIs",
            "BaseIVA16",
            "BaseIVA8",
            "BaseIVA0",
            "BaseIVAExento",
            "Neto",
            "RetencionesISR",
          ].includes(String(column.key));
        }
      });
    }
  }

  return getColumnsByTab({ tab, internalTab });
}
