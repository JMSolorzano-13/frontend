import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import moment from "moment";
import { emptyTotals } from "@utils/emptyTotals";
import { CFDI_Types } from "@constants/Enums";
import { formatDatesWithOperators } from "@utils/domains";
import { fetchTotals } from "@api/cfdi";

type Out = {
  module: CFDIModule;
  totals: CFDIsTotals | null;
  validationId?: string;
};

type In = {
  module: CFDIModule;
  options?: SearchOptions & {
    overridePeriodDates?: boolean;
  };
  validationId?: string;
  cfdiTypes: CFDI_Types[];
};

export const getTotals = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "cfdi/getTotals",
  async ({ options, module, validationId, cfdiTypes }, { rejectWithValue, getState }) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in getTotals: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }
    const { periodDates, efosPeriodDates } = getState().common;
    let isBefore2023 = false;

    if (periodDates) {
      const pdates = periodDates.split("|");
      isBefore2023 = moment(pdates[0]).year() + 1 < 2023;
    }

    let types = cfdiTypes;
    if (cfdiTypes.length === 0) {
      types = [
        CFDI_Types.INGRESS,
        CFDI_Types.EGRESS,
        CFDI_Types.PAYMENT,
        CFDI_Types.PAYROLL,
        CFDI_Types.TRANSFER,
      ];
    }

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

      let cfdiTotals: CFDIsTotals | null = null;
      cfdiTotals = await (
        await fetchTotals(
          company,
          {
            domain: [
              ["TipoDeComprobante", "in", types as string[]],
              ...domain,
              ...(options?.domain || []),
            ],
            search: options?.search,
          },
          module,
          cfdiTypes[0] === "P" ? { TipoDeComprobante: "P" } : null
        )
      ).totals;

      return {
        module,
        totals:
          module === "validation-complete" &&
          isBefore2023 &&
          validationId === "recibidosIngresoPUENoBancarizado"
            ? emptyTotals
            : cfdiTotals,
        validationId,
      };
    } catch (e: any) {
      console.error("Unexpected error in getTotals: ", e);
      return rejectWithValue("Error al obtener los CFDIs");
    }
  }
);
