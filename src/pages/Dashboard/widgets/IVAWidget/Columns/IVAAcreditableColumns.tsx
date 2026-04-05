import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/es/table";

export default function IVAAcreditableColumns() {
  const TOTALS_STYLE = { fontWeight: "bold", padding: "4px 0px" };

  const renderCell = (val: any, record: IvaAcreditableWidget, formatter?: (value: any) => any) => {
    if (record.mes === "Totales") {
      return (
        <p style={TOTALS_STYLE}>
          {formatter ? formatter(val) : <span className="hover:text-primary">{val}</span>}
        </p>
      );
    }
    return formatter ? formatter(val) : <span className="hover:text-primary">{val}</span>;
  };

  const IVAAcreditableColumns: ColumnsType<IvaAcreditableWidget> = [
    {
      title: "Mes",
      dataIndex: "mes",
      key: "mes",
      render: (val, record) => renderCell(val, record, undefined),
      width: 90,
    },
    {
      title: "Conteo CFDIs",
      dataIndex: "conteo_cfdis",
      key: "conteo_cfdis",
      width: 110,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.COMMAS)),
    },
    {
      title: "Base 16%",
      dataIndex: "base_16",
      key: "base_16",
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
      width: 120,
    },
    {
      title: "Base 8%",
      dataIndex: "base_8",
      key: "base_8",
      width: 110,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "Base 0%",
      dataIndex: "base_0",
      key: "base_0",
      width: 110,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "Base Exento",
      dataIndex: "base_exento",
      key: "base_exento",
      width: 110,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "IVA 16%",
      dataIndex: "acreditable_16",
      key: "acreditable_16",
      width: 110,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "IVA 8%",
      dataIndex: "acreditable_8",
      key: "acreditable_8",
      width: 110,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "IVA total",
      dataIndex: "acreditable_total",
      key: "acreditable_total",
      width: 120,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "Retenciones IVA",
      dataIndex: "retenciones_iva",
      key: "retenciones_iva",
      width: 120,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
  ];

  return IVAAcreditableColumns;
}
