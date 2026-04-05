import { Button, Card, Grid } from "antd";
import { useMemo, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BarChartOutlined, LineChartOutlined } from "@ant-design/icons";
import s from "./LineChartTotals.module.scss";
import { commonSelector } from "@store/common";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { tailwindColors } from "@utils/tailwindColors";
import { IS_SIIGO } from "@utils/SIIGO/Global";

const { useBreakpoint } = Grid;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const generalLabels = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function LineChartTotals() {
  const screens = useBreakpoint();
  const [isBarChart, setIsBarChart] = useState(true);
  const { periods, accumulatedDates, datesValue } = useSelector(commonSelector);

  const [datasets, labels] = useMemo(() => {
    if (accumulatedDates === null) {
      return [null, null];
    }

    const ingressData: number[] = [];
    const egressData: number[] = [];

    let labels: string[] = [];

    if (datesValue === "Todos") {
      const years: {
        [key: string]: { month: number; income: number; expense: number }[];
      } = {};
      periods.forEach((p) => {
        const pDate = new Date(p.period);
        const year = pDate.getUTCFullYear();
        const month = pDate.getUTCMonth();

        if (!years[year]) {
          years[year] = [];
        }

        years[year].push({
          month,
          income: p.incomes?.neto ?? 0,
          expense: p.expenses?.neto ?? 0,
        });
      });

      const orderedYears = Object.keys(years).sort((a, b) => {
        return parseInt(a, 10) - parseInt(b, 10);
      });

      labels = orderedYears;

      orderedYears.forEach((y) => {
        const yearData = years[y];

        let totalIngress = 0;
        let totalEgress = 0;

        yearData.forEach((yd) => {
          totalIngress += yd.income;
          totalEgress += yd.expense;
        });

        ingressData.push(totalIngress);
        egressData.push(totalEgress);
      });
    } else {
      const accumulatedDatesList = accumulatedDates.split("|");
      const startMonth = new Date(accumulatedDatesList[0]).getUTCMonth();
      let endMonth = new Date(accumulatedDatesList[1]).getUTCMonth();
      const year = new Date(accumulatedDatesList[0]).getUTCFullYear();
      const endYear = new Date(accumulatedDatesList[1]).getUTCFullYear();

      if (endYear > year) {
        endMonth = 12;
      }

      labels = generalLabels.slice(startMonth, endMonth);

      for (let i = startMonth; i < endMonth; i += 1) {
        const monthIndex = periods.findIndex((p) => {
          const pDate = new Date(p.period);
          if (pDate.getUTCMonth() === i && pDate.getUTCFullYear() === year) {
            return true;
          }
          return false;
        });
        if (monthIndex > -1) {
          ingressData.push(periods[monthIndex].incomes?.neto ?? 0);
          egressData.push(periods[monthIndex].expenses?.neto ?? 0);
        } else {
          ingressData.push(0);
          egressData.push(0);
        }
      }
    }

    const primaryColor = IS_SIIGO ? tailwindColors.sg_primary["500"] : tailwindColors.primary;
    const secondaryColor = IS_SIIGO ? tailwindColors.sg_secondary["600"] : tailwindColors.secondary;

    const datasets = [
      {
        label: "Ingreso neto",
        borderColor: primaryColor,
        backgroundColor: primaryColor,
        data: ingressData,
      },
      {
        label: "Gastos y compras netas",
        borderColor: secondaryColor,
        backgroundColor: secondaryColor,
        data: egressData,
      },
    ];

    return [datasets, labels];
  }, [periods, accumulatedDates]);

  const indexAxis: "x" | "y" = screens.sm ? "x" : "y";
  const yScales = {
    y: {
      ticks: {
        callback: (value: string | number) => formatDisplay(value, DisplayType.MONEY) as string,
      },
    },
  };
  const xScales = {
    x: {
      ticks: {
        callback: (value: string | number) => formatDisplay(value, DisplayType.MONEY) as string,
      },
    },
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis,
    scales: screens.sm ? yScales : xScales,
    plugins: {
      title: {
        display: false,
      },
    },
  };

  return (
    <Card className={s.Widget}>
      {datasets && labels ? (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="default"
              size="small"
              icon={isBarChart ? <LineChartOutlined /> : <BarChartOutlined />}
              onClick={() => setIsBarChart(!isBarChart)}
            />
          </div>
          <div className={s.Chart}>
            {isBarChart ? (
              <Bar
                className={s.Bars}
                data={{
                  labels,
                  datasets,
                }}
                options={options}
              />
            ) : (
              <Line
                className={s.Lines}
                data={{
                  labels,
                  datasets,
                }}
                options={options}
              />
            )}
          </div>
        </>
      ) : null}
    </Card>
  );
}

export const LineChartTotalsData = {
  id: "linecharttotals",
  component: LineChartTotals,
  className: s.Widget,
};
