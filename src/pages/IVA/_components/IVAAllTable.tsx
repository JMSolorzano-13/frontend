import { Table, TablePaginationConfig, Typography } from "antd";
import { Dispatch, FC, SetStateAction } from "react";
import { TState, UpdateUUIDsType } from "../_types/StateTypes";
import { TableMeta } from "@hooks/useTableMeta";
import { IVACFDI, propsType } from "@utils/ADD/IVACFDIColumns";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { ColumnsType } from "antd/lib/table";

interface Propstable {
  extraCols: any;
  IVACFDIColumns: (props: propsType) => ColumnsType<IVACFDI>;
  pageSizeOptions: string[];
  topTab: TState;
  periodSelected: string;
  tab: TabIVAType;
  tableMeta: TableMeta<IVACFDI>;
  setUUIDs: Dispatch<SetStateAction<UpdateUUIDsType>>;
  isFetching: boolean;
  uuids: UpdateUUIDsType;
  setTableMeta: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IVACFDI> | SorterResult<IVACFDI>[]
  ) => void;
  ivaCFDIs: { cfdis: CFDI[]; totals: CFDIsTotals | null; quantity: number };
}
export const IVAAllTableCFDIs: FC<Propstable> = ({
  IVACFDIColumns,
  ivaCFDIs,
  extraCols,
  isFetching,
  periodSelected,
  setTableMeta,
  setUUIDs,
  tab,
  tableMeta,
  topTab,
  uuids,
  pageSizeOptions,
}) => {
  return (
    <>
      <Typography.Title
        style={{ fontSize: "16px", marginBottom: 10, marginTop: 10 }}
        id={`iva_title_table_header_${tab}`}
      >
        {tab !== "EXCLUDED" && tab !== "MOVED"
          ? `CFDIs ${
              tab === "ALL" && topTab.includes("creditable") ? "y documentos relacionados" : ""
            }`
          : tab === "EXCLUDED"
          ? "CFDIs no considerados en el cálculo del IVA"
          : "CFDIs con periodo reasignado"}
      </Typography.Title>
      <Table
        rowKey="UUID"
        size="small"
        columns={[
          ...extraCols,
          ...IVACFDIColumns({
            modalType: topTab.includes("creditable") ? "creditable" : "transferred",
            topTab,
            modalPeriod: periodSelected,
            tab,
            sorter: tableMeta.sorter,
            setUUIDs,
            uuids,
          }),
        ]}
        scroll={{ y: 420, x: 10 }}
        loading={isFetching}
        dataSource={ivaCFDIs.cfdis as any}
        onChange={setTableMeta}
        pagination={{
          defaultCurrent: 1,
          current: tableMeta?.pagination.current,
          pageSizeOptions,
          pageSize: tableMeta?.pagination.pageSize,
          total: ivaCFDIs.quantity,
          showSizeChanger: true,
          showTotal: (total) =>
            total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
        }}
      />
    </>
  );
};
