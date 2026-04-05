import React, { useEffect, useState } from "react";
import getADDColumns from "@utils/ADD/ADDColumns";
import { Table } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { ADD_CFDI_Types, CFDI_Types } from "@constants/Enums";
import { TableMeta } from "@hooks/useTableMeta";
import { useSelector } from "react-redux";
import { addSelector } from "@store/addSlice";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import CFDIModal from "@components/cfdis/Modal/CFDIModal";
import { useLocation } from "react-router";
import PayrollDetailsModal from "@components/cfdis/Payroll/PayrollDetailsModal";
import { optionsPagination } from "@utils/global/numberPagination";

interface ADDTablePropsType {
  columns: ColumnsType<any>;
  dataSource: ADDCFDI[];
  currentTab: ADD_CFDI_Types;
  tableMeta: TableMeta<ADDCFDI>;
  setTableMeta: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ADDCFDI> | SorterResult<ADDCFDI>[]
  ) => void;
  module: CFDIModule;
  setColumns: React.Dispatch<React.SetStateAction<ColumnsType<ADDCFDI>>>;
  forceSetTableMeta: React.Dispatch<React.SetStateAction<TableMeta<ADDCFDI>>>;
  setCFDIToDisplay: (state: string) => void;
  cfdiOnModal: CFDI | undefined;
  setCfdiOnModal: (state: CFDI | undefined) => void;
  cfdiToDisplay: string;
  setSelectedRows: React.Dispatch<React.SetStateAction<React.Key[]>>;
  setCfdiModalVisible: (value: boolean) => void;
  cfdiModalVisible: boolean;
  CFDITypeToRequest: CFDI_Types;
  setCFDITypeToRequest: (value: CFDI_Types) => void;
}

export default function ADDTable(props: ADDTablePropsType) {
  const {
    module,
    columns,
    setColumns,
    dataSource,
    currentTab,
    tableMeta,
    setTableMeta,
    forceSetTableMeta,
    setCFDIToDisplay,
    cfdiOnModal,
    setCfdiOnModal,
    cfdiToDisplay,
    setSelectedRows,
    cfdiModalVisible,
    setCfdiModalVisible,
    CFDITypeToRequest,
    setCFDITypeToRequest,
  } = props;
  const { totalCFDIs, loadingCFDIs } = useSelector(addSelector);
  const [cfdiModalType, setCFDIModalType] = useState("normal");
  const location = useLocation();

  useEffect(() => {
    const cols = getADDColumns({
      module,
      sorter: tableMeta.sorter,
      setCfdiModalVisible,
      setCFDIToDisplay,
      setCFDITypeToRequest,
    });
    setColumns(cols);
  }, [tableMeta.sorter, location]);

  useEffect(() => {
    forceSetTableMeta({
      ...tableMeta,
      pagination: { ...tableMeta.pagination, current: 1, defaultCurrent: 1 },
    });
  }, [currentTab]);

  return (
    <>
      <Table
        rowKey="UUID"
        rowSelection={{
          type: "checkbox",
          onChange: setSelectedRows,
        }}
        style={{ padding: "0 15px 15px 15px", backgroundColor: "white" }}
        columns={columns}
        scroll={{ y: 380, x: 10 }}
        size="small"
        dataSource={dataSource}
        onChange={setTableMeta}
        loading={loadingCFDIs}
        pagination={{
          defaultCurrent: 1,
          current: tableMeta?.pagination.current,
          pageSizeOptions: optionsPagination,
          pageSize: tableMeta.pagination.pageSize,
          total: totalCFDIs,
          showSizeChanger: true,
          showTotal: (total) =>
            total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
        }}
      />
      {currentTab !== "N" || (cfdiOnModal && cfdiOnModal.TipoDeComprobante !== "N") ? (
        <CFDIModal
          visible={cfdiModalVisible}
          setVisible={setCfdiModalVisible}
          cfdi={cfdiOnModal}
          setCFDI={setCfdiOnModal}
          cfdiToDisplay={cfdiToDisplay}
          setCFDIToDisplay={setCFDIToDisplay}
          modalType={cfdiModalType}
          setCFDIModalType={setCFDIModalType}
          CFDITypeToRequest={CFDITypeToRequest}
        />
      ) : (
        <PayrollDetailsModal
          visible={cfdiModalVisible}
          setVisible={setCfdiModalVisible}
          cfdi={cfdiOnModal}
        />
      )}
    </>
  );
}
