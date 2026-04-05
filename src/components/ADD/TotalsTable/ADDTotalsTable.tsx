import { Col, Table, Grid } from "antd";
import { ColumnsType } from "antd/lib/table";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import style from "./ADDTotalsTable.module.scss";
import { useCOIEnabled } from "@hooks/useCOI";

type GenericTotalsType = {
  ezauditaTotals: CFDIsTotals | null;
  addTotals: CFDIsTotals | null;
};

interface AddTotalsTableType extends GenericTotalsType {
  isAvailable: boolean;
  canBeSend: CFDIsTotals | null;
  canNotBeSend: CFDIsTotals | null;
  loading: boolean;
  isActive?: boolean;
}

interface DifferenceFunctionType extends GenericTotalsType {
  format: boolean;
}
const { useBreakpoint } = Grid;

function manageDifferences({ ezauditaTotals, addTotals, format }: DifferenceFunctionType) {
  if (ezauditaTotals && addTotals && !format) {
    return Math.abs(ezauditaTotals.filtered.count - addTotals.filtered.count);
  }
  if (ezauditaTotals && addTotals && format) {
    return formatDisplay(
      Math.abs(ezauditaTotals.filtered.Total - addTotals.filtered.Total),
      DisplayType.MONEY
    );
  }
  return "0";
}

export default function ADDTotalsTable({
  isAvailable,
  addTotals,
  ezauditaTotals,
  canBeSend,
  canNotBeSend,
  loading,
  isActive,
}: AddTotalsTableType) {
  const { lg } = useBreakpoint();
  const { coi_enabled } = useCOIEnabled()
  const columnsTitle: ColumnsType<any> = [
    {
      title: `${isAvailable ? "#CFDIs" : "Cancelados"}`,
      dataIndex: "quantity",
      render: (val: string) => (
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {val}
        </span>
      ),
      align: "right",
    },
    {
      title: coi_enabled ? "Siigo Fiscal" : "ezaudita",
      dataIndex: "ezaudita",
      align: "right",
      render: (val: string) => (
        <span
          style={{
            fontSize: 12,
          }}
        >
          {val}
        </span>
      ),
    },
    {
      title: coi_enabled ? "COI" : "ADD",
      dataIndex: "add",
      align: "right",
      render: (val: string) => (
        <span
          style={{
            fontSize: 12,
          }}
        >
          {val}
        </span>
      ),
    },
    {
      title: "Diferencia",
      dataIndex: "difference",
      align: "right",
      render: (val: string) => (
        <span
          style={{
            fontSize: 12,
          }}
        >
          {val}
        </span>
      ),
    },
    {
      title: `Sí pueden ${isAvailable ? "enviarse" : "cancelarse"}`,
      dataIndex: "canBeSend",
      align: "right",
      className: "lastTwo",
      render: (val: string) => (
        <span
          style={{
            fontSize: 12,
          }}
        >
          {val}
        </span>
      ),
    },
    {
      title: `No pueden ${isAvailable ? "enviarse" : "cancelarse"}`,
      dataIndex: "canNotBeSend",
      align: "right",
      className: "lastTwo",
      render: (val: string) => (
        <span
          style={{
            fontSize: 12,
          }}
        >
          {val}
        </span>
      ),
      width: 160,
    },
  ];
  const dataSource = [
    {
      key: "1",
      quantity: "Cantidad",
      ezaudita: ezauditaTotals ? ezauditaTotals.filtered.count : "0",
      add: addTotals ? addTotals.filtered.count : "0",
      difference: manageDifferences({
        ezauditaTotals,
        addTotals,
        format: false,
      }),
      canBeSend: canBeSend?.filtered.count,
      canNotBeSend: canNotBeSend?.filtered.count,
    },
  ];

  return (
    <Col
      xl={12}
      lg={24}
      md={24}
      sm={24}
      style={!lg ? { minWidth: "100%" } : isActive ? { minWidth: "fit-content" } : {}}
    >
      <Table
        className={style.TotalTable}
        columns={columnsTitle}
        dataSource={dataSource}
        pagination={false}
        scroll={isActive ? { x: "max-content" } : { x: 700 }}
        loading={loading}
        size="small"
      />
    </Col>
  );
}
