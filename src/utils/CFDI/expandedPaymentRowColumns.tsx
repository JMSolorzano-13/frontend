import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/lib/table";

export default function expandedPaymentRowColumns() {
  const cols: ColumnsType<CFDIDetails> = [
    {
      title: "DR - Serie",
      key: "DRSerie",
      dataIndex: "Serie",
      render: (_, record) => {
        return record?.cfdi_related?.Serie;
      },
      width: 100,
    },
    {
      title: "DR - Folio",
      key: "DRFolio",
      dataIndex: "Folio",
      render: (_, record) => {
        return record?.cfdi_related?.Folio;
      },
      width: 160,
    },
    {
      title: "DR - Fecha de emisión",
      key: "DRFechaEmision",
      dataIndex: "cfdi_related.Fecha",
      render: (_, record) => {
        return formatDisplay(record?.cfdi_related?.Fecha, DisplayType.TIMEZONEDATE);
      },
      width: 170,
    },
    {
      title: "DR - UUID",
      key: "DRUUID",
      dataIndex: "UUID_related",
      render: (_, record) => {
        return record?.UUID_related;
      },
      width: 300,
    },
    {
      title: "DR - Uso de CFDI",
      key: "DRUsoCFDI",
      dataIndex: "cfdi_related.UsoCFDIReceptor",
      render: (_, record) => {
        return record?.cfdi_related?.UsoCFDIReceptor;
      },
      width: 130,
      align: "right",
    },
    {
      title: "DR - Objeto de impuesto",
      key: "DRObjetoImpuesto",
      dataIndex: "ObjetoImpDR",
      render: (_, record) => {
        return record?.ObjetoImpDR || "";
      },
      width: 180,
    },
    {
      title: "DR - Base IVA 16%",
      key: "DRBaseIVA16",
      dataIndex: "BaseIVA16",
      render: (_, record) => {
        return formatDisplay(record?.BaseIVA16, DisplayType.MONEY) || "";
      },
      width: 140,
      align: "right",
    },
    {
      title: "DR - Base IVA 8%",
      key: "DRBaseIVA8",
      dataIndex: "BaseIVA8",
      render: (_, record) => {
        return formatDisplay(record?.BaseIVA8, DisplayType.MONEY) || 0;
      },
      width: 150,
      align: "right",
    },
    {
      title: "DR - Base IVA 0%",
      key: "DRBaseIVA0",
      dataIndex: "BaseIVA0",
      render: (_, record) => {
        return formatDisplay(record?.BaseIVA0, DisplayType.MONEY) || 0;
      },
      width: 150,
      align: "right",
    },
    {
      title: "DR - Base IVA exento",
      key: "DRBaseIVAExento",
      dataIndex: "BaseIVAExento",
      render: (_, record) => {
        return formatDisplay(record?.BaseIVAExento, DisplayType.MONEY) || 0;
      },
      width: 180,
      align: "right",
    },
    {
      title: "DR - IVA acreditable 16%",
      key: "DRIVAAcreditable16",
      dataIndex: "IVATrasladado16",
      render: (_, record) => {
        return formatDisplay(record?.IVATrasladado16, DisplayType.MONEY) || 0;
      },
      width: 180,
      align: "right",
    },
    {
      title: "DR - IVA acreditable 8%",
      key: "DRIVAAcreditable8",
      dataIndex: "IVATrasladado8",
      render: (_, record) => {
        return formatDisplay(record?.IVATrasladado8, DisplayType.MONEY) || 0;
      },
      width: 180,
      align: "right",
    },
    {
      title: "DR - IVA acreditable total",
      key: "DRIVAAcreditableTotal",
      dataIndex: "TrasladosIVAMXN",
      render: (_, record) => {
        return formatDisplay(record?.TrasladosIVAMXN, DisplayType.MONEY) || 0;
      },
      width: 180,
      align: "right",
    },
    {
      title: "DR - Retenciones IVA",
      key: "DRRetencionesIVA",
      dataIndex: "RetencionesIVAMXN",
      render: (_, record) => {
        return formatDisplay(record?.RetencionesIVAMXN, DisplayType.MONEY);
      },
      width: 160,
      align: "right",
    },
    // {
    //   title: "DR - Retenciones ISR",
    //   key: "DRRetencionesISR",
    //   dataIndex: "",
    //   render: (_, record) => {
    //     return "";
    //   },
    //   width: 120,
    //   align: "right",
    // },
    {
      title: "DR - Importe pagado",
      key: "DRImportePagado",
      dataIndex: "ImpPagadoMXN",
      render: (_, record) => {
        return formatDisplay(record?.ImpPagadoMXN, DisplayType.MONEY) || 0;
      },
      width: 160,
      align: "right",
    },
  ];

  return cols;
}
