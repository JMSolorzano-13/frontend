import { Col, Grid, Row } from "antd";
import { CSSProperties } from "react";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";

type Props = {
  cfdi: CFDI | undefined;
};

const totalsStyle: CSSProperties = {
  fontSize: 16,
  marginTop: 15,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
};

export default function IVADefaultTotals({ cfdi }: Props) {
  const { useBreakpoint } = Grid;
  const { md, lg } = useBreakpoint();
  return (
    <Row
      gutter={16}
      style={{
        borderBottom: "1px solid #f0f0f0",
        paddingBottom: 20,
        alignItems: "flex-start",
        justifyContent: "center",
        width: "102%",
        gap: 8,
      }}
    >
      <Col
        xs={24}
        md={11}
        lg={11}
        xl={11}
        xxl={11}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <p
          style={{
            ...totalsStyle,
            justifyContent: "flex-end",
            marginLeft: md ? "-11px" : "0",
          }}
        >
          <span style={{ fontWeight: 500, marginRight: 20, fontSize: "14px" }}>
            Total de percepciones y otros pagos
          </span>
          <span style={{ fontSize: "14px" }}>
            {formatDisplay(
              cfdi?.nomina?.TotalOtrosPagos || cfdi?.nomina?.TotalPercepciones
                ? cfdi?.nomina?.TotalOtrosPagos + cfdi?.nomina?.TotalPercepciones
                : null,
              DisplayType.MONEY
            )}
          </span>
        </p>
      </Col>
      <Col
        xs={24}
        md={11}
        lg={11}
        xl={11}
        xxl={11}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <p
          style={{
            ...totalsStyle,
            justifyContent: "flex-end",
            marginRight: lg ? "-32px" : md ? "-20px" : 0,
          }}
        >
          <span style={{ fontWeight: 500, marginRight: 20, fontSize: "14px" }}>
            Total de deducciones:{" "}
          </span>
          <span style={{ fontSize: "14px" }}>
            {formatDisplay(cfdi?.nomina?.TotalDeducciones, DisplayType.MONEY)}
          </span>
        </p>

        <p
          style={{
            ...totalsStyle,
            justifyContent: "flex-end",
            marginRight: lg ? "-32px" : md ? "-20px" : 0,
          }}
        >
          <span style={{ fontWeight: 500, marginRight: 20, fontSize: "14px" }}>Neto a pagar: </span>
          <span style={{ fontSize: "14px" }}>
            {formatDisplay(cfdi?.nomina?.NetoAPagar, DisplayType.MONEY)}
          </span>
        </p>
      </Col>
    </Row>
  );
}
