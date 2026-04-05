import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import WidgetCard from "@components/Dashboard/WidgetCard";
import { commonSelector } from "@store/common";
import s from "./Totals.module.scss";
import { EditModeContext } from "@pages/Dashboard/Dashboard";

function Totals() {
  const { periods, accumulatedDates, periodDates, datesValue } = useSelector(commonSelector);

  const editMode = useContext(EditModeContext);

  const data = useMemo(() => {
    if (editMode) {
      return {
        ingressPeriod: 99999999,
        ingressAccumulated: 99999999,
        egressPeriod: 99999999,
        egressAccumulated: 99999999,
      };
    }
    if (accumulatedDates === null || periodDates === null) return null;

    let ingressPeriod = 0;
    let ingressAccumulated = 0;
    let egressPeriod = 0;
    let egressAccumulated = 0;

    if (datesValue === "Todos") {
      periods.forEach((p) => {
        ingressPeriod += p.incomes?.neto ?? 0;
        ingressAccumulated += p.incomes?.neto ?? 0;
        egressPeriod += p.expenses?.neto ?? 0;
        egressAccumulated += p.expenses?.neto ?? 0;
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
          ingressPeriod += p.incomes?.neto ?? 0;
          egressPeriod += p.expenses?.neto ?? 0;
        }

        if (
          new Date(p.period) >= accumulatedInitialDate &&
          new Date(p.period) < accumulatedFinalDate
        ) {
          ingressAccumulated += p.incomes?.neto ?? 0;
          egressAccumulated += p.expenses?.neto ?? 0;
        }
      });
    }

    return {
      ingressPeriod,
      ingressAccumulated,
      egressPeriod,
      egressAccumulated,
    };
  }, [periods, accumulatedDates, periodDates, editMode]);

  return (
    <div className={`${s.Widget} flex flex-col xl:flex-row justify-between w-full gap-2 xl:gap-8`}>
      <WidgetCard
        first
        period={data?.ingressPeriod}
        excercise={data?.ingressAccumulated}
        title="Ingresos netos"
      />
      <WidgetCard
        period={data?.egressPeriod}
        excercise={data?.egressAccumulated}
        title="Gastos y compras netas"
      />
    </div>
  );
}

export const TotalsData = {
  id: "totals",
  component: Totals,
  className: s.Widget,
};
