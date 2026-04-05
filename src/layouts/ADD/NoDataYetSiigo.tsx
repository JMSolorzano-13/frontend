import { Button, Row, Typography } from "antd";
import { SIIGO_LOGO_URL } from "@utils/SIIGO/urls";

export default function NoDataYetSiigo() {
  return (
    <>
      <Row style={{ justifyContent: "center", marginBottom: 15, marginTop: 50 }}>
        <img src={SIIGO_LOGO_URL} width="240px" />
      </Row>
      <Row style={{ justifyContent: "center", marginBottom: 15 }}>
        <Typography.Text style={{ textAlign: "center" }}>
          Te invitamos a entrar a tu sistema COI para solicitar tu primera sincronización con Siigo fiscal. <br/> Si ya mandaste una sincronización espera unos minutos y refresca la página.
        </Typography.Text>
      </Row>
      <Row style={{ justifyContent: "center" }}>
        <Button type="primary" onClick={() => window.location.reload()}>
          {" "}
          Recargar la página{" "}
        </Button>
      </Row>
      <Row style={{ justifyContent: "center", marginTop: 15 }}>
        <Typography.Text style={{ textAlign: "center" }}>
          Ya esperaste varios minutos y aún no tienes resultados, te recomendamos contactar al servicio a cliente.
        </Typography.Text>
      </Row>
    </>
  );
}
