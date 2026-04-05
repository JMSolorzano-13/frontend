import { TableMeta } from "@hooks/useTableMeta";
import { FilterValue, SorterResult, TablePaginationConfig } from "antd/es/table/interface";

export type TabHeaderType = {
  date: string | null;
  currentTopTab: TopTabSectionType;
  setTopTab: (tab: TopTabSectionType) => void;
  totals: ISRTotalsResponseType | ISRTotalsResponseTypeDedcutions | null;
  loading: boolean;
  periodType: string | null;
  setTab: (tab: TabType) => void;
  company: string;
  period: string;
  totalsDeductions: TabTotalsResponseRow[] | null;
};

export type TopTabType = {
  section: TopTabSectionType;
  active: boolean;
  changeCurrentTopTab: (tab: TopTabSectionType) => void;
  currentTotals: ISRTotalsPeriodType | undefined;
  loading: boolean;
  text: string;
  text2: string;
  setTab: (tab: TabType) => void;
  company: string;
  period: string;
  currentTopTab: TopTabSectionType;
};

export type TopTabTypeDeductions = {
  section: TopTabSectionType;
  active: boolean;
  changeCurrentTopTab: (tab: TopTabSectionType) => void;
  currentTotals: ISRTotalsPeriodType | undefined;
  loading: boolean;
  text: string;
  text2: string;
  setTab: (tab: TabType) => void;
  currentTopTab: TopTabSectionType;
};

export type DeductionsTotal = {
  Importe?: number;
  importe?: number;
  isr_cargo: number;
};

export type DeductionTopTabType = {
  section: TopTabSectionType;
  active: boolean;
  changeCurrentTopTab: (tab: TopTabSectionType) => void;
  currentTotals: ISRTotalsPeriodType | undefined;
  loading: boolean;
};

export type TopTabSectionType = "incomes" | "deductions";

export type ISRDetailsTabsType = {
  date: string | null;
  currentTopTab: TopTabSectionType;
  tab: TabType;
  setTab: (tab: TabType) => void;
  setInternalTab: (value: InternalTabType) => void;
  data: ISRTotalsResponseType | null;
  loading: boolean;
  periodType: string | null;
};

export type ISRDetailsTabsTypeDeductions = {
  date: string | null;
  currentTopTab: TopTabSectionType;
  tab: TabType;
  setTab: (tab: TabType) => void;
  setInternalTab: (value: InternalTabType) => void;
  data: ResponseTotalsDeductionsComplete | null;
  loading: boolean;
  periodType: string | null;
};

export type GetDetailsTabsType = {
  date: string | null;
  currentTopTab: TopTabSectionType;
  data: ISRTotalsResponseType | null;
  loading: boolean;
  periodType: string | null;
};

export type GetDetailsTabsTypeDeductions = {
  date: string | null;
  currentTopTab: TopTabSectionType;
  data: ResponseTotalsDeductionsComplete | null;
  loading: boolean;
  periodType: string | null;
};

export type TabType =
  | "ALL"
  | "CASH"
  | "PAYMENT"
  | "EXCLUDED"
  | "MOVED"
  | "EXCLUDED-PREFILLED"
  | "DISCOUNTS"
  | "EGRESS"
  | "INVESTMENTS";

export type InternalTabType =
  | "DISCOUNTS-INCOMES"
  | "DISCOUNTS-EGRESS"
  | "EXCLUDED-PREFILLED-INCOMES"
  | "EXCLUDED-PREFILLED-PAYMENT"
  | "CASH"
  | "PAYMENT"
  | "EXCLUDED"
  | "MOVED"
  | "EXCLUDED-PREFILLED"
  | "DISCOUNTS"
  | "EGRESS"
  | "INVESTMENTS"
  | "EXCLUDED-INCOMES"
  | "EXCLUDED-EGRESS"
  | "EXCLUDED-INCOMES-PUE"
  | "EXCLUDED-PAYMENTS";

export type PaymentRelated = {
  FechaPago: string;
  FormaDePagoP: string;
  c_forma_pago: {
    name: string;
  };
};

export type ISRRecordType = {
  Fecha: string;
  UUID: string;
  Serie: string;
  Folio: string;
  RfcReceptor: string;
  nombreReceptor: string;
  TipoDeComprobante: string;
  MetodoPago: string;
  BaseIVA16: number;
  BaseIVA8: number;
  BaseIVA0: number;
  BaseIVAExento: number;
  base_isr: number;
  RetencionesISRMXN: number;
  FormaPago: string;
  // forma_pago_code: string;
  c_forma_pago: {
    code: string;
    name: string;
  };
  c_uso_cfdi?: {
    code: string;
    name: string;
  };
  // forma_pago_name: string;
  payments: payment[] | payment;
  // Fields for ExcludeISR
  Version: string;
  ExcludeFromISR: boolean;
  is_too_big: boolean;
  // Fields for Modal
  FechaFiltro: string;
  ExcludeFromIVA: boolean;
  cfdi_related?: CFDI;

  // Payments
  identifier: string;
  payment_related: PaymentRelated;
  cfdi_origin: CFDI;
  Neto: number;
  RetencionesISR: number;
  ImpPagadoMXN: number;
  is_issued: boolean;
};

export type ISRCFDIResponseType = {
  data: ISRRecordType[];
  next_page: boolean;
  total_records: number;
};

export type ISRTotalsRecordType = {
  key: React.Key;
  context: string;
  period: string;
  qty: number | "";
  baseIVA16: number | "";
  baseIVA8: number | "";
  baseIVA0: number | "";
  baseExemptIVA: number | "";
  totalISR: number | "";
  ISRHoldings: number | "";
};

export type ISRTotalsRecordTypeDeductions = {
  key: React.Key;
  context: string;
  conteo: string;
  subtotal: string;
  neto: string;
  descuento: string;
  retenciones: string;
};

export type TotalTableProps = {
  topTab: TopTabSectionType;
  tab: TabType;
  setTab: (tab: TabType) => void;
  internalTab?: InternalTabType;
  data: ISRTotalsResponseType | ISRTotalsResponseTypeDedcutions | null;
  loading: boolean;
  date: string | null;
  periodType: string | null;
};

export type ISRCFDITableProps = {
  topTab: TopTabSectionType;
  tab: TabType;
  internalTab: InternalTabType;
  data: ISRRecordType[];
  dataQty: number;
  tableMeta: TableMeta<ISRRecordType>;
  setTableMeta: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ISRRecordType> | SorterResult<any>[]
  ) => void;
  loading: boolean;
  uuidsToUpdate: UUIDsToUpdateType;
  setUUIDSToUpdate: (val: UUIDsToUpdateType) => void;
  doctosToUpdate: DoctosToUpdateType;
  setDoctosToUpdate: (val: DoctosToUpdateType) => void;
};

export type ISRTotalColumnsType = {
  // topTab: TopTabSectionType;
  tab: TabType;
  internalTab?: InternalTabType;
};

export type ISRTotalsPayload = {
  company: string | null;
  period: string;
  isr_topTab: TopTabSectionType;
  domain: DomainItem[];
  tab?: TabType;
  internalTab?: InternalTabType;
};

export type ISRUpdatePayload = {
  company: string | null;
  percentage: number;
  period: string;
};

export type ISRCFDIsPayload = {
  domain: DomainItem[];
  limit: number;
  orderBy: string;
  offset: number;
  tab?: TabType;
  topTab?: TopTabSectionType;
  internalTab?: InternalTabType;
};

export type ISRUpdateCFDIPayload = {
  companyIdentifier: string | null;
  cfdis: ISRCFDIsPayloadType;
};
export type ISRCFDIsPayloadType = {"UUID": string, "is_issued": boolean, "ExcludeFromISR": boolean}[]

export type ISRUpdateDoctosPayload = {
  company_identifier: string | null;
  cfdis: ISRDoctosPayloadType;
};

export type ISRDoctosPayloadType = { identifier: string; [key: string]: boolean | string }[];


export type ISRTotalsResponseType = {
  exercise: ISRTotalsPeriodType;
  period: ISRTotalsPeriodType;
};

export type ISRTotalsResponseTypeDedcutions = {
  ConteoCFDIs: number;
  SubTotal: number;
  DescuentoMXN: number;
  NetoMXN: number;
  RetencionesISRMXN: number;
};

type ISRTotalsPeriodType = {
  deductions: ISRPeriodSectionType;
  incomes: ISRPeriodSectionType;
};

export type ISRPeriodSectionType = {
  invoice_pue: SinglePeriodSectionType;
  payments: SinglePeriodSectionType;
  excluded_qty: number;
  qty: number;
  total: number;
};

type SinglePeriodSectionType = {
  BaseIVA0: number;
  BaseIVA8: number;
  BaseIVA16: number;
  BaseIVAExento: number;
  RetencionesISRMXN: number;
  qty: number;
  total: number;
};

export type getISRDomainProps = {
  company: string | null;
  topTab: TopTabSectionType;
  tab: TabType;
  internalTab?: InternalTabType;
  date: string | null;
  periodType: string | null;
  filters?: any;
};

export type getDatesDomainType = {
  date: string | null;
  topTab: TopTabSectionType;
  tab: TabType;
  periodType: string | null;
  internalTab?: InternalTabType;
};

export interface IExportISRTable {
  period: string;
  isr: "all" | "invoice_pue" | "payments" | "excluded";
  issued: boolean;
  yearly: boolean;
  file_name?: string;

  topTab: TopTabSectionType;
  tab: TabType;
  internalTab: InternalTabType;

  date: string | null;
  periodType: string | null;
  filters?: any;
}

export interface IExportISRPayload extends IExportISRTable {
  company_identifier: string;
  fields?: any;
  domain?: DomainItem[];
}

export interface ExportPayloadComplete {
  period: string;
  isr: "all" | "invoice_pue" | "payments" | "excluded";
  issued: boolean;
  yearly: boolean;
  file_name?: string;
  topTab: TopTabSectionType;
  tab: TabType;
  internalTab: InternalTabType;
  export_data: {
    file_name?: string;
    type: string;
  };
  date: string | null;
  periodType: string | null;
  filters?: any;
  company_identifier: string;
  fields?: any;
  domain?: DomainItem[];
  display_name_deductions?: string;
}

export interface IExportISRPayloadDeductions {
  domain: DomainItem[];
  period: string;
  file_name?: string;

  topTab: TopTabSectionType;
  tab: TabType;
  internalTab: InternalTabType;
  fields: any;
}

export type UUIDsToUpdateType = SingleUUIDToUpdateType[];

type SingleUUIDToUpdateType = {
  uuid: string;
  currentValue: boolean;
  is_issued: boolean;
};

export type DoctosToUpdateType = SingleDoctoToUpdateType[]

type SingleDoctoToUpdateType = {
  uuid: string;
  currentValue: boolean;
}

export type TabTotalsResponseTable = {
  totals_tabs: TabTotalsResponseRow[];
};

export type ResponseTotalsAll = {
  incomes: ISRTotalsResponseType;
  totals_table_excluded: TabTotalsResponseRow[];
  totals_table: TabTotalsResponseRow[];
};

export type ResponseTotalsDeductionsComplete = {
  totals_table_excluded: TabTotalsResponseRow[];
  totals_table: TabTotalsResponseRow[];
};

export type TabTotalsResponseRow = {
  concepto: string;
  conteoCFDIs?: number;
  importe?: number;
  isr_cargo?: number;
  isEqual?: boolean;
  isPlus?: boolean;
  isNeutral?: boolean;
  isBlack?: boolean;
  deducible?: number;
  concepts?: TabTotalsResponseRow[];
};

export type TabTotalsResponseRowBefore = {
  Concepto: string;
  ConteoCFDIs?: number; // A veces no está
  Importe: number;
  porcentaje?: number;
  isr_cargo?: number;
  concepts?: TabTotalsResponseRowBefore[];
};

export type TotalsPayment = {
  ConteoCFDIs: number;
  BaseIVA16: number;
  BaseIVA8: number;
  BaseIVA0: number;
  BaseIVAExento: number;
  Neto: number;
  RetencionesISR: number;
};
