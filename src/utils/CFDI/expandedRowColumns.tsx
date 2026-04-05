import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/lib/table";
import { getRetencionTax, getTrasladoTax } from "./getTaxFromConcept";

export default function expandedRowColumns() {
  const cols: ColumnsType<CFDIDetails> = [
    {
      title: "Clave producto",
      key: "ConceptosClaveProdServ",
      dataIndex: "Conceptos.ClaveProdServ",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        return conceptosJSON.Concepto["@ClaveProdServ"] || "";
      },
      width: 130,
    },
    {
      title: "No. Identificacion",
      key: "ConceptosNoIdentificacion",
      dataIndex: "Conceptos.NoIdentificacion",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        return conceptosJSON.Concepto["@NoIdentificacion"] || "";
      },
      width: 150,
    },
    {
      title: "Cantidad",
      key: "ConceptosCantidad",
      dataIndex: "Conceptos.Cantidad",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        return conceptosJSON.Concepto["@Cantidad"] || "";
      },
      width: 80,
    },
    {
      title: "Clave unidad",
      key: "ConceptosClaveUnidad",
      dataIndex: "Conceptos.ClaveUnidad",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        return conceptosJSON.Concepto["@ClaveUnidad"] || "";
      },
      width: 100,
    },
    {
      title: "Unidad",
      key: "ConceptosUnidad",
      dataIndex: "Conceptos.Unidad",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        return conceptosJSON.Concepto["@Unidad"] || "";
      },
      width: 100,
    },
    {
      title: "Descripción",
      key: "ConceptosDescripcion",
      dataIndex: "Conceptos.Descripcion",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        return conceptosJSON.Concepto["@Descripcion"] || "";
      },
      width: 320,
    },
    {
      title: "Valor unitario",
      key: "ConceptosValorUnitario",
      dataIndex: "Conceptos.ValorUnitario",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const parsedData = conceptosJSON.Concepto["@ValorUnitario"]
          ? formatDisplay(conceptosJSON.Concepto["@ValorUnitario"], DisplayType.MONEY)
          : "";
        return parsedData;
      },
      align: "right",
      width: 150,
    },
    {
      title: "Importe",
      key: "ConceptosImporte",
      dataIndex: "Conceptos.Importe",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const parsedData = conceptosJSON.Concepto["@Importe"]
          ? formatDisplay(conceptosJSON.Concepto["@Importe"], DisplayType.MONEY)
          : "";
        return parsedData;
      },
      align: "right",
      width: 150,
    },
    {
      title: "Descuento",
      key: "ConceptosDescuento",
      dataIndex: "Conceptos.Descuento",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const parsedData = conceptosJSON.Concepto["@Descuento"]
          ? formatDisplay(conceptosJSON.Concepto["@Descuento"], DisplayType.MONEY)
          : "";
        return parsedData;
      },
      align: "right",
      width: 150,
    },
    {
      title: "Cuenta predial",
      key: "ConceptosCuentaPredial",
      dataIndex: "Conceptos.CuentaPredial.Numero",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const cuentaPredialData =
          conceptosJSON?.Concepto[0]?.CuentaPredial || conceptosJSON?.Concepto?.CuentaPredial;
        let numerosPredial: string | null = null;
        if (Array.isArray(cuentaPredialData)) {
          numerosPredial = cuentaPredialData
            .map((item: any) => item?.["@Numero"])
            .filter(Boolean)
            .join(", ");
        } else if (cuentaPredialData?.["@Numero"]) {
          numerosPredial = cuentaPredialData["@Numero"];
        }
        return numerosPredial ? formatDisplay(numerosPredial, DisplayType.STRING) : "";
      },
      width: 120,
    },
    {
      title: "Objeto de impuesto",
      key: "ConceptosObjetoImp",
      dataIndex: "Conceptos.ObjetoImp",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        return conceptosJSON.Concepto["@ObjetoImp"] || "";
      },
      width: 150,
    },
    {
      title: "Base de IVA traslado",
      key: "ConceptosImpuestosTrasladosTrasladoIVABase",
      dataIndex: "Conceptos.Impuestos.Traslados.Traslado.IVA.Base",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const traslados = conceptosJSON?.Concepto?.Impuestos?.Traslados?.Traslado;

        return getTrasladoTax(traslados, "@Base", "money", "002");
      },
      align: "right",
      width: 210,
    },
    {
      title: "Tipo factor IVA traslado",
      key: "ConceptosImpuestosTrasladosTrasladoTipoFactor",
      dataIndex: "Conceptos.Impuestos.Traslados.Traslado.IVA.TipoFactor",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const traslados = conceptosJSON?.Concepto?.Impuestos?.Traslados?.Traslado;

        return getTrasladoTax(traslados, "@TipoFactor", "string", "002");
      },
      width: 210,
    },
    {
      title: "Tasa o cuota IVA traslado",
      key: "ConceptosImpuestosTrasladosTrasladoTasaOCuota",
      dataIndex: "Conceptos.Impuestos.Traslados.Traslado.IVA.TasaOCuota",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const traslados = conceptosJSON?.Concepto?.Impuestos?.Traslados?.Traslado;

        return getTrasladoTax(traslados, "@TasaOCuota", "string", "002");
      },
      width: 210,
    },
    {
      title: "Importe IVA traslado",
      key: "ConceptosImpuestosTrasladosTrasladoIVAImporte",
      dataIndex: "Conceptos.Impuestos.Traslados.Traslado.IVA.Importe",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const traslados = conceptosJSON?.Concepto?.Impuestos?.Traslados?.Traslado;

        return getTrasladoTax(traslados, "@Importe", "money", "002");
      },
      align: "right",
      width: 200,
    },
    {
      title: "Base IEPS",
      key: "ConceptosImpuestosTrasladosTrasladoIEPSBase",
      dataIndex: "Conceptos.Impuestos.Traslados.Traslado.IEPS.Base",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const traslados = conceptosJSON?.Concepto?.Impuestos?.Traslados?.Traslado;

        return getTrasladoTax(traslados, "@Base", "money", "003");
      },
      align: "right",
      width: 150,
    },
    {
      title: "Tipo factor IEPS",
      key: "ConceptosImpuestosTrasladosTrasladoIEPSTipoFactor",
      dataIndex: "Conceptos.Impuestos.Traslados.Traslado.IEPS.TipoFactor",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const traslados = conceptosJSON?.Concepto?.Impuestos?.Traslados?.Traslado;

        return getTrasladoTax(traslados, "@TipoFactor", "string", "003");
      },
      width: 150,
    },
    {
      title: "Tasa o cuota IEPS",
      key: "ConceptosImpuestosTrasladosTrasladoIEPSTasaOCuota",
      dataIndex: "Conceptos.Impuestos.Traslados.Traslado.IEPS.TasaOCuota",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const traslados = conceptosJSON?.Concepto?.Impuestos?.Traslados?.Traslado;

        return getTrasladoTax(traslados, "@TasaOCuota", "string", "003");
      },
      width: 150,
    },
    {
      title: "Importe IEPS",
      key: "ConceptosImpuestosTrasladosTrasladoIEPSImporte",
      dataIndex: "Conceptos.Impuestos.Traslados.Traslado.IEPS.Importe",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const traslados = conceptosJSON?.Concepto?.Impuestos?.Traslados?.Traslado;

        return getTrasladoTax(traslados, "@Importe", "money", "003");
      },
      align: "right",
      width: 150,
    },
    {
      title: "Base IVA retencion",
      key: "ConceptosImpuestosRetencionesRetencionIVABase",
      dataIndex: "Conceptos.Impuestos.Retenciones.Retencion.IVA.Base",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const retenciones = conceptosJSON?.Concepto?.Impuestos?.Retenciones?.Retencion;

        return getRetencionTax(retenciones, "@Base", "money", "002");
      },
      align: "right",
      width: 150,
    },
    {
      title: "Tipo factor IVA retencion",
      key: "ConceptosImpuestosRetencionesRetencionIVATipoFactor",
      dataIndex: "Conceptos.Impuestos.Retenciones.Retencion.IVA.TipoFactor",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const retenciones = conceptosJSON?.Concepto?.Impuestos?.Retenciones?.Retencion;

        return getRetencionTax(retenciones, "@TipoFactor", "string", "002");
      },
      width: 210,
    },
    {
      title: "Tasa o cuota IVA retencion",
      key: "ConceptosImpuestosRetencionesRetencionIVATasaOCuota",
      dataIndex: "Conceptos.Impuestos.Retenciones.Retencion.IVA.TasaOCuota",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const retenciones = conceptosJSON?.Concepto?.Impuestos?.Retenciones?.Retencion;

        return getRetencionTax(retenciones, "@TasaOCuota", "string", "002");
      },
      width: 210,
    },
    {
      title: "Importe IVA retencion",
      key: "ConceptosImpuestosRetencionesRetencionIVAImporte",
      dataIndex: "Conceptos.Impuestos.Retenciones.Retencion.IVA.Importe",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const retenciones = conceptosJSON?.Concepto?.Impuestos?.Retenciones?.Retencion;

        return getRetencionTax(retenciones, "@Importe", "money", "002");
      },
      align: "right",
      width: 160,
    },
    {
      title: "Base ISR",
      key: "ConceptosImpuestosRetencionesRetencionISRBase",
      dataIndex: "Conceptos.Impuestos.Retenciones.Retencion.ISR.Base",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const retenciones = conceptosJSON?.Concepto?.Impuestos?.Retenciones?.Retencion;

        return getRetencionTax(retenciones, "@Base", "money", "001");
      },
      align: "right",
      width: 150,
    },
    {
      title: "Tipo factor ISR",
      key: "ConceptosImpuestosRetencionesRetencionISRTipoFactor",
      dataIndex: "Conceptos.Impuestos.Retenciones.Retencion.ISR.TipoFactor",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const retenciones = conceptosJSON?.Concepto?.Impuestos?.Retenciones?.Retencion;

        return getRetencionTax(retenciones, "@TipoFactor", "string", "001");
      },
      width: 150,
    },
    {
      title: "Tasa o cuota ISR",
      key: "ConceptosImpuestosRetencionesRetencionISRTasaOCuota",
      dataIndex: "Conceptos.Impuestos.Retenciones.Retencion.ISR.TasaOCuota",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const retenciones = conceptosJSON?.Concepto?.Impuestos?.Retenciones?.Retencion;

        return getRetencionTax(retenciones, "@TasaOCuota", "string", "001");
      },
      width: 150,
    },
    {
      title: "Importe ISR",
      key: "ConceptosImpuestosRetencionesRetencionISRImporte",
      dataIndex: "Conceptos.Impuestos.Retenciones.Retencion.ISR.Importe",
      render: (_, record) => {
        const conceptosJSON = JSON.parse(record.Conceptos as string);
        const retenciones = conceptosJSON?.Concepto?.Impuestos?.Retenciones?.Retencion;

        return getRetencionTax(retenciones, "@Importe", "money", "001");
      },
      align: "right",
      width: 150,
    },
  ];

  return cols;
}
