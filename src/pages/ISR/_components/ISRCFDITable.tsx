import { useState } from "react";
import { Table, Space, Button, Tooltip } from "antd";
import { FileExcelOutlined, FileSearchOutlined, MoreOutlined } from "@ant-design/icons";
import ISRColumns from "../_utils/ISRColumns";
import { ISRCFDITableProps, ISRRecordType } from "../_types/ISRTypes";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { optionsPagination } from "@utils/global/numberPagination";
import CFDIModal from "@components/cfdis/Modal/CFDIModal";
import ISRColumnsDeductions, { isPaymentColumn } from "../_utils/ISRColumnsDeductions";
import { ColumnsType } from "antd/es/table/InternalTable";
import getCFDITypeToRequest from "../_utils/getCFDITypeToRequest";

export default function ISRCFDITable(props: ISRCFDITableProps) {
  const {
    topTab,
    tab,
    internalTab,
    data,
    tableMeta,
    setTableMeta,
    dataQty,
    loading,
    uuidsToUpdate,
    setUUIDSToUpdate,
    doctosToUpdate,
    setDoctosToUpdate,
  } = props;
  const [cfdiModalVisible, setCFDIModalVisible] = useState(false);
  const [cfdiModalType, setCFDIModalType] = useState("normal");
  const [cfdiFromRecord, setCFDIFromRecord] = useState<ISRRecordType | CFDI | IVACFDI>();
  const [cfdiToDisplay, setCFDIToDisplay] = useState("");
  const isPayment = isPaymentColumn(tab, internalTab);

  const extraCols: ColumnsType<ISRRecordType> = [
    {
      title: <FileSearchOutlined style={{ marginTop: 7, marginLeft: 3, fontSize: 17 }} />,
      key: "action",
      render: (_, record: ISRRecordType) => (
        <Space style={{ display: "flex" }}>
          <Tooltip title="Ver detalles">
            <Button
              size="small"
              type="text"
              icon={<MoreOutlined />}
              onClick={() => {
                setCFDIFromRecord(record);
                setCFDIToDisplay(record.UUID);
                setCFDIModalVisible(true);
              }}
            />
          </Tooltip>
          {record.is_too_big ? (
            <div style={{ display: "flex" }}>
              <Tooltip title="Sin XML" placement="left">
                <FileExcelOutlined width={20} style={{ marginLeft: -5, marginTop: 3 }} />
              </Tooltip>
            </div>
          ) : null}
        </Space>
      ),
      fixed: true,
      align: "center",
      width: 60,
    },
  ];

  return (
    <>
      <Table
        rowKey={(record: ISRRecordType) => `${record.UUID}-${Math.random()}`}
        columns={
          topTab === "deductions"
            ? [
                ...extraCols,
                ...ISRColumnsDeductions(
                  topTab,
                  tab,
                  internalTab,
                  tableMeta.sorter,
                  uuidsToUpdate,
                  setUUIDSToUpdate,
                  doctosToUpdate,
                  setDoctosToUpdate
                ),
              ]
            : [
                ...extraCols,
                ...ISRColumns(topTab, tableMeta.sorter, uuidsToUpdate, setUUIDSToUpdate),
              ]
        }
        size="small"
        scroll={{ y: 420, x: 10 }}
        dataSource={data}
        loading={loading}
        onChange={setTableMeta}
        pagination={{
          defaultCurrent: 1,
          showTotal: (total: number) =>
            total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
          pageSizeOptions: optionsPagination,
          current: tableMeta.pagination.current,
          pageSize: tableMeta?.pagination.pageSize,
          total: dataQty,
          showSizeChanger: true,
        }}
      />
      {cfdiModalVisible && (
        <CFDIModal
          visible={cfdiModalVisible}
          setVisible={setCFDIModalVisible}
          cfdi={cfdiFromRecord}
          setCFDI={setCFDIFromRecord}
          cfdiToDisplay={cfdiToDisplay}
          setCFDIToDisplay={setCFDIToDisplay}
          modalType={cfdiModalType}
          setCFDIModalType={setCFDIModalType}
          CFDITypeToRequest={getCFDITypeToRequest(cfdiFromRecord, isPayment, topTab)}
          ivaType="ISR"
          uuidsToExclude={uuidsToUpdate}
        />
      )}
    </>
  );
}
