import { Col, Row } from "antd";
import s from "../_styles/ISR.module.scss";
import { TabHeaderType } from "../_types/ISRTypes";
import TopTabIncomes from "./TopTabIncomes";
import TopTabDeductions from "./TopTabDeductions";

export default function ISRTabHeader(props: TabHeaderType) {
  const { currentTopTab, setTopTab, totals, loading, setTab, totalsDeductions, company, period } = props;
  return (
    <Row className={s.TopTabsContainer}>
      <Col style={{ flex: 0.5, gap: 5 }}>
        <Row style={{ display: "flex", gap: 4 }}>
          <TopTabIncomes
            section="incomes"
            active={currentTopTab === "incomes"}
            changeCurrentTopTab={setTopTab}
            currentTotals={(totals as any)?.period}
            loading={loading}
            text="Ingresos acumulables"
            text2="ISR retenido a favor"
            setTab={setTab}
            currentTopTab={currentTopTab}
            company={company}
            period={period}

          />

          <TopTabDeductions
            section="deductions"
            active={currentTopTab === "deductions"}
            changeCurrentTopTab={setTopTab}
            currentTotals={currentTopTab === "deductions" ? ({totalsDeductions} as any) : (totals as any)?.period}
            loading={loading}
            text="Deducciones"
            text2="ISR retenido a cargo"
            setTab={setTab}
            currentTopTab={currentTopTab}
          />
        </Row>
      </Col>
    </Row>
  );
}
