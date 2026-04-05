import { useCOIEnabled } from "@hooks/useCOI";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";

export const ADDLogColumns = () => {
  const { coi_enabled } = useCOIEnabled();
  const columns: ColumnsType<ADDSyncSearch> = [
    {
      title: "Fecha de sincronización",
      dataIndex: "created_at",
      key: "created_at",
      align: "left",
      render: (val: string) => formatDisplay(val, DisplayType.DATETIME) as string,
      showSorterTooltip: false,
      sorter: (a, b) => moment(a.created_at).unix() - moment(b.created_at).unix(),
      defaultSortOrder: "descend",
      width: 190,
    },
    {
      title: "Tipo",
      dataIndex: "manually_triggered",
      key: "type",
      align: "left",
      render: (val) => (val ? "Manual" : "Automática"),
      width: 100,
    },
    {
      title: "Desde",
      dataIndex: "start",
      key: "star",
      align: "left",
      render: (val: string) => moment(val).format("DD/MM/YYYY"),
      width: 110,
    },
    {
      title: "Hasta",
      dataIndex: "end",
      key: "end",
      align: "left",
      render: (val: string) => moment(val).format("DD/MM/YYYY"),
      width: 110,
    },
  ];

  !coi_enabled &&
    columns.push(
      {
        title: "Solicitud - CFDIs a sincronizar enviados",
        dataIndex: "xmls_to_send",
        key: "xmls_to_send",
        width: 270,
        align: "left",
        render: (val, record) => {
          if (record.state === "DRAFT") return "...";
          return val;
        },
      },
      {
        title: "Solicitud - CFDIs a cancelar",
        dataIndex: "cfdis_to_cancel",
        key: "cfdis_to_cancel",
        width: 190,
        render: (val, record) => {
          if (record.state === "DRAFT") return "...";
          return val;
        },
        align: "left",
      }
    );

  columns.push({
    title: "Estatus",
    dataIndex: "state",
    key: "state",
    render: (val, record) => {
      if (
        record.cfdis_to_cancel_pending === 0 &&
        record.xmls_to_send_pending === 0 &&
        val === "SENT"
      )
        return "Finalizado";
      if (val === "DRAFT") return "En Proceso";
      if (val === "SENT") return "En Proceso";
      if (val === "ERROR") return "Error";

      return "-";
    },
    align: "left",
    width: 100,
  });

  !coi_enabled &&
    columns.push(
      {
        title: "Resultados - CFDIs sincronizados",
        dataIndex: "xmls_to_send_pending",
        key: "xmls_to_send_pending",
        render: (val, record) => {
          if (record.state === "DRAFT") {
            return "...";
          }
          if (val !== 0 && record.cfdis_to_cancel_pending !== 0 && record.state !== "ERROR") {
            return "";
          }

          return record.xmls_to_send - val;
        },
        align: "left",
        width: 240,
      },
      {
        title: "Resultados - CFDIs cancelados",
        dataIndex: "cfdis_to_cancel_pending",
        key: "cfdis_to_cancel_pending",
        align: "left",
        render: (val, record) => {
          if (record.state === "DRAFT") {
            return "...";
          }
          if (val !== 0 && record.xmls_to_send_pending !== 0 && record.state !== "ERROR") {
            return "";
          }

          return record.cfdis_to_cancel - val;
        },
        width: 240,
      }
    );

  return columns;
};
