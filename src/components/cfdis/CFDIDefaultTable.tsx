import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { CFDI_Types } from "@constants/Enums";
import GetExtraRows from "@utils/CFDI/getExtraRows";
import { Table, Tooltip } from "antd";
import { ColumnGroupType, ColumnType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, Key, SorterResult } from "antd/es/table/interface";
import { TableMeta } from "@hooks/useTableMeta";
import s from "@pages/CFDI/CFDIContainer.module.scss";
import { optionsPagination } from "@utils/global/numberPagination";

export default function CFDIDefaultTable(props: CFDIDefaultTableType) {
  const {
    cfdiData,
    expandedRowKeys,
    company,
    generalDetailsColumns,
    tab,
    setExpandedRowKeys,
    selectedRows,
    onSelectChange,
    setTableMeta,
    tableMeta,
    generalColumns,
    isFetching,
    datesValue,
    rfc,
    isFetchingTotals,
  } = props;
  let { keys } = props;

  const tooltipMessage =
    tab === "P"
      ? ["Ocultar documentos relacionados", "Ver documentos relacionados"]
      : ["Ocultar conceptos", "Ver conceptos"];

  return (
    <Table
      className="cfdi-table"
      expandable={
        tab === "I" || tab === "P"
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
              rowExpandable: (record) =>
                record?.TipoDeComprobante === "I" || record?.TipoDeComprobante === "P",
              expandIcon: ({ expanded, record, onExpand }) =>
                tab === "I" || tab === "P" ? (
                  <Tooltip
                    mouseLeaveDelay={0}
                    title={expanded ? tooltipMessage[0] : tooltipMessage[1]}
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
      rowSelection={{
        type: "checkbox",
        selectedRowKeys: selectedRows,
        onChange: onSelectChange,
      }}
      style={{ padding: "0 15px 15px 15px", backgroundColor: "white" }}
      size="small"
      rowKey={(record) => record.UUID}
      onChange={setTableMeta}
      columns={generalColumns}
      dataSource={cfdiData?.cfdis}
      loading={isFetching || !datesValue || !rfc || isFetchingTotals}
      scroll={{ y: 380, x: 10 }}
      pagination={{
        showTotal: (total) =>
          total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
        defaultCurrent: 1,
        current: tableMeta.pagination.current,
        pageSizeOptions: optionsPagination,
        pageSize: tableMeta.pagination.pageSize,
        total: cfdiData?.quantity || 0,
        showSizeChanger: true,
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

type CFDIDefaultTableType = {
  cfdiData: GroupedCFDIs;
  expandedRowKeys: Key[];
  company: string | null;
  generalDetailsColumns: (ColumnGroupType<CFDIDetails> | ColumnType<CFDIDetails>)[];
  tab: CFDI_Types;
  keys: Array<Key>;
  setExpandedRowKeys: React.Dispatch<React.SetStateAction<Key[]>>;
  selectedRows: Key[];
  onSelectChange: (newSelectedRowKeys: React.Key[]) => void;
  setTableMeta: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<CFDI> | SorterResult<any>[]
  ) => void;
  tableMeta: TableMeta<CFDI>;
  generalColumns: (ColumnGroupType<CFDI> | ColumnType<CFDI>)[];
  isFetching: boolean;
  datesValue: string | null;
  rfc: string | null;
  isFetchingTotals: boolean;
};
