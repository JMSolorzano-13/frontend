import { Card, Col, Row } from "antd";
import { CFDI_Types } from "@constants/Enums";
import ValidationCard from "../ValidationCard";

const groupName = "Recibidos";

export default function ReceivedCFDIs() {
  // const {periodDates} = useSelector(commonSelector)
  // const pdates = periodDates?.split('|') ?? ['', '']

  return (
    <Col span={24}>
      <Card>
        <div style={{ marginBottom: 10 }}>
          <h5 id="ilm_received_title">{groupName}</h5>
        </div>
        <Row gutter={[12, 12]}>
          <Col xs={24} lg={12} xl={6} xxl={4}>
            <ValidationCard
              title="Ingresos PUE"
              subtitle='con forma de pago "99", no bancarizada'
              validationId="recibidosIngresoPUENoBancarizado"
              validationDomain={[
                ["MetodoPago", "=", "PUE"],
                ["FormaPago", "not in", ["02", "03", "04", "05", "06", "28", "29"]],
                ["Estatus", "=", true],
                ["is_issued", "=", false],
              ]}
              cfdiTypes={[CFDI_Types.INGRESS]}
              group={groupName}
            />
          </Col>
          <Col xs={24} lg={12} xl={6} xxl={4}>
            <ValidationCard
              title="Ingresos PUE"
              subtitle="con CFDIs de pago relacionados"
              validationId="recibidosIngresoPUEConPagos"
              validationDomain={[
                ["MetodoPago", "=", "PUE"],
                ["is_issued", "=", false],
                ["active_payments", "=", "any"],
                ["Estatus", "=", true],
              ]}
              cfdiTypes={[CFDI_Types.INGRESS]}
              group={groupName}
            />
          </Col>
          <Col xs={24} lg={12} xl={6} xxl={4}>
            <ValidationCard
              title="Egresos"
              subtitle="sin CFDIs relacionados"
              validationId="recibidosEgresoSinCfdi"
              validationDomain={[
                ["TipoDeComprobante_E_CfdiRelacionados_None", "=", true],
                ["is_issued", "=", false],
                ["Estatus", "=", true],
              ]}
              cfdiTypes={[CFDI_Types.EGRESS]}
              group={groupName}
            />
          </Col>
          {/* <Col xs={24} lg={12} xl={6} xxl={4}>
            <ValidationCard
              title="Cancelados"
              validationId="recibidosCancelados"
              validationDomain={[
                ['FechaCancelacion', '>=', pdates[0]],
                ['FechaCancelacion', '<', pdates[1]],
                ['FechaCertificacionSat', '<', pdates[0]],
                ['is_issued', '=', false],
              ]}
              cfdiTypes={[]}
              group={groupName}
            />
          </Col> */}
        </Row>
      </Card>
    </Col>
  );
}
