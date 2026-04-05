import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { CFDI_Types } from "@constants/Enums";
import { TableMeta } from "@hooks/useTableMeta";
import GetExtraRows from "@utils/CFDI/getExtraRows";
import { Table, Tooltip } from "antd";
import { ColumnGroupType, ColumnType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, Key, SorterResult } from "antd/es/table/interface";
import s from "@pages/CFDI/CFDIContainer.module.scss";
import { optionsPagination } from "@utils/global/numberPagination";

type CFDIPayrollTableType = {
  generalPayrollColumns: (ColumnGroupType<CFDI> | ColumnType<CFDI>)[];
  dataSource: GroupedCFDIs;
  tableMeta: TableMeta<CFDI>;
  setTableMeta: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<CFDI> | SorterResult<any>[]
  ) => void;
  isFetching: boolean;
  isFetchingTotals: boolean;
  selectedRows: Key[];
  onSelectChange: (newSelectedRowKeys: React.Key[]) => void;
  tab: CFDI_Types;
  company: string | null;
  expandedRowKeys: Key[];
  generalDetailsColumns: (ColumnGroupType<CFDIDetails> | ColumnType<CFDIDetails>)[];
  keys: Array<Key>;
  setExpandedRowKeys: React.Dispatch<React.SetStateAction<Key[]>>;
};

export default function CFDIPayrollTable(props: CFDIPayrollTableType) {
  const {
    generalPayrollColumns,
    dataSource,
    tableMeta,
    setTableMeta,
    isFetching,
    isFetchingTotals,
    selectedRows,
    onSelectChange,
    company,
    tab,
    expandedRowKeys,
    generalDetailsColumns,
    setExpandedRowKeys,
  } = props;
  let { keys } = props;

  return (
    <Table
      className="cfdi-table"
      expandable={
        tab === "N"
          ? {
              expandedRowKeys: expandedRowKeys,
              expandedRowRender: (record: CFDI, index, indent, expanded) => (
                <GetExtraRows
                  record={record}
                  company={company}
                  generalDetailsColumns={generalDetailsColumns}
                  expanded={expanded}
                  tab={tab}
                />
              ),
              rowExpandable: (record) => record?.TipoDeComprobante === "N",
              expandIcon: ({ expanded, record, onExpand }) =>
                tab === "N" ? (
                  <Tooltip
                    mouseLeaveDelay={0}
                    title={expanded ? "Ocultar conceptos" : "Ver conceptos"}
                  >
                    {expanded ? (
                      <MinusOutlined
                        className={s.ExpandableRowButton}
                        onClick={(e) => onExpand(record, e)}
                      />
                    ) : (
                      <PlusOutlined
                        className={s.ExpandableRowButton}
                        onClick={(e) => onExpand(record, e)}
                      />
                    )}
                  </Tooltip>
                ) : null,
              onExpand: (expanded, record) => {
                if (expanded) {
                  keys = [...expandedRowKeys, record.UUID];
                  setExpandedRowKeys(keys);
                } else {
                  const index = expandedRowKeys.indexOf(record.UUID);
                  expandedRowKeys.splice(index, 1);
                  setExpandedRowKeys(expandedRowKeys);
                }
              },
            }
          : undefined
      }
      rowKey="UUID"
      columns={generalPayrollColumns}
      style={{ padding: "0 15px 15px 15px", backgroundColor: "white" }}
      dataSource={dataSource.cfdis}
      size="small"
      scroll={{ y: 380, x: 10 }}
      onChange={setTableMeta}
      pagination={{
        defaultCurrent: 1,
        current: tableMeta?.pagination.current,
        pageSizeOptions: optionsPagination,
        pageSize: tableMeta.pagination.pageSize,
        total: dataSource?.quantity || 0,
        showSizeChanger: true,
        showTotal: (total) =>
          total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
      }}
      loading={isFetching || isFetchingTotals}
      rowSelection={{
        type: "checkbox",
        selectedRowKeys: selectedRows,
        onChange: onSelectChange,
      }}
      components={{
        header: {
          cell: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
            <th {...props} style={{ height: isFetching ? "45px" : "auto" }}>
              <div style={{ display: isFetching ? "none" : "block" }}>{props.children}</div>
            </th>
          ),
        },
      }}
    />
  );
}
