import { Button, Col, Row, Spin, Typography } from "antd";
import { SyncOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { MessageAction } from "./MessageAction";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { PropsCurrentTab } from "../_types/StateTypes";
import moment from "moment";
import { diffMinutes } from "@formkit/tempo";

export const ViewPDF = ({
  updatePage,
  download,
  url,
  title,
  status,
  requesting_from_sat,
  requesting_from_sat_retry,
  loading_tab,
  fetchDocumentRetry,
  date_owner,
  date,
}: PropsCurrentTab) => {
  if (loading_tab) {
    return <Spin />;
  }

  const pastTime = diffMinutes(new Date(), new Date(date));

  const handlePendingStatus =
    (status === "pending" && pastTime <= 15) || requesting_from_sat || requesting_from_sat_retry;

  return (
    <>
      {handlePendingStatus && (
        <MessageAction
          text={`Estamos obteniendo tu ${title} desde el SAT; espera unos minutos y refresca la página.`}
        />
      )}
      {status === "error" && (
        <MessageAction
          text={`Recientemente intentaste actualizar tu ${title} y obtuvimos un error de parte del SAT, te sugerimos volver a intentarlo.`}
          type="error"
        />
      )}
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Row className="flex sm:flex-col md:flex-row py-2 w-full md:justify-between">
          <Col className="flex flex-col md:flex-row md:items-center w-full gap-2 justify-between">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <Typography.Text style={{ fontSize: "14px" }}>
                {handlePendingStatus
                  ? "Actualizando..."
                  : `Se obtuvo del SAT: ${formatDisplay(date_owner, DisplayType.DATE)} `}
              </Typography.Text>
              {handlePendingStatus ? (
                <Button
                  type="primary"
                  loading={requesting_from_sat || requesting_from_sat_retry}
                  icon={<SyncOutlined />}
                  onClick={fetchDocumentRetry}
                >
                  Refrescar
                </Button>
              ) : (
                (formatDisplay(date_owner, DisplayType.DATETIME).toString().split(",")[0] !==
                  moment().format("D/M/YYYY") ||
                  status === "error") && (
                  <Button type="default" icon={<SyncOutlined />} onClick={updatePage}>
                    Actualizar
                  </Button>
                )
              )}
            </div>
            <Button type="primary" icon={<VerticalAlignBottomOutlined />} href={download}>
              Descargar
            </Button>
          </Col>
        </Row>
        <div className="flex-1 overflow-auto relative w-full">
          <object
            data={url}
            type="application/pdf"
            width="100%"
            height="100%"
            title="Constancia"
            className="absolute z-40"
          />
          {(requesting_from_sat_retry || requesting_from_sat) && (
            <div className="absolute z-50 w-full h-full text-white p-5 overflow-auto flex justify-center items-center bg-[#ffffffc4]">
              <Spin size="large" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
