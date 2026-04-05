import { GetColumnModify } from "@components/global/getColumnModify";
import { TState, UpdateUUIDsType } from "@pages/IVA/_types/StateTypes";
import getDisableSwitch from "@pages/IVA/_utils/getDisableSwitch";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { Switch } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SorterResult } from "antd/lib/table/interface";

export interface propsType {
  modalType: "creditable" | "transferred";
  modalPeriod: string;
  tab: TabIVAType;
  sorter: SorterResult<IVACFDI>[];
  uuids: UpdateUUIDsType;
  topTab: TState;
  setUUIDs: (state: UpdateUUIDsType) => any;
}

export default function IVACFDIColumns(props: propsType): ColumnsType<IVACFDI> {
  const { modalType, tab, sorter, setUUIDs, uuids, topTab } = props;
  let vatType;

  if (modalType === "creditable") {
    vatType = "acreditable";
  } else {
    vatType = "trasladado";
  }

  const allColumns: ColumnsType<IVACFDI> = [
    {
      title: "No considerar IVA",
      dataIndex: "ExcludeFromIVA",
      key: "ExcludeFromIVA",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "ExcludeFromIVA") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "ExcludeFromIVA")?.order,
      render: (_, record) => {
        const disableSwitch = getDisableSwitch(record);
        if (disableSwitch) {
          return <span>No aplica</span>;
        } else {
          return (
            <Switch
              defaultChecked={record.ExcludeFromIVA}
              checked={
                uuids.some((u) => u.uuid === record.UUID) && !record.ExcludeFromIVA
                  ? true
                  : record.ExcludeFromIVA && !uuids.some((u) => u.uuid === record.UUID)
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
                      currentValue: record.ExcludeFromIVA,
                      is_issued: record.is_issued,
                    },
                  ]);
                  return;
                }
                const newArray = uuids.filter((u) => u.uuid !== record.UUID);
                setUUIDs(newArray);
              }}
            />
          );
        }
      },
      width: 165,
      fixed: false,
      align: "center",
    },
    {
      title: "Fecha de emisión",
      key: "Fecha",
      dataIndex: "Fecha",
      width: 145,
      render: (val) => {
        return formatDisplay(val, DisplayType.PUREDATE) as string;
      },
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Fecha") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Fecha")?.order,
      showSorterTooltip: false,
    },
    {
      title: "Fecha de pago",
      key: "PaymentDate",
      dataIndex: "PaymentDate",
      width: 150,
      render: (val) => {
        return formatDisplay(val, DisplayType.PUREDATE) as string;
      },
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "PaymentDate") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "PaymentDate")?.order,
      showSorterTooltip: false,
    },
    { title: "UUID", key: "UUID", dataIndex: "UUID", width: 320 },
    {
      title: "Serie",
      key: "Serie",
      dataIndex: "Serie",
      width: 150,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Serie") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Serie")?.order,
    },
    {
      title: "Folio",
      key: "Folio",
      dataIndex: "Folio",
      render: (value) => <GetColumnModify value={value} characters={6} />,
      width: 100,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Folio") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Folio")?.order,
    },
    {
      title: `RFC ${topTab.includes("transferred") ? "receptor" : "emisor"}`,
      key: topTab.includes("transferred") ? "RfcReceptor" : "RfcEmisor",
      dataIndex: topTab.includes("transferred") ? "RfcReceptor" : "RfcEmisor",
      width: 150,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex(
          (s) => s.columnKey === (topTab.includes("transferred") ? "RfcReceptor" : "RfcEmisor")
        ) === -1
          ? undefined
          : sorter?.find(
              (s) => s.columnKey === (topTab.includes("transferred") ? "RfcReceptor" : "RfcEmisor")
            )?.order,
    },
    {
      title: `${topTab.includes("transferred") ? "Receptor" : "Emisor"}`,
      key: topTab.includes("transferred") ? "NombreReceptor" : "NombreEmisor",
      dataIndex: topTab.includes("transferred") ? "NombreReceptor" : "NombreEmisor",
      render: (value) => <GetColumnModify value={value} characters={31} />,
      width: 300,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex(
          (s) =>
            s.columnKey === (topTab.includes("transferred") ? "NombreReceptor" : "NombreEmisor")
        ) === -1
          ? undefined
          : sorter?.find(
              (s) =>
                s.columnKey === (topTab.includes("transferred") ? "NombreReceptor" : "NombreEmisor")
            )?.order,
    },
    {
      title: "Tipo de comprobante",
      key: "TipoDeComprobante",
      dataIndex: "TipoDeComprobante",
      filters:
        tab === "EXCLUDED" || tab === "MOVED"
          ? [
              {
                text: "I",
                value: "I",
              },
              {
                text: "E",
                value: "E",
              },
              {
                text: "T",
                value: "T",
              },
              {
                text: "N",
                value: "N",
              },
              {
                text: "P",
                value: "P",
              },
            ]
          : undefined,
      width: 175,
      align: "left",
    },
    {
      title: "# Relacionados",
      dataIndex: "pr_count",
      key: "pr_count",
      width: 130,
      fixed: false,
    },
    {
      title: "Uso de CFDI",
      dataIndex: "UsoCFDIReceptor",
      key: "UsoCFDIReceptor",
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "UsoCFDIReceptor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "UsoCFDIReceptor")?.order,
      showSorterTooltip: false,
      filters:
        tab === "EXCLUDED" || tab === "MOVED"
          ? [
              {
                text: "G01",
                value: "G01",
              },
              {
                text: "G02",
                value: "G02",
              },
              {
                text: "G03",
                value: "G03",
              },
              {
                text: "I01",
                value: "I01",
              },
              {
                text: "I02",
                value: "I02",
              },
              {
                text: "I03",
                value: "I03",
              },
              {
                text: "I04",
                value: "I04",
              },
              {
                text: "I05",
                value: "I05",
              },
              {
                text: "I06",
                value: "I06",
              },
              {
                text: "I07",
                value: "I07",
              },
              {
                text: "I08",
                value: "I08",
              },
              {
                text: "D01",
                value: "D01",
              },
              {
                text: "D02",
                value: "D02",
              },
              {
                text: "D03",
                value: "D03",
              },
              {
                text: "D04",
                value: "D04",
              },
              {
                text: "D05",
                value: "D05",
              },
              {
                text: "D06",
                value: "D06",
              },
              {
                text: "D07",
                value: "D07",
              },
              {
                text: "D08",
                value: "D08",
              },
              {
                text: "D09",
                value: "D09",
              },
              {
                text: "D10",
                value: "D10",
              },
              {
                text: "S01",
                value: "S01",
              },
              {
                text: "CP01",
                value: "CP01",
              },
              {
                text: "CN01",
                value: "CN01",
              },
            ]
          : undefined,
      width: 140,
      fixed: false,
    },
    {
      title: "Forma de pago código",
      dataIndex: "c_forma_pago.code",
      key: "c_forma_pago.code",
      sorter: false,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "c_forma_pago.code") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "c_forma_pago.code")?.order,
      render: (_, record) => {
        return record?.c_forma_pago?.code;
      },
      filters:
        tab === "EXCLUDED" || tab === "MOVED"
          ? [
              {
                text: "01",
                value: "01",
              },
              {
                text: "02",
                value: "02",
              },
              {
                text: "03",
                value: "03",
              },
              {
                text: "04",
                value: "04",
              },
              {
                text: "05",
                value: "05",
              },
              {
                text: "06",
                value: "06",
              },
              {
                text: "08",
                value: "08",
              },
              {
                text: "12",
                value: "12",
              },
              {
                text: "13",
                value: "13",
              },
              {
                text: "14",
                value: "14",
              },
              {
                text: "15",
                value: "15",
              },
              {
                text: "17",
                value: "17",
              },
              {
                text: "23",
                value: "23",
              },
              {
                text: "24",
                value: "24",
              },
              {
                text: "25",
                value: "25",
              },
              {
                text: "26",
                value: "26",
              },
              {
                text: "27",
                value: "27",
              },
              {
                text: "28",
                value: "28",
              },
              {
                text: "29",
                value: "29",
              },
              {
                text: "30",
                value: "30",
              },
              {
                text: "31",
                value: "31",
              },
              {
                text: "99",
                value: "99",
              },
            ]
          : undefined,
      width: 210,
      fixed: false,
    },
    {
      title: "Forma de pago",
      dataIndex: "forma_pago_name",
      render: (_, record) => record?.c_forma_pago?.name,
      key: "forma_pago_name",
      width: 250,
      fixed: false,
    },
    {
      title: "Método de pago",
      key: "MetodoPago",
      dataIndex: "MetodoPago",
      width: 150,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "MetodoPago") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "MetodoPago")?.order,
    },
    {
      title: "Base IVA 16%",
      key: "BaseIVA16",
      dataIndex: "BaseIVA16",
      render: (value) => formatDisplay(value, DisplayType.MONEY) as string,
      align: "right",
      width: 140,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA16") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA16")?.order,
    },
    {
      title: "Base IVA 8%",
      key: "BaseIVA8",
      dataIndex: "BaseIVA8",
      render: (value) => formatDisplay(value, DisplayType.MONEY) as string,
      align: "right",
      width: 150,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA8") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA8")?.order,
    },
    {
      title: "Base IVA 0%",
      key: "BaseIVA0",
      dataIndex: "BaseIVA0",
      render: (value) => formatDisplay(value, DisplayType.MONEY) as string,
      align: "right",
      width: 150,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA0") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA0")?.order,
    },
    {
      title: "Base IVA exento",
      key: "BaseIVAExento",
      dataIndex: "BaseIVAExento",
      render: (value) => formatDisplay(value, DisplayType.MONEY) as string,
      align: "right",
      width: 150,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVAExento") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVAExento")?.order,
    },
    {
      title: `IVA ${vatType} 16%`,
      key: "IVATrasladado16",
      dataIndex: "IVATrasladado16",
      render: (value) => formatDisplay(value, DisplayType.MONEY) as string,
      align: "right",
      width: 175,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "IVATrasladado16") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "IVATrasladado16")?.order,
    },
    {
      title: `IVA ${vatType} 8%`,
      key: "IVATrasladado8",
      dataIndex: "IVATrasladado8",
      render: (value) => formatDisplay(value, DisplayType.MONEY) as string,
      align: "right",
      width: 160,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "IVATrasladado8") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "IVATrasladado8")?.order,
    },
    {
      title: `IVA ${vatType} total`,
      key: "TrasladosIVAMXN",
      dataIndex: "TrasladosIVAMXN",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TrasladosIVAMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TrasladosIVAMXN")?.order,
      render: (value, record) => {
        if (tab === "CASH" || tab === "CREDIT") {
          return formatDisplay(
            record.IVATrasladado16 + record.IVATrasladado8 - record.RetencionesIVAMXN,
            DisplayType.MONEY
          ) as string;
        } else {
          return formatDisplay(value, DisplayType.MONEY) as string;
        }
      },
      align: "right",
      width: 175,
    },
    {
      title: "Retenciones IVA",
      key: "RetencionesIVAMXN",
      dataIndex: "RetencionesIVAMXN",
      render: (value) => formatDisplay(value, DisplayType.MONEY) as string,
      align: "right",
      width: 140,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RetencionesIVAMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RetencionesIVAMXN")?.order,
    },
    {
      title: "Total",
      key: "Total",
      dataIndex: "Total",
      render: (value) => formatDisplay(value, DisplayType.MONEY) as string,
      align: "right",
      width: 160,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Total") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Total")?.order,
    },
  ];

  function getColumnsPerTab(tab: string) {
    const columns = allColumns;
    switch (tab) {
      case "ALL":
        return columns.filter((c) => {
          if (c.key) {
            return !["pr_count"].includes(String(c.key));
          }
          return true;
        });
      case "CASH":
        return columns.filter((c) => {
          if (c.key) {
            return !["pr_count"].includes(String(c.key));
          }
          return true;
        });
      case "CREDIT":
        return columns.filter((c) => {
          if (c.key) {
            return !["MetodoPago"].includes(String(c.key));
          }
          return true;
        });
      case "CREDIT_NOTES":
        return columns.filter((c) => {
          if (c.key) {
            return !["pr_count"].includes(String(c.key));
          }
          return true;
        });
      case "WITHHOLDINGCASH":
        return columns.filter((c) => {
          if (c.key) {
            return !["TotalCreditableOrTransferredIVA", "TrasladosIVAMXN"].includes(String(c.key));
          }
          return true;
        });
      case "WITHHOLDINGCREDIT":
        return columns.filter((c) => {
          if (c.key) {
            return !["TotalCreditableOrTransferredIVA", "TrasladosIVAMXN", "MetodoPago"].includes(
              String(c.key)
            );
          }
          return true;
        });
      case "EXCLUDED":
        return columns.filter((c) => {
          if (c.key) {
            return !["pr_count"].includes(String(c.key));
          }
          return true;
        });
      case "MOVED":
        return columns.filter((c) => {
          if (c.key) {
            return !["pr_count"].includes(String(c.key));
          }
          return true;
        });
      default:
        return columns;
    }
  }

  return getColumnsPerTab(tab);
}

export interface IVACFDI {
  id: number;
  identifier: string;
  is_issued: boolean;
  FechaFiltro: string;
  UUID: string;
  Serie: string;
  Folio: string;
  RfcEmisor: string;
  NombreEmisor: string;
  RfcReceptor: string;
  NombreReceptor: string;
  TipoDeComprobante: string;
  Conceptos: string;
  MetodoPago: string;
  RetencionesIVAMXN: number;
  BaseIVA16: number;
  BaseIVA8: number;
  BaseIVA0: number;
  BaseIVAExento: number;
  IVATrasladado16: number;
  IVATrasladado8: number;
  TrasladosIVAMXN: number;
  ExcludeFromIVA: boolean;
  ExcludeFromISR: boolean;
  FechaCancelacion: string;
  Estatus: boolean;
  from_xml: boolean;
  c_tipo_de_comprobante: {
    name: string;
  };
  LugarExpedicion: string;
  RegimenFiscalEmisor: string;
  c_regimen_fiscal_emisor: {
    name: string;
  };
  Fecha: string;
  NoCertificado: string;
  FormaPago: string;
  forma_pago_code: string;
  forma_pago_name: string;
  c_forma_pago: {
    name: string;
    code: string;
  };
  payments: payment[];
  c_metodo_pago: {
    name: string;
  };
  UsoCFDIReceptor: string;
  c_uso_cfdi: {
    name: string;
  };
  Moneda: string;
  c_moneda: {
    name: string;
  };
  SubTotal: number;
  Descuento: number;
  TrasladosIEPS: number;
  TrasladosISR: number;
  TrasladosIVA: number;
  RetencionesIEPS: number;
  RetencionesISR: number;
  RetencionesIVA: number;
  Total: number;
  PaymentDate: string;
  Version: string;
  is_too_big: boolean;
  paid_by: IVACFDI[];
  FechaPago: string;
  UUID_related: string;
  ImpPagadoMXN: string;
  FormaDePagoP: string;
  FormaPagoCode: string;
  FormaPagoName: string;
  payment_related: {
    FormaDePagoP: string;
    c_forma_pago: {
      name: string;
    };
  };
  "DR-ExcludeFromIVA": boolean;
  "DR-Serie": string;
  "DR-Folio": string;
  "DR-FormaPagoCode": string;
  "DR-FormaPagoName": string;
  "DR-BaseIVA16": string;
  "DR-BaseIVA8": string;
  "DR-BaseIVA0": string;
  "DR-IVATrasladado16": string;
  "DR-IVATrasladado8": string;
  "DR-TrasladosIVAMXN": string;
  "DR-RetencionesIVAMXN": string;
  "DR-ImpPagadoMXN": string;
  "DR-UUID": string;
  "DR-Identifier": string;
  cfdi_origin: IVACFDI; // se agrega por tema de tipados
}
