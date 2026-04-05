import { ColumnsType } from "antd/lib/table";
import { DisplayType, formatDisplay } from "../formatDisplay";

export type RecordType = {
  key: React.Key;
  tipo: string;
  retencionIVA: number;
  retencionIEPS: number;
  retencionISR: number;
  trasladoIVA: number;
  trasladoIEPS: number;
  trasladoISR: number;
  conteoCFDI: number;
  impuestoLocal: number;
  subtotal: number;
  descuento: number;
  neto: number;
  total: number;
};

export type PaymentRecordType = {
  key: React.Key;
  count: number;
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
  PaymentRelatedCount: number;
};

const columns: ColumnsType<RecordType> = [
  { title: "Tipo", dataIndex: "tipo", key: "tipo", fixed: "left", width: 100 },
  {
    title: "Conteo de CFDIs",
    dataIndex: "conteoCFDI",
    key: "conteoCFDI",
    width: 125,
  },
  {
    title: "Retención IVA",
    dataIndex: "retencionIVA",
    key: "retencionIVA",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 125,
  },
  {
    title: "Retención IEPS",
    dataIndex: "retencionIEPS",
    key: "retencionIEPS",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 125,
  },
  {
    title: "Retención ISR",
    dataIndex: "retencionISR",
    key: "retencionISR",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 125,
  },
  {
    title: "Traslado IVA",
    dataIndex: "trasladoIVA",
    key: "trasladoIVA",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 125,
  },
  {
    title: "Traslado IEPS",
    dataIndex: "trasladoIEPS",
    key: "trasladoIEPS",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 125,
  },
  {
    title: "Traslado ISR",
    dataIndex: "trasladoISR",
    key: "trasladoISR",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 125,
  },
  {
    title: "Total de retenciones",
    dataIndex: "impuestoLocal",
    key: "impuestoLocal",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 180,
  },
  {
    title: "Subtotal",
    dataIndex: "subtotal",
    key: "subtotal",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
  {
    title: "Descuento",
    dataIndex: "descuento",
    key: "descuento",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
  {
    title: "Neto",
    dataIndex: "neto",
    key: "neto",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
];

export const paymentsColumns: ColumnsType<PaymentRecordType> = [
  { title: "Tipo", dataIndex: "tipo", key: "tipo", fixed: "left", width: 100 },
  {
    title: "Conteo de CFDIs",
    dataIndex: "count",
    key: "count",
    width: 125,
  },
  {
    title: "# Relacionados",
    dataIndex: "PaymentRelatedCount",
    key: "PaymentRelatedCount",
    width: 130,
    fixed: false,
  },
  {
    title: "Base IVA 16%",
    dataIndex: "BaseIVA16",
    key: "BaseIVA16",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
  {
    title: "IVA 16%",
    dataIndex: "IVATrasladado16",
    key: "IVATrasladado16",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },

  {
    title: "Base IVA 8%",
    dataIndex: "BaseIVA8",
    key: "BaseIVA8",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
  {
    title: "IVA 8%",
    dataIndex: "IVATrasladado8",
    key: "IVATrasladado8",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },

  {
    title: "Base IVA 0%",
    dataIndex: "BaseIVA0",
    key: "BaseIVA0",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },

  {
    title: "Base IVA Exento",
    dataIndex: "BaseIVAExento",
    key: "BaseIVAExento",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
  {
    title: "Traslado IVA",
    dataIndex: "TrasladosIVA",
    key: "TrasladosIVA",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
  {
    title: "Retenciones IVA",
    dataIndex: "RetencionesIVA",
    key: "RetencionesIVA",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
  {
    title: "Retenciones ISR",
    dataIndex: "RetencionesISR",
    key: "RetencionesISR",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
  {
    title: "Retenciones IEPS",
    dataIndex: "RetencionesIEPS",
    key: "RetencionesIEPS",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
  {
    title: "Total",
    dataIndex: "Total",
    key: "Total",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 150,
  },
  {
    title: "Total pagos relacionados",
    dataIndex: "total_docto_relacionados",
    key: "total_docto_relacionados",
    render: (val) => formatDisplay(val, DisplayType.MONEY),
    align: "right",
    width: 200,
  },
];

export default columns;
