import { ColumnsType } from "antd/lib/table";
import { ISRTotalColumnsType, ISRTotalsRecordType } from "../_types/ISRTypes";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";

export default function ISRColumnsIncomesTotals(props: ISRTotalColumnsType) {
  const {tab } = props;
  const allColumns: ColumnsType<ISRTotalsRecordType> = [
    {
      title: "",
      dataIndex: "context",
      key: "context",
      render: (value) => {
        if (value === "Total") {
          return <b>{value}</b>;
        } else {
          return value;
        }
      },
    },
    {
      title: "Periodo",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Conteo de CFDIs",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "Base IVA 16%",
      dataIndex: "baseIVA16",
      key: "baseIVA16",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Base IVA 8%",
      dataIndex: "baseIVA8",
      key: "baseIVA8",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Base IVA 0%",
      dataIndex: "baseIVA0",
      key: "baseIVA0",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Base IVA exento",
      dataIndex: "baseExemptIVA",
      key: "baseExemptIVA",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Total base ISR",
      dataIndex: "totalISR",
      key: "totalISR",
      render: (value) => (
        <div style={{ color: "#0070b3", fontWeight: "bold" }}>
          {formatDisplay(value, DisplayType.MONEY)}
        </div>
      ),
      align: "right",
    },
    {
      title: "ISR retenido a favor",
      dataIndex: "ISRHoldings",
      key: "ISRHoldings",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
  ];

  function getColumnsByTab(values: ISRTotalColumnsType) {
    const { tab } = values;
    const columns = allColumns;
    let columnsToReturn = columns;



    // Switch to return all columns except 'context' column in payment tab or cash tab
    switch (tab) {
      case "CASH":
        columnsToReturn = columnsToReturn.filter((column) => {
          if (column.key) {
            return !["context"].includes(String(column.key));
          }
        });
        break;
      case "PAYMENT":
        columnsToReturn = columnsToReturn.filter((column) => {
          if (column.key) {
            return !["context"].includes(String(column.key));
          }
        });
        break;
      default:
        columnsToReturn;
    }

    return columnsToReturn;
  }

  return getColumnsByTab({tab });
}
