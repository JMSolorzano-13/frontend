import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { SATStatusList } from "@utils/SATLogStatusList";
import { Tag } from "antd";
import { ColumnsType, SorterResult } from "antd/lib/table/interface";
import { theme } from "antd";
import { tailwindColors } from "@utils/tailwindColors";
import { GlobalToken } from "antd/lib/theme/interface";

const { useToken } = theme;

export const getCols = (
  token: GlobalToken,
  sorter?: SorterResult<SATQuerySingleData>[]
): ColumnsType<SATQuerySingleData> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 90,
  },
  {
    title: "Fecha Inicial Solicitud",
    dataIndex: "created_at",
    key: "created_at",
    sorter: true,
    showSorterTooltip: false,
    sortOrder:
      sorter?.findIndex((s) => s.columnKey === "created_at") === -1
        ? undefined
        : sorter?.find((s) => s.columnKey === "created_at")?.order,
    render: (created_at: string) => {
      return formatDisplay(created_at, DisplayType.DATETIME);
    },
    width: 170,
  },
  {
    title: "Estatus",
    dataIndex: "state",
    filters: [
      {
        text: "Creado",
        value: "DRAFT",
      },
      {
        text: "Petición enviada",
        value: "SENT",
      },
      {
        text: "Descargando",
        value: "TO_DOWNLOAD",
      },
      {
        text: "Procesando",
        value: "DOWNLOADED",
      },
      {
        text: "Completado",
        value: "PROCESSED",
      },
      {
        text: "Error",
        value: "ERROR",
      },
      {
        text: "Sin datos",
        value: "INFORMATION_NOT_FOUND",
      },
    ],
    key: "state",
    render: (state: string) => {
      const currentStatus = SATStatusList[state];
      if (currentStatus !== undefined) {
        return <Tag color={currentStatus.tagInfo.color}>{currentStatus.tagInfo.text}</Tag>;
      }
      return <Tag color="blue"> Respuesta Inesperada </Tag>;
    },
    width: 170,
  },
  {
    title: "Inicio Descarga",
    dataIndex: "start",
    key: "start",
    sorter: true,
    showSorterTooltip: false,
    sortOrder:
      sorter?.findIndex((s) => s.columnKey === "start") === -1
        ? undefined
        : sorter?.find((s) => s.columnKey === "start")?.order,
    render: (start: string) => {
      return formatDisplay(start, DisplayType.TIMEZONE);
    },
    width: 170,
  },
  {
    title: "Fin Descarga",
    dataIndex: "end",
    key: "end",
    sorter: true,
    showSorterTooltip: false,
    sortOrder:
      sorter?.findIndex((s) => s.columnKey === "end") === -1
        ? undefined
        : sorter?.find((s) => s.columnKey === "end")?.order,
    render: (end: string) => {
      return formatDisplay(end, DisplayType.TIMEZONE);
    },
    width: 170,
  },
  {
    title: "Nombre Paquete",
    dataIndex: "name",
    key: "name",
    width: 300,
  },
  {
    title: "Tipo Solicitud",
    dataIndex: "request_type",
    key: "request_type",
    filterMultiple: false,
    filters: [
      {
        text: "CFDI",
        value: "CFDI",
      },
      {
        text: "Metadata",
        value: "METADATA",
      },
    ],
    render: (requestType: string) => {
      switch (requestType) {
        case "CFDI":
          return <Tag color="default">CFDI</Tag>;
        case "METADATA":
          return <Tag color="default">Metadata</Tag>;
        default:
          return <Tag color="default">CFDI</Tag>;
      }
    },
    width: 110,
    align: "right",
  },
  {
    title: "Tipo Descarga",
    dataIndex: "download_type",
    filterMultiple: false,
    filters: [
      {
        text: "Emitidos",
        value: "ISSUED",
      },
      {
        text: "Recibidos",
        value: "RECEIVED",
      },
    ],
    key: "download_type",
    render: (downloadType: string) => {
      switch (downloadType) {
        case "RECEIVED":
          return <Tag color={token.colorPrimary}>Recibidos</Tag>;
        case "ISSUED":
          return <Tag color={tailwindColors.secondary}>Emitidos</Tag>;
        default:
          return <Tag color="default">Desconocido</Tag>;
      }
    },
    width: 110,
    align: "right",
  },
];

export const getDataColumns = (
  sorter?: SorterResult<SATQuerySingleData>[]
): ColumnsType<SATQuerySingleData> => {
  const { token } = useToken();
  const cols = getCols(token, sorter);
  return cols;
};
