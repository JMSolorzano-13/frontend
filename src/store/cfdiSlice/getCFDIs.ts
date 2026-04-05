import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCFDIs, fetchCFDIsForIVA } from "@api/cfdi";
import { CFDI_Types } from "@constants/Enums";
import { formatDatesWithOperators } from "@utils/domains";
import { RootState } from "../store";
import moment from "moment";
import { getCFDICountFuzzySearch } from "@utils/CFDI/getCFDICountFuzzySearch";

type Out = {
  CFDIs: CFDI[];
  module: CFDIModule;
  quantity: number;
  cfdiCount?: CFDICount;
  payCfdiCount?: CFDICount;
};

type In = {
  forIVA?: boolean;
  ivaTab?: TabIVAType;
  excluded?: boolean;
  module: CFDIModule;
  type: CFDI_Types;
  options?: SearchOptions & {
    overridePeriodDates?: boolean;
  };
  validationId?: string;
  isSearchOrFilter?: boolean;
};

export const getCFDIs = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "cfdi/getCFDIs",
  async (
    { forIVA = false, ivaTab = "CASH", options, module, type, validationId, isSearchOrFilter },
    { rejectWithValue, getState }
  ) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in getCFDIs: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }
    const { periodDates, efosPeriodDates, efosAccumulatedDates, accumulatedDates } =
      getState().common;

    let isBefore2023 = false;

    if (periodDates) {
      const pdates = periodDates.split("|");
      isBefore2023 = moment(pdates[0]).year() + 1 < 2023;
    }
    const periodOpts = options ?? {};

    periodOpts.domain = formatDatesWithOperators(periodOpts.domain ?? []);

    if (
      module === "efos" &&
      efosPeriodDates &&
      efosAccumulatedDates &&
      !periodOpts.overridePeriodDates
    ) {
      if (!efosPeriodDates?.startsWith("Todos")) {
        const pdates = efosPeriodDates.split("|");
        const dateDomain: Domain = [
          ["FechaFiltro", ">=", new Date(pdates[0]).toISOString().replaceAll("Z", "")],
          ["FechaFiltro", "<", new Date(pdates[1]).toISOString().replaceAll("Z", "")],
        ];
        periodOpts.domain = [...dateDomain, ...(periodOpts?.domain ?? [])];
      }
    }

    if (
      module !== "efos" &&
      periodDates &&
      accumulatedDates &&
      !periodOpts.overridePeriodDates &&
      module !== "iva"
    ) {
      if (!periodDates?.startsWith("Todos")) {
        const pdates = periodDates.split("|");
        const dateDomain: Domain = [
          ["FechaFiltro", ">=", new Date(pdates[0]).toISOString().replaceAll("Z", "")],
          ["FechaFiltro", "<", new Date(pdates[1]).toISOString().replaceAll("Z", "")],
        ];
        periodOpts.domain = [...dateDomain, ...(periodOpts?.domain ?? [])];
      }
    }

    if (periodOpts.domain) {
      const updatedDomain: Domain = [];
      periodOpts.domain.map((item) => {
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
      periodOpts.domain = [...updatedDomain];
    }

    if (rfc) {
      // Set module filter
      switch (module) {
        case "issued":
          periodOpts.domain = [...(periodOpts?.domain ?? []), ["is_issued", "=", true]];
          break;

        case "received":
          periodOpts.domain = [...(periodOpts?.domain ?? []), ["is_issued", "=", false]];
          break;

        default:
          break;
      }
    }

    // Set type filter
    switch (type) {
      case CFDI_Types.INGRESS:
        periodOpts.domain = [...(periodOpts?.domain ?? []), ["TipoDeComprobante", "=", "I"]];
        break;

      case CFDI_Types.EGRESS:
        periodOpts.domain = [...(periodOpts?.domain ?? []), ["TipoDeComprobante", "=", "E"]];
        break;

      case CFDI_Types.PAYMENT:
        periodOpts.domain = [...(periodOpts?.domain ?? []), ["TipoDeComprobante", "=", "P"]];
        break;

      case CFDI_Types.PAYROLL:
        periodOpts.domain = [...(periodOpts?.domain ?? []), ["TipoDeComprobante", "=", "N"]];
        break;

      case CFDI_Types.TRANSFER:
        periodOpts.domain = [...(periodOpts?.domain ?? []), ["TipoDeComprobante", "=", "T"]];
        break;

      default:
        periodOpts.domain = [...(periodOpts?.domain ?? []), ...[]];
        break;
    }

    const periodDomains: Domain = periodOpts.domain.map((item) => {
      if (item[0] === "FechaFiltro") {
        const date = `${item[2]?.toLocaleString().split("T")[0]}T00:00:00.000`;
        return [item[0], item[1], date];
      } else {
        return item;
      }
    });

    try {
      let periodCFDIs;
      if (forIVA) {
        periodCFDIs = await await fetchCFDIsForIVA(
          company,
          {
            ...periodOpts,
            domain: periodDomains,
          },
          ivaTab
        );
      } else {
        periodCFDIs = await await fetchCFDIs(
          company,
          { ...periodOpts, domain: periodDomains },
          type
        );
      }

      return {
        CFDIs:
          module === "validation-complete" &&
          isBefore2023 &&
          validationId === "recibidosIngresoPUENoBancarizado"
            ? []
            : periodCFDIs.cfdis,
        module,
        type,
        quantity: periodCFDIs.totalRecords,
        ...(isSearchOrFilter && {
          cfdiCount: getCFDICountFuzzySearch(type, periodCFDIs.totalRecords.toString()),
        }),
        ...(isSearchOrFilter && {
          payCfdiCount: getCFDICountFuzzySearch(type, periodCFDIs.totalRecords.toString()),
        }),
      };
    } catch (error) {
      console.error("Unexpected error in getCFDIs: ", error);
      return rejectWithValue("Error al obtener los CFDIs");
    }
  }
);
