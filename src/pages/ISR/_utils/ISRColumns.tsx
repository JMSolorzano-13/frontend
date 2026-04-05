import { ColumnsType } from "antd/lib/table";
import { ISRRecordType, TopTabSectionType, UUIDsToUpdateType } from "../_types/ISRTypes";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { SorterResult } from "antd/es/table/interface";
import { Switch } from "antd";
import { GetColumnModify } from "@components/global/getColumnModify";

export default function ISRColumns(
  topTab: TopTabSectionType,
  sorter: SorterResult<ISRRecordType>[],
  uuids: UUIDsToUpdateType,
  setUUIDs: (val: UUIDsToUpdateType) => void
) {
  const allColumns: ColumnsType<ISRRecordType> = [
    {
      title: "No considerar ISR",
      dataIndex: "ExcludeFromISR",
      key: "ExcludeFromISR",
      showSorterTooltip: false,
      sorter: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "ExcludeFromISR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "ExcludeFromISR")?.order,
      render: (_, record) => {
        const disableSwitch = !(
          (record.TipoDeComprobante === "I" &&
            record.MetodoPago === "PUE" &&
            record.Version === "4.0") ||
          (record.TipoDeComprobante === "P" && record.Version === "4.0")
        );
        return (
          <Switch
            defaultChecked={record.ExcludeFromISR}
            checked={
              uuids?.some((u) => u.uuid === record.UUID) && !record.ExcludeFromISR
                ? true
                : record.ExcludeFromISR && !uuids.some((u) => u.uuid === record.UUID)
                ? true
                : false
            }
            disabled={disableSwitch}
            onChange={() => {
              if (!uuids.some((u) => u.uuid === record.UUID)) {
                setUUIDs([
                  ...uuids,
                  {
                    uuid: record.UUID,
                    currentValue: record.ExcludeFromISR,
                    is_issued: record.is_issued,
                  },
                ]);
              } else {
                const newArray = uuids.filter((u) => u.uuid !== record.UUID);
                setUUIDs(newArray);
              }
            }}
          />
        );
      },
      width: 150,
      fixed: false,
      align: "center",
    },
    {
      title: "Fecha de emisión",
      dataIndex: "Fecha",
      key: "Fecha",
      render: (value) => formatDisplay(value, DisplayType.PUREDATE),
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Fecha") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Fecha")?.order,
      width: 150,
    },
    {
      title: "Fecha de pago",
      dataIndex: "PaymentDate",
      key: "PaymentDate",
      render: (value) => formatDisplay(value, DisplayType.PUREDATE),
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "PaymentDate") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "PaymentDate")?.order,
      width: 150,
    },
    {
      title: "UUID",
      dataIndex: "UUID",
      key: "UUID",
      width: 325,
    },
    {
      title: "Serie",
      dataIndex: "Serie",
      key: "Serie",
      width: 95,
    },
    {
      title: "Folio",
      dataIndex: "Folio",
      key: "Folio",
      width: 80,
    },
    {
      title: "RFC receptor",
      dataIndex: "RfcReceptor",
      key: "RfcReceptor",
      width: 140,
    },
    {
      title: "Receptor",
      dataIndex: "NombreReceptor",
      key: "NombreReceptor",
      width: 300,
      render: (value) => <GetColumnModify value={value} characters={31} />,
    },
    {
      title: "RFC emisor",
      dataIndex: "RfcEmisor",
      key: "RfcEmisor",
      width: 140,
    },
    {
      title: "Emisor",
      dataIndex: "NombreEmisor",
      key: "NombreEmisor",
      width: 300,
    },
    {
      title: "Tipo de comprobante",
      dataIndex: "TipoDeComprobante",
      key: "TipoDeComprobante",
      width: 160,
    },
    {
      title: "Forma de pago código",
      dataIndex: "forma_pago_code",
      key: "FormaPagoCodigo",
      render: (value, record) =>
        record.TipoDeComprobante === "P"
          ? Array.isArray(record.payments)
            ? record.payments[0]?.FormaDePagoP
            : record.payments?.FormaDePagoP
          : record?.c_forma_pago?.code,
      width: 180,
      fixed: false,
    },
    {
      title: "Forma de pago",
      dataIndex: "forma_pago_name",
      render: (_, record) =>
        record.TipoDeComprobante === "P"
          ? Array.isArray(record.payments)
            ? record.payments[0]?.c_forma_pago?.name
            : record.payments?.c_forma_pago?.name
          : record?.c_forma_pago?.name,
      key: "FormaPago",
      width: 255,
      fixed: false,
    },
    {
      title: "Método de pago",
      dataIndex: "MetodoPago",
      key: "MetodoPago",
      width: 120,
    },
    {
      title: "Base IVA 16%",
      dataIndex: "BaseIVA16",
      key: "BaseIVA16",
      render: (value) => formatDisplay(value, DisplayType.MONEY),
      align: "right",
      width: 120,
    },
    {
      title: "Base IVA 8%",
      dataIndex: "BaseIVA8",
      key: "BaseIVA8",
      render: (value) => formatDisplay(value, DisplayType.MONEY),
      align: "right",
      width: 120,
    },
    {
      title: "Base IVA 0%",
      dataIndex: "BaseIVA0",
      key: "BaseIVA0",
      render: (value) => formatDisplay(value, DisplayType.MONEY),
      align: "right",
      width: 120,
    },
    {
      title: "Base IVA exento",
      dataIndex: "BaseIVAExento",
      key: "BaseIVAExento",
      render: (value) => formatDisplay(value, DisplayType.MONEY),
      align: "right",
      width: 140,
    },
    {
      title: "Total base ISR",
      dataIndex: "base_isr",
      key: "base_isr",
      render: (value) => formatDisplay(value, DisplayType.MONEY),
      align: "right",
      width: 120,
    },
    {
      title: "Retenciones ISR",
      dataIndex: "RetencionesISRMXN",
      key: "RetencionesISRMXN",
      render: (value) => formatDisplay(value, DisplayType.MONEY),
      align: "right",
      width: 140,
    },
  ];

  function getColumnsByTab(topTab: TopTabSectionType) {
    const columns = allColumns;

    switch (topTab) {
      case "incomes":
        return columns.filter((column) => {
          if (column.key) {
            return !["RfcEmisor", "NombreEmisor"].includes(String(column.key));
          }
          return true;
        });

      case "deductions":
        return columns.filter((column) => {
          if (column.key) {
            return !["ISRHoldings", "RfcReceptor", "NombreReceptor"].includes(String(column.key));
          }
          return true;
        });

      default:
        return columns;
    }
  }

  return getColumnsByTab(topTab);
}
