export interface CFDIVoucherType {
  "cfdi:Comprobante": {
    "cfdi:Complemento": CFDIComplementType;
    "cfdi:Conceptos": CFDIVoucherConceptType;
    "cfdi:Emisor": string;
    "cfdi:Impuestos": string;
    "cfdi:Receptor": string;
    _attributes: string;
  };
}

export interface CFDIComplementType {
  "tfd:TimbreFiscalDigital": {
    _attributes: {
      FechaTimbrado: string;
      NoCertificadoSAT: string;
      RfcProvCertif: string;
      SelloCFD: string;
      SelloSAT: string;
      UUID: string;
      Version: string;
      "xmlsn:tfd": string;
      "xmlns:xsi": string;
      "xsi:schemaLocation": string;
    };
  };
}

export interface CFDIVoucherConceptType {
  "cfdi:Concepto": CFDIConceptDetailsType[] | CFDIConceptDetailsType;
}

export interface CFDIConceptDetailsType {
  "cfdi:Impuestos": {
    "cfdi:Traslados": {
      "cfdi:Traslado": {
        _attributes: {
          Base: string;
          Importe: string;
          Impuesto: string;
          TasaOCuota: string;
          TipoFactor: string;
        };
      };
    };
    "cfdi:Retenciones": {
      "cfdi:Retencion": {
        _attributes: {
          Base: string;
          Importe: string;
          Impuesto: string;
          TasaOCuota: string;
          TipoFactor: string;
        };
      };
    };
  };
  _attributes: {
    Cantidad: string;
    ClaveProdServ: string;
    ClaveUnidad: string;
    Descripcion: string;
    Descuento: string;
    Importe: string;
    NoIdentificacion: string;
    ObjetoImp: string;
    Unidad: string;
    ValorUnitario: string;
  };
}

function setUniqueConcept(value: CFDIConceptDetailsType) {
  const conceptAttributes = value._attributes;
  const impuestos = value["cfdi:Impuestos"];
  const traslados = impuestos ? impuestos["cfdi:Traslados"] : null;
  const retenciones = impuestos ? impuestos["cfdi:Retenciones"] : null;
  let trasladosData = {};
  let retencionesData = {};
  let conceptsData = {
    ClaveProdServ: conceptAttributes.ClaveProdServ,
    NoIdentificacion: conceptAttributes.NoIdentificacion,
    Cantidad: conceptAttributes.Cantidad,
    ClaveUnidad: conceptAttributes.ClaveUnidad,
    Unidad: conceptAttributes.Unidad,
    Descripcion: conceptAttributes.Descripcion,
    ValorUnitario: conceptAttributes.ValorUnitario,
    Importe: conceptAttributes.Importe,
    Descuento: conceptAttributes.Descuento,
    ObjetoImp: conceptAttributes.ObjetoImp,
  };

  if (traslados && traslados["cfdi:Traslado"]._attributes.Impuesto === "002") {
    trasladosData = {
      transferred_iva_base: traslados["cfdi:Traslado"]._attributes.Base,
      transferred_iva_factor: traslados["cfdi:Traslado"]._attributes.TipoFactor,
      transferred_iva_share: traslados["cfdi:Traslado"]._attributes.TasaOCuota,
      transferred_iva_amount: traslados["cfdi:Traslado"]._attributes.Importe,
    };
  } else if (traslados && traslados["cfdi:Traslado"]._attributes.Impuesto === "003") {
    trasladosData = {
      transferred_ieps_base: traslados["cfdi:Traslado"]._attributes.Base,
      transferred_ieps_factor: traslados["cfdi:Traslado"]._attributes.TipoFactor,
      transferred_ieps_share: traslados["cfdi:Traslado"]._attributes.TasaOCuota,
      transferred_ieps_amount: traslados["cfdi:Traslado"]._attributes.Importe,
    };
  }

  if (retenciones && retenciones["cfdi:Retencion"]._attributes.Impuesto === "002") {
    retencionesData = {
      holdings_iva_base: retenciones["cfdi:Retencion"]._attributes.Base,
      holdings_iva_factor: retenciones["cfdi:Retencion"]._attributes.TipoFactor,
      holdings_iva_share: retenciones["cfdi:Retencion"]._attributes.TasaOCuota,
      holdings_iva_amount: retenciones["cfdi:Retencion"]._attributes.Importe,
    };
  } else if (retenciones && retenciones["cfdi:Retencion"]._attributes.Impuesto === "001") {
    retencionesData = {
      holdings_isr_base: retenciones["cfdi:Retencion"]._attributes.Base,
      holdings_isr_factor: retenciones["cfdi:Retencion"]._attributes.TipoFactor,
      holdings_isr_share: retenciones["cfdi:Retencion"]._attributes.TasaOCuota,
      holdings_isr_amount: retenciones["cfdi:Retencion"]._attributes.Importe,
    };
  }

  conceptsData = { ...conceptsData, ...trasladosData, ...retencionesData };

  return conceptsData;
}

export default function getCFDIConcepts(cfdiVoucher: CFDIVoucherType) {
  if (Object.keys(cfdiVoucher).length !== 0) {
    const conceptos = cfdiVoucher["cfdi:Comprobante"]["cfdi:Conceptos"]["cfdi:Concepto"];
    const finalResult: CFDIConceptType[] = [];

    if (Array.isArray(conceptos)) {
      conceptos.map((e) => {
        const uniqueConcept = setUniqueConcept(e);
        finalResult.push(uniqueConcept);
      });
    } else {
      const uniqueConcept = setUniqueConcept(conceptos);
      finalResult.push(uniqueConcept);
    }

    return finalResult;
  }

  return [];
}
