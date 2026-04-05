import { Row, Typography } from "antd";
import Logo from "@resources/img/logo.png";

export default function ADDDisabled() {
  return (
    <>
      <Row style={{ justifyContent: "center", marginBottom: 35, marginTop: 50 }}>
        <img src={Logo} width="200px" />
      </Row>
      <Row style={{ justifyContent: "center", marginBottom: 10 }}>
        <Typography.Text style={{ textAlign: "center", fontSize: 20 }}>
          Estamos experimentando problemas con el módulo de sincronización ADD.
        </Typography.Text>
      </Row>
      <Row style={{ justifyContent: "center", marginBottom: 10 }}>
        <Typography.Text style={{ textAlign: "center", fontSize: 20 }}>
          Nos encontramos dando mantenimiento al módulo para restablecer su funcionamiento a la
          brevedad.
        </Typography.Text>
      </Row>
      <Row style={{ justifyContent: "center", marginTop: 10 }}>
        <Typography.Text style={{ textAlign: "center", fontSize: 20 }}>
          Te mantendremos informado.
        </Typography.Text>
      </Row>
    </>
  );
}
