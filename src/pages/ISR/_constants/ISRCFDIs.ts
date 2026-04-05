import { TableMeta } from "@hooks/useTableMeta";
import { ISRRecordType } from "../_types/ISRTypes";
import { numberPagination } from "@utils/global/numberPagination";

export const ISRFields = [
  "Fecha",
  "UUID",
  "Serie",
  "Folio",
  "RfcReceptor",
  "NombreReceptor",
  "RfcEmisor",
  "NombreEmisor",
  "TipoDeComprobante",
  "FormaPago",
  // "forma_pago_code",
  // "forma_pago_name",
  "c_forma_pago.name",
  "c_forma_pago.code",
  "payments.FormaDePagoP",
  "payments.c_forma_pago.name",
  "MetodoPago",
  "BaseIVA16",
  "BaseIVA8",
  "BaseIVA0",
  "BaseIVAExento",
  "RetencionesISRMXN",
  "base_isr",
  "PaymentDate",
  // Fields for Excluded
  "ExcludeFromISR",
  "ExcludeFromIVA",
  "Version",
  "is_too_big",
  // Deductions
  "Fecha",
  "UsoCFDIReceptor",
  "SubTotalMXN",
  "DescuentoMXN",
  "NetoMXN",
  "c_uso_cfdi.name",
  "c_uso_cfdi.code",
  "is_issued",
];

export const ISRPaymentFields = [
  "identifier",
  "ExcludeFromISR",
  "FechaPago",
  "cfdi_origin.Fecha",
  "UUID",
  "Serie",
  "Folio",
  "cfdi_origin.RfcEmisor",
  "cfdi_origin.NombreEmisor",
  "payment_related.FormaDePagoP",
  "payment_related.c_forma_pago.name",
  "cfdi_related.Folio",
  "cfdi_related.Serie",
  "cfdi_related.Fecha",
  "UUID_related",
  "cfdi_related.MetodoPago",
  "cfdi_related.UsoCFDIReceptor",
  "ObjetoImpDR",
  "BaseIVA16",
  "BaseIVA8",
  "BaseIVA0",
  "BaseIVAExento",
  "Neto",
  "RetencionesISR",
  "ImpPagadoMXN",
  // FIELDS FOR MODAL
  "cfdi_origin.TipoDeComprobante",
];

export const DEFAULT_ISR_TABLE_META: TableMeta<ISRRecordType> = {
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
  parsedOptions: { orderBy: "Fecha", limit: numberPagination, offset: 0 },
  filters: [],
};

export const DEFAULT_ISR_PAYMENT_TABLE_META: TableMeta<ISRRecordType> = {
  sorter: [
    {
      column: {
        dataIndex: "FechaPago",
      },
      columnKey: "FechaPago",
      order: "ascend",
      field: "FechaPago",
    },
  ],
  pagination: {
    current: 1,
    pageSize: numberPagination,
    defaultCurrent: 1,
  },
  parsedOptions: { orderBy: "FechaPago", limit: numberPagination, offset: 0 },
  filters: [],
};
