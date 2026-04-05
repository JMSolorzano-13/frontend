import React from "react";
import { Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SATStatusList } from "@utils/SATLogStatusList";
import moment from "moment";
import { SingleLogDayType } from "@api/sat";

export const DailyDownloadsColumns: ColumnsType<SingleLogDayType> = [
  {
    key: "date",
    title: "Fecha de emisión",
    dataIndex: "date",
    render: (date: string) => moment(date).format("DD/MM/YYYY"),
    showSorterTooltip: false,
    sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    width: 150,
    defaultSortOrder: "descend",
  },
  {
    key: "status",
    title: "Estatus",
    dataIndex: "status",
    filters: [
      {
        text: "Finalizada",
        value: "COMPLETE",
      },
      {
        text: "Incompleta",
        value: "INCOMPLETE",
      },
      {
        text: "Sin datos",
        value: "EMPTY",
      },
      {
        text: "En proceso",
        value: "IN_PROGRESS",
      },
    ],
    onFilter: (value: any, record) => record.status.indexOf(value) === 0,
    filterMultiple: false,
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
    render: (_, record) => record.issued.total.toLocaleString("en-US"),
    width: 130,
    align: "right",
  },
  {
    key: "issued",
    title: "CFDIs emitidos descargados",
    dataIndex: "issued",
    render: (_, record) => record.issued.processed.toLocaleString("en-US"),
    width: 130,
    align: "right",
  },
  {
    key: "received",
    title: "CFDIs recibidos que tiene el SAT",
    dataIndex: "received",
    render: (_, record) => record.received.total.toLocaleString("en-US"),
    width: 130,
    align: "right",
  },
  {
    key: "received",
    title: "CFDIs recibidos descargados",
    dataIndex: "received",
    render: (_, record) => record.received.processed.toLocaleString("en-US"),
    width: 130,
    align: "right",
  },
];
