import { ClockCircleOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import moment from "moment";

type DownloadStatusProps = {
  url: string;
  createdAt: string;
  handleGetExports: () => void;
  tabType: "CFDIs" | "IVA" | "ISR";
  record: CFDIExport | IVAExport;
};

export const DownloadStatus = ({
  url,
  createdAt,
  handleGetExports,
  tabType,
}: DownloadStatusProps) => {
  const calculateMinutesPassed = (createdAt: string): number => {
    const todaysDate = moment().utc();
    const createdAtDate = moment(createdAt).utc(true);
    return todaysDate.diff(createdAtDate, "minutes");
  };

  const minutesPassed = calculateMinutesPassed(createdAt);

  const renderDownloadButton = () => (
    <Button
      type="primary"
      style={{ fontSize: 12, display: "inline-flex", alignItems: "center" }}
      size="small"
      href={url}
    >
      <DownloadOutlined style={{ fontSize: "12px", marginTop: -2 }} />
      Descargar
    </Button>
  );

  const renderStatusButton = () => {
    if (minutesPassed <= 15) {
      return (
        <Tooltip title="Refrescar">
          <Button
            size="small"
            style={{ fontSize: 12, display: "inline-flex", alignItems: "center" }}
            onClick={handleGetExports}
          >
            <ClockCircleOutlined style={{ fontSize: "12px" }} />
            <span style={{ textAlign: "center" }}>En proceso</span>
          </Button>
        </Tooltip>
      );
    }
    return (
      <Tooltip title={`Reintenta de nuevo la exportación desde la sección ${tabType}`}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 12,
            color: "gray",
          }}
        >
          Error al exportar
        </span>
      </Tooltip>
    );
  };

  return <div>{url && url !== "EMPTY" ? renderDownloadButton() : renderStatusButton()}</div>;
};
