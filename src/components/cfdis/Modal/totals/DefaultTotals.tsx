import { Col, Descriptions, Row } from "antd";
import React, { CSSProperties } from "react";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";

type Props = {
  cfdi: IVACFDI | CFDI | undefined;
};

const titleStyle: CSSProperties = {
  fontWeight: 600,
  paddingTop: "10px",
  fontSize: "15px",
};

const totalsStyle: CSSProperties = {
  fontSize: 16,
  marginTop: 15,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
};

const itemStyle = {
  padding: 0,
};

export default function DefaultTotals(props: Props) {
  const { cfdi } = props;
  return (
    <Row gutter={16} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 20 }}>
      <Col
        xs={24}
        md={14}
        lg={16}
        xl={17}
        xxl={18}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <h6 style={titleStyle}>Moneda</h6>
        <Descriptions
          size="small"
          labelStyle={{ fontWeight: 500 }}
          layout="horizontal"
          contentStyle={{ padding: 0 }}
        >
          <Descriptions.Item style={itemStyle} span={3}>
            {cfdi?.Moneda} {cfdi?.c_moneda?.name ? `- ${cfdi?.c_moneda?.name}` : ""}
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col
        xs={24}
        md={10}
        lg={8}
        xl={7}
        xxl={6}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <p style={totalsStyle}>
          <span style={{ fontWeight: 500 }}>Subtotal: </span>
          {formatDisplay(cfdi?.SubTotal ?? null, DisplayType.MONEY)}
        </p>

        {cfdi?.Descuento && cfdi.Descuento !== "0" ? (
          <p style={totalsStyle}>
            <span style={{ fontWeight: 500 }}>Descuento: </span>
            {formatDisplay(cfdi?.Descuento, DisplayType.MONEY)}
          </p>
        ) : null}

        {cfdi?.TrasladosIEPS && cfdi.TrasladosIEPS !== "0" ? (
          <p style={totalsStyle}>
            <span style={{ fontWeight: 500 }}>Traslados IEPS: </span>
            {formatDisplay(cfdi?.TrasladosIEPS, DisplayType.MONEY)}
          </p>
        ) : null}

        {cfdi?.TrasladosISR && cfdi.TrasladosISR !== "0" ? (
          <p style={totalsStyle}>
            <span style={{ fontWeight: 500 }}>Traslados ISR: </span>
            {formatDisplay(cfdi?.TrasladosISR, DisplayType.MONEY)}
          </p>
        ) : null}

        {cfdi?.TrasladosIVA && cfdi.TrasladosIVA !== "0" ? (
          <p style={totalsStyle}>
            <span style={{ fontWeight: 500 }}>Traslados IVA: </span>
            {formatDisplay(cfdi?.TrasladosIVA, DisplayType.MONEY)}
          </p>
        ) : null}

        {cfdi?.RetencionesIEPS && cfdi.RetencionesIEPS !== "0" ? (
          <p style={totalsStyle}>
            <span style={{ fontWeight: 500 }}>Retenciones IEPS: </span>
            {formatDisplay(cfdi?.RetencionesIEPS, DisplayType.MONEY)}
          </p>
        ) : null}

        {cfdi?.RetencionesISR && cfdi.RetencionesISR !== "0" ? (
          <p style={totalsStyle}>
            <span style={{ fontWeight: 500 }}>Retenciones ISR: </span>
            {formatDisplay(cfdi?.RetencionesISR, DisplayType.MONEY)}
          </p>
        ) : null}

        {cfdi?.RetencionesIVA && cfdi.RetencionesIVA !== "0" ? (
          <p style={totalsStyle}>
            <span style={{ fontWeight: 500 }}>Retenciones IVA: </span>
            {formatDisplay(cfdi?.RetencionesIVA, DisplayType.MONEY)}
          </p>
        ) : null}

        <p style={totalsStyle}>
          <span style={{ fontWeight: 800 }}>Total: </span>
          {formatDisplay(cfdi?.Total ?? null, DisplayType.MONEY)}
        </p>
      </Col>
    </Row>
  );
}
