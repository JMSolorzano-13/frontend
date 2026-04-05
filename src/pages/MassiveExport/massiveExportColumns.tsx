import { ColumnsType } from "antd/lib/table";
import { Tag } from "antd";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import moment from "moment";
import "moment/locale/es-mx";
import "moment/dist/locale/es-mx";
import { SorterResult } from "antd/es/table/interface";
import { DownloadStatus } from "./DownloadStatus";
import { GetColumnExport } from "@components/global/getColumnModify";
import { theme } from "antd";
import { tailwindColors } from "@utils/tailwindColors";

moment().locale("es-mx");
const { useToken } = theme;

export function getMassiveExportColumns(
  sorter: SorterResult<CFDIExport>[],
  handleGetExports: () => void
) {
  const { token } = useToken();
  const massiveExportColumns: ColumnsType<CFDIExport> = [
    {
      title: "Fecha creación",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => {
        return formatDisplay(created_at, DisplayType.DATETIME);
      },
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "created_at") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "created_at")?.order,
      width: 150,
    },
    {
      title: "Fecha de expiración",
      dataIndex: "expiration_date",
      key: "expiration_date",
      render: (expiration_date: string) => {
        return expiration_date !== "None"
          ? formatDisplay(expiration_date, DisplayType.TIMEZONEDATE)
          : "-";
      },
      width: 150,
    },
    {
      title: "Desde",
      dataIndex: "start",
      key: "start",
      render: (start: string) => {
        return formatDisplay(start, DisplayType.TIMEZONEDATE);
      },
      width: 100,
    },
    {
      title: "Hasta",
      dataIndex: "end",
      key: "end",
      render: (end: string) => {
        return formatDisplay(end, DisplayType.DATE);
      },
      width: 100,
    },
    {
      title: "Efecto de comprobante",
      dataIndex: "cfdi_type",
      key: "cfdi_type",
      render: (cfdi_type: string) => {
        switch (cfdi_type) {
          case "I":
            return <Tag>Ingreso</Tag>;
          case "Iconceptos":
            return <Tag>Ingresos con conceptos</Tag>;
          case "E":
            return <Tag>Egreso</Tag>;
          case "Econceptos":
            return <Tag>Egresos con conceptos</Tag>;
          case "P":
            return <Tag>Pago</Tag>;
          case "Pdoctos":
            return <Tag>Pago con docs. relacionados</Tag>;
          case "T":
            return <Tag>Traslado</Tag>;
          case "N":
            return <Tag>Nómina</Tag>;
          case "Nconceptos":
            return <Tag>Nómina con conceptos</Tag>;
          default:
            return <Tag>Desconocido</Tag>;
        }
      },
      width: 170,
    },
    {
      title: "Tipo de CFDI",
      dataIndex: "download_type",
      key: "download_type",
      render: (download_type: string) => {
        switch (download_type) {
          case "RECEIVED":
            return <Tag color={token.colorPrimary}>Recibidos</Tag>;
          case "ISSUED":
            return <Tag color={tailwindColors.secondary}>Emitidos</Tag>;
          default:
            return <Tag color="default">Desconocido</Tag>;
        }
      },
      width: 100,
    },
    {
      title: "Formato",
      dataIndex: "format",
      key: "format",
      render: (format: string) => {
        switch (format) {
          case "XLSX":
            return <Tag color="green">XLSX</Tag>;
          case "XML":
            return <Tag color="geekblue">XML</Tag>;
          default:
            return <Tag color="default">{format}</Tag>;
        }
      },
      width: 100,
    },
    {
      title: "Acciones",
      dataIndex: "url",
      render: (url: string, record) => {
        return (
          <DownloadStatus
            url={url}
            createdAt={record.created_at}
            handleGetExports={handleGetExports}
            tabType="CFDIs"
            record={record}
          />
        );
      },
      key: "url",
      width: 120,
    },
  ];

  return massiveExportColumns;
}

export function getIVAExportColumns(
  sorter: SorterResult<IVAExport>[],
  handleGetExports: () => void
) {
  const { token } = useToken();
  const ivaExportColumns: ColumnsType<IVAExport> = [
    {
      title: "Fecha creación",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => {
        return created_at !== null ? formatDisplay(created_at, DisplayType.DATETIME) : "-";
      },
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "created_at") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "created_at")?.order,
      showSorterTooltip: false,
      width: 150,
    },
    {
      title: "Fecha de expiración",
      dataIndex: "expiration_date",
      key: "expiration_date",
      render: (expiration_date: string) => {
        return expiration_date !== null
          ? formatDisplay(expiration_date, DisplayType.TIMEZONEDATE)
          : "-";
      },
      width: 150,
    },
    {
      title: "Periodo",
      dataIndex: "start",
      key: "period",
      render: (startDate: string, record) => {
        return moment
          .utc(startDate ? startDate : new Date())
          .format(record.external_request ? "YYYY" : "MMMM YYYY");
        // return startDate !== null
        //   ? moment.utc( startDate ? startDate : new Date()).format(record.external_request ? 'YYYY': 'MM YYYY')
        //   : "-";
      },
      width: 150,
    },
    {
      title: "Tipo de IVA",
      dataIndex: "displayed_name",
      key: "displayed_name",
      render: (displayed_name: string) => {
        let tagColor = "";
        let tagText = displayed_name;

        if (displayed_name.includes("Trasladado")) {
          tagColor = token.colorPrimary;
          if (displayed_name.includes("Notas")) {
            tagText = "Trasladado - Notas de crédito";
          }
        } else if (displayed_name.includes("Acreditable")) {
          tagColor = tailwindColors.secondary;
          if (displayed_name.includes("Notas")) {
            tagText = "Acreditable - Notas de crédito";
          }
        }

        return <Tag color={tagColor}>{tagText}</Tag>;
      },
      width: 290,
    },
    {
      title: "Formato",
      dataIndex: "format",
      key: "format",
      render: () => <Tag color="green">XLSX</Tag>,
      width: 100,
    },
    {
      title: "Acciones",
      dataIndex: "url",
      render: (url: string, record) => {
        return (
          <DownloadStatus
            url={url}
            createdAt={record.created_at}
            handleGetExports={handleGetExports}
            tabType="IVA"
            record={record}
          />
        );
      },
      key: "url",
      width: 120,
    },
  ];

  return ivaExportColumns;
}

export function getISRExportColumns(
  sorter: SorterResult<IVAExport>[],
  handleGetExports: () => void
) {
  const { token } = useToken();
  const isrExportColumns: ColumnsType<IVAExport> = [
    {
      title: "Fecha creación",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => {
        return created_at !== null ? formatDisplay(created_at, DisplayType.DATETIME) : "-";
      },
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "created_at") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "created_at")?.order,
      showSorterTooltip: false,
      width: 150,
    },
    {
      title: "Fecha de expiración",
      dataIndex: "expiration_date",
      key: "expiration_date",
      render: (expiration_date: string) => {
        return expiration_date !== null
          ? formatDisplay(expiration_date, DisplayType.TIMEZONEDATE)
          : "-";
      },
      width: 130,
    },
    {
      title: "Periodo",
      dataIndex: "start",
      key: "period",
      render: (startDate: string, record) => {
        return moment
          .utc(startDate ? startDate : new Date())
          .format(record.external_request ? "YYYY" : "MMMM YYYY");
      },
      width: 130,
    },
    {
      title: "Tipo",
      dataIndex: "displayed_name",
      key: "displayed_name",
      render: (displayed_name: string) => {
        if (displayed_name.includes("Deducciones")) {
          return (
            <GetColumnExport value={displayed_name} characters={80} color={token.colorPrimary} />
          );
        }
        if (displayed_name.includes("Ingresos")) {
          return (
            <GetColumnExport
              value={displayed_name}
              characters={80}
              color={tailwindColors.secondary}
            />
          );
        }
        return <GetColumnExport value={displayed_name} characters={60} color="#474747" />;
      },
      width: 340,
    },
    {
      title: "Formato",
      dataIndex: "format",
      key: "format",
      render: () => <Tag color="green">XLSX</Tag>,
      width: 70,
    },
    {
      title: "Acciones",
      dataIndex: "url",
      render: (url: string, record) => {
        return (
          <DownloadStatus
            url={url}
            createdAt={record.created_at}
            handleGetExports={handleGetExports}
            tabType="ISR"
            record={record}
          />
        );
      },
      key: "url",
      width: 110,
    },
  ];

  return isrExportColumns;
}

export default getMassiveExportColumns;
