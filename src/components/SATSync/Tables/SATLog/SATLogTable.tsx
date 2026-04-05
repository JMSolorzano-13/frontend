import { useEffect } from "react";
import { Button, Table, theme } from "antd";
import { useCColumns } from "@hooks/useCColumns";
import { getCols, getDataColumns } from "@pages/Settings/SATSettings/SATLogColumns";
import { useSelector } from "react-redux";
import { satSelector } from "@store/satSlice";
import useTableMeta from "@hooks/useTableMeta";
import parseTableMeta from "@utils/CFDI/parseTableMeta";
import { getSatLog } from "@store/satSlice/getSatLog";
import { getLastSync } from "@store/satSlice/getLastSync";
import { SyncOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@store/store";
import { numberPagination, optionsPagination } from "@utils/global/numberPagination";

const { useToken } = theme;

export default function SATLogTable() {
  const { token } = useToken();
  const { satLog, satLogFetching, satLogCount } = useSelector(satSelector);
  const dispatch = useAppDispatch();
  const [tableMeta, setTableMeta] = useTableMeta<SATQuerySingleData>({
    sorter: [
      {
        column: {
          dataIndex: "created_at",
        },
        columnKey: "created_at",
        order: "descend",
        field: "created_at",
      },
    ],
    pagination: {
      current: 1,
      pageSize: numberPagination,
      defaultCurrent: 1,
    },
    parsedOptions: { orderBy: "", limit: numberPagination, offset: 0 },
    filters: [],
  });

  const handleGetSatLog = () => {
    const { orderBy } = parseTableMeta<SATQuerySingleData>(tableMeta);
    const { filters } = tableMeta;
    let downloadType = "";
    let requestType = "";
    let states = [];

    if (filters.download_type) {
      downloadType = filters.download_type;
    }

    if (filters.request_type) {
      requestType = filters.request_type;
    }

    if (filters.state) {
      states = filters.state;
      if (states.includes("TO_DOWNLOAD")) {
        states.push("TO_SCRAP", "SPLITTED");
      }
      if (states.includes("DOWNLOADED")) {
        states.push("DELAYED", "SCRAPPED");
      }
    }

    dispatch(
      getSatLog({
        offset: (tableMeta.pagination.current ?? 1) - 1,
        limit: tableMeta.pagination.pageSize,
        orderBy,
        downloadType: downloadType[0],
        requestType: requestType[0],
        states,
      })
    );
    dispatch(getLastSync());
  };

  // Set table columns
  const [tableColumns, setTableColumns] = useCColumns(getDataColumns(), "sat_log_table");

  useEffect(() => {
    const sortCols = getCols(token, tableMeta.sorter);
    setTableColumns(sortCols);
  }, [tableMeta.sorter]);

  useEffect(() => {
    handleGetSatLog();
  }, [tableMeta]);

  return (
    <>
      <Button
        id="adv-refresh-button"
        ghost
        onClick={handleGetSatLog}
        icon={<SyncOutlined />}
        loading={satLogFetching}
        disabled={satLogFetching}
      />
      <Table
        size="small"
        columns={tableColumns}
        scroll={{ x: 10, y: 500 }}
        dataSource={satLog}
        loading={satLogFetching}
        rowKey="id"
        pagination={{
          total: satLogCount,
          defaultCurrent: 1,
          current: tableMeta?.pagination.current,
          pageSizeOptions: optionsPagination,
          pageSize: tableMeta?.pagination.pageSize,
          showSizeChanger: true,
          showTotal: (total) =>
            total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
        }}
        onChange={setTableMeta}
        data-test="satsync-table"
      />
    </>
  );
}
