import { ColumnsType } from "antd/lib/table";
import { SorterResult } from "antd/lib/table/interface";
import { Months } from "../dateHelper";
import { DisplayType, formatDisplay } from "../formatDisplay";
import l from "lodash";
import { GlobalToken, Switch } from "antd";
import { CFDI_Types } from "@constants/Enums";
import { UpdateUUIDsType } from "@pages/IVA/_types/StateTypes";
import getDisableSwitch from "./getDisabledSwitch";
import { GetRelatedCFDI } from "@components/global/getRelatedCFDI";
import { GetRelatedEgressCFDI } from "@components/global/getRelatedEgressCFDI";
import { GetColumnModify } from "@components/global/getColumnModify";
import { GetUUID } from "@components/global/getUUID";
import { GetTotalEgressCFDI } from "@components/global/GetTotalEgressCFDI";
import GetPolicies from "@pages/CFDI/_utils/GetPolicies";
import { IS_SIIGO } from "@utils/SIIGO/Global";
import GetColumnAttachments from "@components/global/getColumnattachments";
import { PaperClipOutlined } from "@ant-design/icons";

type Data = {
  setModalVisible?: (visible: boolean) => void;
  setPolicyModalVisible?: (visible: boolean) => void;
  setAttachmentsModalVisible?: (visible: boolean) => void;
  setCFDIToDisplay?: (state: string) => void;
  setUUIDsToModify?: (state: UpdateUUIDsType) => void;
  uuidsToModify?: UpdateUUIDsType;
  module: CFDIModule;
  token: GlobalToken;
  sorter?: SorterResult<CFDI>[];
  tab: CFDI_Types;
  setCFDITypeToRequest?: (state: CFDI_Types) => void;
  isDownloadPlan?: boolean;
};

export default function CFDIColumns(data: Data): ColumnsType<CFDI> {
  const {
    module,
    sorter,
    setModalVisible,
    setPolicyModalVisible,
    setAttachmentsModalVisible,
    setCFDIToDisplay,
    tab,
    setUUIDsToModify,
    uuidsToModify,
    setCFDITypeToRequest,
    token,
    isDownloadPlan,
  } = data;
  const getAllCols: ColumnsType<CFDI> = [
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
      render: (val) => formatDisplay(val, DisplayType.PUREDATE) as string,
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
      showSorterTooltip: false,
      render: (value) => <GetColumnModify value={value} characters={5} />,
      sorter: tab === "P" ? true : false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Serie") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Serie")?.order,
      width: 120,
      fixed: false,
    },
    {
      title: "Folio",
      dataIndex: "Folio",
      key: "Folio",
      showSorterTooltip: false,
      sorter: true,
      render: (value) => <GetColumnModify value={value} characters={6} />,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Folio") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Folio")?.order,
      width: 100,
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
      render: (value) => <GetColumnModify value={value} characters={31} />,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "NombreEmisor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "NombreEmisor")?.order,
      width: 300,
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
      render: (val) => <GetColumnModify value={val ? val.name : ""} characters={28} />,
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RegimenFiscalEmisorDesc") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RegimenFiscalEmisorDesc")?.order,
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
      width: 150,
      fixed: false,
    },
    {
      title: "Receptor",
      dataIndex: "NombreReceptor",
      key: "NombreReceptor",
      render: (value) => <GetColumnModify value={value} characters={31} />,
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "NombreReceptor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "NombreReceptor")?.order,
      width: 300,
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
      render: (val) => <GetColumnModify value={val ? val.name : ""} characters={28} />,
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
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 120,
      fixed: false,
      align: "right",
    },
    {
      title: "Subtotal MXN",
      dataIndex: "SubTotalMXN",
      key: "SubTotalMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "SubTotalMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "SubTotalMXN")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 125,
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
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 140,
      fixed: false,
      align: "right",
    },
    {
      title: "Total descuento MXN",
      dataIndex: "DescuentoMXN",
      key: "DescuentoMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "DescuentoMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "DescuentoMXN")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 180,
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
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 120,
      fixed: false,
      align: "right",
    },
    {
      title: "Neto MXN",
      dataIndex: "NetoMXN",
      key: "NetoMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "NetoMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "NetoMXN")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
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
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 130,
      fixed: false,
      align: "right",
    },
    {
      title: "Retención IVA MXN",
      dataIndex: "RetencionesIVAMXN",
      key: "RetencionesIVAMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RetencionesIVAMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RetencionesIVAMXN")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 170,
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
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 130,
      fixed: false,
      align: "right",
    },
    {
      title: "Retención ISR MXN",
      dataIndex: "RetencionesISRMXN",
      key: "RetencionesISRMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RetencionesISRMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RetencionesISRMXN")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 170,
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
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 120,
      fixed: false,
      align: "right",
    },
    {
      title: "Traslado IVA MXN",
      dataIndex: "TrasladosIVAMXN",
      key: "TrasladosIVAMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TrasladosIVAMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TrasladosIVAMXN")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 160,
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
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
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
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 120,
      fixed: false,
      align: "right",
    },
    {
      title: tab !== "P" ? "Moneda" : "Moneda de pago",
      dataIndex: tab !== "P" ? "Moneda" : "c_moneda",
      key: "Moneda",
      render: (value: string, record: CFDI) => (
        <GetColumnModify value={record.c_moneda ? record.c_moneda.name : value} characters={13} />
      ),
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Moneda") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Moneda")?.order,
      width: tab !== "P" ? 130 : 150,
      fixed: false,
    },
    {
      title: "Tipo de cambio",
      dataIndex: tab === "P" ? "payments.TipoCambioP" : "TipoCambio",
      key: "TipoCambio",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TipoCambio") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TipoCambio")?.order,
      width: 150,
      render: (_, record: CFDI) =>
        tab === "P" && record.payments ? record?.payments[0]?.TipoCambioP : record?.TipoCambio,
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
      dataIndex: tab === "P" ? "payments.FormaDePagoP" : "FormaPago",
      key: "FormaPagoCodigo",
      showSorterTooltip: false,
      sorter: tab !== "P" ? true : false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FormaPagoCodigo") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FormaPagoCodigo")?.order,
      render: (_, record) =>
        tab === "P" && record?.payments ? record?.payments[0]?.FormaDePagoP : record?.FormaPago,
      width: 180,
      fixed: false,
    },
    {
      title: "Forma de pago",
      dataIndex: tab === "P" ? "payments.c_forma_pago.name" : "c_forma_pago",
      key: "FormaPago",
      render: (_, record) => (
        <GetColumnModify
          value={
            tab === "P" && record?.payments
              ? record?.payments[0]?.c_forma_pago?.name
              : record?.c_forma_pago?.name
          }
          characters={17}
        />
      ),
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
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 140,
      fixed: false,
      align: "right",
    },
    {
      title: "Retención IEPS MXN",
      dataIndex: "RetencionesIEPSMXN",
      key: "RetencionesIEPSMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RetencionesIEPSMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RetencionesIEPSMXN")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 180,
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
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 140,
      fixed: false,
      align: "right",
    },
    {
      title: "Traslado IEPS MXN",
      dataIndex: "TrasladosIEPSMXN",
      key: "TrasladosIEPSMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TrasladosIEPSMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TrasladosIEPSMXN")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 160,
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
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 140,
      fixed: false,
      align: "right",
    },
    {
      title: "Traslado ISR MXN",
      dataIndex: "TrasladosISRMXN",
      key: "TrasladosISRMXN",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TrasladosISRMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TrasladosISRMXN")?.order,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      width: 160,
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
      title: "Año",
      dataIndex: "Year",
      key: "Year",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Year") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Year")?.order,
      width: 100,
      fixed: false,
    },
    {
      title: "Tipo de relación",
      dataIndex: "CfdiRelacionados",
      key: "TipoRelacion",
      render: (val) => {
        let obj = val;
        if (!val) return undefined;
        if (typeof obj === "string") {
          obj = JSON.parse(val);
        }

        if (Array.isArray(obj)) {
          return obj[0]["@TipoRelacion"];
        } else {
          return obj && obj["@TipoRelacion"];
        }
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
        if (!val) {
          return undefined;
        }
        if (typeof obj === "string") {
          obj = JSON.parse(val);
        }
        const uuids: string[] = [];

        if (Array.isArray(obj)) {
          // Check if "obj" is array
          obj.map((o) => {
            const related = o.CfdiRelacionado; // get every single CfdiRelacionado in array
            if (Array.isArray(related)) {
              // check if "related" is array
              related.map((r) => {
                uuids.push(r["@UUID"]); // push to "uuids", every single @UUID in "related"
              });
            } else {
              uuids.push(related["@UUID"]); // case "related" is not array simply push @UUID
            }
          });
        } else {
          // if "obj" is not array
          const related = obj.CfdiRelacionado;

          if (Array.isArray(related)) {
            // check if "related" inside non "obj" array is array
            related.map((r) => {
              uuids.push(r["@UUID"]);
            });
          } else if (related) {
            uuids.push(related["@UUID"]);
          }
        }

        if (uuids.length > 0) {
          return (
            <GetUUID
              uuid_related={uuids}
              setModalVisible={setModalVisible}
              setCFDIToDisplay={setCFDIToDisplay}
              setCFDITypeToRequest={setCFDITypeToRequest}
              tab={tab}
            />
          );
        }
        return undefined;
      },
      width: 330,
      fixed: false,
    },
    {
      title: "Lugar de expedición",
      dataIndex: "LugarExpedicion",
      key: "LugarExpedicion",
      showSorterTooltip: false,
      sorter: tab === "P" ? false : true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "LugarExpedicion") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "LugarExpedicion")?.order,
      width: 170,
      fixed: false,
    },
    {
      title: "Domicilio Fiscal",
      dataIndex: "DomicilioFiscalReceptor",
      key: "DomicilioFiscalReceptor",
      showSorterTooltip: false,
      sorter: tab === "P" ? false : true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "DomicilioFiscalReceptor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "DomicilioFiscalReceptor")?.order,
      width: 170,
      fixed: false,
    },
    // START COLUMNS FOR PAYROLL VIEW
    {
      title: "Fecha de pago",
      dataIndex: "FechaFiltro",
      key: "FechaFiltro",
      render: (_, record) => formatDisplay(record.FechaFiltro, DisplayType.TIMEZONEDATE),
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FechaFiltro") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FechaFiltro")?.order,
      width: 170,
      fixed: false,
    },
    {
      title: "Tipo régimen",
      dataIndex: "nomina.ReceptorTipoRegimen",
      key: "ReceptorTipoRegimen",
      render: (_, record) => record.nomina?.ReceptorTipoRegimen,
      width: 100,
      fixed: false,
    },
    {
      title: "Percepciones",
      dataIndex: "nomina.TotalPercepciones",
      key: "TotalPercepciones",
      render: (_, { nomina }) => formatDisplay(nomina?.TotalPercepciones, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "Deducciones",
      dataIndex: "nomina.TotalDeducciones",
      key: "TotalDeducciones",
      render: (_, { nomina }) => formatDisplay(nomina?.TotalDeducciones, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "Otros pagos",
      dataIndex: "nomina.TotalOtrosPagos",
      key: "TotalOtrosPagos",
      render: (_, { nomina }) => formatDisplay(nomina?.TotalOtrosPagos, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "Sueldos",
      dataIndex: "nomina.PercepcionesTotalSueldos",
      key: "PercepcionesTotalSueldos",
      render: (_, { nomina }) => formatDisplay(nomina?.PercepcionesTotalSueldos, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "Otras percepciones",
      dataIndex: "nomina.OtrasPercepciones",
      key: "OtrasPercepciones",
      render: (_, { nomina }) => formatDisplay(nomina?.OtrasPercepciones, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "Separación-Indemnización",
      dataIndex: "nomina.PercepcionesSeparacionIndemnizacion",
      key: "PercepcionesSeparacionIndemnizacion",
      render: (_, { nomina }) =>
        formatDisplay(nomina?.PercepcionesSeparacionIndemnizacion, DisplayType.MONEY),
      width: 220,
      fixed: false,
      align: "right",
    },
    {
      title: "Jubilación-Pensión",
      dataIndex: "nomina.PercepcionesJubilacionPensionRetiro",
      key: "PercepcionesJubilacionPensionRetiro",
      render: (_, { nomina }) =>
        formatDisplay(nomina?.PercepcionesJubilacionPensionRetiro, DisplayType.MONEY),
      width: 160,
      fixed: false,
      align: "right",
    },
    {
      title: "Gravado",
      dataIndex: "nomina.PercepcionesTotalGravado",
      key: "PercepcionesTotalGravado",
      render: (_, { nomina }) => formatDisplay(nomina?.PercepcionesTotalGravado, DisplayType.MONEY),
      width: 150,
      fixed: false,
      align: "right",
    },
    {
      title: "Exento",
      dataIndex: "nomina.PercepcionesTotalExento",
      key: "PercepcionesTotalExento",
      render: (_, { nomina }) => formatDisplay(nomina?.PercepcionesTotalExento, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "ISR retenido",
      dataIndex: "nomina.DeduccionesTotalImpuestosRetenidos",
      key: "DeduccionesTotalImpuestosRetenidos",
      render: (_, { nomina }) =>
        formatDisplay(nomina?.DeduccionesTotalImpuestosRetenidos, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "Ajuste ISR retenido",
      dataIndex: "nomina.AjusteISRRetenido",
      key: "AjusteISRRetenido",
      render: (_, { nomina }) => formatDisplay(nomina?.AjusteISRRetenido, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "Otras deducciones",
      dataIndex: "nomina.DeduccionesTotalOtrasDeducciones",
      key: "DeduccionesTotalOtrasDeducciones",
      render: (_, { nomina }) =>
        formatDisplay(nomina?.DeduccionesTotalOtrasDeducciones, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "Subsidio causado",
      dataIndex: "nomina.SubsidioCausado",
      key: "SubsidioCausado",
      render: (_, { nomina }) => formatDisplay(nomina?.SubsidioCausado, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "Neto a pagar",
      dataIndex: "nomina.NetoAPagar",
      key: "NetoAPagar",
      render: (_, { nomina }) => formatDisplay(nomina?.NetoAPagar, DisplayType.MONEY),
      width: 150,
      fixed: false,
      align: "right",
    },
    {
      title: "Versión",
      dataIndex: "nomina.Version",
      key: "VersionNomina",
      render: (_, { nomina }) => nomina?.Version,
      width: 170,
      fixed: false,
    },
    {
      title: "Tipo nómina",
      dataIndex: "nomina.TipoNomina",
      key: "TipoNomina",
      render: (_, { nomina }) => nomina?.TipoNomina,
      width: 150,
      fixed: false,
    },
    {
      title: "Fecha inicial pago",
      dataIndex: "nomina.FechaInicialPago",
      key: "FechaInicialPago",
      render: (_, { nomina }) => formatDisplay(nomina?.FechaInicialPago, DisplayType.TIMEZONEDATE),
      width: 170,
      fixed: false,
    },
    {
      title: "Fecha final pago",
      dataIndex: "nomina.FechaFinalPago",
      key: "FechaFinalPago",
      render: (_, { nomina }) => formatDisplay(nomina?.FechaFinalPago, DisplayType.TIMEZONEDATE),
      width: 170,
      fixed: false,
    },
    {
      title: "Número días pagados",
      dataIndex: "nomina.NumDiasPagados",
      key: "NumDiasPagados",
      render: (_, { nomina }) => nomina?.NumDiasPagados,
      width: 170,
      fixed: false,
    },
    {
      title: "Registro patronal",
      dataIndex: "nomina.EmisorRegistroPatronal",
      key: "EmisorRegistroPatronal",
      render: (_, { nomina }) => nomina?.EmisorRegistroPatronal,
      width: 170,
      fixed: false,
    },
    {
      title: "CURP",
      dataIndex: "nomina.ReceptorCurp",
      key: "ReceptorCurp",
      render: (_, { nomina }) => nomina?.ReceptorCurp,
      width: 180,
      fixed: false,
    },
    {
      title: "Num seguridad social",
      dataIndex: "nomina.ReceptorNumSeguridadSocial",
      key: "ReceptorNumSeguridadSocial",
      render: (_, { nomina }) => nomina?.ReceptorNumSeguridadSocial,
      width: 170,
      fixed: false,
    },
    {
      title: "Fecha inicio rel laboral",
      dataIndex: "nomina.ReceptorFechaInicioRelLaboral",
      key: "ReceptorFechaInicioRelLaboral",
      render: (_, { nomina }) =>
        formatDisplay(nomina?.ReceptorFechaInicioRelLaboral, DisplayType.TIMEZONEDATE),
      width: 170,
      fixed: false,
    },
    {
      title: "Antigüedad",
      dataIndex: "nomina.ReceptorAntigüedad",
      key: "ReceptorAntigüedad",
      render: (_, { nomina }) => nomina?.ReceptorAntigüedad,
      width: 140,
      fixed: false,
    },
    {
      title: "Tipo contrato",
      dataIndex: "nomina.ReceptorTipoContrato",
      key: "ReceptorTipoContrato",
      render: (_, { nomina }) => nomina?.ReceptorTipoContrato,
      width: 170,
      fixed: false,
    },
    {
      title: "Sindicalizado",
      dataIndex: "nomina.ReceptorSindicalizado",
      key: "ReceptorSindicalizado",
      render: (_, { nomina }) => <p>{nomina?.ReceptorSindicalizado ? "Si" : "No"}</p>,
      width: 170,
      fixed: false,
    },
    {
      title: "Tipo jornada",
      dataIndex: "nomina.ReceptorTipoJornada",
      key: "ReceptorTipoJornada",
      render: (_, { nomina }) => nomina?.ReceptorTipoJornada,
      width: 170,
      fixed: false,
    },
    {
      title: "Num empleado",
      dataIndex: "nomina.ReceptorNumEmpleado",
      key: "ReceptorNumEmpleado",
      render: (_, { nomina }) => nomina?.ReceptorNumEmpleado,
      width: 170,
      fixed: false,
    },
    {
      title: "Departamento",
      dataIndex: "nomina.ReceptorDepartamento",
      key: "ReceptorDepartamento",
      // render: (_, { nomina }) => nomina?.ReceptorDepartamento,
      render: (_, { nomina }) => (
        <GetColumnModify value={nomina?.ReceptorDepartamento} characters={16} />
      ),
      width: 170,
      fixed: false,
    },
    {
      title: "Puesto",
      dataIndex: "nomina.ReceptorPuesto",
      key: "ReceptorPuesto",
      render: (_, { nomina }) => <GetColumnModify value={nomina?.ReceptorPuesto} characters={21} />,
      width: 170,
      fixed: false,
    },
    {
      title: "Riesgo puesto",
      dataIndex: "nomina.ReceptorRiesgoPuesto",
      key: "ReceptorRiesgoPuesto",
      render: (_, { nomina }) => nomina?.ReceptorRiesgoPuesto,
      width: 170,
      fixed: false,
    },
    {
      title: "Periodicidad pago",
      dataIndex: "nomina.ReceptorPeriodicidadPago",
      key: "ReceptorPeriodicidadPago",
      render: (_, { nomina }) => nomina?.ReceptorPeriodicidadPago,
      width: 170,
      fixed: false,
    },
    {
      title: "Banco",
      dataIndex: "nomina.ReceptorBanco",
      key: "ReceptorBanco",
      render: (_, { nomina }) => nomina?.ReceptorBanco,
      width: 170,
      fixed: false,
    },
    {
      title: "Cuenta bancaria",
      dataIndex: "nomina.ReceptorCuentaBancaria",
      key: "ReceptorCuentaBancaria",
      render: (_, { nomina }) => nomina?.ReceptorCuentaBancaria,
      width: 170,
      fixed: false,
    },
    {
      title: "Sal Base Cot",
      dataIndex: "nomina.ReceptorSalarioBaseCotApor",
      key: "ReceptorSalarioBaseCotApor",
      render: (_, { nomina }) =>
        formatDisplay(nomina?.ReceptorSalarioBaseCotApor, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "Sal Diario Int",
      dataIndex: "nomina.ReceptorSalarioDiarioIntegrado",
      key: "ReceptorSalarioDiarioIntegrado",
      render: (_, { nomina }) =>
        formatDisplay(nomina?.ReceptorSalarioDiarioIntegrado, DisplayType.MONEY),
      width: 170,
      fixed: false,
      align: "right",
    },
    {
      title: "Clave Ent Fed",
      dataIndex: "nomina.ReceptorClaveEntFed",
      key: "ReceptorClaveEntFed",
      render: (_, { nomina }) => nomina?.ReceptorClaveEntFed,
      width: 170,
      fixed: false,
    },
    // END COLUMNS FOR PAYROLL VIEW
    { title: "UUID", dataIndex: "UUID", key: "UUID", width: 320, fixed: false },
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
        const disableSwitch = getDisableSwitch(tab, record);
        if (disableSwitch) {
          return <span>No aplica</span>;
        } else {
          return (
            <Switch
              defaultChecked={record?.ExcludeFromIVA}
              disabled={disableSwitch}
              checked={record?.ExcludeFromIVA}
              onChange={() => {
                if (setUUIDsToModify && uuidsToModify)
                  setUUIDsToModify([
                    ...uuidsToModify,
                    {
                      uuid: record.UUID,
                      currentValue: record.ExcludeFromIVA,
                      is_issued: record.is_issued,
                    },
                  ]);
              }}
            />
          );
        }
      },
      align: "center",
      width: 150,
      fixed: false,
    },
    // Payments stuff
    {
      title: "Base IVA 16%",
      dataIndex: "BaseIVA16",
      key: "BaseIVA16",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA16") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA16")?.order,
      width: 150,
      fixed: false,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      align: "right",
    },
    {
      title: "IVA 16%",
      dataIndex: "IVATrasladado16",
      key: "IVATrasladado16",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "IVATrasladado16") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "IVATrasladado16")?.order,
      width: 150,
      fixed: false,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      align: "right",
    },
    {
      title: "Base IVA 8%",
      dataIndex: "BaseIVA8",
      key: "BaseIVA8",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA8") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA8")?.order,
      width: 150,
      fixed: false,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      align: "right",
    },
    {
      title: "IVA 8%",
      dataIndex: "IVATrasladado8",
      key: "IVATrasladado8",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "IVATrasladado8") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "IVATrasladado8")?.order,
      width: 150,
      fixed: false,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      align: "right",
    },
    {
      title: "Base IVA 0%",
      dataIndex: "BaseIVA0",
      key: "BaseIVA0",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA0") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA0")?.order,
      width: 150,
      fixed: false,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      align: "right",
    },
    {
      title: "Base IVA exento",
      dataIndex: "BaseIVAExento",
      key: "BaseIVAExento",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVAExento") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVAExento")?.order,
      width: 150,
      fixed: false,
      render: (val) => formatDisplay(val, DisplayType.MONEY) as string,
      align: "right",
    },
    {
      title: "Total pagos relacionados",
      dataIndex: "pays.ImpPagado",
      key: "total_docto_relacionados",
      width: 200,
      fixed: false,
      render: (_, { pays }) => {
        let total = 0;
        if (pays && pays.length > 0) {
          total = pays.reduce((acc, val) => acc + val.ImpPagado, 0);
        }
        return formatDisplay(total, DisplayType.MONEY) as string;
      },
      align: "right",
      // Este valor no puede ser mayor que el total.
    },
    {
      title: "RFC entidad ordenante",
      dataIndex: "payments.RfcEmisorCtaOrd",
      key: "RfcEmisorCtaOrd",
      width: 200,
      fixed: false,
      render: (_, { payments }) => {
        return payments && payments.length > 0 ? payments[0].RfcEmisorCtaOrd : "-";
      },
    },
    {
      title: "Banco ordenante",
      dataIndex: "payments.NomBancoOrdExt",
      key: "NomBancoOrdExt",
      width: 160,
      fixed: false,
      render: (_, { payments }) => {
        return payments && payments.length > 0 ? payments[0].NomBancoOrdExt : "-";
      },
    },
    {
      title: "Cuenta ordenante",
      dataIndex: "payments.CtaOrdenante",
      key: "CtaOrdenante",
      width: 160,
      fixed: false,
      render: (_, { payments }) => {
        return payments && payments.length > 0 ? payments[0].CtaOrdenante : "-";
      },
    },
    {
      title: "RFC entidad destino",
      dataIndex: "payments.RfcEmisorCtaBen",
      key: "RfcEmisorCtaBen",
      width: 160,
      fixed: false,
      render: (_, { payments }) => {
        return payments && payments.length > 0 ? payments[0].RfcEmisorCtaBen : "-";
      },
    },
    {
      title: "Cuenta beneficiario",
      dataIndex: "payments.CtaBeneficiario",
      key: "CtaBeneficiario",
      width: 160,
      fixed: false,
      render: (_, { payments }) => {
        return payments && payments.length > 0 ? payments[0].CtaBeneficiario : "-";
      },
    },
    {
      title: "Tipo cadena de pago",
      dataIndex: "payments.TipoCadPago",
      key: "TipoCadPago",
      width: 160,
      fixed: false,
      render: (_, { payments }) => {
        return payments && payments.length > 0 ? payments[0].TipoCadPago : "-";
      },
    },
    {
      title: "Monto del pago",
      dataIndex: "payments.Monto",
      key: "Monto",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "Monto") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "Monto")?.order,
      width: 150,
      fixed: false,
      render: (_, { payments }) => {
        return payments && payments.length > 0
          ? formatDisplay(payments[0].Monto, DisplayType.MONEY)
          : formatDisplay(0, DisplayType.MONEY);
      },
      align: "right",
    },
    {
      title: "Número de operación",
      dataIndex: "payments.NumOperacion",
      key: "NumOperacion",
      width: 200,
      fixed: false,
      render: (_, { payments }) => (
        <GetColumnModify
          value={payments && payments.length > 0 ? payments[0].NumOperacion : "-"}
          characters={19}
        />
      ),
    },
    {
      title: "# Relacionados",
      dataIndex: "pr_count",
      key: "pr_count",
      width: 130,
      fixed: false,
    },
    {
      title: (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PaperClipOutlined style={{ fontSize: 17 }} />
        </div>
      ),
      dataIndex: "attachments_count",
      key: "attachments_count",
      render: (_, record) => {
        return (
          <GetColumnAttachments
            type={record.TipoDeComprobante}
            uuid={record?.UUID}
            cfdi={record}
            attachments={record?.attachments_count}
            token={token}
            setModalVisible={setAttachmentsModalVisible}
          />
        )
      },
      width: 60,
      fixed: false,
    },
  ];

  IS_SIIGO &&
    getAllCols.push({
      title: <span id="im-column-polizas">Pólizas</span>,
      dataIndex: "polizas",
      key: "polizas",
      render: (_, record) => (
        <GetPolicies
          policies={record?.polizas}
          token={token}
          setModalVisible={setPolicyModalVisible}
        />
      ),
      width: 275,
      fixed: false,
    });

  (!IS_SIIGO || (IS_SIIGO && !isDownloadPlan)) &&
    getAllCols.push(
      {
        title: "Saldo de la factura",
        dataIndex: "balance",
        key: "balance",
        showSorterTooltip: false,
        sorter: true,
        sortOrder:
          sorter?.findIndex((s) => s.columnKey === "balance") === -1
            ? undefined
            : sorter?.find((s) => s.columnKey === "balance")?.order,
        render: (val) => formatDisplay(val, DisplayType.MONEY) as string as string,
        width: 200,
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
              setModalVisible={setModalVisible}
            />
          );
        },
        width: 320,
        fixed: false,
      },
      {
        title: "CFDIs de egreso relacionados",
        dataIndex: "cfdi_related.uuid_origin",
        key: "cfdi_related.uuid_origin",
        width: 320,
        fixed: false,
        render: (_, { cfdi_related }) => {
          return cfdi_related ? (
            <GetRelatedEgressCFDI
              uuid_related={cfdi_related}
              setModalVisible={setModalVisible}
              setCFDIToDisplay={setCFDIToDisplay}
              setCFDITypeToRequest={setCFDITypeToRequest}
            />
          ) : null;
        },
      },
      {
        title: "Total egresos relacionados",
        dataIndex: "active_egresos.Total",
        key: "active_egresos.Total",
        width: 200,
        align: "right",
        fixed: false,
        render: (_, { active_egresos }) => {
          return active_egresos ? <GetTotalEgressCFDI active_egresos={active_egresos} /> : null;
        },
      }
    );

  const getDataColumns = (module: CFDIModule, tab: CFDI_Types): ColumnsType<CFDI> => {
    const cols = getAllCols;
    const ingressColumnKeys = ["polizas"];
    const payrollColumnKeys = [
      "name",
      "nomina.RfcReceptor",
      "ReceptorTipoRegimen",
      "TotalPercepciones",
      "TotalDeducciones",
      "TotalOtrosPagos",
      "PercepcionesTotalSueldos",
      "OtrasPercepciones",
      "PercepcionesTotalGravado",
      "PercepcionesTotalExento",
      "AjusteISRRetenido",
      "DeduccionesTotalImpuestosRetenidos",
      "DeduccionesTotalOtrasDeducciones",
      "SubsidioCausado",
      "NetoAPagar",
      "VersionNomina",
      "TipoNomina",
      "FechaInicialPago",
      "FechaFinalPago",
      "NumDiasPagados",
      "EmisorRegistroPatronal",
      "ReceptorCurp",
      "ReceptorNumSeguridadSocial",
      "ReceptorFechaInicioRelLaboral",
      "ReceptorAntigüedad",
      "ReceptorTipoContrato",
      "ReceptorSindicalizado",
      "ReceptorTipoJornada",
      "ReceptorNumEmpleado",
      "ReceptorDepartamento",
      "ReceptorPuesto",
      "ReceptorRiesgoPuesto",
      "ReceptorPeriodicidadPago",
      "ReceptorBanco",
      "ReceptorCuentaBancaria",
      "ReceptorSalarioBaseCotApor",
      "ReceptorSalarioDiarioIntegrado",
      "ReceptorClaveEntFed",
      "PercepcionesSeparacionIndemnizacion",
      "PercepcionesJubilacionPensionRetiro",
      "DomicilioFiscalReceptor",
    ];
    const excludePaymentColumnKeys = [
      "BaseIVA16",
      "BaseIVA8",
      "BaseIVA0",
      "BaseIVAExento",
      "total_docto_relacionados",
      "RfcEmisorCtaOrd",
      "NomBancoOrdExt",
      "CtaOrdenante",
      "RfcEmisorCtaBen",
      "CtaBeneficiario",
      "TipoCadPago",
      "Monto",
      "NumOperacion",
      "IVATrasladado16",
      "IVATrasladado8",
      "pr_count",
    ];
    const section = module + (module !== "efos" && module !== "validation-complete" ? tab : "");

    switch (section) {
      case "issuedT":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "active_egresos.Total",
              "balance",
              "paid_by.UUID",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "TrasladosIVAMXN",
              "TrasladosIEPSMXN",
              "TrasladosISRMXN",
              "RetencionesIVAMXN",
              "RetencionesIEPSMXN",
              "RetencionesISRMXN",
              "cfdi_related.uuid_origin",
              "ExcludeFromIVA",
              "Year",
              "RfcEmisor",
              "NombreEmisor",
              "RegimenFiscalEmisor",
              "RegimenFiscalEmisorDesc",
              "FechaFiltro",
              ...ingressColumnKeys,
              ...excludePaymentColumnKeys,
              ...payrollColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });
      case "receivedT":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "active_egresos.Total",
              "balance",
              "paid_by.UUID",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "TrasladosIVAMXN",
              "TrasladosIEPSMXN",
              "TrasladosISRMXN",
              "RetencionesIVAMXN",
              "RetencionesIEPSMXN",
              "RetencionesISRMXN",
              "cfdi_related.uuid_origin",
              "ExcludeFromIVA",
              "Year",
              "RfcReceptor",
              "NombreReceptor",
              "ExcludeFromIVA",
              "Year",
              "FechaFiltro",
              ...ingressColumnKeys,
              ...excludePaymentColumnKeys,
              ...payrollColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });
      case "issued":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "RfcEmisor",
              "NombreEmisor",
              "RegimenFiscalEmisor",
              "RegimenFiscalEmisorDesc",
              "ExcludeFromIVA",
              "Year",
              "FechaFiltro",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "TrasladosIVAMXN",
              "TrasladosIEPSMXN",
              "TrasladosISRMXN",
              "RetencionesIVAMXN",
              "RetencionesIEPSMXN",
              "RetencionesISRMXN",
              "cfdi_related.uuid_origin",
              ...excludePaymentColumnKeys,
              ...payrollColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });
      case "issuedI":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "RfcEmisor",
              "NombreEmisor",
              "RegimenFiscalEmisor",
              "RegimenFiscalEmisorDesc",
              "FechaFiltro",
              ...excludePaymentColumnKeys,
              ...payrollColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });
      case "issuedE":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "active_egresos.Total",
              "balance",
              "RfcEmisor",
              "NombreEmisor",
              "paid_by.UUID",
              "RegimenFiscalEmisor",
              "RegimenFiscalEmisorDesc",
              "Year",
              "FechaFiltro",
              "cfdi_related.uuid_origin",
              ...excludePaymentColumnKeys,
              ...payrollColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });
      case "issuedN":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "active_egresos.Total",
              "balance",
              "paid_by.UUID",
              "ExcludeFromIVA",
              "Version",
              "RfcEmisor",
              "NombreEmisor",
              "RegimenFiscalEmisor",
              "RegimenFiscalEmisorDesc",
              "c_regimen_fiscal_emisor",
              "RegimenFiscalReceptor",
              "RegimenFiscalReceptorDesc",
              "c_regimen_fiscal_receptor",
              "SubTotal",
              "Descuento",
              "Neto",
              "RetencionesIVA",
              "RetencionesISR",
              "TrasladosIVA",
              "Total",
              "TotalMXN",
              "Moneda",
              "TipoCambio",
              "UsoCFDIReceptor",
              "FormaPago",
              "FormaPagoCodigo",
              "c_forma_pago",
              "MetodoPago",
              "MetodoPagoCodigo",
              "FechaYear",
              "FechaMonth",
              "c_metodo_pago",
              "CondicionesDePago",
              "FechaCertificacionSat",
              "FechaCertificacionSatYear",
              "FechaCertificacionSatMonth",
              "RetencionesIEPS",
              "TrasladosIEPS",
              "TrasladosISR",
              "NoCertificado",
              "TipoDeComprobante",
              "Exportacion",
              "Periodicidad",
              "Meses",
              // "LugarExpedicion",
              "Year",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "TrasladosIVAMXN",
              "TrasladosIEPSMXN",
              "TrasladosISRMXN",
              "RetencionesIVAMXN",
              "RetencionesIEPSMXN",
              "RetencionesISRMXN",
              "cfdi_related.uuid_origin",
              ...excludePaymentColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });
      case "issuedP":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "active_egresos.Total",
              "balance",
              "RfcEmisor",
              "NombreEmisor",
              "RegimenFiscalEmisor",
              "RegimenFiscalEmisorDesc",
              "Year",
              "ExcludeFromIVA",
              "RegimenFiscalReceptor",
              "RegimenFiscalReceptorDesc",
              "MetodoPago",
              "CondicionesDePago",
              "FechaCertificacionSat",
              "FechaCertificacionSatYear",
              "FechaCertificacionSatMonth",
              "SubTotal",
              "Descuento",
              "Neto",
              "UsoCFDIReceptor",
              "FechaYear",
              "FechaMonth",
              "TrasladosIEPS",
              "TrasladosISR",
              "NoCertificado",
              "TipoDeComprobante",
              "Exportacion",
              "Periodicidad",
              "Meses",
              "balance",
              "paid_by.UUID",
              "MetodoPagoCodigo",
              "TotalMXN",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "TrasladosIVAMXN",
              "TrasladosIEPSMXN",
              "TrasladosISRMXN",
              "RetencionesIVAMXN",
              "RetencionesIEPSMXN",
              "RetencionesISRMXN",
              "cfdi_related.uuid_origin",
              ...payrollColumnKeys,
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
              "ExcludeFromIVA",
              "Year",
              "FechaFiltro",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "TrasladosIVAMXN",
              "TrasladosIEPSMXN",
              "TrasladosISRMXN",
              "RetencionesIVAMXN",
              "RetencionesIEPSMXN",
              "RetencionesISRMXN",
              "cfdi_related.uuid_origin",
              ...excludePaymentColumnKeys,
              ...payrollColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });
      case "receivedI":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "RfcReceptor",
              "NombreReceptor",
              "FechaFiltro",
              ...excludePaymentColumnKeys,
              ...payrollColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });
      case "receivedE":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "active_egresos.Total",
              "balance",
              "RfcReceptor",
              "paid_by.UUID",
              "NombreReceptor",
              "Year",
              "FechaFiltro",
              "cfdi_related.uuid_origin",
              ...excludePaymentColumnKeys,
              ...payrollColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });
      case "receivedN":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "active_egresos.Total",
              "balance",
              "paid_by.UUID",
              "ExcludeFromIVA",
              "Version",
              "RegimenFiscalEmisor",
              "RegimenFiscalEmisorDesc",
              "c_regimen_fiscal_emisor",
              "RfcReceptor",
              "NombreReceptor",
              "RegimenFiscalReceptor",
              "RegimenFiscalReceptorDesc",
              "c_regimen_fiscal_receptor",
              "SubTotal",
              "Descuento",
              "Neto",
              "RetencionesIVA",
              "RetencionesISR",
              "TrasladosIVA",
              "Total",
              "TotalMXN",
              "Moneda",
              "TipoCambio",
              "UsoCFDIReceptor",
              "FormaPago",
              "FormaPagoCodigo",
              "c_forma_pago",
              "MetodoPago",
              "MetodoPagoCodigo",
              "FechaYear",
              "FechaMonth",
              "c_metodo_pago",
              "CondicionesDePago",
              "FechaCertificacionSat",
              "FechaCertificacionSatYear",
              "FechaCertificacionSatMonth",
              "RetencionesIEPS",
              "TrasladosIEPS",
              "TrasladosISR",
              "NoCertificado",
              "TipoDeComprobante",
              "Exportacion",
              "Periodicidad",
              "Meses",
              // "LugarExpedicion",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "TrasladosIVAMXN",
              "TrasladosIEPSMXN",
              "TrasladosISRMXN",
              "RetencionesIVAMXN",
              "RetencionesIEPSMXN",
              "RetencionesISRMXN",
              "cfdi_related.uuid_origin",
              ...excludePaymentColumnKeys,
              "Year",
            ].includes(String(c.key));
          }
          return true;
        });
      case "receivedP":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "active_egresos.Total",
              "balance",
              "Year",
              "ExcludeFromIVA",
              "RegimenFiscalEmisor",
              "RegimenFiscalEmisorDesc",
              "MetodoPago",
              "CondicionesDePago",
              "FechaCertificacionSat",
              "FechaCertificacionSatYear",
              "FechaCertificacionSatMonth",
              "SubTotal",
              "Descuento",
              "Neto",
              "UsoCFDIReceptor",
              "FechaYear",
              "FechaMonth",
              "TrasladosIEPS",
              "TrasladosISR",
              "NoCertificado",
              "TipoDeComprobante",
              "Exportacion",
              "Periodicidad",
              "Meses",
              "balance",
              "paid_by.UUID",
              "MetodoPagoCodigo",
              "TotalMXN",
              "NombreReceptor",
              "RfcReceptor",
              "NombreReceptor",
              "SubTotalMXN",
              "DescuentoMXN",
              "NetoMXN",
              "TrasladosIVAMXN",
              "TrasladosIEPSMXN",
              "TrasladosISRMXN",
              "RetencionesIVAMXN",
              "RetencionesIEPSMXN",
              "RetencionesISRMXN",
              "cfdi_related.uuid_origin",
              ...payrollColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });
      case "efos":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "FechaFiltro",
              "Fecha",
              "Version",
              "Serie",
              "Folio",
              "RfcReceptor",
              "NombreReceptor",
              "RegimenFiscalReceptor",
              "RegimenFiscalReceptorDesc",
              "balance",
              "paid_by.UUID",
              "ExcludeFromIVA",
              "Year",
              "cfdi_related.uuid_origin",
              "active_egresos.Total",
              "polizas",
              "attachments_count",
              ...excludePaymentColumnKeys,
              ...payrollColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });
      case "validation-complete":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "balance",
              "paid_by.UUID",
              "ExcludeFromIVA",
              "FechaFiltro",
              "cfdi_related.uuid_origin",
              "active_egresos.Total",
              "attachments_count",
              ...ingressColumnKeys,
              ...excludePaymentColumnKeys,
              ...payrollColumnKeys,
            ].includes(String(c.key));
          }
          return true;
        });

      default:
        return cols;
    }
  };

  return getDataColumns(module, tab);
}
