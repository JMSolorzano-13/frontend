import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPayrollTotals } from "@api/cfdi";
import { CFDI_Types } from "@constants/Enums";
import { formatDatesWithOperators } from "@utils/domains";
import { RootState } from "../store";
import moment from "moment";

type Out = {
  module: CFDIModule;
  totals: PayrollTotals;
};

type In = {
  module: CFDIModule;
  options?: SearchOptions & {
    overridePeriodDates?: boolean;
  };
};

export const getPayrollTotals = createAsyncThunk<
  Out,
  In,
  { rejectValue: string; state: RootState }
>("cfdi/getPayrollTotals", async ({ options, module }, { rejectWithValue, getState }) => {
  const { company, rfc } = getState().auth;
  if (!company || !rfc) {
    console.error("Error in getPayrollTotals: no company or rfc selected");
    return rejectWithValue("Sin compañía o RFC");
  }
  const { periodDates, efosPeriodDates } = getState().common;

  const types = [CFDI_Types.PAYROLL];
  const domain: Domain = [];

  if (options) {
    options.domain = formatDatesWithOperators(options.domain ?? []);
  }

  if (
    module === "efos" &&
    efosPeriodDates &&
    !efosPeriodDates?.startsWith("Todos") &&
    !options?.overridePeriodDates
  ) {
    const pdates = efosPeriodDates.split("|");
    const dateDomain: Domain = [
      ["FechaFiltro", ">=", new Date(pdates[0]).toISOString().replaceAll("Z", "")],
      ["FechaFiltro", "<", new Date(pdates[1]).toISOString().replaceAll("Z", "")],
    ];
    domain.push(...dateDomain);
  }

  if (
    module !== "efos" &&
    periodDates &&
    !periodDates?.startsWith("Todos") &&
    !options?.overridePeriodDates
  ) {
    const pdates = periodDates.split("|");
    const dateDomain: Domain = [
      ["FechaFiltro", ">=", new Date(pdates[0]).toISOString().replaceAll("Z", "")],
      ["FechaFiltro", "<", new Date(pdates[1]).toISOString().replaceAll("Z", "")],
    ];
    domain.push(...dateDomain);
  }

  if (options && options.domain) {
    const updatedDomain: Domain = [];
    options.domain.map((item) => {
      const hasDate = item[0] === "Fecha";
      const isEqual = item[1] === "=";
      const isGreater = item[1] === ">";
      const isLessThan = item[1] === "<=";
      const newDate = item[2] as string;
      if (hasDate && isEqual && newDate) {
        updatedDomain.push(
          [
            "Fecha",
            ">=",
            `${new Date(newDate).toISOString().replaceAll("Z", "").split("T")[0]}T00:00:00.000`,
          ],
          [
            "Fecha",
            "<",
            `${
              moment(newDate).add(1, "day").toISOString().replaceAll("Z", "").split("T")[0]
            }T00:00:00.000`,
          ]
        );
      } else if (hasDate && isGreater) {
        updatedDomain.push([
          "Fecha",
          ">",
          `${
            moment(newDate).add(1, "day").toISOString().replaceAll("Z", "").split("T")[0]
          }T00:00:00.000`,
        ]);
      } else if (hasDate && isLessThan) {
        updatedDomain.push([
          "Fecha",
          "<=",
          `${
            moment(newDate).add(1, "day").toISOString().replaceAll("Z", "").split("T")[0]
          }T00:00:00.000`,
        ]);
      } else {
        updatedDomain.push(item);
      }
    });
    options.domain = [...updatedDomain];
  }

  try {
    if (rfc) {
      // Set module filter
      switch (module) {
        case "issued":
          domain.push(["is_issued", "=", true]);
          break;

        case "received":
          domain.push(["is_issued", "=", false]);
          break;

        default:
          break;
      }
    }

    const cfdiTotals = (await await fetchPayrollTotals(company, {
      domain: [
        ["TipoDeComprobante", "in", types as string[]],
        ...domain,
        ...(options?.domain || []),
      ],
      search: options?.search,
    })) as PayrollTotals;

    return {
      module,
      totals: cfdiTotals,
    };
  } catch (e: any) {
    console.error("Unexpected error in getTotals: ", e);
    return rejectWithValue("Error al obtener los CFDIs");
  }
});
