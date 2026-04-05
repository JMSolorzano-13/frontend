import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { Col, Descriptions, Row, Skeleton } from "antd";
import { CSSProperties } from "react";

type Props = {
  cfdi: CFDI | undefined;
  loading: boolean | undefined;
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
  justifyContent: "flex-end",
  alignItems: "flex-end",
};

const itemStyle = {
  padding: 0,
};

export default function PPDTotals(props: Props) {
  const { cfdi, loading } = props;

  return (
    <Row style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 20 }}>
      <Col xs={24} md={16} lg={14} xl={10} xxl={10} className="flex flex-col md:flex-row">
        <div style={{}}>
          <h6 style={titleStyle}>Moneda</h6>
          <Descriptions
            size="small"
            labelStyle={{ fontWeight: 500 }}
            layout="horizontal"
            contentStyle={{ padding: 0 }}
          >
            <Descriptions.Item style={itemStyle} span={3}>
              {loading ? (
                <Skeleton active paragraph={{ rows: 0, width: 25 }} />
              ) : (
                cfdi?.payments[0]?.MonedaP
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div style={{}}>
          <h6 style={titleStyle}>Forma de pago</h6>
          <Descriptions
            size="small"
            labelStyle={{ fontWeight: 500 }}
            layout="horizontal"
            contentStyle={{ padding: 0 }}
          >
            <Descriptions.Item style={itemStyle} span={3}>
              {loading ? (
                <Skeleton active paragraph={{ rows: 0, width: 25 }} />
              ) : (
                cfdi?.payments[0]?.c_forma_pago?.name
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div style={{}}>
          <h6 style={titleStyle}>Tipo de cambio</h6>
          <Descriptions
            size="small"
            labelStyle={{ fontWeight: 500 }}
            layout="horizontal"
            contentStyle={{ padding: 0 }}
          >
            <Descriptions.Item style={itemStyle} span={3}>
              {loading ? (
                <Skeleton active paragraph={{ rows: 0, width: 25 }} />
              ) : (
                cfdi?.payments[0]?.TipoCambioP && cfdi?.payments[0]?.TipoCambioP + ".00"
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Col>
      <Col xs={24} md={8} lg={10} xl={14} xxl={14} style={{}}>
        <p style={totalsStyle}>
          <span style={{ fontWeight: 800, marginRight: 30 }}>Total monto pagado: </span>
          {loading ? (
            <Skeleton active paragraph={{ rows: 0, width: 100 }} />
          ) : (
            formatDisplay(cfdi?.Total ?? null, DisplayType.MONEY)
          )}
        </p>
      </Col>
    </Row>
  );
}
