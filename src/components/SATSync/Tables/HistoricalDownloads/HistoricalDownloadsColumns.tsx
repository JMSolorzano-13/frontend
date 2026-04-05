import { Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SATStatusList } from "@utils/SATLogStatusList";
import { HistoricLogType } from "@api/sat";
import moment from "moment";

const HistoricalDownloadsColumns: ColumnsType<HistoricLogType> = [
  {
    key: "start",
    title: "Fecha de inicio",
    dataIndex: "start",
    render: (date: string) => moment(date).format("DD/MM/YYYY"),
    showSorterTooltip: false,
    width: 110,
  },
  {
    key: "end",
    title: "Fecha de fin",
    dataIndex: "end",
    render: (date: string) => moment(date).format("DD/MM/YYYY"),
    showSorterTooltip: false,
    width: 110,
  },
  {
    key: "status",
    title: "Estatus",
    dataIndex: "status",
    render: (state: string) => {
      const currentStatus = SATStatusList[state];
      if (currentStatus !== undefined) {
        return <Tag color={currentStatus.tagInfo.color}>{currentStatus.tagInfo.text}</Tag>;
      }
      return <Tag color="blue"> Respuesta Inesperada </Tag>;
    },
    width: 120,
  },
  {
    key: "issued",
    title: "CFDIs emitidos que tiene el SAT",
    dataIndex: "issued",
    render: (_, record) => record?.issued?.total?.toLocaleString("en-US"),
    width: 130,
    align: "right",
  },
  {
    key: "issued",
    title: "CFDIs emitidos descargados",
    dataIndex: "issued",
    render: (_, record) => record?.issued?.processed?.toLocaleString("en-US"),
    width: 130,
    align: "right",
  },
  {
    key: "received",
    title: "CFDIs recibidos que tiene el SAT",
    dataIndex: "received",
    render: (_, record) => record?.received?.total?.toLocaleString("en-US"),
    width: 130,
    align: "right",
  },
  {
    key: "received",
    title: "CFDIs recibidos descargados",
    dataIndex: "received",
    render: (_, record) => record?.received?.processed?.toLocaleString("en-US"),
    width: 130,
    align: "right",
  },
];

export default HistoricalDownloadsColumns;
