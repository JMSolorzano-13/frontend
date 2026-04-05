import { Table } from "antd";
import { SingleLogDayType } from "@api/sat";
import { DailyDownloadsColumns } from "./DailyDownloadsColumns";
import { numberPagination, optionsPagination } from "@utils/global/numberPagination";

type PropsType = {
  dataTable: SingleLogDayType[];
  loading: boolean;
};

export default function DailyDownloadsTable(props: PropsType) {
  const { dataTable, loading } = props;
  return (
    <Table
      rowKey={(record) =>
        `${record.date}-${record.status}-${record.issued.total}-${record.received.total}`
      }
      size="small"
      loading={loading}
      columns={DailyDownloadsColumns}
      dataSource={dataTable}
      scroll={{ x: 10, y: 350 }}
      pagination={{
        showTotal: (total) =>
          total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
        defaultPageSize: numberPagination,
        pageSizeOptions: optionsPagination,
      }}
    />
  );
}
