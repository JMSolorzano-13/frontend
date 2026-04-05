import { IS_SIIGO } from "@utils/SIIGO/Global";

export const SELECTION_OPS = {
  DATE: [
    { label: "=", value: "=" },
    { label: ">", value: ">" },
    { label: ">=", value: ">=" },
    { label: "<", value: "<" },
    { label: "<=", value: "<=" },
  ],
  MINIMAL_DATE: [
    { label: ">", value: ">" },
    { label: ">=", value: ">=" },
    { label: "<", value: "<" },
    { label: "<=", value: "<=" },
  ],
  NUMBER: [
    { label: "=", value: "=" },
    { label: "<>", value: "!=" },
    { label: ">", value: ">" },
    { label: ">=", value: ">=" },
    { label: "<", value: "<" },
    { label: "<=", value: "<=" },
  ],
  STRING: [
    { label: "=", value: "=" },
    { label: "<>", value: "!=" },
  ],
  EXACT_STRING: [{ label: "=", value: "=" }],
  CONTAINS: [
    { label: "Contiene", value: "in" },
    { label: "No contiene", value: "not in" },
    { label: "=", value: "=" },
    { label: "<>", value: "!=" },
  ],
  CONTAINS_POSITIVE: [
    { label: "Contiene", value: "in" },
    { label: "=", value: "=" },
  ],
  BOOLEAN: [
    { label: "=", value: "=" },
    { label: "<>", value: "!=" },
  ],
  BOOLEAN_CONTAINS: [{ label: "=", value: "=" }],
};

// change this to accept options for each Tab
export const advSelections: CFDISelection[] = [
  {
    label: "Tiene XML",
    value: "from_xml",
    operators: SELECTION_OPS.BOOLEAN,
    type: "boolean",
  },
  {
    label: "Fecha expedición",
    value: "FechaFiltro",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Versión",
    value: "Version",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Serie",
    value: "Serie",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Folio",
    value: "Folio",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Emisor",
    value: "NombreEmisor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Régimen fiscal emisor",
    value: "RegimenFiscalEmisor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Receptor",
    value: "NombreReceptor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Régimen fiscal receptor",
    value: "RegimenFiscalReceptor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Subtotal",
    value: "SubTotal",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Total descuento",
    value: "Descuento",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Neto",
    value: "Neto",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Retención IVA",
    value: "RetencionesIVA",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Retención ISR",
    value: "RetencionesISR",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Traslado IVA",
    value: "TrasladosIVA",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Total",
    value: "Total",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Tipo de cambio",
    value: "TipoCambio",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Uso de CFDI",
    value: "UsoCFDIReceptor",
    operators: SELECTION_OPS.CONTAINS,
    type: "contains",
  },
  {
    label: "Forma pago código",
    value: "FormaPago",
    operators: SELECTION_OPS.CONTAINS,
    type: "contains",
  },
  {
    label: "Forma de pago bancarizada",
    value: "FormaPagov2",
    operators: SELECTION_OPS.BOOLEAN_CONTAINS,
    type: "boolean_contains",
  },
  {
    label: "Método pago código",
    value: "MetodoPago",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Condiciones de pago",
    value: "CondicionesDePago",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Fecha timbrado",
    value: "FechaCertificacionSat",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Retención IEPS",
    value: "RetencionesIEPS",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Traslado IEPS",
    value: "TrasladosIEPS",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Traslado ISR",
    value: "TrasladosISR",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "No. Certificado",
    value: "NoCertificado",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Tipo comprobante",
    value: "TipoDeComprobante",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Exportación",
    value: "Exportacion",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Periodicidad",
    value: "Periodicidad",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Meses",
    value: "Meses",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Lugar de expedición",
    value: "LugarExpedicion",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "UUID relacionado",
    value: "cfdi_origin.uuid_related",
    operators: SELECTION_OPS.EXACT_STRING,
    type: "string",
  },
  {
    label: "Tipo de relación",
    value: "cfdi_origin.TipoRelacion",
    operators: SELECTION_OPS.CONTAINS_POSITIVE,
    type: "contains",
  },
];

export const ingressADVSelections: CFDISelection[] = [
  {
    label: "No considerar IVA",
    value: "ExcludeFromIVA",
    operators: SELECTION_OPS.BOOLEAN,
    type: "boolean",
  },
  {
    label: "Tiene XML",
    value: "from_xml",
    operators: SELECTION_OPS.BOOLEAN,
    type: "boolean",
  },
  {
    label: "Fecha expedición",
    value: "Fecha",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Versión",
    value: "Version",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Serie",
    value: "Serie",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Folio",
    value: "Folio",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Emisor",
    value: "NombreEmisor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Régimen fiscal emisor",
    value: "RegimenFiscalEmisor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Receptor",
    value: "NombreReceptor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Régimen fiscal receptor",
    value: "RegimenFiscalReceptor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Subtotal",
    value: "SubTotal",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Total descuento",
    value: "Descuento",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Neto",
    value: "Neto",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Retención IVA",
    value: "RetencionesIVA",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Retención ISR",
    value: "RetencionesISR",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Traslado IVA",
    value: "TrasladosIVA",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Total",
    value: "Total",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Tiene egresos relacionados",
    value: "cfdi_related",
    operators: SELECTION_OPS.BOOLEAN_CONTAINS,
    type: "boolean_contains",
  },
  {
    label: "Tiene pagos relacionados",
    value: "paid_by",
    operators: SELECTION_OPS.BOOLEAN_CONTAINS,
    type: "boolean_contains",
  },
  {
    label: "Tipo de cambio",
    value: "TipoCambio",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Uso de CFDI",
    value: "UsoCFDIReceptor",
    operators: SELECTION_OPS.CONTAINS,
    type: "contains",
  },
  {
    label: "Forma pago código",
    value: "FormaPago",
    operators: SELECTION_OPS.CONTAINS,
    type: "contains",
  },
  {
    label: "Forma de pago bancarizada",
    value: "FormaPagov2",
    operators: SELECTION_OPS.BOOLEAN_CONTAINS,
    type: "boolean_contains",
  },
  {
    label: "Método pago código",
    value: "MetodoPago",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Condiciones de pago",
    value: "CondicionesDePago",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Fecha timbrado",
    value: "FechaCertificacionSat",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Retención IEPS",
    value: "RetencionesIEPS",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Traslado IEPS",
    value: "TrasladosIEPS",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Traslado ISR",
    value: "TrasladosISR",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "No. Certificado",
    value: "NoCertificado",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Tipo comprobante",
    value: "TipoDeComprobante",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Exportación",
    value: "Exportacion",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Periodicidad",
    value: "Periodicidad",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Meses",
    value: "Meses",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Año",
    value: "Year",
    operators: SELECTION_OPS.NUMBER,
    type: "string",
  },
  {
    label: "Lugar de expedición",
    value: "LugarExpedicion",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "UUID relacionado",
    value: "cfdi_origin.uuid_related",
    operators: SELECTION_OPS.EXACT_STRING,
    type: "string",
  },
  {
    label: "Tipo de relación",
    value: "cfdi_origin.TipoRelacion",
    operators: SELECTION_OPS.CONTAINS_POSITIVE,
    type: "contains",
  },
  {
    label: "Tiene evidencias",
    value: "attachments_count",
    operators: SELECTION_OPS.BOOLEAN,
    type: "boolean",
  },
];

IS_SIIGO &&
  ingressADVSelections.push({
    label: "Tiene póliza contable",
    value: "polizas",
    operators: SELECTION_OPS.BOOLEAN_CONTAINS,
    type: "boolean_contains",
  });

export const egressADVSelections: CFDISelection[] = [
  {
    label: "Tiene XML",
    value: "from_xml",
    operators: SELECTION_OPS.BOOLEAN,
    type: "boolean",
  },
  {
    label: "Fecha expedición",
    value: "FechaFiltro",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Versión",
    value: "Version",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Serie",
    value: "Serie",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Folio",
    value: "Folio",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Emisor",
    value: "NombreEmisor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Régimen fiscal emisor",
    value: "RegimenFiscalEmisor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Receptor",
    value: "NombreReceptor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Régimen fiscal receptor",
    value: "RegimenFiscalReceptor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Subtotal",
    value: "SubTotal",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Total descuento",
    value: "Descuento",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Neto",
    value: "Neto",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Retención IVA",
    value: "RetencionesIVA",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Retención ISR",
    value: "RetencionesISR",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Traslado IVA",
    value: "TrasladosIVA",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Total",
    value: "Total",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Tipo de cambio",
    value: "TipoCambio",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Uso de CFDI",
    value: "UsoCFDIReceptor",
    operators: SELECTION_OPS.CONTAINS,
    type: "contains",
  },
  {
    label: "Forma pago código",
    value: "FormaPago",
    operators: SELECTION_OPS.CONTAINS,
    type: "contains",
  },
  {
    label: "Forma de pago bancarizada",
    value: "FormaPagov2",
    operators: SELECTION_OPS.BOOLEAN_CONTAINS,
    type: "boolean_contains",
  },
  {
    label: "Método pago código",
    value: "MetodoPago",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Condiciones de pago",
    value: "CondicionesDePago",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Fecha timbrado",
    value: "FechaCertificacionSat",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Retención IEPS",
    value: "RetencionesIEPS",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Traslado IEPS",
    value: "TrasladosIEPS",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Traslado ISR",
    value: "TrasladosISR",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "No. Certificado",
    value: "NoCertificado",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Tipo comprobante",
    value: "TipoDeComprobante",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Exportación",
    value: "Exportacion",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Periodicidad",
    value: "Periodicidad",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Meses",
    value: "Meses",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Lugar de expedición",
    value: "LugarExpedicion",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "UUID relacionado",
    value: "cfdi_origin.uuid_related",
    operators: SELECTION_OPS.EXACT_STRING,
    type: "string",
  },
  {
    label: "Tipo de relación",
    value: "cfdi_origin.TipoRelacion",
    operators: SELECTION_OPS.CONTAINS_POSITIVE,
    type: "contains",
  },
  {
    label: "Tiene evidencias",
    value: "attachments_count",
    operators: SELECTION_OPS.BOOLEAN,
    type: "boolean",
  },
];

IS_SIIGO &&
  egressADVSelections.push({
    label: "Tiene póliza contable",
    value: "polizas",
    operators: SELECTION_OPS.BOOLEAN_CONTAINS,
    type: "boolean_contains",
  });

export const payrollADVSelections: CFDISelection[] = [
  {
    label: "RFC",
    value: "RfcReceptor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Nombre",
    value: "NombreReceptor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Tiene XML",
    value: "from_xml",
    operators: SELECTION_OPS.BOOLEAN,
    type: "boolean",
  },
  {
    label: "Tipo régimen",
    value: "nomina.ReceptorTipoRegimen",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Tipo nómina",
    value: "nomina.TipoNomina",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Fecha expedición",
    value: "Fecha",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Fecha inicial pago",
    value: "nomina.FechaInicialPago",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Fecha final pago",
    value: "nomina.FechaFinalPago",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Fecha de pago",
    value: "FechaFiltro",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Registro patronal",
    value: "nomina.EmisorRegistroPatronal",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "CURP",
    value: "nomina.ReceptorCurp",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Num seguridad social",
    value: "nomina.ReceptorNumSeguridadSocial",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Tipo contrato",
    value: "nomina.ReceptorTipoContrato",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Sindicalizado",
    value: "nomina.ReceptorSindicalizado",
    operators: SELECTION_OPS.BOOLEAN,
    type: "boolean",
  },
  {
    label: "Tipo jornada",
    value: "nomina.ReceptorTipoJornada",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Num empleado",
    value: "nomina.ReceptorNumEmpleado",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Departamento",
    value: "nomina.ReceptorDepartamento",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Puesto",
    value: "nomina.ReceptorPuesto",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Periodicidad pago",
    value: "nomina.ReceptorPeriodicidadPago",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Clave Ent Fed",
    value: "nomina.ReceptorClaveEntFed",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Serie",
    value: "Serie",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Folio",
    value: "Folio",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "UUID relacionado",
    value: "cfdi_origin.uuid_related",
    operators: SELECTION_OPS.EXACT_STRING,
    type: "string",
  },
  {
    label: "Tipo de relación",
    value: "cfdi_origin.TipoRelacion",
    operators: SELECTION_OPS.CONTAINS_POSITIVE,
    type: "contains",
  },
  {
    label: "Tiene evidencias",
    value: "attachments_count",
    operators: SELECTION_OPS.BOOLEAN,
    type: "boolean",
  },
];

IS_SIIGO &&
  payrollADVSelections.push({
    label: "Tiene póliza contable",
    value: "polizas",
    operators: SELECTION_OPS.BOOLEAN_CONTAINS,
    type: "boolean_contains",
  });

export const paymentADVSelectionsV2: CFDISelection[] = [
  {
    label: "Emisor",
    value: "NombreEmisor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Receptor",
    value: "NombreReceptor",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Tiene XML",
    value: "from_xml",
    operators: SELECTION_OPS.BOOLEAN,
    type: "boolean",
  },
  {
    label: "Fecha de pago",
    value: "FechaFiltro",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Fecha expedición",
    value: "Fecha",
    operators: SELECTION_OPS.DATE,
    type: "date",
  },
  {
    label: "Versión",
    value: "Version",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Serie",
    value: "Serie",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },
  {
    label: "Folio",
    value: "Folio",
    operators: SELECTION_OPS.STRING,
    type: "string",
  },

  { label: "Base IVA 16", value: "BaseIVA16", operators: SELECTION_OPS.NUMBER, type: "number" },
  { label: "IVA 16", value: "IVATrasladado16", operators: SELECTION_OPS.NUMBER, type: "number" },
  { label: "Base IVA 8", value: "BaseIVA8", operators: SELECTION_OPS.NUMBER, type: "number" },
  { label: "IVA 8", value: "IVATrasladado8", operators: SELECTION_OPS.NUMBER, type: "number" },
  { label: "Base IVA 0", value: "BaseIVA0", operators: SELECTION_OPS.NUMBER, type: "number" },

  {
    label: "Base IVA exento",
    value: "BaseIVAExento",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  { label: "Traslado IVA", value: "TrasladosIVA", operators: SELECTION_OPS.NUMBER, type: "number" },
  {
    label: "Retención IVA",
    value: "RetencionesIVA",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Retención ISR",
    value: "RetencionesISR",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Retención IEPS",
    value: "RetencionesIEPS",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Total",
    value: "Total",
    operators: SELECTION_OPS.NUMBER,
    type: "number",
  },
  {
    label: "Forma pago código",
    value: "payments.FormaDePagoP",
    operators: SELECTION_OPS.CONTAINS,
    type: "contains",
  },
  {
    label: "Forma de pago bancarizada",
    value: "FormaPagov2",
    operators: SELECTION_OPS.BOOLEAN_CONTAINS,
    type: "boolean_contains",
  },
  {
    label: "Moneda pago código",
    value: "Moneda",
    operators: SELECTION_OPS.STRING,
    type: "currency",
  },
  {
    label: "UUID relacionado",
    value: "cfdi_origin.uuid_related",
    operators: SELECTION_OPS.EXACT_STRING,
    type: "string",
  },
  {
    label: "Tipo de relación",
    value: "cfdi_origin.TipoRelacion",
    operators: SELECTION_OPS.CONTAINS_POSITIVE,
    type: "contains",
  },
  {
    label: "Tiene evidencias",
    value: "attachments_count",
    operators: SELECTION_OPS.BOOLEAN,
    type: "boolean",
  },
];

IS_SIIGO &&
  paymentADVSelectionsV2.push({
    label: "Tiene póliza contable",
    value: "polizas",
    operators: SELECTION_OPS.BOOLEAN_CONTAINS,
    type: "boolean_contains",
  });

export const paymentBankedValues: { [key: string]: DomainItem } = {
  true: ["payments.FormaDePagoP", "in", ["02", "03", "04", "05", "06", "28", "29"]],
  false: [
    "payments.FormaDePagoP",
    "in",
    ["01", "08", "12", "13", "14", "15", "17", "23", "24", "25", "26", "27", "30", "31", "99"],
  ],
};

export const bankedValues: { [key: string]: DomainItem } = {
  true: ["FormaPago", "in", ["02", "03", "04", "05", "06", "28", "29"]],
  false: [
    "FormaPago",
    "in",
    ["01", "08", "12", "13", "14", "15", "17", "23", "24", "25", "26", "27", "30", "31", "99"],
  ],
};

export function getAnyValuesDomain(
  value: string | boolean | number | null | string[] | number[] | undefined,
  field: string
): DomainItem {
  if (value) {
    return [field, "=", "any"];
  } else {
    return [field, "!=", "any"];
  }
}

export const attachmentValues: { [key: string]: DomainItem } = {
  true: ["attachments_count", ">", "0"],
  false: ["attachments_count", "=", "0"],
};
