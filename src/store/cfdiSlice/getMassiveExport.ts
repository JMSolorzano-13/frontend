import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMassiveExport } from "@api/cfdi";
import { ADD_CFDI_Types, CFDI_Types } from "@constants/Enums";
import { CFDIFields } from "@constants/Fields";
import { formatDatesWithOperators } from "@utils/domains";
import { RootState } from "../store";
import moment from "moment";
import { getExportCFDIName } from "@utils/getExportFileName";

type Out = {
  module: CFDIModule;
  massiveExport: MassiveExportResponse;
};

type In = {
  module: CFDIModule;
  type: CFDI_Types | ADD_CFDI_Types;
  options?: SearchOptions & {
    overridePeriodDates?: boolean;
  };
  fields: string[];
  seccionType: string | null;
  exportType?: string;
};

export const getMassiveExport = createAsyncThunk<
  Out,
  In,
  { rejectValue: string; state: RootState }
>(
  "cfdi/getMassiveExport",
  async (
    { options, module, type, fields, seccionType, exportType },
    { rejectWithValue, getState }
  ) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in getCFDIs: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }
    const { periodDates, efosPeriodDates, efosAccumulatedDates, accumulatedDates } =
      getState().common;
    const periodOpts = options ?? {};
    const fieldsToExport = fields ?? CFDIFields;
    const optionsDomain = options?.domain;

    // Export INACTIVE CFDIs for ADD
    if (
      seccionType &&
      seccionType === "ADD" &&
      optionsDomain &&
      optionsDomain.length > 0 &&
      optionsDomain[0].includes("!=")
    ) {
      periodOpts.domain = [...(periodOpts?.domain ?? []), ["add_cancel_date", "=", null]];
    }

    // Export ACTIVE CFDIs for ADD
    if (
      seccionType &&
      seccionType === "ADD" &&
      optionsDomain &&
      optionsDomain.length > 0 &&
      optionsDomain[0].includes("=")
    ) {
      periodOpts.domain = [
        ...(periodOpts?.domain ?? []),
        ["add_exists", "=", false],
        ["add_cancel_date", "=", null],
      ];
    }

    // Export ALL CFDIs for ADD
    if (seccionType && seccionType === "ADD" && optionsDomain && optionsDomain.length === 0) {
      periodOpts.domain = [
        ...(periodOpts?.domain ?? []),
        ["add_exists", "=", false],
        ["add_cancel_date", "=", null],
      ];
    }

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

    if (module !== "efos" && periodDates && accumulatedDates && !periodOpts.overridePeriodDates) {
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
        break;
    }
    const file_name = getExportCFDIName(rfc, periodOpts.domain as Domain, exportType);

    try {
      const massiveExport: MassiveExportResponse = await (
        await fetchMassiveExport(
          company,
          periodOpts,
          fieldsToExport,
          type,
          seccionType,
          exportType,
          file_name
        )
      ).exportResponse;

      return {
        massiveExport,
        module,
      };
    } catch (error) {
      console.error("Unexpected error in getCFDIMassiveExports: ", error);
      return rejectWithValue("Ocurrió un error al realizar la descarga del Periodo");
    }
  }
);
