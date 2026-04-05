import { CFDI_Types } from "@constants/Enums";
import { InternalTabType, TabType } from "@pages/ISR/_types/ISRTypes";

type DomainItem = [
  string,
  string,
  string | boolean | number | null | string[] | number[] | undefined
];

type Data = {
  company_identifier?: string;
  startDate: string;
  endDate: string;
  cancelledStartDate?: string;
  cancelledEndDate?: string;
  Estatus?: boolean;
  is_issued?: boolean;
  TipoDeComprobante: CFDI_Types;
  efos?: string;
};

type DataTaxes = {
  period: string;
  iva?: IVAAPITYPE;
  isr?: "all" | "invoice_pue" | "payments" | "excluded";
  issued: boolean;
  yearly?: boolean;
};

type DataName = {
  period: string;
  yearly?: boolean;
  tab: TabType;
  internalTab: InternalTabType;
};

type DataValidation = {
  group: string;
  subtitle: string;
  datesValue: string | null;
  rfc: string;
};

const tab = {
  I: "ingresos",
  E: "egresos",
  T: "trasladado",
  N: "nominas",
  P: "pagos",
};

export const getExportCFDIName = (rfc: string, domain: DomainItem[], exportType?: string) => {
  const {
    startDate,
    endDate,
    is_issued,
    TipoDeComprobante,
    efos,
    Estatus,
    cancelledStartDate,
    cancelledEndDate,
  } = domainToObject(domain);

  let dateFile = "";

  if (!Estatus && cancelledStartDate && cancelledEndDate) {
    dateFile = datesToString(cancelledStartDate, cancelledEndDate);
  } else {
    dateFile = datesToString(startDate, endDate);
  }

  if (efos) {
    return getExportEfosName(rfc, startDate, endDate);
  }
  const doctosOrConcepts =
    exportType === "conceptos" ? "Conceptos" : exportType === "doctos" ? "DocsRelacionados" : "";

  return `${replace_chars_from_rfc(rfc)}_${tab[TipoDeComprobante]}${doctosOrConcepts}_${
    is_issued ? "emitidos" : "recibidos"
  }_${dateFile}`;
};

const getExportEfosName = (rfc: string, startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() - 1);
  const isYearly =
    (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() > 2;

  return `${replace_chars_from_rfc(rfc)}_OperacionesConEFOS_${dateToStringYearly(start, isYearly)}`;
};

export function getISRTypeNameDeductions(tab: TabType, internalTab?: InternalTabType): string {
  const tabNameInternal = internalTab ? internalTab : tab;
  const ISR_TYPE: { [key: string]: string } = {
    ALL: "Todos",
    CASH: "FacturasDeContado",
    PAYMENT: `Pagos`,
    DISCOUNTS: tabNameInternal === "DISCOUNTS-INCOMES" ? "IngresosEmitidos" : "EgresosEmitidos",
    EGRESS: "EgresosRecibidos",
    INVESTMENTS: "Inversiones",
    "EXCLUDED-PREFILLED":
      tabNameInternal === "EXCLUDED-PREFILLED-INCOMES" ? "IngresosPUE" : "Pagos",
    EXCLUDED:
      tabNameInternal === "CASH"
        ? "FacturasDeContado"
        : tabNameInternal === "PAYMENT"
        ? "Pagos"
        : internalTab === "EXCLUDED-INCOMES"
        ? "Ingresos"
        : internalTab === "EXCLUDED-EGRESS"
        ? "Egresos"
        : internalTab === "EXCLUDED-INCOMES-PUE"
        ? "IngresosPUE"
        : internalTab === "EXCLUDED-PAYMENTS"
        ? "Pagos"
        : internalTab === "EGRESS"
        ? "EgresosRecibidos"
        : "",
  };
  return ISR_TYPE[tab];
}

export function getISRTypeDisplayNameDeductions(
  tab: TabType,
  internalTab?: InternalTabType
): string {
  const tabNameInternal = internalTab ? internalTab : tab;
  const ISR_TYPE: { [key: string]: string } = {
    ALL: "Deducciones - Totales",
    CASH: "Deducciones - Facturas de contado",
    PAYMENT: `Deducciones -  Pagos`,
    DISCOUNTS:
      tabNameInternal === "DISCOUNTS-INCOMES"
        ? "Deducciones - Dev., desctos. y bonif. emitidos - Ingresos emitidos"
        : "Deducciones -  Dev., desctos. y bonif. emitidos - Egresos emitidos",
    EGRESS: "Deducciones - Egresos recibidos",
    INVESTMENTS: "Deducciones - Inversiones",
    "EXCLUDED-PREFILLED":
      tabNameInternal === "EXCLUDED-PREFILLED-INCOMES"
        ? "Deducciones -  No considerados pre-llenado - Ingresos PUE"
        : "Deducciones -  No considerados pre-llenado - Pagos",
    EXCLUDED:
      tabNameInternal === "CASH"
        ? "Deducciones - No considerados ISR - Facturas de contado"
        : tabNameInternal === "PAYMENT"
        ? "Deducciones - No considerados ISR - Pagos"
        : internalTab === "EXCLUDED-INCOMES"
        ? "Deducciones - No considerados ISR - Dev., desctos. y bonif. emitidos - Ingresos emitidos"
        : internalTab === "EXCLUDED-EGRESS"
        ? "Deducciones - No considerados ISR -  Dev., desctos. y bonif. emitidos - Egresos emitidos"
        : internalTab === "EXCLUDED-INCOMES-PUE"
        ? "Deducciones - No considerados ISR -  No considerados pre-llenado - Ingresos PUE"
        : internalTab === "EXCLUDED-PAYMENTS"
        ? "Deducciones - No considerados ISR - No considerados pre-llenado - Pagos"
        : internalTab === "EGRESS"
        ? "Deducciones - No considerados ISR - Egresos Recibidos"
        : "",
  };
  return ISR_TYPE[tab];
}

export const getExportIVAName = (rfc: string, DataIva: DataTaxes) => {
  const { period, iva, issued } = DataIva;

  const IVAType = {
    all: "Todos",
    i_tra: "FacturasDeContado",
    p_tra: issued ? "CobroFacturasDeCredito" : "PagoFacturasDeCredito",
    excluded: "NoConsideradosIVA",
    credit_notes: "NotasDeCredito",
    moved: "PeriodoIVAReasignado",
    prev_i_ret: "RetencionesIVA",
    prev_p_ret: "RetencionesCredito",
    OpeConTer: "OperacionesConTerceros",
  };

  return `${replace_chars_from_rfc(rfc)}_IVA_${issued ? "Trasladado" : "Acreditable"}_${
    iva && IVAType[iva]
  }_${dateToStringYearly(period)}`;
};

export const getExportISRName = (rfc: string, DataIva: DataTaxes) => {
  const { period, isr, issued, yearly } = DataIva;

  const ISRType = {
    all: "Todos",
    invoice_pue: "FacturasDeContado",
    payments: "CFDIsDePago",
    excluded: "NoConsideradosISR",
  };

  return `${replace_chars_from_rfc(rfc)}_ISR_${issued ? "retenciones" : "deducciones"}_${
    isr && ISRType[isr]
  }_${dateToStringYearly(period, yearly)}`;
};

export const getExportISRNameDeductions = (rfc: string, DataIva: DataName) => {
  const { period, internalTab, tab, yearly } = DataIva;

  return `${replace_chars_from_rfc(rfc)}_ISR_Deducciones_${getISRTypeNameDeductions(
    tab,
    internalTab
  )}_${dateToStringYearly(period, yearly)}`;
};

export const getExportISRDisplayNameDeductions = (rfc: string, DataIva: DataName) => {
  const { internalTab, tab } = DataIva;

  return `${getISRTypeDisplayNameDeductions(tab, internalTab)}`;
};

export const getExportValidationName = (dataValidation: DataValidation) => {
  const validationType = {
    'con forma de pago "99"': "IngresosPUE99",
    "con CFDIs de pagos relacionados": "IngresosPUEConPagosRelacionados",
    "sin CFDIs relacionados": "EgresosSinRelaciones",
    'con forma de pago "99", no bancarizada': "IngresosPUE99",
  };
  const { group, subtitle, datesValue, rfc } = dataValidation;
  return `${replace_chars_from_rfc(rfc)}_${group}_validacion_${
    validationType[subtitle as keyof typeof validationType]
  }_${datesValueToString(datesValue as string)}`;
};

export const getExportSingleCFDIName = (dataValidation: DataValidation) => {
  const { group, subtitle, datesValue, rfc } = dataValidation;
  return `${replace_chars_from_rfc(rfc)}_${group === "issued" ? "Emitidos" : "Recibidos"}_${
    tab[subtitle as keyof typeof tab]
  }_${datesValueToString(datesValue as string)}`;
};

export const getExportSinglePolizaName = (dataValidation: DataValidation) => {
  const { group, datesValue, rfc } = dataValidation;
  return `${replace_chars_from_rfc(rfc)}_${
    group === "issued" ? "Emitidos" : "Recibidos"
  }_${datesValueToString(datesValue as string)}`;
};

const domainToObject = (domain: DomainItem[]): Data => {
  return domain.reduce<Data>((obj, [key, operator, value]) => {
    if (key === "FechaFiltro") {
      if (operator === ">=") {
        obj.startDate = value as string;
      } else if (operator === "<") {
        obj.endDate = value as string;
      }
    } else if (key === "FechaCancelacion") {
      if (operator === ">=") {
        obj.cancelledStartDate = value as string;
      } else if (operator === "<") {
        obj.cancelledEndDate = value as string;
      }
    } else {
      const typedKey = key as keyof Data;
      if (typedKey === "company_identifier" || typedKey === "efos") {
        obj[typedKey] = value as string;
      } else if (typedKey === "TipoDeComprobante") {
        obj[typedKey] = value as CFDI_Types;
      } else if (typedKey === "Estatus" || typedKey === "is_issued") {
        obj[typedKey] = value as boolean;
      }
    }
    return obj;
  }, {} as Data);
};

const datesToString = (startDate: string, endDate: string): string => {
  const locale = "es-ES";

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() - 1);

  const monthsDifference =
    (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();

  if (monthsDifference > 2) {
    return `${start.getFullYear()}`;
  }

  const formatDate = (date: Date): string => {
    const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);
    const month = new Intl.DateTimeFormat(locale, { month: "short" }).format(date);
    const year = new Intl.DateTimeFormat(locale, { year: "numeric" }).format(date);
    return `${day}${month.charAt(0).toUpperCase()}${month.slice(1)}${year}`;
  };

  const formattedStartDate = formatDate(start);
  const formattedEndDate = formatDate(end);

  return `Desde${formattedStartDate}_Hasta${formattedEndDate}`;
};

const dateToStringYearly = (inputDate: Date | string | number, isYearly = false): string => {
  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    throw new RangeError(`Invalid date value: ${inputDate}`);
  }

  if (isYearly) {
    return date.getUTCFullYear().toString();
  }

  const monthOptions: Intl.DateTimeFormatOptions = { month: "short", timeZone: "UTC" };
  const month = new Intl.DateTimeFormat("es-ES", monthOptions).format(date).toLowerCase();

  const year = date.getUTCFullYear(); // Get the year in UTC

  const formattedDate = `${month}${year}`.replace(/\s/g, "");
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

const datesValueToString = (datesValue: string): string => {
  const datesArray = datesValue.split("|");
  const firstDate = new Date(datesArray[0]);

  if (datesArray.length === 2) {
    return firstDate.getUTCFullYear().toString();
  }
  const monthOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  };
  const formattedDate = new Intl.DateTimeFormat("es-ES", monthOptions)
    .format(firstDate)
    .replace(/\s/g, "");

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

function replace_chars_from_rfc(rfc: string) {
  return rfc.replace(/[&ñ]/g, "_");
}
