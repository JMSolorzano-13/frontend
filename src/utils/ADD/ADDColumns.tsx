import { Months } from "@utils/dateHelper";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import l from "lodash";
import { ColumnsType } from "antd/lib/table";
import { SorterResult } from "antd/lib/table/interface";
import { CFDI_Types } from "@constants/Enums";
import { GetRelatedCFDI } from "@components/global/getRelatedCFDI";
import RelatedAddModal from "@components/ADD/getRelatedAdd";

type Props = {
  setCfdiModalVisible?: (visible: boolean) => void;
  setCFDIToDisplay?: (cfdi: string) => void;
  module: CFDIModule;
  sorter?: SorterResult<ADDCFDI>[];
  setCFDITypeToRequest?: (state: CFDI_Types) => void;
};

export default function ADDColumns(props: Props) {
  const { setCfdiModalVisible, setCFDIToDisplay, module, sorter, setCFDITypeToRequest } = props;
  const columns: ColumnsType<ADDCFDI> = [
    {
      title: "Fecha expedición",
      dataIndex: "Fecha",
      key: "Fecha",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Fecha") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Fecha")?.order,
      render: (val) => formatDisplay(val, DisplayType.PUREDATE),
      width: 160,
      fixed: false,
    },
    {
      title: "Fecha de pago",
      dataIndex: "FechaFiltro",
      key: "FechaFiltro",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FechaFiltro") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FechaFiltro")?.order,
      render: (val) => formatDisplay(val, DisplayType.PUREDATE),
      width: 160,
      fixed: false,
    },
    {
      title: "Versión",
      dataIndex: "Version",
      key: "Version",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Version") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Version")?.order,
      width: 90,
      fixed: false,
    },
    {
      title: "Serie",
      dataIndex: "Serie",
      key: "Serie",
      width: 120,
      fixed: false,
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
      width: 200,
      fixed: false,
    },
    {
      title: "RFC emisor",
      dataIndex: "RfcEmisor",
      key: "RfcEmisor",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RfcEmisor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RfcEmisor")?.order,
      width: 140,
      fixed: false,
    },
    {
      title: "Emisor",
      dataIndex: "NombreEmisor",
      key: "NombreEmisor",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "NombreEmisor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "NombreEmisor")?.order,
      width: 400,
      fixed: false,
    },
    {
      title: "Régimen fiscal emisor",
      dataIndex: "RegimenFiscalEmisor",
      key: "RegimenFiscalEmisor",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RegimenFiscalEmisor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RegimenFiscalEmisor")?.order,
      width: 200,
      fixed: false,
    },
    {
      title: "Régimen fiscal emisor descripción",
      dataIndex: "c_regimen_fiscal_emisor",
      key: "RegimenFiscalEmisorDesc",
      render: (val) => (val ? val.name : ""),
      showSorterTooltip: false,
      /* sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === 'RegimenFiscalEmisorDesc') ===
        -1
          ? undefined
          : sorter?.find((s) => s.columnKey === 'RegimenFiscalEmisorDesc')
              ?.order, */
      width: 280,
      fixed: false,
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
      fixed: false,
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
      width: 400,
      fixed: false,
    },
    {
      title: "Régimen fiscal receptor",
      dataIndex: "RegimenFiscalReceptor",
      key: "RegimenFiscalReceptor",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RegimenFiscalReceptor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RegimenFiscalReceptor")?.order,
      width: 200,
      fixed: false,
    },
    {
      title: "Régimen fiscal receptor descripción",
      dataIndex: "c_regimen_fiscal_receptor",
      key: "RegimenFiscalReceptorDesc",
      render: (val) => (val ? val.name : ""),
      showSorterTooltip: false,
      /* sorter: true,
    sortOrder:
      sorter?.findIndex((s) => s.columnKey === 'RegimenFiscalReceptorDesc') ===
      -1
        ? undefined
        : sorter?.find((s) => s.columnKey === 'RegimenFiscalReceptorDesc')
            ?.order, */
      width: 280,
      fixed: false,
    },
    {
      title: "Subtotal",
      dataIndex: "SubTotal",
      key: "SubTotal",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "SubTotal") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "SubTotal")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 120,
      fixed: false,
      align: "right",
    },
    {
      title: "Total descuento",
      dataIndex: "Descuento",
      key: "Descuento",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Descuento") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Descuento")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 140,
      fixed: false,
      align: "right",
    },
    {
      title: "Neto",
      dataIndex: "Neto",
      key: "Neto",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Neto") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Neto")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 120,
      fixed: false,
      align: "right",
    },
    {
      title: "Retención IVA",
      dataIndex: "RetencionesIVA",
      key: "RetencionesIVA",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RetencionesIVA") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RetencionesIVA")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 130,
      fixed: false,
      align: "right",
    },
    {
      title: "Retención ISR",
      dataIndex: "RetencionesISR",
      key: "RetencionesISR",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RetencionesISR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RetencionesISR")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 130,
      fixed: false,
      align: "right",
    },
    {
      title: "Traslado IVA",
      dataIndex: "TrasladosIVA",
      key: "TrasladosIVA",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TrasladosIVA") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TrasladosIVA")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 120,
      fixed: false,
      align: "right",
    },
    {
      title: "Total",
      dataIndex: "Total",
      key: "Total",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Total") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Total")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 120,
      fixed: false,
      align: "right",
    },
    {
      title: "Total MXN",
      dataIndex: "TotalMXN",
      key: "TotalMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TotalMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TotalMXN")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 120,
      fixed: false,
      align: "right",
    },
    {
      title: "Moneda",
      dataIndex: "Moneda",
      key: "Moneda",
      render: (value: string, record: CFDI) => (record?.c_moneda ? record?.c_moneda.name : value),
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Moneda") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Moneda")?.order,
      width: 130,
      fixed: false,
    },
    {
      title: "Tipo de cambio",
      dataIndex: "TipoCambio",
      key: "TipoCambio",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TipoCambio") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TipoCambio")?.order,
      width: 150,
      fixed: false,
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
      width: 120,
      fixed: false,
    },
    {
      title: "Forma de pago código",
      dataIndex: "FormaPago",
      key: "FormaPagoCodigo",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FormaPagoCodigo") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FormaPagoCodigo")?.order,
      render: (_, record) =>
        record?.TipoDeComprobante === "P" && record?.payments
          ? record?.payments[0]?.FormaDePagoP
          : record.FormaPago,
      width: 180,
      fixed: false,
    },
    {
      title: "Forma de pago",
      dataIndex: "c_forma_pago",
      render: (_, record) =>
        record.TipoDeComprobante === "P" && record?.payments
          ? record?.payments[0]?.c_forma_pago?.name
          : record?.c_forma_pago?.name,
      key: "FormaPago",
      /* showSorterTooltip: false,
    sorter: true,
    sortOrder:
      sorter?.findIndex((s) => s.columnKey === 'FormaPago') === -1
        ? undefined
        : sorter?.find((s) => s.columnKey === 'FormaPago')?.order, */
      width: 150,
      fixed: false,
    },
    {
      title: "Método pago código",
      dataIndex: "MetodoPago",
      key: "MetodoPagoCodigo",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "MetodoPagoCodigo") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "MetodoPagoCodigo")?.order,
      width: 180,
      fixed: false,
    },
    {
      title: "Método pago",
      dataIndex: "c_metodo_pago",
      render: (val) => (val ? val.name : ""),
      key: "MetodoPago",
      /* showSorterTooltip: false,
    sorter: true,
    sortOrder:
      sorter?.findIndex((s) => s.columnKey === 'MetodoPago') === -1
        ? undefined
        : sorter?.find((s) => s.columnKey === 'MetodoPago')?.order, */
      width: 230,
      fixed: false,
    },
    {
      title: "Condiciones de pago",
      dataIndex: "CondicionesDePago",
      key: "CondicionesDePago",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "CondicionesDePago") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "CondicionesDePago")?.order,
      width: 170,
      fixed: false,
    },
    {
      title: "Año comprobante",
      dataIndex: "FechaYear",
      key: "FechaYear",
      render: (val) => (val ? val : " "),
      width: 150,
      fixed: false,
    },
    {
      title: "Mes comprobante",
      dataIndex: "FechaMonth",
      key: "FechaMonth",
      render: (val) => (val ? Months[Number(val)] : " "),
      width: 150,
      fixed: false,
    },
    {
      title: "Fecha timbrado",
      dataIndex: "FechaCertificacionSat",
      key: "FechaCertificacionSat",
      render: (val) => formatDisplay(val, DisplayType.TIMEZONEDATE),
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FechaCertificacionSat") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FechaCertificacionSat")?.order,
      width: 140,
      fixed: false,
    },
    {
      title: "Año timbrado",
      dataIndex: "FechaCertificacionSatYear",
      key: "FechaCertificacionSatYear",
      render: (val) => (val ? val : " "),
      width: 120,
      fixed: false,
    },
    {
      title: "Mes timbrado",
      dataIndex: "FechaCertificacionSatMonth",
      key: "FechaCertificacionSatMonth",
      render: (val) => (val ? Months[Number(val)] : " "),
      width: 130,
      fixed: false,
    },
    {
      title: "Retención IEPS",
      dataIndex: "RetencionesIEPS",
      key: "RetencionesIEPS",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RetencionesIEPS") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RetencionesIEPS")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 140,
      fixed: false,
      align: "right",
    },
    {
      title: "Traslado IEPS",
      dataIndex: "TrasladosIEPS",
      key: "TrasladosIEPS",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TrasladosIEPS") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TrasladosIEPS")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 140,
      fixed: false,
      align: "right",
    },
    {
      title: "Traslado ISR",
      dataIndex: "TrasladosISR",
      key: "TrasladosISR",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TrasladosISR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TrasladosISR")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 140,
      fixed: false,
      align: "right",
    },
    {
      title: "No.Certificado",
      dataIndex: "NoCertificado",
      key: "NoCertificado",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "NoCertificado") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "NoCertificado")?.order,
      width: 200,
      fixed: false,
    },
    {
      title: "Tipo comprobante",
      dataIndex: "TipoDeComprobante",
      key: "TipoDeComprobante",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TipoDeComprobante") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TipoDeComprobante")?.order,
      width: 170,
      fixed: false,
    },
    {
      title: "Exportación",
      dataIndex: "Exportacion",
      key: "Exportacion",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Exportacion") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Exportacion")?.order,
      width: 120,
      fixed: false,
    },
    {
      title: "Periodicidad",
      dataIndex: "Periodicidad",
      key: "Periodicidad",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Periodicidad") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Periodicidad")?.order,
      width: 120,
      fixed: false,
    },
    {
      title: "Meses",
      dataIndex: "Meses",
      key: "Meses",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Meses") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Meses")?.order,
      width: 100,
      fixed: false,
    },
    {
      title: "Tipo de relación",
      dataIndex: "CfdiRelacionados",
      key: "TipoRelacion",
      render: (val) => {
        let obj = val;
        if (typeof obj === "string") {
          obj = JSON.parse(val);
        }
        return obj ? obj["@TipoRelacion"] : undefined;
      },
      width: 170,
      fixed: false,
    },
    {
      title: "UUID relacionado",
      dataIndex: "CfdiRelacionados",
      key: "UUIDRelacionado",
      render: (val) => {
        let obj = val;
        if (!val) return undefined;
        if (typeof obj === "string") {
          obj = JSON.parse(val);
        }
        const related = obj.CfdiRelacionado;
        if (related) return <RelatedAddModal uuid={related["@UUID"]} />;
        return undefined;
      },
      width: 260,
      fixed: false,
    },
    {
      title: "Lugar de expedición",
      dataIndex: "LugarExpedicion",
      key: "LugarExpedicion",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "LugarExpedicion") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "LugarExpedicion")?.order,
      width: 170,
      fixed: false,
    },
    { title: "UUID", dataIndex: "UUID", key: "UUID", width: 320, fixed: false },
    {
      title: "Saldo de CFDIs de pago",
      dataIndex: "balance",
      key: "balance",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "balance") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "balance")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
      width: 190,
      align: "right",
      fixed: false,
    },
    {
      title: "CFDIs de pago relacionados",
      dataIndex: "paid_by.UUID",
      key: "paid_by.UUID",
      render: (_, { paid_by }) => {
        const unrepeated = l.uniqWith(paid_by, l.isEqual);
        return (
          <GetRelatedCFDI
            unrepeated={unrepeated}
            setCFDIToDisplay={setCFDIToDisplay}
            setCFDITypeToRequest={setCFDITypeToRequest}
            setModalVisible={setCfdiModalVisible}
          />
        );
      },
      width: 300,
      fixed: false,
    },
  ];

  const getADDColumns = (module: CFDIModule): ColumnsType<ADDCFDI> => {
    const cols = columns;
    switch (module) {
      case "issued":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "RfcEmisor",
              "NombreEmisor",
              "RegimenFiscalEmisor",
              "RegimenFiscalEmisorDesc",
            ].includes(String(c.key));
          }
          return true;
        });
      case "received":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "RfcReceptor",
              "NombreReceptor",
              "RegimenFiscalReceptor",
              "RegimenFiscalReceptorDesc",
            ].includes(String(c.key));
          }
          return true;
        });
      default:
        return cols;
    }
  };

  return getADDColumns(module);
}
