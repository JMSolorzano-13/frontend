// / <reference types="vite-plugin-svgr/client" />
declare interface Window {
  inline_manual_player: any;
  inlineManualTracking: any;
  inline_manual_player: any;
  InlineManual: (event: string, data: any) => void;
}

declare type DomainItem = [
  string,
  string,
  string | boolean | number | null | string[] | number[] | undefined,
];

declare type Domain = DomainItem[];

declare type DomainItemAdvanced = [
  string,
  string,
  string | boolean | number | null | string[] | number[] | undefined | DomainItem,
];
declare type ComplexDomainItem = ["|" | "&", DomainItemAdvanced[][[]] | DomainItemAdvanced[]];

declare type SearchOptions = {
  domain?: Domain;
  orderBy?: string;
  search?: string;
  limit?: number;
  offset?: number;
  format?: string;
  fields?: string[];
  period?: string;
  yearly?: boolean;
  isIssued?: boolean;
  filters?: any;
};

declare type CFDIModule =
  | "issued"
  | "received"
  | "validation-simple"
  | "validation-complete"
  | "efos"
  | "iva";

declare type CFDI = {
  id: number;
  is_issued: boolean;
  PaymentDate: string;
  active_egresos: {
    Total: number;
  }[];
  FechaPago: string;
  created_at: string;
  UUID: string;
  Fecha: string;
  Total: number;
  TotalMXN: number;
  Folio: string;
  Serie: string;
  NoCertificado: string;
  Certificado: string;
  TipoDeComprobante: string;
  c_tipo_de_comprobante: {
    name: string;
  };
  LugarExpedicion: string;
  FormaPago: string;
  forma_pago_name: string;
  c_forma_pago: {
    name: string;
  };
  MetodoPago: string;
  c_metodo_pago: {
    name: string;
  };
  Moneda: string;
  c_moneda: {
    name: string;
  };
  RegimenFiscalEmisor: string;
  RegimenFiscalReceptor: string;
  DomicilioFiscalReceptor: string;
  CfdiRelacionados: string;
  c_regimen_fiscal_emisor: {
    name: string;
  };
  c_regimen_fiscal_receptor: {
    name: string;
  };
  UsoCFDIReceptor: string;
  c_uso_cfdi: {
    name: string;
  };
  Exportacion: string | null;
  c_exportacion: null | {
    name: string;
  };
  Meses: string | null;
  c_meses: null | {
    name: string;
  };
  Periodicidad: string | null;
  c_periodicidad: null | {
    name: string;
  };
  Neto: number;
  NetoMXN: number;
  Descuento: number | string;
  DescuentoMXN: number;
  SubTotal: number;
  SubTotalMXN: number;
  RfcEmisor: string;
  NombreEmisor: string;
  RfcReceptor: string;
  NombreReceptor: string;
  RfcPac: string;
  FechaCertificacionSat: string;
  EfectoComprobante: string;
  Estatus: boolean;
  FechaCancelacion: string | null;
  TipoCambio: string | null;
  TrasladosIVA: number | string;
  TrasladosIVAMXN: number;
  TrasladosIEPS: number | string;
  TrasladosIEPSMXN: number;
  TrasladosISR: number | string;
  TrasladosISRMXN: number;
  RetencionesIVA: number | string;
  RetencionesIVAMXN: number;
  RetencionesIEPS: number | string;
  RetencionesIEPSMXN: number;
  RetencionesISR: number | string;
  RetencionesISRMXN: number;
  CondiciondesDePago: string;
  UsoCFDIReceptor: string;
  Conceptos: string;
  company: {
    id: number;
    name: string;
  };
  Impuestos: string;
  from_xml: boolean;
  balance: number | null;
  paid_by: paidData[];
  pays: paidData[];
  payments: payment[];
  add_exists: boolean;
  add_cancel_date: DateTime | null;
  xml_content: string;
  Version: string;
  ExcludeFromIVA: boolean;
  nomina: payrollData;
  FechaFiltro: string;
  Sello: string;
  PaymentDate: string | null;
  ExcludeFromISR: boolean;
  Year: number | null;
  pr_count: number;
  is_too_big: boolean;
  cfdi_related: CFDIRelationType[];
  cfdi_origin: CFDIRelationType[];
  company_identifier: string;
  polizas: Poliza[];
  attachments: Attachment[];
  attachments_count: number;
};

type Poliza = {
  relaciones: Relacion[];
  tipo: string;
  cfdis: Partial<CFDI>[];
  numero: string;
  fecha: string;
  sistema_origen?: string;
  concepto?: string;
  movimientos: Movimiento[];
  identifier: string;
};

type Movimiento = {
  numerador: string;
  cuenta_contable: string;
  nombre: string;
  cargo: number;
  abono: number;
  cargo_me: number;
  abono_me: number;
  concepto: string;
  referencia: string;
  poliza_identifier: string;
};

type Relacion = {
  cfdi_related: Partial<CFDI>;
  uuid_related: string;
};

type Attachment = {
  identifier: string;
  url: string;
  status: boolean;
  file_name: string;
  state: string;
};

type CFDIPayrollDeduction = {
  "@TipoImpuesto": string;
  "@Clave": string;
  "@Concepto": string;
  "@Importe": string | null;
  "@ImporteGravado": string | null;
  "@ImporteExento": string | null;
  "@TipoOtroPago": string | null;
  "@TipoDeduccion": string | null;
  "@TipoPercepcion": string | null;
  tipoNodo: string;
};

type CFDIPayment = {
  cfdi_related: {
    Estatus: boolean;
    Folio: string;
    Serie: string;
    Fecha: string;
    UsoCFDIReceptor: string;
  };
  UUID_related: string;
  ObjetoImpDR: string;
  BaseIVA0: number;
  BaseIVA8: number;
  BaseIVA16: number;
  BaseIVAExento: number;
  IVATrasladado8: number;
  IVATrasladado16: number;
  TrasladosIVAMXN: number;
  RetencionesIVAMXN: number;
  ImpPagadoMXN: number;
};

type CFDIDetails = Partial<CFDI & CFDIPayrollDeduction & CFDIPayment>;

type PayrollType = {
  OtrosPagos?: OtrosPagos[];
  Deducciones?: Deducciones[];
  Percepciones?: Percepciones[];
};

type OtrosPagos = {
  OtroPago: OtroPago[];
};

type OtroPago = {
  "@TipoOtroPago": string;
  "@Clave": string;
  "@Concepto": string;
  "@Importe": string;
};

type Deducciones = {
  Deduccion: Deduccion[];
};

type Deduccion = {
  "@TipoDeduccion": string;
  "@Clave": string;
  "@Concepto": string;
  "@Importe": string;
};

type Percepciones = {
  Percepcion: Percepcion[];
};
type Percepcion = {
  "@TipoPercepcion": string;
  "@Clave": string;
  "@Concepto": string;
  "@ImporteGravado": string;
  "@ImporteExento": string;
};

type CFDIRelationType = {
  cfdi_related: CFDI;
  identifier: string;
  cfdi_origin: CFDI;
  company_identifier: string;
  created_at: string;
  uuid_origin: string;
  is_issued: boolean;
  Estatus: boolean;
  TipoDeComprobante: string;
  uuid_related: string;
  TipoRelacion: string;
};

type ADDActionType = "Send" | "Cancel" | "Both" | "None";

declare interface ADDCFDI extends CFDI {
  action: ADDActionType;
}

declare interface payrollData {
  FechaPago: string;
  ReceptorTipoRegimen: string;
  TotalPercepciones: number;
  TotalDeducciones: number;
  TotalOtrosPagos: number;
  PercepcionesTotalSueldos: number;
  OtrasPercepciones: number;
  PercepcionesTotalGravado: number;
  PercepcionesTotalExento: number;
  AjusteISRRetenido: number;
  DeduccionesTotalImpuestosRetenidos: number;
  DeduccionesTotalOtrasDeducciones: number;
  SubsidioCausado: number;
  NetoAPagar: number;
  Version: string;
  TipoNomina: string;
  FechaInicialPago: string;
  FechaFinalPago: string;
  NumDiasPagados: number;
  EmisorRegistroPatronal: string;
  ReceptorCurp: string;
  ReceptorNumSeguridadSocial: string;
  ReceptorFechaInicioRelLaboral: string;
  ReceptorAntigüedad: string;
  ReceptorTipoContrato: string;
  ReceptorSindicalizado: boolean;
  ReceptorTipoJornada: string;
  ReceptorNumEmpleado: string;
  ReceptorDepartamento: string;
  ReceptorPuesto: string;
  ReceptorRiesgoPuesto: string;
  ReceptorPeriodicidadPago: string;
  ReceptorBanco: string;
  ReceptorCuentaBancaria: string;
  ReceptorSalarioBaseCotApor: number;
  ReceptorSalarioDiarioIntegrado: number;
  ReceptorClaveEntFed: string;
  PercepcionesSeparacionIndemnizacion: number;
  PercepcionesJubilacionPensionRetiro: number;
  c_ReceptorPeriodicidadPago: {
    name: string;
  };
}

declare interface payrollCFDI extends CFDI {
  paymentDate: string;
}

declare type paidData = {
  UUID: string;
  UUID_related: string;
  Folio: string;
  MonedaDR: string;
  MetodoDePagoDR: string;
  NumParcialidad: number;
  ImpSaldoAnt: number;
  ImpPagado: number;
  ImpSaldoInsoluto: number;
  Estatus: boolean;
  cfdi_related: {
    Estatus: string;
    MetodoPago: string;
  };
};

declare type payment = {
  uuid_origin: string;
  FechaPago: string;
  FormaDePagoP: string;
  c_forma_pago: {
    name: string;
  };
  MonedaP: string;
  Monto: number;
  TipoCambioP: number;
  NumOperacion: string;
  RfcEmisorCtaOrd: string;
  NomBancoOrdExt: string;
  CtaOrdenante: string;
  RfcEmisorCtaBen: string;
  CtaBeneficiario: string;
  TipoCadPago: string;
  CertPago: string;
  CadPago: string;
  SelloPago: string;
  docto_relacionados: relatedDoc[];
};

declare type relatedDoc = {
  payment_identifier: string;
  UUID: string;
  UUID_related: string;
  Folio: string;
  MonedaDR: string;
  MetodoDePagoDR: string;
  NumParcialidad: number;
  ImpSaldoAnt: number;
  ImpPagado: number;
  ImpSaldoInsoluto: number;
};

declare type CFDITaxes = {
  "@Impuesto": number;
  "@Base": number;
  "@TasaOCuota": number;
  "@Importe": number;
};

declare type CFDIPaymentTotals = {
  filtered: {
    count: number;
    PaymentRelatedCount: number;
    BaseIVA16: number;
    IVATrasladado16: number;
    BaseIVA8: number;
    IVATrasladado8: number;
    BaseIVA0: number;
    IVATrasladado0: number;
    BaseIVAExento: number;
    TrasladosIVA: number;
    RetencionesIVA: number;
    RetencionesISR: number;
    RetencionesIEPS: number;
    Total: number;
    total_docto_relacionados: number;
  };
  excercise: {
    count: number;
    PaymentRelatedCount: number;
    BaseIVA16: number;
    IVATrasladado16: number;
    BaseIVA8: number;
    IVATrasladado8: number;
    BaseIVA0: number;
    IVATrasladado0: number;
    BaseIVAExento: number;
    TrasladosIVA: number;
    RetencionesIVA: number;
    RetencionesISR: number;
    RetencionesIEPS: number;
    Total: number;
    total_docto_relacionados: number;
  };
};

declare type CFDIsTotals = {
  filtered: {
    SubTotalMXN: number;
    NetoMXN: number;
    TrasladosIVAMXN: number;
    TrasladosIEPSMXN: number;
    TrasladosISRMXN: number;
    RetencionesIVAMXN: number;
    RetencionesIEPSMXN: number;
    RetencionesISRMXN: number;
    count: number;
    ImpuestosRetenidos: number;
    DescuentoMXN: number;
    Total: number;
    TotalMXN: number;
  };
  excercise: {
    SubTotalMXN: number;
    NetoMXN: number;
    TrasladosIVAMXN: number;
    TrasladosIEPSMXN: number;
    TrasladosISRMXN: number;
    RetencionesIVAMXN: number;
    RetencionesIEPSMXN: number;
    RetencionesISRMXN: number;
    count: number;
    ImpuestosRetenidos: number;
    DescuentoMXN: number;
    Total: number;
    TotalMXN: number;
  };
};

type CFDICount = {
  E: string;
  I: string;
  N: string;
  P: string;
  T: string;
  ALL: string;
};

declare type GroupedCFDIs = {
  cfdis: CFDI[];
  totals: CFDIsTotals | null;
  quantity: number;
};

declare type ValidationCFDIs = {
  cfdis: CFDI[];
  totals: {
    [key: string]: CFDIsTotals | null;
  };
};

declare type Company = {
  id: number;
  identifier: string;
  created_at: string;
  name: string;
  rfc: string;
  emails_to_send_efos: string[];
  emails_to_send_errors: string[];
  emails_to_send_canceled: string[];
  have_certificates: boolean;
  has_valid_certs: boolean;
  exceed_metadata_limit: boolean;
  permission_to_sync: boolean;
  pasto_company_identifier: string;
  pasto_last_metadata_sync: string;
  add_auto_sync: boolean;
  workspace: {
    id: number;
    identifier: string;
    name: string;
    license: string;
    owner: {
      id: number;
      identifier: string;
      email: string;
    };
  };
  data: {
    scrap_status_constancy: {
      current_status: "pending" | "scraped" | "error" | "";
      updated_at: string;
      export_data: {
        file_name: string;
      };
    };
    scrap_status_opinion: {
      current_status: "pending" | "scraped" | "error" | "";
      updated_at: string;
      export_data: {
        file_name: string;
      };
    };
    coi_enabled: boolean;
  };
};

declare type PeriodData = {
  incomes?: {
    count: number;
    neto: number;
    subtotal: number;
    total: number;
  };
  expenses?: {
    count: number;
    neto: number;
    subtotal: number;
    total: number;
  };
};

declare type FormattedPeriodData = PeriodData & {
  period: string;
};

declare type RawPeriods = { [key: string]: PeriodData };

declare type StripeSubsStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

declare type StripeInvoiceStatus = "draft" | "open" | "paid" | "uncollectible" | "void";

declare type UserData = {
  user: {
    id: number;
    name: string;
    email: string;
  };
  access: {
    [key: string]: {
      id: number;
      license: {
        id: number;
        date_start: string;
        date_end: string;
        stripe_status: string;
        details: {
          add_enabled: boolean;
          max_companies: number;
          max_emails_enroll: number;
          exceed_metadata_limit: boolean;
          products?: { identifier: string; quantity: number }[];
        };
      };
      name: string;
      owner_id: number;
      pasto_worker_id: string | null;
      pasto_license_key: string | null;
      pasto_installed: string | null;
      stripe_status: StripeSubsStatus | null;
      companies: {
        [key: string]: {
          id: number;
          name: string;
          partner: {
            id: number;
          };
          modules: string[];
        };
      };
    };
  };
};

declare type EFOS = {
  no: number;
  rfc: string;
  name: string;
  state: string;
  sat_office_alleged: string;
  sat_publish_alleged_date: string;
  dof_office_alleged: string;
  dof_publish_alleged_date: string;
  sat_office_distored: string;
  sat_publish_distored_date: string;
  dof_office_distored: string;
  dof_publish_distored_date: string;
  sat_office_definitive: string;
  sat_publish_definitive_date: string;
  dof_office_definitive: string;
  dof_publish_definitive_date: string;
  sat_office_favorable_judgement: string;
  sat_publish_favorable_judgement_date: string;
  dof_office_favorable_judgement: string;
  dof_publish_favorable_judgement_date: string;
};

declare type EFOSTotals = {
  DEFINITIVE: number;
  DISTORTED: number;
  ALLEGED: number;
  FAVORABLE_JUDGMENT: number;
};

declare type PivotLayout = {
  id: string;
  name: string;
  rows: string[];
  cols: string[];
  rendererName: string;
  aggregatorName: string;
};

declare type TableLayout = {
  column: string;
  visible: boolean;
}[];

type NewWidgets = {
  totals: boolean;
  linecharttotals: boolean;
  "nominal-income": boolean;
  "improved-IVA": boolean;
  featuredTopic: boolean;
};

declare type UserConfig = {
  dashboardIds: string[];
  validationIds: string[];
  pivotLayouts: { [key: string]: PivotLayout[] };
  tableColumns: { [key: string]: TableLayout };
  IVAIds: string[];
  scrap_status_constancy: {
    current_status: "pending" | "scraped" | "error" | "";
    updated_at: string;
  };
  scrap_status_opinion: {
    current_status: "pending" | "scraped" | "error" | "";
    updated_at: string;
  };
};

declare type UserCompanyRoles = {
  companyId: number;
  companyName: string;
  identifier: string;
  roles: string[];
};

declare type UserWithPermissions = {
  id: number;
  email: string;
  name: string | null;
  sourceName: string;
  permissions: UserCompanyRoles[];
};

declare type Permission = {
  id: number;
  role: string;
  user: {
    id: number;
    name: string;
    email: string;
    source_name: string;
  };
  company: {
    name: string;
    id: number;
    identifier: string;
  };
};

declare type Alert = {
  id: number;
  notification_type: string;
  workspace_id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

declare type UserWithAlerts = {
  id: number;
  email: string;
  name: string | null;
  alerts: string[];
};

declare type SATQuerySingleData = {
  date: string;
  state: string;
  sat_cfdi_issued: number;
  downloaded_cfdi_issued: number;
  sat_cfdi_received: number;
  downloaded_cfdi_received: number;
  start_date: string;
  end_date: string;
};

declare type PeriodTree = {
  title: string;
  value: string;
  selectable?: boolean;
  children: { title: string; value: string }[];
};

declare type CFDISelection = {
  label: string;
  value: string;
  operators: { label: string; value: string }[];
  type: string;
};

declare type CFDIConcept = {
  id: string;
  ClaveProducto: string;
  CuentaPredial?: string;
  Cantidad: number;
  ClaveUnidad: string;
  Descripcion: string;
  PrecioUnitario: number;
  CuentaPredial?: string;
  Importe: number;
  Impuestos: {
    Traslados: {
      Traslado: {
        "@Base": number;
        "@Importe": number;
        "@Impuesto": number;
        "@TasaOCuota": number;
        "@TipoFactor": number;
      };
    };
    Retenciones: {
      Retencion: {
        "@Base": number;
        "@Importe": number;
        "@Impuesto": number;
        "@TasaOCuota": number;
        "@TipoFactor": number;
      };
    };
  };
};

declare type GServerParam = {
  value: string | boolean | number;
  name: string;
};

declare type WidgetCardType = {
  title: string;
  data: {
    [key: string]: number;
  } | null;
  value: number | undefined;
  style?: string;
};

declare type CFDIExport = {
  created_at: string;
  identifier: string;
  url: string;
  expiration_date: string;
  company_id: string;
  start: string;
  end: string;
  cfdi_type: string;
  state: string;
  format: string;
};

declare type NominalIncomeData = {
  datos: { [key: string]: Total };
  total: Total;
};

declare type NominalData = {
  mes?: string;
  vigentes: number;
  cancelados: number;
  subtotal_mxn: number;
  descuento_mxn: number;
  ingresos_netos?: number;
  emptyMonth?: boolean;
};

declare type IVAExport = {
  displayed_name: string;
  url: string;
  expiration_date: string;
  identifier: string;
  id: string;
  created_at: string;
  state: string;
  start: string;
  end: string;
  external_request: boolean;
};

declare type MassiveExportResponse = {
  cfdi_export_identifier: string;
};

declare type Product = {
  identifier: string;
  stripe_identifier: string;
  characteristics: {
    exceed_metadata_limit?: string;
    max_emails_enroll?: number | "unlimited";
    max_companies?: number | "unlimited";
    is_package?: string;
  };
  price: number;
  stripe_price_identifier: string;
  stripe_name: string;
};

declare type Price = {
  product: string;
  unit_amount: number;
};

declare type LineData = {
  price: Price;
};

declare type NotificationView = {
  isFreeTrialNotificationView: boolean;
  isAfterDaysNotificationsView: boolean;
  trialRemainingDays: number;
};

declare type License = {
  sub_identifier: string;
  cus_identifier: string;
  latest_invoice: {
    status: StripeInvoiceStatus;
    hosted_invoice_url: string;
    created_at: string;
    amount_due: number;
  } | null;
  latest_paid_invoice: {
    lines_data: LineData[];
  };
  add_enabled: boolean;
  any_invoice_paid: boolean;
  last_charge_amount: number | null;
  last_date_invoice: number | null;
  valid_until: number | null;
  details_coupon: CouponDetails | null;
};

declare type CouponDetails = {
  id: string;
  obejct: string;
  amount_off: null;
  created: number;
  currency: null;
  duration: string;
  duration_in_months: null;
  livemode: boolean;
  max_redemptions: null;
  metadata: string;
  name: string;
  percent_off: number;
  redeem_by: null;
  times_redeemed: number;
  valid: boolean;
};

declare type paidArray = {
  uuid: string;
  allVisible: boolean;
};

declare type regimeCatalogue = {
  [key: string]: string;
};

declare type invoiceData = {
  regimen_fiscal_id: number;
  nombre: string;
  rfc: string;
  cp: string;
  email: string;
};

declare interface LastManualSyncType {
  companyId: string;
  lastSyncDate: Date;
  amountOfDailyRequest: number;
}

declare interface LastTimeSatLogRequestedType {
  companyIdentifier: string | null;
  time: string;
}

declare interface ADDCompanyTypes {
  pasto_company_id: string;
  workspace_identifier: string;
  bdd: string;
  name: string;
  alias: string;
  rfc: string;
  pasto_last_metadata_sync: DateTime;
}

declare interface AddCompanyPayloadTypes {
  name: string;
  rfc: string;
  company_id: string;
}

declare interface ADDSyncSearch {
  xmls_to_send: number;
  cfdis_to_cancel_pending: number;
  state: "DRAFT" | "SEND" | "ERROR";
  end: string;
  xmls_to_send_pending: number;
  company_identifier: string;
  start: string;
  system: string;
  cfdis_to_cancel: number;
  xmls_to_send_total: number;
  cfdis_to_cancel_total: number;
  created_at: string;
  manually_triggered: boolean;
}

declare interface IVABase {
  TrasladosIVAMXN: number;
  BaseIVA16: number;
  BaseIVA8: number;
  BaseIVA0: number;
  BaseIVAExento: number;
  IVATrasladado16: number;
  IVATrasladado8: number;
  qty: number;
  total: number;
  PaymentRelatedCount: number;
  RetencionesIVAMXN: number;
}

declare interface IVAPeriod {
  i_tra: IVABase;
  p_tra: IVABase;
  prev_i_ret: IVABase;
  prev_p_ret: IVABase;
  credit_notes: IVABase;
  total: number;
  qty: number;
  excluded_qty: number;
  moved_qty: number;
}

declare interface IVATotals {
  creditable: IVAPeriod;
  transferred: IVAPeriod;
  diff: number;
}

declare interface IVAResponse {
  period: IVATotals;
  exercise: IVATotals;
}

declare interface IVAWidgetData {
  [month: string]: IVAResponse;
}

declare interface IvaPeriodWidget {
  mes: string;
  iva_trasladado: number;
  iva_acreditado: number;
  iva_a_cargo: number;
  retenciones_iva: number;
}

declare interface IvaTrasladadoWidget {
  mes: string;
  conteo_cfdis: number;
  base_16: number;
  base_8: number;
  base_0: number;
  base_exento: number;
  trasladado_16: number;
  trasladado_8: number;
  trasladado_total: number;
  retenciones_iva: number;
}

declare interface IvaAcreditableWidget {
  mes: string;
  conteo_cfdis: number;
  base_16: number;
  base_8: number;
  base_0: number;
  base_exento: number;
  acreditable_16: number;
  acreditable_8: number;
  acreditable_total: number;
  retenciones_iva: number;
}

declare interface InformationTAXResponse {
  url: string;
  urlDownload: string;
  date: string;
  scrap_status_constancy: {
    current_status: "pending" | "scraped" | "error" | "";
    updated_at: string;
    export_data: {
      file_name: string;
    };
  };
  scrap_status_opinion: {
    current_status: "pending" | "scraped" | "error" | "";
    updated_at: string;
    export_data: {
      file_name: string;
    };
  };
}

declare interface CFDIConceptType {
  ClaveProdServ: string;
  NoIdentificacion: string;
  Cantidad: string;
  ClaveUnidad: string;
  Unidad: string;
  Descripcion: string;
  ValorUnitario: string;
  Importe: string;
  Descuento: string;
  ObjetoImp: string;
  Impuestos?: {
    Traslados?: {
      Traslado: {
        IVA?: {
          Base: string;
          TipoFactor: string;
          TasaOCuota: string;
          Importe: string;
        };
        IEPS?: {
          Base: string;
          TipoFactor: string;
          TasaOCuota: string;
          Importe: string;
        };
      };
    };
    Retenciones?: {
      Retencion: {
        IVA?: {
          Base: string;
          TipoFactor: string;
          TasaOCuota: string;
          Importe: string;
        };
        ISR?: {
          Base: string;
          TipoFactor: string;
          TasaOCuota: string;
          Importe: string;
        };
      };
    };
  };
  Conceptos?: string;
}

type TabIVAType =
  | "ALL"
  | "CASH"
  | "CREDIT"
  | "WITHHOLDINGCASH"
  | "WITHHOLDINGCREDIT"
  | "EXCLUDED"
  | "MOVED"
  | "RESIGNED"
  | "NONE"
  | "CREDIT_NOTES";

type ExcludedIVAType = "EXCLUDED" | "RESIGNED" | "NONE";

type IVAAPITYPE =
  | "all"
  | "i_tra"
  | "p_tra"
  | "prev_i_ret"
  | "prev_p_ret"
  | "moved"
  | "excluded"
  | "credit_notes"
  | "OpeConTer";

declare interface PayrollTotalsType {
  type?: string;
  Qty: number;
  EmpleadosQty: number;
  TotalPercepciones: number;
  TotalDeducciones: number;
  TotalOtrosPagos: number;
  PercepcionesTotalSueldos: number;
  OtrasPercepciones: number;
  AjusteISRRetenido: number;
  PercepcionesTotalGravado: number;
  PercepcionesTotalExento: number;
  DeduccionesTotalImpuestosRetenidos: number;
  DeduccionesTotalOtrasDeducciones: number;
  SubsidioCausado: number;
  NetoAPagar: number;
}

declare interface PayrollTotals {
  filtered: PayrollTotalsType;
  excercise: PayrollTotalsType;
}
declare interface PayrollTotalsTypeWithKey extends PayrollTotalsType {
  key: React.Key;
}

declare interface PayrollDetailsModalContent {
  folio: string;
}

type TIVAPeriodTab =
  | "period_creditable"
  | "period_transferred"
  | "exercise_creditable"
  | "exercise_transferred";

declare interface CompanyType {
  empresa: string;
  rfc: string;
  rol: string;
  payroll: string;
  owner: string;
}

interface CompanyStatus {
  blockedCompanyIdentifiers: string[];
  isActiveFlag: boolean;
}
