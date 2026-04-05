import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { TableMeta } from "../hooks/useTableMeta";
import { numberPagination } from "@utils/global/numberPagination";

export const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const type = {
  I: "Ingresos",
  T: "Traslados",
  E: "Egresos",
  P: "Pagos",
  N: "Nómina",
};

export const Module = {
  issued: "CFDIs_Emitidos",
  received: "CFDIs_Recibidos",
  "validation-simple": "Dashboard",
  "validation-complete": "Validaciones",
  efos: "EFOS",
  iva: "IVA",
};

export const DEFAULT_USER_CONFIG: UserConfig = {
  dashboardIds: ["totals", "linecharttotals", "nominal-income", "improved-IVA"],
  validationIds: ["issuedcfdis", "receivedcfdis", "efos"],
  pivotLayouts: {},
  tableColumns: {},
  IVAIds: ["iva-widget"],
  scrap_status_constancy: {
    current_status: "",
    updated_at: "",
  },
  scrap_status_opinion: {
    current_status: "",
    updated_at: "",
  },
};

export const DEFAULT_CFDI_TABLE_META: TableMeta<CFDI> = {
  sorter: [
    {
      column: {
        dataIndex: "Fecha",
      },
      columnKey: "Fecha",
      order: "ascend",
      field: "Fecha",
    },
  ],
  pagination: {
    current: 1,
    pageSize: numberPagination,
    defaultCurrent: 1,
  },
  parsedOptions: { orderBy: "", limit: numberPagination, offset: 0 },
  filters: [],
};

export const DEFAULT_IVA_CFDI_TABLE_META: TableMeta<IVACFDI> = {
  sorter: [
    {
      column: {
        dataIndex: "PaymentDate",
      },
      columnKey: "PaymentDate",
      order: "ascend",
      field: "PaymentDate",
    },
  ],
  pagination: {
    current: 1,
    pageSize: numberPagination,
    defaultCurrent: 1,
  },
  parsedOptions: { orderBy: "", limit: numberPagination, offset: 0 },
  filters: [],
};

export const DEFAULT_PAYROLL_CFDI_TABLE_META: TableMeta<CFDI> = {
  sorter: [
    {
      column: {
        dataIndex: "FechaFiltro",
      },
      columnKey: "FechaFiltro",
      order: "ascend",
      field: "FechaFiltro",
    },
  ],
  pagination: {
    current: 1,
    pageSize: numberPagination,
    defaultCurrent: 1,
  },
  parsedOptions: { orderBy: "FechaFiltro", limit: numberPagination, offset: 0 },
  filters: [],
};

export const DEFAULT_MODAL_CFDI_TABLE_META: TableMeta<EFOS> = {
  sorter: [],
  pagination: {
    current: 1,
    pageSize: numberPagination,
    defaultCurrent: 1,
  },
  parsedOptions: { orderBy: "", limit: numberPagination, offset: 0 },
  filters: [],
};

export const DEFAULT_ADD_TABLE_META: TableMeta<ADDCFDI> = {
  sorter: [
    {
      column: {
        dataIndex: "Fecha",
      },
      columnKey: "Fecha",
      order: "ascend",
      field: "Fecha",
    },
  ],
  pagination: {
    current: 1,
    pageSize: numberPagination,
    defaultCurrent: 1,
  },
  parsedOptions: { orderBy: "", limit: numberPagination, offset: 0 },
  filters: [],
};

export const DEFAULT_CFDI_EXPORTS_TABLE_META: TableMeta<CFDIExport> = {
  sorter: [
    {
      column: {
        dataIndex: "created_at",
      },
      columnKey: "created_at",
      order: "descend",
      field: "created_at",
    },
  ],
  pagination: {
    current: 1,
    pageSize: numberPagination,
    defaultCurrent: 1,
  },
  parsedOptions: { orderBy: "", limit: numberPagination, offset: 0 },
  filters: [],
};

export const DEFAULT_IVA_EXPORTS_TABLE_META: TableMeta<IVAExport> = {
  sorter: [
    {
      column: {
        dataIndex: "created_at",
      },
      columnKey: "created_at",
      order: "descend",
      field: "created_at",
    },
  ],
  pagination: {
    current: 1,
    pageSize: numberPagination,
    defaultCurrent: 1,
  },
  parsedOptions: { orderBy: "", limit: numberPagination, offset: 0 },
  filters: [],
};

export const IVA_ACCEPTED_YEAR = 2023;
