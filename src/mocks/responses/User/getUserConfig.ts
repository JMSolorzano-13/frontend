import { DefaultBodyType, ResponseComposition, RestContext } from "msw";

export const userConfigSuccess = (res: ResponseComposition<DefaultBodyType>, ctx: RestContext) => {
  return res(
    ctx.status(200),
    ctx.json({
      "0": {
        data: {
          IVAIds: ["iva-widget"],
          dashboardIds: {
            totals: true,
            "improved-IVA": true,
            featuredTopic: false,
            "nominal-income": true,
            linecharttotals: true,
          },
          pivotLayouts: {},
          tableColumns: {
            cfdi_issued_ingress_v160424: [
              {
                column: "Fecha",
                visible: true,
              },
              {
                column: "LugarExpedicion",
                visible: true,
              },
              {
                column: "Serie",
                visible: true,
              },
              {
                column: "Folio",
                visible: true,
              },
              {
                column: "UUID",
                visible: true,
              },
              {
                column: "RfcReceptor",
                visible: true,
              },
              {
                column: "NombreReceptor",
                visible: true,
              },
              {
                column: "Total",
                visible: true,
              },
              {
                column: "TotalMXN",
                visible: false,
              },
              {
                column: "balance",
                visible: true,
              },
              {
                column: "paid_by.UUID",
                visible: true,
              },
              {
                column: "cfdi_related.uuid_origin",
                visible: false,
              },
              {
                column: "active_egresos.Total",
                visible: false,
              },
              {
                column: "SubTotal",
                visible: true,
              },
              {
                column: "SubTotalMXN",
                visible: false,
              },
              {
                column: "Descuento",
                visible: true,
              },
              {
                column: "DescuentoMXN",
                visible: false,
              },
              {
                column: "Neto",
                visible: true,
              },
              {
                column: "NetoMXN",
                visible: false,
              },
              {
                column: "TrasladosIVA",
                visible: true,
              },
              {
                column: "TrasladosIVAMXN",
                visible: false,
              },
              {
                column: "TrasladosIEPS",
                visible: false,
              },
              {
                column: "TrasladosIEPSMXN",
                visible: false,
              },
              {
                column: "TrasladosISR",
                visible: false,
              },
              {
                column: "TrasladosISRMXN",
                visible: false,
              },
              {
                column: "ExcludeFromIVA",
                visible: false,
              },
              {
                column: "RetencionesIVA",
                visible: false,
              },
              {
                column: "RetencionesIVAMXN",
                visible: false,
              },
              {
                column: "RetencionesIEPS",
                visible: false,
              },
              {
                column: "RetencionesIEPSMXN",
                visible: false,
              },
              {
                column: "RetencionesISR",
                visible: false,
              },
              {
                column: "RetencionesISRMXN",
                visible: false,
              },
              {
                column: "RegimenFiscalReceptor",
                visible: false,
              },
              {
                column: "RegimenFiscalReceptorDesc",
                visible: false,
              },
              {
                column: "UUIDRelacionado",
                visible: false,
              },
              {
                column: "TipoRelacion",
                visible: false,
              },
              {
                column: "Moneda",
                visible: false,
              },
              {
                column: "TipoCambio",
                visible: false,
              },
              {
                column: "UsoCFDIReceptor",
                visible: true,
              },
              {
                column: "MetodoPagoCodigo",
                visible: true,
              },
              {
                column: "MetodoPago",
                visible: false,
              },
              {
                column: "FormaPagoCodigo",
                visible: true,
              },
              {
                column: "FormaPago",
                visible: false,
              },
              {
                column: "CondicionesDePago",
                visible: false,
              },
              {
                column: "Periodicidad",
                visible: false,
              },
              {
                column: "Meses",
                visible: false,
              },
              {
                column: "Year",
                visible: false,
              },
              {
                column: "FechaYear",
                visible: false,
              },
              {
                column: "FechaMonth",
                visible: false,
              },
              {
                column: "Exportacion",
                visible: false,
              },
              {
                column: "FechaCertificacionSat",
                visible: false,
              },
              {
                column: "FechaCertificacionSatYear",
                visible: false,
              },
              {
                column: "FechaCertificacionSatMonth",
                visible: false,
              },
              {
                column: "NoCertificado",
                visible: false,
              },
              {
                column: "Version",
                visible: false,
              },
              {
                column: "TipoDeComprobante",
                visible: false,
              },
            ],
            cfdi_ingress_details_issued_v230524: [
              {
                column: "ConceptosClaveProdServ",
                visible: true,
              },
              {
                column: "ConceptosNoIdentificacion",
                visible: false,
              },
              {
                column: "ConceptosCantidad",
                visible: true,
              },
              {
                column: "ConceptosClaveUnidad",
                visible: true,
              },
              {
                column: "ConceptosUnidad",
                visible: false,
              },
              {
                column: "ConceptosDescripcion",
                visible: true,
              },
              {
                column: "ConceptosValorUnitario",
                visible: true,
              },
              {
                column: "ConceptosImporte",
                visible: true,
              },
              {
                column: "ConceptosDescuento",
                visible: true,
              },
              {
                column: "ConceptosObjetoImp",
                visible: false,
              },
              {
                column: "ConceptosImpuestosTrasladosTrasladoIVABase",
                visible: true,
              },
              {
                column: "ConceptosImpuestosTrasladosTrasladoTipoFactor",
                visible: false,
              },
              {
                column: "ConceptosImpuestosTrasladosTrasladoTasaOCuota",
                visible: false,
              },
              {
                column: "ConceptosImpuestosTrasladosTrasladoIVAImporte",
                visible: true,
              },
              {
                column: "ConceptosImpuestosTrasladosTrasladoIEPSBase",
                visible: false,
              },
              {
                column: "ConceptosImpuestosTrasladosTrasladoIEPSTipoFactor",
                visible: false,
              },
              {
                column: "ConceptosImpuestosTrasladosTrasladoIEPSTasaOCuota",
                visible: false,
              },
              {
                column: "ConceptosImpuestosTrasladosTrasladoIEPSImporte",
                visible: false,
              },
              {
                column: "ConceptosImpuestosRetencionesRetencionIVABase",
                visible: false,
              },
              {
                column: "ConceptosImpuestosRetencionesRetencionIVATipoFactor",
                visible: false,
              },
              {
                column: "ConceptosImpuestosRetencionesRetencionIVATasaOCuota",
                visible: false,
              },
              {
                column: "ConceptosImpuestosRetencionesRetencionIVAImporte",
                visible: false,
              },
              {
                column: "ConceptosImpuestosRetencionesRetencionISRBase",
                visible: false,
              },
              {
                column: "ConceptosImpuestosRetencionesRetencionISRTipoFactor",
                visible: false,
              },
              {
                column: "ConceptosImpuestosRetencionesRetencionISRTasaOCuota",
                visible: false,
              },
              {
                column: "ConceptosImpuestosRetencionesRetencionISRImporte",
                visible: false,
              },
            ],
          },
          validationIds: ["issuedcfdis", "receivedcfdis", "efos"],
          scrap_status_opinion: {
            updated_at: "",
            current_status: "",
          },
          scrap_status_constancy: {
            updated_at: "2025-08-11 15:30:28",
            current_status: "scraped",
          },
        },
      },
    })
  );
};
