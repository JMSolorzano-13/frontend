import { Col, Descriptions, Row } from "antd";
import moment from "moment";
import { CSSProperties } from "react";

const titleStyle: CSSProperties = {
  fontWeight: 500,
  fontSize: "14px",
  color: "#878787",
};

const itemStyle: CSSProperties = {
  padding: 0,
  color: "#0070B3",
  fontWeight: 600,
  fontSize: "16px",
};

const titleStyleConcept: CSSProperties = {
  fontWeight: 500,
  fontSize: "16px",
  color: "#878787",
  padding: 0
};

export default function ModalAttachmentsInfo({ policyActive }: { policyActive: Poliza }) {
  return (
    <Row gutter={16} style={{ padding: "0 15px 15px 15px" }}>
      <Col xs={24} md={4}>
        <h6 style={titleStyle}>Fecha de póliza:</h6>
        <Descriptions
          size="small"
          labelStyle={{ fontWeight: 500 }}
          layout="horizontal"
          contentStyle={{ padding: 0 }}
        >
          <Descriptions.Item span={3}>
            <p style={itemStyle}>{moment.utc(policyActive?.fecha).format("DD/MM/YYYY")}</p>
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col xs={24} md={4}>
        <h6 style={titleStyle}>Tipo de póliza:</h6>
        <Descriptions
          size="small"
          labelStyle={{ fontWeight: 500 }}
          layout="horizontal"
          contentStyle={{ padding: 0 }}
        >
          <Descriptions.Item span={3}>
            <p style={itemStyle}>{policyActive?.tipo}</p>
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col xs={24} md={4}>
        <h6 style={titleStyle}>Número:</h6>
        <Descriptions
          size="small"
          labelStyle={{ fontWeight: 500 }}
          layout="horizontal"
          contentStyle={{ padding: 0 }}
        >
          <Descriptions.Item span={3}>
            <p style={itemStyle}>{policyActive?.numero}</p>
          </Descriptions.Item>
        </Descriptions>
      </Col>

      <Col xs={24} md={8}>
        <h6 style={titleStyle}>Concepto:</h6>
        <Descriptions
          size="small"
          labelStyle={{ fontWeight: 500 }}
          layout="horizontal"
          contentStyle={{ padding: 0 }}
        >
          <Descriptions.Item span={3}>
            <p style={titleStyleConcept}>{policyActive?.concepto}</p>
          </Descriptions.Item>
        </Descriptions>
      </Col>

      <Col xs={24} md={4}>
        <h6 style={titleStyle}>Sistema origen:</h6>
        <Descriptions
          size="small"
          labelStyle={{ fontWeight: 500 }}
          layout="horizontal"
          contentStyle={{ padding: 0 }}
        >
          <Descriptions.Item span={3}>
            <p style={titleStyleConcept}>{policyActive?.sistema_origen}</p>
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
}
