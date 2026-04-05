import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/es/table";

export default function IVAPeriodColumns() {
  const TOTALS_STYLE = { fontWeight: "bold", padding: "4px 0px" };

  const renderCell = (val: any, record: IvaPeriodWidget, formatter?: (value: any) => any) => {
    if (record.mes === "Totales") {
      return (
        <p style={TOTALS_STYLE}>
          {formatter ? formatter(val) : <span className="hover:text-primary">{val}</span>}
        </p>
      );
    }
    return formatter ? formatter(val) : <span className="hover:text-primary">{val}</span>;
  };

  const IVAPeriodColumns: ColumnsType<IvaPeriodWidget> = [
    {
      title: "Mes",
      dataIndex: "mes",
      key: "mes",
      render: (val, record) => renderCell(val, record, undefined),
      width: 80,
    },
    {
      title: "IVA trasladado",
      dataIndex: "iva_trasladado",
      key: "iva_trasladado",
      width: 200,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "IVA acreditable",
      dataIndex: "iva_acreditado",
      key: "iva_acreditado",
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
      width: 200,
    },
    {
      title: "IVA a cargo",
      dataIndex: "iva_a_cargo",
      key: "iva_a_cargo",
      width: 200,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "Retenciones IVA",
      dataIndex: "retenciones_iva",
      key: "retenciones_iva",
      width: 200,
      align: "right",
      render: (value, record) =>
        renderCell(value, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
  ];

  return IVAPeriodColumns;
}
