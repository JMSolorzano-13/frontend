import { Card, Col, Row } from "antd";
import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import s from "./Subtotals.module.scss";
import { commonSelector } from "@store/common";
import { EditModeContext } from "@pages/Dashboard/Dashboard";
import WidgetCardOld from "@components/Dashboard/WidgetIVACard/WidgetCardOld";

function Subtotals() {
  const { periods, accumulatedDates, periodDates, datesValue } = useSelector(commonSelector);
  const editMode = useContext(EditModeContext);

  const data = useMemo(() => {
    if (editMode) {
      return {
        subtotalPeriod: 99999999,
        subtotalAccumulated: 99999999,
      };
    }
    if (accumulatedDates === null || periodDates === null) return null;

    let subtotalPeriod = 0;
    let subtotalAccumulated = 0;

    if (datesValue === "Todos") {
      periods.forEach((p) => {
        subtotalPeriod += p.incomes?.subtotal ?? 0;
        subtotalAccumulated += p.incomes?.subtotal ?? 0;
      });
    } else {
      const periodDatesList = periodDates.split("|");
      const accumulatedDatesList = accumulatedDates.split("|");

      const periodInitialDate = new Date(periodDatesList[0]);
      const periodFinalDate = new Date(periodDatesList[1]);
      const accumulatedInitialDate = new Date(accumulatedDatesList[0]);
      const accumulatedFinalDate = new Date(accumulatedDatesList[1]);

      periods.forEach((p) => {
        if (new Date(p.period) >= periodInitialDate && new Date(p.period) < periodFinalDate) {
          subtotalPeriod += p.incomes?.subtotal ?? 0;
        }

        if (
          new Date(p.period) >= accumulatedInitialDate &&
          new Date(p.period) < accumulatedFinalDate
        ) {
          subtotalAccumulated += p.incomes?.subtotal ?? 0;
        }
      });
    }

    return {
      subtotalPeriod,
      subtotalAccumulated,
    };
  }, [periods, accumulatedDates, periodDates, editMode]);

  return (
    <Card className={s.Widget} data-test="subtotals-card">
      <Row gutter={[24, 12]}>
        <Col xs={24} lg={12} style={{ display: "flex" }}>
          <WidgetCardOld
            style={s.SecondaryBorder}
            title="Ingreso del periodo antes de descuentos"
            data={data}
            value={data?.subtotalPeriod}
          />
        </Col>
        <Col xs={24} lg={12} style={{ display: "flex" }}>
          <WidgetCardOld
            style={s.SecondaryBorder}
            data={data}
            title="Ingreso acumulado del ejercicio antes de descuentos"
            value={data?.subtotalAccumulated}
          />
        </Col>
      </Row>
    </Card>
  );
}

export const SubtotalsData = {
  id: "subtotals",
  component: Subtotals,
  className: s.Widget,
};
