import { Table } from "antd";
import ISRColumnsIncomesTotals from "../_constants/ISRColumnsIncomesTotals";
import { TotalTableProps } from "../_types/ISRTypes";
import getTotalsData from "../_utils/getTotalsData";
import ISRTotalColumnsDeductionsTotals from "../_constants/ISRColumnsDeductionsTotals";

export default function TotalsTable(props: TotalTableProps) {
  const { topTab, data, tab, loading, date, periodType, internalTab, setTab } = props;

  if (topTab === "deductions") {
    return (
      <Table
        columns={ISRTotalColumnsDeductionsTotals({ tab, internalTab })}
        pagination={false}
        size="small"
        style={{ width: "fit-content" }}
        scroll={{ x: "max-content" }}
        tableLayout="auto"
        dataSource={data ? [data] : []}
        loading={loading}
      />
    );
  }

  return (
    <Table
      columns={ISRColumnsIncomesTotals({ tab })}
      pagination={false}
      size="small"
      style={{ width: "fit-content" }}
      scroll={{ x: "max-content" }}
      tableLayout="auto"
      dataSource={getTotalsData(tab, topTab, data, date, periodType)}
      loading={loading}
      onRow={(record) => ({
        onMouseEnter: (e) => {
          if (record.context === "Total") {
            return;
          }
          e.currentTarget.style.color = "#0070b3";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.color = "black";
        },
        style: { cursor: record.context === "Total" ? "default" : "pointer" },
        onClick: () => {
          if (record.context === "Total") {
            return;
          }
          if (record.context === "Facturas de contado") {
            setTab("CASH");
          } else if (record.context === "CFDI de pagos") {
            setTab("PAYMENT");
          } else {
            setTab("CASH");
          }
        },
      })}
    />
  );
}
