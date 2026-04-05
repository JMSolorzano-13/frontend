import { TState, UpdateUUIDsType, updateDoctosType } from "@pages/IVA/_types/StateTypes";
import getDisableSwitchIVA from "@pages/IVA/_utils/getDisableSwitchIVA";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { Switch, Tag } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { ColumnsType } from "antd/lib/table";
import { IVACFDI } from "./IVACFDIColumns";
import { tailwindColors } from "@utils/tailwindColors";
export interface propsType {
  tab: TabIVAType;
  uuids: UpdateUUIDsType;
  topTab: TState;
  setUUIDs: (state: UpdateUUIDsType) => any;
  doctoUUIDs: updateDoctosType;
  setDoctoUUIDs: (state: updateDoctosType) => void;
  setCFDIToDisplay: (visible: string) => void;
  setCFDIModalVisible: (state: boolean) => void;
  sorter: SorterResult<IVACFDI>[];
}

export default function IVAExcludedColumns(props: propsType): ColumnsType<IVACFDI> {
  const {
    setUUIDs,
    uuids,
    topTab,
    doctoUUIDs,
    setDoctoUUIDs,
    setCFDIModalVisible,
    setCFDIToDisplay,
    sorter,
  } = props;
  const allColumns: ColumnsType<IVACFDI> = [
    {
      title: "No considerar IVA",
      dataIndex: "ExcludeFromIVA",
      key: "ExcludeFromIVA",
      showSorterTooltip: false,
      render: (_, record) => {
        const disableSwitch = getDisableSwitchIVA(record);
        return (
          <Switch
            defaultChecked={
              record["DR-Identifier"] ? record["ExcludeFromIVA"] : record.ExcludeFromIVA
            }
            checked={
              record["DR-Identifier"]
                ? !doctoUUIDs.some((u) => u.uuid === record["DR-Identifier"]) &&
                  record["ExcludeFromIVA"]
                  ? true
                  : doctoUUIDs.some((u) => u.uuid === record["DR-Identifier"]) &&
                      !record["ExcludeFromIVA"]
                    ? true
                    : false
                : uuids.some((u) => u.uuid === record.UUID) && !record.ExcludeFromIVA
                  ? true
                  : record.ExcludeFromIVA && !uuids.some((u) => u.uuid === record.UUID)
                    ? true
                    : false
            }
            disabled={disableSwitch}
            onChange={() => {
              if (record["DR-Identifier"]) {
                if (!doctoUUIDs.some((u) => u.uuid === record["DR-Identifier"])) {
                  setDoctoUUIDs([
                    ...doctoUUIDs,
                    {
                      uuid: record["DR-Identifier"],
                      currentValue: record["ExcludeFromIVA"],
                    },
                  ]);
                  return;
                }
                const newArray = doctoUUIDs.filter((u) => u.uuid !== record["DR-Identifier"]);
                setDoctoUUIDs(newArray);
              } else {
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
      key: "Fecha",
      dataIndex: "Fecha",
      width: 145,
      render: (val, record) => {
        return formatDisplay(record.Fecha, DisplayType.PUREDATE) as string;
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
      render: (val, record) => formatDisplay(record.PaymentDate, DisplayType.PUREDATE) as string,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "PaymentDate") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "PaymentDate")?.order,
      showSorterTooltip: false,
    },
    {
      title: "UUID",
      key: "UUID",
      dataIndex: "UUID",
      width: 320,
      render: (val, record) => {
        return record.UUID;
      },
    },
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
      render: (val, record) => record.Serie,
    },
    {
      title: "Folio",
      key: "Folio",
      dataIndex: "Folio",
      width: 190,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Folio") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Folio")?.order,
      render: (val, record) => record.Folio,
    },
    {
      title: `RFC ${topTab.includes("transferred") ? "receptor" : "emisor"}`,
      key: topTab.includes("transferred") ? "RfcReceptor" : "RfcEmisor",
      dataIndex: topTab.includes("transferred") ? "RfcReceptor" : "RfcEmisor",
      width: 140,
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
      render: (val, record) => record.RfcEmisor,
    },
    {
      title: `${topTab.includes("transferred") ? "Receptor" : "Emisor"}`,
      key: topTab.includes("transferred") ? "NombreReceptor" : "NombreEmisor",
      dataIndex: topTab.includes("transferred") ? "NombreReceptor" : "NombreEmisor",
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
      render: (val, record) => record.NombreEmisor,
    },
    {
      title: "Tipo de comprobante",
      key: "TipoDeComprobante",
      dataIndex: "TipoDeComprobante",
      width: 190,
      align: "left",
      filters: [
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
      ],
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TipoDeComprobante") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TipoDeComprobante")?.order,
      render: (val, record) => record.TipoDeComprobante,
    },
    {
      title: "Uso de CFDI",
      dataIndex: "UsoCFDIReceptor",
      key: "UsoCFDIReceptor",
      filters: [
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
      ],
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "UsoCFDIReceptor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "UsoCFDIReceptor")?.order,
      showSorterTooltip: false,
      width: 140,
      fixed: false,
      render: (val, record) => record.UsoCFDIReceptor,
    },
    {
      title: "Forma de pago código",
      dataIndex: "FormaPago",
      key: "FormaPago",
      filters: [
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
      ],
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FormaPago") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FormaPago")?.order,
      render: (val, record) => record["FormaPago"],
      width: 220,
      fixed: false,
    },
    {
      title: "Forma de pago",
      dataIndex: "forma_pago_name",
      key: "forma_pago_name",
      width: 250,
      fixed: false,
      render: (val, record) => {
        return record["FormaPagoName"];
      },
    },
    {
      title: "Método de pago",
      key: "MetodoPago",
      dataIndex: "MetodoPago",
      sorter: true,
      showSorterTooltip: false,
      filterMultiple: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "MetodoPago") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "MetodoPago")?.order,
      filters: [
        {
          text: "PUE",
          value: "PUE",
        },
        {
          text: "PPD",
          value: "PPD",
        },
      ],
      width: 160,
      render: (val, record) => record.MetodoPago,
    },
    {
      title: "Base IVA 16%",
      key: "BaseIVA16",
      dataIndex: "BaseIVA16",
      align: "right",
      width: 140,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA16") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA16")?.order,
      render: (val, record) => formatDisplay(record.BaseIVA16, DisplayType.MONEY) as string,
    },
    {
      title: "Base IVA 8%",
      key: "BaseIVA8",
      dataIndex: "BaseIVA8",
      align: "right",
      width: 150,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA8") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA8")?.order,
      render: (val, record) => formatDisplay(record.BaseIVA8, DisplayType.MONEY) as string,
    },
    {
      title: "Base IVA 0%",
      key: "BaseIVA0",
      dataIndex: "BaseIVA0",
      align: "right",
      width: 150,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA0") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA0")?.order,
      render: (val, record) => formatDisplay(record.BaseIVA0, DisplayType.MONEY) as string,
    },
    {
      title: "Base IVA exento",
      key: "BaseIVAExento",
      dataIndex: "BaseIVAExento",
      align: "right",
      width: 150,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVAExento") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVAExento")?.order,
      render: (val, record) => formatDisplay(record.BaseIVAExento, DisplayType.MONEY) as string,
    },
    {
      title: `IVA 16%`,
      key: "IVATrasladado16",
      dataIndex: "IVATrasladado16",
      render: (val, record) => formatDisplay(record.IVATrasladado16, DisplayType.MONEY) as string,
      align: "right",
      width: 160,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "IVATrasladado16") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "IVATrasladado16")?.order,
    },
    {
      title: `IVA 8%`,
      key: "IVATrasladado8",
      dataIndex: "IVATrasladado8",
      render: (val, record) => formatDisplay(record.IVATrasladado8, DisplayType.MONEY) as string,
      align: "right",
      width: 150,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "IVATrasladado8") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "IVATrasladado8")?.order,
    },
    {
      title: `IVA acreditable total`,
      key: "TrasladosIVA",
      dataIndex: "TrasladosIVA",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TrasladosIVA") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TrasladosIVA")?.order,
      render: (val, record) => formatDisplay(record.TrasladosIVA, DisplayType.MONEY) as string,
      align: "right",
      width: 175,
    },
    {
      title: "Retenciones IVA",
      key: "RetencionesIVA",
      dataIndex: "RetencionesIVA",
      align: "right",
      width: 140,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RetencionesIVA") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RetencionesIVA")?.order,
      render: (val, record) => formatDisplay(record.RetencionesIVA, DisplayType.MONEY) as string,
    },
    {
      title: "Total",
      key: "Total",
      dataIndex: "Total",
      align: "right",
      width: 160,
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Total") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Total")?.order,
      render: (val, record) => formatDisplay(record.Total, DisplayType.MONEY) as string,
    },
    {
      title: "UUID pago",
      key: "DR-UUID",
      dataIndex: "DR-UUID",
      width: 300,
      showSorterTooltip: false,
      render: (val, record) => {
        if (record["DR-UUID"]) {
          return (
            <Tag
              style={{
                cursor: "pointer",
                marginBottom: 5,
                color: "#000000",
                backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
                border: `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
                minWidth: "260px",
              }}
              onClick={() => {
                setCFDIModalVisible(true);
                setCFDIToDisplay(record["DR-UUID"]);
              }}
            >
              {record["DR-UUID"]}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
  ];

  return allColumns;
}
