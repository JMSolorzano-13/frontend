import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/es/table";

export default function IVATrasladadoColumns() {
  const TOTALS_STYLE = { fontWeight: "bold", padding: "4px 0px" };

  const renderCell = (val: any, record: IvaTrasladadoWidget, formatter?: (value: any) => any) => {
    if (record.mes === "Totales") {
      return (
        <p style={TOTALS_STYLE}>
          {formatter ? formatter(val) : <span className="hover:text-primary">{val}</span>}
        </p>
      );
    }
    return formatter ? formatter(val) : <span className="hover:text-primary">{val}</span>;
  };

  const IVATrasladadoColumns: ColumnsType<IvaTrasladadoWidget> = [
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
      dataIndex: "trasladado_16",
      key: "trasladado_16",
      width: 110,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "IVA 8%",
      dataIndex: "trasladado_8",
      key: "trasladado_8",
      width: 110,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "IVA total",
      dataIndex: "trasladado_total",
      key: "trasladado_total",
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

  return IVATrasladadoColumns;
}
