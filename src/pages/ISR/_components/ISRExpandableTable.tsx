import { Table } from "antd";
import { InternalTabType, TabType, TabTotalsResponseRow } from "../_types/ISRTypes";
import { ISRTabTotalColumnsDeductionsExpanded } from "../_constants/ISRTabTotalColumnsDeductionsExpanded";

interface PropsTable {
  data: TabTotalsResponseRow[] | null;
  tab: TabType;
  internalTab: InternalTabType;
  setTab: (value: TabType) => void;
  setInternalTab: (value: InternalTabType) => void;
}

export const ISRTotalExpandableTable = ({
  data,
  internalTab,
  tab,
  setInternalTab,
  setTab,
}: PropsTable) => {
  return (
    <div className="secondary-concepts-table" style={{ width: "100%" }}>
      <div id="table-container" className="secondary-concepts-table">
        <Table
          size="small"
          id="concepts-id-table"
          columns={ISRTabTotalColumnsDeductionsExpanded({
            data,
            tab,
            internalTab,
            setInternalTab,
            setTab,
          })}
          rowClassName={"secondary-concepts-table"}
          onRow={(record) => ({
            onMouseEnter: (e) => {
              e.currentTarget.style.color = "#0070b3";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.color = "black";
            },
            onClick: () => {
              if (record.concepto === 'Devoluciones, descuentos y bonificaciones en ingresos emitidos') {
                setTab('DISCOUNTS')
                setInternalTab('DISCOUNTS-INCOMES')
              } else if (record.concepto === 'Devoluciones, descuentos y bonificaciones en egresos emitidos') {
                setTab('DISCOUNTS')
                setInternalTab('DISCOUNTS-EGRESS')
              } else if (record.concepto === 'No considerados en el pre-llenado: Ingresos PUE') {
                setTab('EXCLUDED-PREFILLED')
                setInternalTab('EXCLUDED-PREFILLED-INCOMES')
              } else if (record.concepto === 'No considerados en el pre-llenado: Pagos') {
                setTab('EXCLUDED-PREFILLED')
                setInternalTab('EXCLUDED-PREFILLED-PAYMENT')
              } else {
                setTab('DISCOUNTS')
                setInternalTab('DISCOUNTS-INCOMES')
              }
            },
            style: { cursor: "pointer" },
          })}
          dataSource={data || []}
          loading={false}
          pagination={false}
          scroll={{ x: "max-content" }}
          showHeader={false}
          tableLayout="fixed"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};
