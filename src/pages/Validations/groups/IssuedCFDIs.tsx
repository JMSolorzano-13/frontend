import { Card, Col, Row } from "antd";
import { CFDI_Types } from "@constants/Enums";
import ValidationCard from "../ValidationCard";

const groupName = "Emitidos";

export default function IssuedCFDIs() {
  // const {periodDates} = useSelector(commonSelector)
  // const pdates = periodDates?.split('|') ?? ['', '']

  return (
    <Col span={24}>
      <Card style={{ marginBottom: "1rem" }}>
        <div style={{ marginBottom: 10 }}>
          <h5 id="ilm_issued_title">{groupName}</h5>
        </div>
        <Row gutter={[12, 12]}>
          <Col xs={24} lg={12} xl={6} xxl={4}>
            <ValidationCard
              title="Ingresos PUE"
              subtitle='con forma de pago "99"'
              validationId="emitidosIngresoPUE"
              validationDomain={[
                ["MetodoPago", "=", "PUE"],
                ["FormaPago", "=", "99"],
                ["Estatus", "=", true],
                ["is_issued", "=", true],
              ]}
              cfdiTypes={[CFDI_Types.INGRESS]}
              group={groupName}
            />
          </Col>
          <Col xs={24} lg={12} xl={6} xxl={4}>
            <ValidationCard
              title="Ingresos PUE"
              subtitle="con CFDIs de pagos relacionados"
              validationId="emitidosIngresoPUEConPagos"
              validationDomain={[
                ["MetodoPago", "=", "PUE"],
                ["is_issued", "=", true],
                ["Estatus", "=", true],
                ["active_payments", "=", "any"],
              ]}
              cfdiTypes={[CFDI_Types.INGRESS]}
              group={groupName}
            />
          </Col>
          <Col xs={24} lg={12} xl={6} xxl={4}>
            <ValidationCard
              title="Egresos"
              subtitle="sin CFDIs relacionados"
              validationId="emitidosEgresoSinCFDI"
              validationDomain={[
                ["TipoDeComprobante_E_CfdiRelacionados_None", "=", true],
                ["is_issued", "=", true],
                ["Estatus", "=", true],
              ]}
              cfdiTypes={[CFDI_Types.EGRESS]}
              group={groupName}
            />
          </Col>
          {/* <Col xs={24} lg={12} xl={6} xxl={4}>
            <ValidationCard
              title="Cancelados"
              validationId="emitidosCancelados"
              validationDomain={[
                ['FechaCancelacion', '>=', pdates[0]],
                ['FechaCancelacion', '<', pdates[1]],
                ['FechaCertificacionSat', '<', pdates[0]],
                ['is_issued', '=', true],
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
