import { Table, Tooltip } from "antd";
import {
  InternalTabType,
  TabType,
  TabTotalsResponseRow,
  ISRUpdatePayload,
} from "../_types/ISRTypes";
import { ISRTotalExpandableTable } from "./ISRExpandableTable";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import s from "../_styles/ISR.module.scss";
import { useNavigate } from "react-router-dom";
import * as P from "@constants/PageIds";
import { ISRTabTotalColumnsDeductions } from "../_constants/ISRTabTotalColumnsDeductions";

interface PropsTable {
  data: TabTotalsResponseRow[] | null;
  tab: TabType;
  internalTab: InternalTabType;
  loading: boolean;
  setTab: (value: TabType) => void;
  setInternalTab: (value: InternalTabType) => void;
  company: string;
  period: string;
  updatePercentageDeductions: (payload: ISRUpdatePayload) => void;
}

export const ISRTotalTable = ({
  data,
  internalTab,
  tab,
  setInternalTab,
  setTab,
  loading,
  period,
  company,
  updatePercentageDeductions,
}: PropsTable) => {
  const navigate = useNavigate();

  return (
    <div style={{ paddingLeft: 15, maxWidth: "75%", padding: 0, margin: 0 }}>
      <Table
        size="small"
        columns={ISRTabTotalColumnsDeductions({
          data,
          internalTab,
          tab,
          setInternalTab,
          setTab,
          updatePercentageDeductions,
          company,
          period,
        })}
        dataSource={data || []}
        tableLayout="fixed"
        rowKey={(record) => record.concepto}
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
        onRow={(record) => ({
          onMouseEnter: (e) => {
            if (
              record.concepto === "Gastos de nómina exenta deducible" ||
              record.concepto === "Gastos de nómina deducibles" ||
              record.concepto === "Compras y gastos" ||
              record.concepto === "Deducciones autorizadas sin inversiones"
            ) {
              return;
            }
            e.currentTarget.style.color = "#0070b3";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.color = "black";
          },
          style: {
            cursor:
              record.concepto === "Gastos de nómina exenta deducible" ||
                record.concepto === "Gastos de nómina deducibles" ||
                record.concepto === "Compras y gastos" ||
                record.concepto === "Deducciones autorizadas sin inversiones"
                ? "default"
                : "pointer",
          },
          onClick: () => {
            if (
              record.concepto === "Gastos de nómina gravada" ||
              record.concepto === "Gastos de nómina exenta"
            ) {
              navigate(
                `${P.CFDIISSUED.path}?cid=${company}&period=${period}&state=active&type=payroll`
              );
            }
            if (
              record.concepto === "Gastos de nómina exenta deducible" ||
              record.concepto === "Gastos de nómina deducibles" ||
              record.concepto === "Compras y gastos" ||
              record.concepto === "Deducciones autorizadas sin inversiones"
            ) {
              return;
            }
            if (record.concepto === "Compras y gastos facturas de contado") {
              setTab("CASH");
            } else if (record.concepto === "Compras y gastos CFDIs de pago") {
              setTab("PAYMENT");
            } else if (record.concepto === "Devoluciones, descuentos y bonificaciones facturadas") {
              setTab("DISCOUNTS");
              setInternalTab("DISCOUNTS-INCOMES")
            } else if (record.concepto === "Compras y gastos no considerados en el pre-llenado") {
              setTab("EXCLUDED-PREFILLED");
              setInternalTab("EXCLUDED-PREFILLED-INCOMES")
            } else if (record.concepto === "Adquisiciones por concepto de inversiones") {
              setTab("INVESTMENTS");
            } else if (record.concepto === "Facturas de egresos recibidas por compras y gastos") {
              setTab("EGRESS");
            } else {
              setTab("CASH");
            }
          },
        })}
        expandable={{
          expandedRowRender: (record) => {
            return (
              record?.concepts && (
                <ISRTotalExpandableTable
                  data={record?.concepts || []}
                  tab={tab}
                  internalTab={internalTab}
                  setInternalTab={setInternalTab}
                  setTab={setTab}
                />
              )
            );
          },
          expandIcon: ({ expanded, record, onExpand }) =>
            (record?.concepts?.length ?? 0) > 1 ? (
              <Tooltip mouseLeaveDelay={0} title={""} style={{ margin: 0 }}>
                {expanded ? (
                  <MinusOutlined
                    className={s.ExpandableRowButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onExpand(record, e);
                    }}
                  />
                ) : (
                  <PlusOutlined
                    className={s.ExpandableRowButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onExpand(record, e);
                    }}
                  />
                )}
              </Tooltip>
            ) : null,
        }}
      />
    </div>
  );
};
