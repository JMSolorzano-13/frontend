import { createAsyncThunk } from "@reduxjs/toolkit";
import ld from "lodash";
import { RootState } from "../store";
import { fetchPeriod } from "@api/cfdi";
import { getMonthName, zeroPad } from "@utils/dateHelper";

type Out = {
  periods: FormattedPeriodData[];
  periodsADD: PeriodTree[];
  // periodsDates: string;
  // accumulatedDates: string;
};

export const getPeriods = createAsyncThunk<Out, void, { rejectValue: string; state: RootState }>(
  "cfdi/getPeriods",
  async (_, { rejectWithValue, getState }) => {
    const { company } = getState().auth;
    if (!company) {
      console.error("Error in getPeriods: no company selected");
      return rejectWithValue("Sin compañía seleccionada");
    }

    try {
      const { periods } = await fetchPeriod(company);

      const parsedPeriods: {
        year: string;
        total: number;
        months: { month: string; total: number }[];
      }[] = [];

      ld.forEach(periods, (data, date) => {
        const [year, month] = date.split("-");
        const pPeriod = parsedPeriods.find((pp) => pp.year === year);
        if (pPeriod) {
          pPeriod.months.push({
            month,
            total: (data.incomes?.count ?? 0) + (data.expenses?.count ?? 0),
          });
          pPeriod.total += (data.incomes?.count ?? 0) + (data.expenses?.count ?? 0);
        } else {
          parsedPeriods.push({
            year,
            total: (data.incomes?.count ?? 0) + (data.expenses?.count ?? 0),
            months: [
              {
                month,
                total: (data.incomes?.count ?? 0) + (data.expenses?.count ?? 0),
              },
            ],
          });
        }
      });

      parsedPeriods.sort((a, b) => {
        if (a.year < b.year) {
          return -1;
        }
        if (a.year > b.year) {
          return 1;
        }
        return 0;
      });
      parsedPeriods.forEach((pP) => {
        pP.months.sort((a, b) => Number(a.month) - Number(b.month));
      });

      const periodsOut: PeriodTree[] = [];
      const periodsADD: PeriodTree[] = [];
      parsedPeriods.forEach((pP) => {
        const children: { title: string; value: string }[] = [];
        pP.months.forEach((m) => {
          const periodEndMonth = Number(m.month) + 1;
          children.unshift({
            title: `${pP.year} - ${getMonthName(parseInt(m.month, 10))}`,
            value: `${pP.year}-${m.month}-01T00:00:00.000Z|${
              periodEndMonth > 12 ? Number(pP.year) + 1 : pP.year
            }-${zeroPad(periodEndMonth > 12 ? 1 : periodEndMonth, 2)}-01T00:00:00.000Z|${
              pP.year
            }-01-01T00:00:00.000Z`,
          });
        });
        periodsOut.unshift({
          title: `${pP.year}`,
          value: `${pP.year}-01-01T00:00:00.000Z|${Number(pP.year) + 1}-01-01T00:00:00.000Z`,
          children,
        });
        periodsADD.unshift({
          title: `${pP.year}`,
          value: `${pP.year}-01-01T00:00:00.000Z|${Number(pP.year) + 1}-01-01T00:00:00.000Z`,
          children,
        });
      });

      /* const now = new Date()
    const nowYear = now.getFullYear()
    const nowMonth = now.getMonth() + 1
    const periodYear = periodsOut.find((p) => p.title === nowYear.toString())
    if (periodYear) {
      const hasMonth = periodYear.children.find(
        (c) => c.title === `${nowYear} - ${getMonthName(nowMonth)}`
      )
      if (!hasMonth) {
        periodYear.children.unshift({
          title: `${nowYear} - ${getMonthName(nowMonth)}`,
          value: `${nowYear}-${zeroPad(
            nowMonth,
            2
          )}-01T00:00:00.000Z|${nowYear}-${zeroPad(
            nowMonth + 1,
            2
          )}-01T00:00:00.000Z|${nowYear}-01-01T00:00:00.000Z`,
        })
      }
    } else {
      periodsOut.unshift({
        title: `${nowYear}`,
        value: `${nowYear}-01-01T00:00:00.000Z|${
          nowYear + 1
        }-01-01T00:00:00.000Z`,
        children: [
          {
            title: `${nowYear} - ${getMonthName(nowMonth)}`,
            value: `${nowYear}-${zeroPad(
              nowMonth,
              2
            )}-01T00:00:00.000Z|${nowYear}-${zeroPad(
              nowMonth + 1,
              2
            )}-01T00:00:00.000Z|${nowYear}-01-01T00:00:00.000Z`,
          },
        ],
      })
      periodsADD.unshift({
        title: `${nowYear}`,
        value: `${nowYear}-01-01T00:00:00.000Z|${
          nowYear + 1
        }-01-01T00:00:00.000Z`,
        children: [
          {
            title: `${nowYear} - ${getMonthName(nowMonth)}`,
            value: `${nowYear}-${zeroPad(
              nowMonth,
              2
            )}-01T00:00:00.000Z|${nowYear}-${zeroPad(
              nowMonth + 1,
              2
            )}-01T00:00:00.000Z|${nowYear}-01-01T00:00:00.000Z`,
          },
        ],
      })
    } */

      const formattedPeriods: FormattedPeriodData[] = [];
      ld.forEach(periods, (data, date) => {
        const [year, month] = date.split("-");
        formattedPeriods.push({
          period: new Date(Number(year), Number(month), 0).toISOString(),
          ...data,
        });
      });

      return {
        periods: formattedPeriods,
        periodsADD,
      };
    } catch (e: any) {
      console.error("Unexpected error in getPeriods", e);
      return rejectWithValue("Error al obtener periodos");
    }
  }
);
