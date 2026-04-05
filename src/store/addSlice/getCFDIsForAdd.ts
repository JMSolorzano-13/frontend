import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCFDIsForADD } from "@api/ADD";
import { ADD_CFDI_Types } from "@constants/Enums";
import { formatDatesWithOperators } from "@utils/domains";
import { RootState } from "../store";

type Out = {
  CFDIs: ADDCFDI[];
  module: CFDIModule;
  total: number;
};

type In = {
  module: CFDIModule;
  type: ADD_CFDI_Types;
  options?: SearchOptions & {
    overridePeriodDates?: boolean;
  };
};

export const getCFDIsForAdd = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "add/getCFDIsForAdd",
  async ({ options, module, type }, { rejectWithValue, getState }) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in getCFDIsForAdd: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }
    const { periodDates, efosPeriodDates, efosAccumulatedDates, accumulatedDates } =
      getState().common;
    const periodOpts = options ?? {};

    periodOpts.domain = formatDatesWithOperators(periodOpts.domain ?? []);
    const optionsDomain = options?.domain;

    // Get INACTIVE CFDIs
    if (optionsDomain && optionsDomain.length > 0 && optionsDomain[0].includes("!=")) {
      periodOpts.domain = [...(periodOpts?.domain ?? []), ["add_cancel_date", "=", null]];
    }

    // Get ACTIVE CFDIs
    if (optionsDomain && optionsDomain.length > 0 && optionsDomain[0].includes("=")) {
      periodOpts.domain = [
        ...(periodOpts?.domain ?? []),
        ["add_exists", "=", false],
        ["add_cancel_date", "=", null],
      ];
    }

    // Get ALL CFDIs
    if (optionsDomain && optionsDomain.length === 0) {
      periodOpts.domain = [...(periodOpts?.domain ?? []), ["need_add_action", "=", true]];
    }

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
          ["Fecha", ">=", new Date(pdates[0]).toISOString().replaceAll("Z", "")],
          ["Fecha", "<", new Date(pdates[1]).toISOString().replaceAll("Z", "")],
        ];
        periodOpts.domain = [...dateDomain, ...(periodOpts?.domain ?? [])];
      }
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
      case ADD_CFDI_Types.INGRESS:
        periodOpts.domain = [...(periodOpts?.domain ?? []), ["TipoDeComprobante", "=", "I"]];
        break;

      case ADD_CFDI_Types.EGRESS:
        periodOpts.domain = [...(periodOpts?.domain ?? []), ["TipoDeComprobante", "=", "E"]];
        break;

      case ADD_CFDI_Types.PAYMENT:
        periodOpts.domain = [...(periodOpts?.domain ?? []), ["TipoDeComprobante", "=", "P"]];
        break;

      case ADD_CFDI_Types.PAYROLL:
        periodOpts.domain = [...(periodOpts?.domain ?? []), ["TipoDeComprobante", "=", "N"]];
        break;

      case ADD_CFDI_Types.TRANSFER:
        periodOpts.domain = [...(periodOpts?.domain ?? []), ["TipoDeComprobante", "=", "T"]];
        break;

      default:
        break;
    }

    try {
      const periodCFDIs = await fetchCFDIsForADD(company, type, periodOpts);
      return {
        CFDIs: periodCFDIs.cfdis,
        total: periodCFDIs.totalRecords,
        module,
        type,
      };
    } catch (error) {
      console.error("Unexpected error in getCFDIsForAdd: ", error);
      return rejectWithValue("Error al obtener los CFDIs para el ADD");
    }
  }
);
