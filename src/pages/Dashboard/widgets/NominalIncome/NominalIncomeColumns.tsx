import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/es/table";

export default function NominalIncomeColumns() {
  const EMPTY_MONTH_STYLE = { color: "grey", padding: "4px 0px" };
  const TOTALS_STYLE = { fontWeight: "bold", padding: "4px 0px" };

  const renderCell = (
    val: any,
    record: NominalData,
    formatter?: (value: any) => any,
    isMonthColumn?: boolean
  ) => {
    if (record.emptyMonth) {
      return isMonthColumn ? (
        <p style={EMPTY_MONTH_STYLE}>{val}</p>
      ) : (
        <p style={EMPTY_MONTH_STYLE}>{` `}</p>
      );
    } else {
      <p>Hola</p>;
    }
    if (record.mes === "Total anual") {
      return (
        <p style={TOTALS_STYLE}>
          {formatter ? formatter(val) : <span className="hover:text-primary">{val}</span>}
        </p>
      );
    }
    return formatter ? formatter(val) : <span className="hover:text-primary">{val}</span>;
  };

  const massiveExportColumns: ColumnsType<NominalData> = [
    {
      title: "Mes",
      dataIndex: "mes",
      key: "mes",
      render: (val, record) => renderCell(val, record, undefined, true),
      width: 100,
    },
    {
      title: "Cancelados",
      dataIndex: "cancelados",
      key: "cancelados",
      width: 100,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.COMMAS)),
    },
    {
      title: "Vigentes",
      dataIndex: "vigentes",
      key: "vigentes",
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.COMMAS)),
      width: 100,
    },
    {
      title: "Ingresos nominales",
      dataIndex: "subtotal_mxn",
      key: "subtotal_mxn",
      width: 250,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "Descuentos",
      dataIndex: "descuento_mxn",
      key: "descuento_mxn",
      width: 250,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
    {
      title: "Ingresos netos",
      dataIndex: "ingresos_netos",
      key: "ingresos_netos",
      width: 250,
      align: "right",
      render: (val, record) =>
        renderCell(val, record, (value) => formatDisplay(value, DisplayType.MONEY)),
    },
  ];

  return massiveExportColumns;
}
