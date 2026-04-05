import { Divider, Row, Space, Spin, Table, Tabs } from "antd";
import { CSSProperties } from "react";
import ModalPoliciesInfo from "./ModalPoliciesinfo";
import { useSelector } from "react-redux";
import { cfdiSelector } from "@store/cfdiSlice";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { CFDI_Types } from "@constants/Enums";
import CFDIRelatedColumns, { movementsColumns } from "@pages/CFDI/_utils/columnsPolicies";

const emptyStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
};

const titleStyle: CSSProperties = {
  fontWeight: 600,
  fontSize: "14px",
  color: "#878787",
  padding: 0
};

type Props = {
  visible: boolean;
  setVisible: (newState: boolean) => void;
  setCFDIToDisplay: (state: string) => void;
  setCFDIModalType: (state: string) => void;
  visiblePolicy: boolean;
  setVisiblePolicy: (visible: boolean) => void;
  policyActive: Poliza;
  setCFDITypeToRequest: (state: CFDI_Types) => void
  tab: string
  setTab: (newState: string) => void;
};

export default function ModalPoliciesBody({
  policyActive,
  setVisible,
  setVisiblePolicy,
  setCFDIToDisplay,
  setCFDITypeToRequest,
  tab,
  setTab
}: Props) {

  const { isFetchingPolicy } = useSelector(cfdiSelector);

  const tableColumns = tab === "movements"
    ? movementsColumns()
    : CFDIRelatedColumns({
      setVisible: setVisible,
      setVisiblePolicy,
      setCFDIToDisplay,
      setCFDITypeToRequest
    });

  const dataSource = tab === "movements" ? policyActive?.movimientos : policyActive?.relaciones;

  const adds = {
    cargos: policyActive?.movimientos?.reduce((prev, value) => prev + value?.cargo, 0) || 0,
    abonos: policyActive?.movimientos?.reduce((prev, value) => prev + value?.abono, 0) || 0
  }

  if (isFetchingPolicy) {
    return (
      <Space style={emptyStyle}>
        <Spin size="large" />
      </Space>
    );
  }

  return (
    <>
      <Divider style={{ marginTop: 10 }} />
      <ModalPoliciesInfo policyActive={policyActive} />
      <Divider style={{ marginTop: 5 }} />

      <Tabs
        type="card"
        size="small"
        activeKey={tab}
        items={[
          { label: "Movimientos", key: "movements" },
          { label: "CFDIs relacionados a la póliza", key: "cfdis_related" },
        ]}
        onChange={(key) => setTab(key)}
      />

      <Table
        size="small"
        scroll={{ x: 10 }}
        style={{ backgroundColor: "white", marginBottom: 30 }}
        pagination={false}
        columns={tableColumns as any}
        dataSource={(dataSource as any) || []}
      />

      {
        tab === 'movements' && <Row
          style={{
            padding: "0px 35px 0px 15px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <span style={titleStyle}>Sumas iguales:</span>
          <span style={{ fontWeight: 700 }}>{formatDisplay(adds.cargos, DisplayType.MONEY)}</span>
          <span style={{ fontWeight: 700 }}>{formatDisplay(adds.abonos, DisplayType.MONEY)}</span>
        </Row>
      }

      <Divider />
    </>
  );
}
