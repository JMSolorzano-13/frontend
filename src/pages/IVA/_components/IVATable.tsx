import { Table, TablePaginationConfig } from "antd";
import { Dispatch, FC, SetStateAction } from "react";
import { TState, UpdateUUIDsType } from "../_types/StateTypes";
import { TableMeta } from "@hooks/useTableMeta";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { ColumnsType } from "antd/lib/table";
import {  optionsPagination } from "@utils/global/numberPagination";

interface Propstable {
    extraCols: any
    IVACFDIColumns: (props: any) => ColumnsType<IVACFDI>;
    topTab: TState;
    periodSelected: string;
    tab: TabIVAType;
    tableMeta: TableMeta<IVACFDI>;
    setUUIDs: Dispatch<SetStateAction<UpdateUUIDsType>>;
    isFetching: boolean;
    uuids: UpdateUUIDsType;
    setTableMeta: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<IVACFDI> | SorterResult<IVACFDI>[]) => void
    ivaCFDIs: { cfdis: CFDI[]; totals: CFDIsTotals | null; quantity: number; }
    
}



const IVATable: FC<Propstable> = ({ IVACFDIColumns, ivaCFDIs, extraCols, isFetching, periodSelected, setTableMeta, setUUIDs, tab, tableMeta, topTab, uuids }) => {
    if (tab === "ALL" && topTab.includes("creditable")) return null
    return (
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
                pageSize: tableMeta?.pagination.pageSize,
                total: ivaCFDIs.quantity,
                showSizeChanger: true,
                pageSizeOptions: optionsPagination,
            }}
        />
    );
}

export default IVATable;
