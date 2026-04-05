import { Button, Row, Typography } from "antd";
import { ReactComponent as Logo } from "@resources/svg/logoez.svg";

export default function NoDataYet() {
  return (
    <>
      <Row style={{ justifyContent: "center", marginBottom: 15, marginTop: 50 }}>
        <Logo style={{ width: "200" }} />
      </Row>
      <Row style={{ justifyContent: "center", marginBottom: 15 }}>
        <Typography.Text style={{ textAlign: "center" }}>
          El sistema se encuentra obteniendo la información más reciente del ADD <br /> Espera unos
          minutos e intenta recargar la página
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
          Si ya has esperado varios minutos te recomendamos verificar que el servidor de CONTPAQi®
          está encendido y funcionando correctamente.
        </Typography.Text>
      </Row>
    </>
  );
}
