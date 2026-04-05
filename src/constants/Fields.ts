export const CFDIFields = [
  "created_at",
  "Version",
  "UUID",
  "Fecha",
  "Total",
  "TotalMXN",
  "Folio",
  "Serie",
  "NoCertificado",
  "Certificado",
  "TipoDeComprobante",
  "c_tipo_de_comprobante.name",
  "LugarExpedicion",
  "FormaPago",
  // "forma_pago_name",
  "c_forma_pago.name",
  "MetodoPago",
  "c_metodo_pago.name",
  "Moneda",
  "c_moneda.name",
  "RegimenFiscalEmisor",
  "c_regimen_fiscal_emisor.name",
  "RegimenFiscalReceptor",
  "c_regimen_fiscal_receptor.name",
  "UsoCFDIReceptor",
  "c_uso_cfdi.name",
  "Exportacion",
  "c_exportacion.name",
  "Meses",
  "c_meses.name",
  "Periodicidad",
  "c_periodicidad.name",
  "Descuento",
  "DescuentoMXN",
  "SubTotal",
  "SubTotalMXN",
  "RfcEmisor",
  "NombreEmisor",
  "RfcReceptor",
  "NombreReceptor",
  "RfcPac",
  "FechaCertificacionSat",
  "Estatus",
  "FechaCancelacion",
  "TipoCambio",
  "Conceptos",
  "company.name",
  "efos.state",
  "CondicionesDePago",
  "Neto",
  "NetoMXN",
  "TrasladosIVA",
  "TrasladosIVAMXN",
  "TrasladosIEPS",
  "TrasladosIEPSMXN",
  "TrasladosISR",
  "TrasladosISRMXN",
  "RetencionesIVA",
  "RetencionesIVAMXN",
  "RetencionesIEPS",
  "RetencionesIEPSMXN",
  "RetencionesISR",
  "RetencionesISRMXN",
  "UsoCFDIReceptor",
  "CfdiRelacionados",
  "Impuestos",
  "from_xml",
  "balance",
  "paid_by.UUID",
  "paid_by.UUID_related",
  "paid_by.Estatus",
  "paid_by.cfdi_related.Estatus",
  "ExcludeFromIVA",
  "ExcludeFromISR",
  "Sello",
  "PaymentDate",
  "FechaFiltro",
  "Year",
  "is_too_big",
  "pr_count",
  // CFDI relations
  "cfdi_related.uuid_origin",
  "cfdi_related.Estatus",
  "cfdi_origin.uuid_related",
  "cfdi_origin.cfdi_related.UUID",
  "cfdi_origin.cfdi_related.TipoDeComprobante",
  "cfdi_origin.cfdi_related.Estatus",
  "cfdi_origin.TipoRelacion",
  "cfdi_related.TipoRelacion",
  "cfdi_related.TipoDeComprobante",
  "active_egresos.Total",
];

export const IVACFDIFields = [
  "UUID",
  "Serie",
  "Folio",
  "RfcEmisor",
  "NombreEmisor",
  "RfcReceptor",
  "NombreReceptor",
  "TipoDeComprobante",
  "FormaPago",

  // "forma_pago_code",
  // "forma_pago_name",

  "c_forma_pago.name",
  "c_forma_pago.code",
  "payments.FormaDePagoP",
  "payments.c_forma_pago.name",
  "MetodoPago",
  "FechaFiltro",
  "BaseIVA16",
  "BaseIVA8",
  "BaseIVA0",
  "BaseIVAExento",
  "IVATrasladado16",
  "IVATrasladado8",
  "RetencionesIVAMXN",
  "TrasladosIVAMXN",
  "ExcludeFromIVA",
  // FIELDSFORMODAL
  "is_issued",
  "FechaCancelacion",
  "from_xml",
  "c_tipo_de_comprobante.name",
  "LugarExpedicion",
  "RegimenFiscalEmisor",
  "c_regimen_fiscal_emisor.name",
  "Fecha",
  "NoCertificado",
  "FormaPago",
  "c_forma_pago.name",
  "c_metodo_pago.name",
  "UsoCFDIReceptor",
  "c_uso_cfdi.name",
  "Moneda",
  "c_moneda.name",
  "SubTotal",
  "Descuento",
  "TrasladosIEPS",
  "TrasladosISR",
  "TrasladosIVA",
  "RetencionesIEPS",
  "RetencionesISR",
  "RetencionesIVA",
  "Total",
  "PaymentDate",
  // Fields for excludefromiva
  "Version",
  "is_too_big",
  "pr_count",
  // paid_by
];

export const IVAExcludedCFDIFields = [
  "is_issued",
  "paid_by.UUID",
  "paid_by.UUID_related",
  "paid_by.ExcludeFromIVA",
  "paid_by.identifier",
  "paid_by.Serie",
  "paid_by.Folio",
  "paid_by.FechaPago",
  "paid_by.MetodoDePagoDR",
  "paid_by.BaseIVA16",
  "paid_by.BaseIVA8",
  "paid_by.BaseIVA0",
  "paid_by.BaseIVAExento",
  "paid_by.IVATrasladado16",
  "paid_by.TrasladosIVAMXN",
  "paid_by.RetencionesIVAMXN",
  "paid_by.ImpPagadoMXN",
  "paid_by.IVATrasladado8",
  "paid_by.payment_related.FormaDePagoP",
  "paid_by.payment_related.c_forma_pago.name",
  "paid_by.NumParcialidad",
  "paid_by.identifier",
];

export const CFDIPPDFields = [
  "ExcludeFromISR",
  "ExcludeFromIVA",
  "payments.Monto",
  "payments.FechaPago",
  "payments.FormaDePagoP",
  "payments.MonedaP",
  "payments.RfcEmisorCtaOrd",
  "payments.CtaOrdenante",
  "payments.NumOperacion",
  "payments.RfcEmisorCtaBen",
  "payments.CtaBeneficiario",
  "payments.NomBancoOrdExt",
  "pays.UUID",
  "pays.UUID_related",
  "pays.Folio",
  "pays.MonedaDR",
  "pays.MetodoDePagoDR",
  "pays.NumParcialidad",
  "pays.ImpSaldoAnt",
  "pays.ImpPagado",
  "pays.ImpSaldoInsoluto",
];

export const CompanyFields = [
  "workspace.name",
  "workspace.valid_until",
  "workspace.license",
  "workspace.owner.email",
  "workspace.owner.id",
  "workspace.owner.identifier",
  "workspace.id",
  "workspace.identifier",
  "have_certificates",
  "has_valid_certs",
  "created_at",
  "id",
  "permission_to_sync",
  "name",
  "identifier",
  "pasto_company_identifier",
  "rfc",
  "emails_to_send_efos",
  "emails_to_send_errors",
  "emails_to_send_canceled",
  "exceed_metadata_limit",
  "pasto_last_metadata_sync",
  "add_auto_sync",
  "data",
];

export const EFOSFields = [
  "no",
  "rfc",
  "name",
  "state",
  "sat_office_alleged",
  "sat_publish_alleged_date",
  "dof_office_alleged",
  "dof_publish_alleged_date",
  "sat_office_distored",
  "sat_publish_distored_date",
  "dof_office_distored",
  "dof_publish_distored_date",
  "sat_office_definitive",
  "sat_publish_definitive_date",
  "dof_office_definitive",
  "dof_publish_definitive_date",
  "sat_office_favorable_judgement",
  "sat_publish_favorable_judgement_date",
  "dof_office_favorable_judgement",
  "dof_publish_favorable_judgement_date",
];

export const PermissionFields = [
  "user.id",
  "role",
  "company.name",
  "company.id",
  "company.identifier",
  "user.name",
  "user.email",
  "user.source_name",
];

export const AlertsFields = ["user.name", "user.email", "workspace", "notification_type"];

export const SATQuerySummaryFields = [
  "start",
  "end",
  "download_type",
  "request_type",
  "packages",
  "state",
  "created_at",
  "updated_at",
  "name",
];

export const ADDSynchSearchFields = [
  // "company_identifier",
  "updated_at",
  "created_at",
  "start",
  "end",
  "xmls_to_send",
  "xmls_to_send_pending",
  // "xmls_to_send_total",
  "cfdis_to_cancel",
  "cfdis_to_cancel_pending",
  // "cfdis_to_cancel_total",
  "state",
  "manually_triggered",
];

export const DoctoRelacionadosFields = [
  "identifier", // Identifier
  "ExcludeFromIVA", // No considerar IVA
  "payment_related.FechaPago", // Fecha de pago
  "payment_related.FormaDePagoP", // Forma de pago código
  "payment_related.c_forma_pago.name", // Forma de pago
  "cfdi_origin.Fecha", // Fecha de emisión
  "cfdi_origin.Serie", // Serie
  "cfdi_origin.Folio", // Folio
  "cfdi_origin.RfcEmisor", // RFC Emisor
  "cfdi_origin.NombreEmisor", // Emisor
  "cfdi_related.Serie", // DR Serie
  "cfdi_related.Folio", // DR Folio
  "cfdi_related.UsoCFDIReceptor", // DR Uso de CFDI
  "cfdi_related.Fecha", // DR Fecha de emisión
  "UUID_related", // DR UUID
  "identifier", // Identifier
  "ExcludeFromIVA", // No considerar IVA
  "UUID", // UUID
  "Serie", // DR Serie
  "Folio", // DR Folio
  "ObjetoImpDR", // DR Objeto de impuesto
  "BaseIVA16", // DR Base IVA 16%
  "BaseIVA8", // DR Base IVA 8%
  "BaseIVA0", // DR Base IVA 0%
  "BaseIVAExento", // DR Base IVA exento
  "IVATrasladado16", // DR IVA Acreditable 16%
  "IVATrasladado8", // DR IVA Acreditable 8%
  "TrasladosIVAMXN", // DR IVA Acreditable Total
  "RetencionesIVAMXN", // DR Retenciones IVA
  "ImpPagadoMXN", // DR Importe Pagado
  "cfdi_related.Estatus", // DR Estatus
];
