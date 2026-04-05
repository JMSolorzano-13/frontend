import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import moment from "moment";
import { CFDI_Types } from "@constants/Enums";
import { formatDatesWithOperators } from "@utils/domains";
import { fetchCFDICount } from "@api/cfdi";

type Out = {
  module: CFDIModule;
  payCount: CFDICount | null;
  validationId?: string;
};

type In = {
  module: CFDIModule;
  options?: SearchOptions & {
    overridePeriodDates?: boolean;
  };
  validationId?: string;
  cfdiType?: CFDI_Types;
};

export const getPaymentsCount = createAsyncThunk<
  Out,
  In,
  { rejectValue: string; state: RootState }
>(
  "cfdi/getPaymentsCount",
  async ({ options, module, validationId, cfdiType }, { rejectWithValue, getState }) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in getCFDICount: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }
    const { periodDates, efosPeriodDates } = getState().common;

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

      let payCount: CFDICount | null = null;

      payCount = await (
        await fetchCFDICount(
          company,
          {
            domain: [...domain, ...(options?.domain || [])],
            search: options?.search,
          },
          cfdiType
        )
      ).count;

      return {
        module,
        payCount,
        validationId,
      };
    } catch (e: any) {
      console.error("Unexpected error in payments CFDICount: ", e);
      return rejectWithValue("Error al obtener el conteo de CFDI de pagos");
    }
  }
);
