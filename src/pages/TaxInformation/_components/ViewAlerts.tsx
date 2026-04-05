import { Spin } from "antd";
import { MessageAction } from "./MessageAction";
import { SyncOutlined } from "@ant-design/icons";
import { PropsMessage } from "../_types/StateTypes";
import { diffMinutes } from "@formkit/tempo";

export const ViewAlerts = ({
  updatePage,
  title,
  status,
  loading_tab,
  requesting_from_sat,
  fetchDocumentRetry,
  requesting_from_sat_retry,
  date,
}: PropsMessage) => {
  if (loading_tab) {
    return <Spin />;
  }

  const pastTime = diffMinutes(new Date(), new Date(date));

  if (
    (status === "pending" && date !== "" && pastTime <= 15) ||
    requesting_from_sat ||
    requesting_from_sat_retry
  ) {
    return (
      <MessageAction
        updatePage={fetchDocumentRetry}
        text={`Estamos obteniendo tu ${title} desde el SAT; espera unos minutos y refresca la página.`}
        buttonIcon={<SyncOutlined />}
        buttonText="Refrescar"
        requesting_from_sat={requesting_from_sat}
        requesting_from_sat_retry={requesting_from_sat_retry}
      />
    );
  }
  if (status === "error") {
    return (
      <MessageAction
        updatePage={updatePage}
        text={`Recientemente intentaste descargar tu ${title} y obtuvimos un error de parte del SAT, te sugerimos volver a intentarlo.`}
        buttonIcon={<SyncOutlined />}
        buttonText="Obtener nuevamente"
        type="error"
      />
    );
  }

  return <MessageAction updatePage={updatePage} />;
};
