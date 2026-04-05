import { CSSProperties } from "react";
import { Col, Descriptions, Row, Typography } from "antd";
import PayrollTable from "./PayrollTable";
import IVADefaultTotals from "./PayrollDefaultTotals";
import moment from "moment";

type Props = {
  cfdi: CFDI | undefined;
  visible: boolean;
  isLoading?: boolean;
};

const titleStyle: CSSProperties = {
  fontWeight: 600,
  paddingTop: "10px",
  fontSize: "15px",
};

const itemStyle: CSSProperties = {
  padding: 0,
};

export default function PayrollModalBody(props: Props) {
  const { cfdi, isLoading } = props;
  const CFDIToDisplay = cfdi;
  return (
    <>
      <Row
        id="details_modal_body"
        gutter={16}
        style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 12, marginBottom: "10px" }}
      >
        <Col xs={24} md={8}>
          <h6 style={titleStyle}>Emisor</h6>
          <Descriptions
            size="small"
            labelStyle={{ fontWeight: 500 }}
            layout="horizontal"
            contentStyle={{ padding: 0 }}
          >
            <Descriptions.Item style={itemStyle} span={3} label="Nombre">
              {CFDIToDisplay?.NombreEmisor}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="RFC">
              {CFDIToDisplay?.RfcEmisor}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Registro patronal">
              {CFDIToDisplay?.nomina?.EmisorRegistroPatronal}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Lugar de expedición">
              {CFDIToDisplay?.LugarExpedicion}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Régimen fiscal">
              {`${CFDIToDisplay?.RegimenFiscalEmisor ? CFDIToDisplay?.RegimenFiscalEmisor : ""} - ${
                CFDIToDisplay?.c_regimen_fiscal_emisor?.name
                  ? CFDIToDisplay?.c_regimen_fiscal_emisor?.name
                  : ""
              }`}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col xs={24} md={8}>
          <h6 style={titleStyle}>Receptor</h6>
          <Descriptions size="small" labelStyle={{ fontWeight: 500 }} layout="horizontal">
            <Descriptions.Item style={itemStyle} span={3} label="Nombre">
              {CFDIToDisplay?.NombreReceptor}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="RFC">
              {CFDIToDisplay?.RfcReceptor}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Domicilio fiscal">
              {CFDIToDisplay?.DomicilioFiscalReceptor ? CFDIToDisplay?.DomicilioFiscalReceptor : ""}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Tipo régimen">
              {CFDIToDisplay?.nomina?.ReceptorTipoRegimen}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xs={24} md={8}>
          <h6 style={titleStyle}>Detalles del recibo nómina</h6>
          <Descriptions size="small" labelStyle={{ fontWeight: 500 }} layout="horizontal">
            <Descriptions.Item style={itemStyle} span={3} label="Fecha de pago">
              {moment(cfdi?.nomina?.FechaPago).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Tipo de nómina">
              {cfdi?.nomina?.c_ReceptorPeriodicidadPago?.name}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Fecha inicial">
              {moment(cfdi?.nomina?.FechaInicialPago).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Fecha final">
              {moment(cfdi?.nomina?.FechaFinalPago).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Días pagados">
              {cfdi?.nomina?.NumDiasPagados}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <>
        <PayrollTable cfdi={cfdi} loading={isLoading} />
        <IVADefaultTotals cfdi={cfdi} />
      </>
      <Row gutter={24} justify="start" style={{ marginTop: 10, marginLeft: 2 }}>
        {/* <Col xs={24} md={12}>
          <Typography.Title level={5}>Sello Fiscal</Typography.Title>
          <Typography.Text>{cfdi?.Sello}</Typography.Text>
        // </Col> */}
        {/* <Col xs={24} md={12}> */}
        <Row>
          <Typography.Title level={5}>UUID:</Typography.Title>
          <Typography.Text style={{ marginLeft: 10 }}>{cfdi?.UUID}</Typography.Text>
        </Row>
        {/* </Col> */}
      </Row>
    </>
  );
}
