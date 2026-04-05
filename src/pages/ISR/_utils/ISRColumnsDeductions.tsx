import {
  DoctosToUpdateType,
  InternalTabType,
  ISRRecordType,
  TabType,
  TopTabSectionType,
  UUIDsToUpdateType,
} from "../_types/ISRTypes";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType, SorterResult } from "antd/es/table/interface";
import { Switch } from "antd";
import { getTableTabSwitchCondition } from "./getISRConditions";
import { CAT_METODO_PAGO, CAT_OBJETO_IMP, CAT_USO_CFDI } from "../_constants/ISRColumnFilters";
import { getFormaPagoFilter, getUsoCFDIFilter } from "./getColumnFilters";
import { getISRCheckedSwitch, setISRCheckedSwitch } from "./getISRSwitchExclude";

export function isPaymentColumn(tab: TabType, internalTab: InternalTabType) {
  return (
    tab === "PAYMENT" ||
    internalTab === "EXCLUDED-PREFILLED-PAYMENT" ||
    (tab === "EXCLUDED" && (internalTab === "PAYMENT" || internalTab === "EXCLUDED-PAYMENTS"))
  );
}

function getCorrectField(field: string, tab: TabType, internalTab: InternalTabType) {
  const FIELDS = {
    FormaPagoCode: {
      PAYMENT: "payment_related.FormaDePagoP",
      CFDI: "c_forma_pago.code",
    },
    MetodoPagoDR: {
      PAYMENT: "cfdi_related.MetodoPago",
      CFDI: "MetodoPagoDR",
    },
    UsoCFDIDR: {
      PAYMENT: "cfdi_related.UsoCFDIReceptor",
      CFDI: "UsoCFDIReceptorDR",
    },
  };

  const isPayment = isPaymentColumn(tab, internalTab);

  return FIELDS[field as keyof typeof FIELDS][isPayment ? "PAYMENT" : "CFDI"];
}

export default function ISRColumnsDeductions(
  topTab: TopTabSectionType,
  tab: TabType,
  internalTab: InternalTabType,
  sorter: SorterResult<ISRRecordType>[],
  uuids: UUIDsToUpdateType,
  setUUIDs: (val: UUIDsToUpdateType) => void,
  doctosToUpdate: DoctosToUpdateType,
  setDoctosToUpdate: (val: DoctosToUpdateType) => void
) {
  const allColumns: ColumnsType<ISRRecordType> = [
    {
      title: "No considerar ISR",
      dataIndex: "ExcludeFromISR",
      key: "ExcludeFromISR",
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={record?.ExcludeFromISR}
            checked={getISRCheckedSwitch(
              uuids,
              doctosToUpdate,
              record,
              isPaymentColumn(tab, internalTab)
            )}
            onChange={() => {
              setISRCheckedSwitch(
                record,
                uuids,
                setUUIDs,
                doctosToUpdate,
                setDoctosToUpdate,
                isPaymentColumn(tab, internalTab)
              );
            }}
          />
        );
      },
      width: 150,
      fixed: false,
      align: "center",
    },
    {
      title: "Fecha de pago",
      dataIndex: "FechaPago",
      key: "FechaPago",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FechaPago") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FechaPago")?.order,
      render: (value) => {
        return formatDisplay(value, DisplayType.PUREDATE);
      },
      width: 150,
    },
    {
      title: `Fecha ${isPaymentColumn(tab, internalTab) ? "de emisión" : "expedición"}`,
      dataIndex: isPaymentColumn(tab, internalTab) ? "cfdi_origin.Fecha" : "Fecha",
      key: "Fecha",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Fecha") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Fecha")?.order,
      render: (value, record) => {
        if (isPaymentColumn(tab, internalTab)) {
          return formatDisplay(record?.cfdi_origin?.Fecha, DisplayType.PUREDATE);
        } else {
          return formatDisplay(value, DisplayType.PUREDATE);
        }
      },
      width: 180,
    },
    {
      title: "UUID",
      dataIndex: "UUID",
      key: "UUID",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "UUID") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "UUID")?.order,
      width: 300,
    },
    {
      title: "Serie",
      dataIndex: "Serie",
      key: "Serie",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Serie") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Serie")?.order,
      width: 95,
    },
    {
      title: "Folio",
      dataIndex: "Folio",
      key: "Folio",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Folio") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Folio")?.order,
      width: 120,
    },
    {
      title: "RFC emisor",
      dataIndex: isPaymentColumn(tab, internalTab) ? "cfdi_origin.RfcEmisor" : "RfcEmisor",
      key: "RfcEmisor",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RfcEmisor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RfcEmisor")?.order,
      render: (value, record) => {
        if (isPaymentColumn(tab, internalTab)) {
          return record?.cfdi_origin?.RfcEmisor;
        } else {
          return value;
        }
      },
      width: 140,
    },
    {
      title: "Emisor",
      dataIndex: isPaymentColumn(tab, internalTab) ? "cfdi_origin.NombreEmisor" : "NombreEmisor",
      key: "NombreEmisor",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "NombreEmisor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "NombreEmisor")?.order,
      render: (value, record) => {
        if (isPaymentColumn(tab, internalTab)) {
          return record?.cfdi_origin?.NombreEmisor;
        } else {
          return value;
        }
      },
      width: 300,
    },
    {
      title: "RFC receptor",
      dataIndex: "RfcReceptor",
      key: "RfcReceptor",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RfcReceptor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RfcReceptor")?.order,
      width: 140,
    },
    {
      title: "Receptor",
      dataIndex: "NombreReceptor",
      key: "NombreReceptor",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "NombreReceptor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "NombreReceptor")?.order,
      width: 300,
    },
    {
      title: "Tipo de comprobante",
      dataIndex: "TipoDeComprobante",
      key: "TipoDeComprobante",
      width: 160,
    },
    {
      title: "Uso de CFDI",
      dataIndex: "UsoCFDIReceptor",
      key: "UsoCFDIReceptor",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "UsoCFDIReceptor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "UsoCFDIReceptor")?.order,
      filters: getUsoCFDIFilter(tab),
      width: 160,
    },
    {
      title: "Uso de CFDI descripción",
      key: "c_uso_cfdi.name",
      dataIndex: "c_uso_cfdi.name",
      render: (_, record) => {
        return record?.c_uso_cfdi?.name;
      },
      width: 240,
      align: "right",
    },
    {
      title: "Forma de pago código",
      dataIndex: getCorrectField("FormaPagoCode", tab, internalTab),
      key: getCorrectField("FormaPagoCode", tab, internalTab),
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex(
          (s) => s.columnKey === getCorrectField("FormaPagoCode", tab, internalTab)
        ) === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === getCorrectField("FormaPagoCode", tab, internalTab))
              ?.order,
      filters: getFormaPagoFilter(tab, internalTab),
      render: (_, record) => {
        if (isPaymentColumn(tab, internalTab)) {
          return record?.payment_related?.FormaDePagoP;
        } else {
          return record?.c_forma_pago?.code;
        }
      },
      width: 200,
      fixed: false,
    },
    {
      title: "Forma de pago",
      dataIndex: "c_forma_pago.name",
      key: "c_forma_pago.name",
      render: (_, record) => {
        if (isPaymentColumn(tab, internalTab)) {
          return record?.payment_related?.c_forma_pago?.name;
        } else {
          return record?.c_forma_pago?.name;
        }
      },
      width: 250,
      fixed: false,
    },
    {
      title: "Método de pago",
      dataIndex: "MetodoPago",
      key: "MetodoPago",
      showSorterTooltip: false,
      sorter: tab === "INVESTMENTS" ? true : false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "MetodoPago") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "MetodoPago")?.order,
      filterMultiple: false,
      filters: tab === "INVESTMENTS" ? CAT_METODO_PAGO : undefined,
      width: 170,
    },
    {
      title: "Subtotal",
      dataIndex: "SubTotalMXN",
      key: "SubTotalMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "SubTotalMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "SubTotalMXN")?.order,
      render: (value) => formatDisplay(value, DisplayType.MONEY),
      width: 250,
      fixed: false,
      align: "right",
    },
    {
      title: "Descuentos",
      dataIndex: "DescuentoMXN",
      key: "DescuentoMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "DescuentoMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "DescuentoMXN")?.order,
      render: (value) => formatDisplay(value, DisplayType.MONEY),
      width: 250,
      fixed: false,
      align: "right",
    },
    {
      title: "Neto",
      dataIndex: "NetoMXN",
      key: "NetoMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "NetoMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "NetoMXN")?.order,
      render: (value) => formatDisplay(value, DisplayType.MONEY),
      width: 250,
      fixed: false,
      align: "right",
    },
    {
      title: "Retenciones ISR",
      dataIndex: "RetencionesISRMXN",
      key: "RetencionesISRMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RetencionesISRMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RetencionesISRMXN")?.order,
      render: (value) => formatDisplay(value, DisplayType.MONEY),
      width: 250,
      fixed: false,
      align: "right",
    },
    {
      title: "Total base ISR",
      dataIndex: "base_isr",
      key: "base_isr",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
      width: 120,
    },
    {
      title: "DR - Serie",
      key: "SerieDR",
      dataIndex: "cfdi_related.Serie",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "SerieDR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "SerieDR")?.order,
      render: (_, record) => record?.cfdi_related?.Serie,
      width: 100,
    },
    {
      title: "DR - Folio",
      key: "FolioDR",
      dataIndex: "cfdi_related.Folio",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FolioDR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FolioDR")?.order,
      render: (_, record) => record?.cfdi_related?.Folio,
      width: 160,
    },
    {
      title: `DR - Fecha${isPaymentColumn(tab, internalTab) ? " de emisión" : " de pago"}`,
      key: "FechaDR",
      dataIndex: "cfdi_related.Fecha",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FechaDR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FechaDR")?.order,
      render: (_, record) => formatDisplay(record?.cfdi_related?.Fecha, DisplayType.PUREDATE),
      width: 180,
    },
    {
      title: "DR - UUID",
      key: "DoctoRelacionadoUUID",
      dataIndex: "UUID_related",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "DoctoRelacionadoUUID") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "DoctoRelacionadoUUID")?.order,
      // render: (_, record) => record.UUID_related,
      width: 300,
    },
    {
      title: "DR - Método de pago",
      key: getCorrectField("MetodoPagoDR", tab, internalTab),
      dataIndex: "cfdi_related.MetodoPago",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex(
          (s) => s.columnKey === getCorrectField("MetodoPagoDR", tab, internalTab)
        ) === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === getCorrectField("MetodoPagoDR", tab, internalTab))
              ?.order,
      filterMultiple: false,
      filters: CAT_METODO_PAGO,
      render: (_, record) => record?.cfdi_related?.MetodoPago,
      width: 300,
    },
    {
      title: "DR - Uso de CFDI",
      key: getCorrectField("UsoCFDIDR", tab, internalTab),
      dataIndex: "cfdi_related.UsoCFDIReceptor",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === getCorrectField("UsoCFDIDR", tab, internalTab)) ===
        -1
          ? undefined
          : sorter?.find((s) => s.columnKey === getCorrectField("UsoCFDIDR", tab, internalTab))
              ?.order,
      filters: CAT_USO_CFDI,
      render: (_, record) => record?.cfdi_related?.UsoCFDIReceptor,
      width: 170,
    },
    {
      title: "DR - Objeto de impuesto",
      key: "ObjetoImpDR",
      dataIndex: "ObjetoImpDR",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "ObjetoImpDR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "ObjetoImpDR")?.order,
      filters: CAT_OBJETO_IMP,
      width: 220,
    },
    {
      title: "DR - Base IVA 16%",
      key: "BaseIVA16",
      dataIndex: "BaseIVA16",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA16") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA16")?.order,
      render: (_, record) => formatDisplay(record?.BaseIVA16, DisplayType.MONEY),
      width: 150,
      align: "right",
    },
    {
      title: "DR - Base IVA 8%",
      key: "BaseIVA8",
      dataIndex: "BaseIVA8",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA8") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA8")?.order,
      render: (_, record) => formatDisplay(record?.BaseIVA8, DisplayType.MONEY),
      width: 150,
      align: "right",
    },
    {
      title: "DR - Base IVA 0%",
      key: "BaseIVA0",
      dataIndex: "BaseIVA0",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA0") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA0")?.order,
      render: (_, record) => formatDisplay(record?.BaseIVA0, DisplayType.MONEY),
      width: 150,
      align: "right",
    },
    {
      title: "DR - Base IVA Exento",
      key: "BaseIVAExento",
      dataIndex: "BaseIVAExento",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVAExento") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVAExento")?.order,
      render: (_, record) => formatDisplay(record?.BaseIVAExento, DisplayType.MONEY),
      width: 180,
      align: "right",
    },
    {
      title: "DR - Neto",
      key: "DRNeto",
      dataIndex: "Neto",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "DRNeto") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "DRNeto")?.order,
      render: (_, record) => formatDisplay(record?.Neto, DisplayType.MONEY),
      width: 135,
      align: "right",
    },
    {
      title: "DR - Retenciones ISR",
      key: "DRRetencionesISR",
      dataIndex: "RetencionesISR",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "DRRetencionesISR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "DRRetencionesISR")?.order,
      render: (_, record) => formatDisplay(record?.RetencionesISR, DisplayType.MONEY),
      width: 170,
      align: "right",
    },
    {
      title: "DR - Importe pagado",
      key: "ImpPagadoMXN",
      dataIndex: "ImpPagadoMXN",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "ImpPagadoMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "ImpPagadoMXN")?.order,
      render: (_, record) => formatDisplay(record?.ImpPagadoMXN, DisplayType.MONEY),
      width: 170,
      align: "right",
    },
  ];

  function getColumnsByTab(tab: TabType, internalTab: InternalTabType) {
    const columns = allColumns;
    const switchTab = getTableTabSwitchCondition(tab, internalTab);

    const PAYMENT_COLUMNS = [
      "ExcludeFromISR",
      "FechaPago",
      "Fecha",
      "UUID",
      "Serie",
      "Folio",
      "RfcEmisor",
      "NombreEmisor",
      "payment_related.FormaDePagoP",
      "c_forma_pago.name",
      "SerieDR",
      "FolioDR",
      "FechaDR",
      "DoctoRelacionadoUUID",
      "cfdi_related.MetodoPago",
      "cfdi_related.UsoCFDIReceptor",
      "ObjetoImpDR",
      "BaseIVA16",
      "BaseIVA8",
      "BaseIVA0",
      "BaseIVAExento",
      "DRNeto",
      "DRRetencionesISR",
      "ImpPagadoMXN",
    ];

    switch (switchTab) {
      case "CASH":
        return columns.filter((column) => {
          if (column.key) {
            return [
              "ExcludeFromISR",
              "Fecha",
              "UUID",
              "Serie",
              "Folio",
              "RfcEmisor",
              "NombreEmisor",
              "TipoDeComprobante",
              "UsoCFDIReceptor",
              "c_forma_pago.code",
              "c_forma_pago.name",
              "MetodoPago",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "RetencionesISRMXN",
            ].includes(String(column.key));
          }
          return true;
        });
      case "PAYMENT":
        return columns.filter((column) => {
          if (column.key) {
            return PAYMENT_COLUMNS.includes(String(column.key));
          }
          return true;
        });
      case "DISCOUNTS-INCOMES":
        return columns.filter((column) => {
          if (column.key) {
            return [
              "Fecha",
              "ExcludeFromISR",
              "UUID",
              "Serie",
              "Folio",
              "RfcReceptor",
              "NombreReceptor",
              "TipoDeComprobante",
              "UsoCFDIReceptor",
              "c_forma_pago.code",
              "c_forma_pago.name",
              "MetodoPago",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
            ].includes(String(column.key));
          }
          return true;
        });
      case "DISCOUNTS-EGRESS":
        return columns.filter((column) => {
          if (column.key) {
            return [
              "ExcludeFromISR",
              "Fecha",
              "UUID",
              "Serie",
              "Folio",
              "RfcReceptor",
              "NombreReceptor",
              "TipoDeComprobante",
              "UsoCFDIReceptor",
              "c_forma_pago.code",
              "c_forma_pago.name",
              "MetodoPago",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
            ].includes(String(column.key));
          }
          return true;
        });
      case "EXCLUDED-PREFILLED-INCOMES":
        return columns.filter((column) => {
          if (column.key) {
            return [
              "ExcludeFromISR",
              "Fecha",
              "UUID",
              "Serie",
              "Folio",
              "RfcEmisor",
              "NombreEmisor",
              "TipoDeComprobante",
              "UsoCFDIReceptor",
              "c_forma_pago.code",
              "c_forma_pago.name",
              "MetodoPago",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "RetencionesISRMXN",
            ].includes(String(column.key));
          }
          return true;
        });

      case "EXCLUDED-PREFILLED-PAYMENT":
        return columns.filter((column) => {
          if (column.key) {
            return PAYMENT_COLUMNS.includes(String(column.key));
          }

          return true;
        });
      case "EGRESS":
        return columns.filter((column) => {
          if (column.key) {
            return [
              "ExcludeFromISR",
              "Fecha",
              "UUID",
              "Serie",
              "Folio",
              "RfcEmisor",
              "NombreEmisor",
              "TipoDeComprobante",
              "UsoCFDIReceptor",
              "c_forma_pago.code",
              "c_forma_pago.name",
              "MetodoPago",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "RetencionesISRMXN",
            ].includes(String(column.key));
          }
          return true;
        });
      case "INVESTMENTS":
        return columns.filter((column) => {
          if (column.key) {
            return [
              "ExcludeFromISR",
              "Fecha",
              "UUID",
              "Serie",
              "Folio",
              "RfcEmisor",
              "NombreEmisor",
              "TipoDeComprobante",
              "UsoCFDIReceptor",
              "c_uso_cfdi.name",
              "c_forma_pago.code",
              "c_forma_pago.name",
              "MetodoPago",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
            ].includes(String(column.key));
          }
          return true;
        });
      case "EXCLUDED-CASH":
        return columns.filter((column) => {
          if (column.key) {
            return [
              "ExcludeFromISR",
              "Fecha",
              "UUID",
              "Serie",
              "Folio",
              "RfcEmisor",
              "NombreEmisor",
              "TipoDeComprobante",
              "UsoCFDIReceptor",
              "c_forma_pago.code",
              "c_forma_pago.name",
              "MetodoPago",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "RetencionesISRMXN",
            ].includes(String(column.key));
          }
          return true;
        });
      case "EXCLUDED-PAYMENT":
        return columns.filter((column) => {
          if (column.key) {
            return PAYMENT_COLUMNS.includes(String(column.key));
          }
          return true;
        });
      case "EXCLUDED-EXCLUDED-INCOMES":
        return columns.filter((column) => {
          if (column.key) {
            return [
              "Fecha",
              "ExcludeFromISR",
              "UUID",
              "Serie",
              "Folio",
              "RfcReceptor",
              "NombreReceptor",
              "TipoDeComprobante",
              "UsoCFDIReceptor",
              "c_forma_pago.code",
              "c_forma_pago.name",
              "MetodoPago",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
            ].includes(String(column.key));
          }
          return true;
        });
      case "EXCLUDED-EXCLUDED-EGRESS":
        return columns.filter((column) => {
          if (column.key) {
            return [
              "ExcludeFromISR",
              "Fecha",
              "UUID",
              "Serie",
              "Folio",
              "RfcReceptor",
              "NombreReceptor",
              "TipoDeComprobante",
              "UsoCFDIReceptor",
              "c_forma_pago.code",
              "c_forma_pago.name",
              "MetodoPago",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
            ].includes(String(column.key));
          }
          return true;
        });
      case "EXCLUDED-EXCLUDED-INCOMES-PUE":
        return columns.filter((column) => {
          if (column.key) {
            return [
              "ExcludeFromISR",
              "Fecha",
              "UUID",
              "Serie",
              "Folio",
              "RfcEmisor",
              "NombreEmisor",
              "TipoDeComprobante",
              "UsoCFDIReceptor",
              "c_forma_pago.code",
              "c_forma_pago.name",
              "MetodoPago",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "RetencionesISRMXN",
            ].includes(String(column.key));
          }
          return true;
        });
      case "EXCLUDED-EXCLUDED-PAYMENTS":
        return columns.filter((column) => {
          if (column.key) {
            return PAYMENT_COLUMNS.includes(String(column.key));
          }
          return true;
        });
      case "EXCLUDED-EGRESS":
        return columns.filter((column) => {
          if (column.key) {
            return [
              "ExcludeFromISR",
              "Fecha",
              "UUID",
              "Serie",
              "Folio",
              "RfcEmisor",
              "NombreEmisor",
              "TipoDeComprobante",
              "UsoCFDIReceptor",
              "c_forma_pago.code",
              "c_forma_pago.name",
              "MetodoPago",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "RetencionesISRMXN",
            ].includes(String(column.key));
          }
          return true;
        });
      default:
        return columns;
    }
  }

  return getColumnsByTab(tab, internalTab);
}
