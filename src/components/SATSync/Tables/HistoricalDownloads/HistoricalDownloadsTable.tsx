import React from "react";
import { Table, Space, Typography, Col } from "antd";
import { HistoricLogType } from "@api/sat";
import HistoricalDownloadsColumns from "./HistoricalDownloadsColumns";
import { numberPagination, optionsPagination } from "@utils/global/numberPagination";

type PropsType = {
  dataTable: HistoricLogType;
  loading: boolean;
};

export default function HistoricalDownloadsTable(props: PropsType) {
  const { dataTable, loading } = props;
  const formattedTableData = dataTable.start ? [dataTable] : [];
  return (
    <Col span={24}>
      <Space style={{ marginBottom: 15 }}>
        <Typography.Title level={5} data-test="satsync-title" style={{ marginBottom: 0 }}>
          Descarga inicial (histórica)
        </Typography.Title>
      </Space>
      <Table
        rowKey={(record) => `${record.status}-${record.issued.total}-${record.received.total}`}
        size="small"
        loading={loading}
        columns={HistoricalDownloadsColumns}
        dataSource={formattedTableData}
        scroll={{ x: 10, y: 500 }}
        pagination={{
          showTotal: (total) =>
            total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
          defaultPageSize: numberPagination,
          pageSizeOptions: optionsPagination,
        }}
      />
    </Col>
  );
}
