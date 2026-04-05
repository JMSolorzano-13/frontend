import {
  deductionDataType,
  otherPaymentsDataType,
  payrollParsedType,
  perceptDataType,
} from "./types";

type payrollBodyContentType = {
  Deducciones: deductionsSingleContentType[] | undefined;
  OtrosPagos: otherPaymentsSingleContentType[] | undefined;
  Percepciones: perceptsSingleContentType[] | undefined;
};

type deductionsSingleContentType = {
  Clave: string;
  Concepto: string;
  Importe: string;
  TipoDeduccion: string;
};

type otherPaymentsSingleContentType = {
  Clave: string;
  Concepto: string;
  Importe: string;
  TipoOtroPago: string;
};

type perceptsSingleContentType = {
  Clave: string;
  Concepto: string;
  ImporteExento: string;
  ImporteGravado: string;
  TipoPercepcion: string;
};

export default function getPayrollFromXML(xmlParsed: payrollParsedType) {
  let xmlData;
  let deductionsData;
  let otherPaymentsData;
  let perceptData;
  let payrollBodyContent: payrollBodyContentType = {
    Deducciones: [],
    OtrosPagos: [],
    Percepciones: [],
  };

  if (xmlParsed) {
    xmlData = xmlParsed?.["cfdi:Comprobante"]?.["cfdi:Complemento"]?.["nomina12:Nomina"];
  }

  if (xmlData) {
    // Code to extract deductions info
    deductionsData = xmlData?.["nomina12:Deducciones"]?.["nomina12:Deduccion"];
    const deductionsParsedData: deductionsSingleContentType[] = [];
    if (Array.isArray(deductionsData) && deductionsData.length > 0) {
      deductionsData.forEach((data) => {
        deductionsParsedData.push({
          Clave: data?._attributes?.Clave,
          Concepto: data?._attributes?.Concepto,
          Importe: data?._attributes?.Importe,
          TipoDeduccion: data?._attributes?.TipoDeduccion,
        });
      });
    } else if (deductionsData !== undefined) {
      const convertedDeductions = deductionsData as deductionDataType;
      deductionsParsedData.push({
        Clave: convertedDeductions?._attributes?.Clave,
        Concepto: convertedDeductions?._attributes?.Concepto,
        Importe: convertedDeductions?._attributes?.Importe,
        TipoDeduccion: convertedDeductions?._attributes?.TipoDeduccion,
      });
    }
    payrollBodyContent = { ...payrollBodyContent, Deducciones: deductionsParsedData };

    // Code to extract other payments info
    otherPaymentsData = xmlData["nomina12:OtrosPagos"]?.["nomina12:OtroPago"];
    const otherPaymentsParsedData: otherPaymentsSingleContentType[] = [];
    if (Array.isArray(otherPaymentsData) && otherPaymentsData.length > 0) {
      otherPaymentsData.forEach((data) => {
        otherPaymentsParsedData.push({
          Clave: data?._attributes?.Clave,
          Concepto: data?._attributes?.Concepto,
          Importe: data?._attributes?.Importe,
          TipoOtroPago: data?._attributes?.TipoOtroPago,
        });
      });
    } else if (otherPaymentsData !== undefined) {
      const convertedOtherPayments = otherPaymentsData as otherPaymentsDataType;
      otherPaymentsParsedData.push({
        Clave: convertedOtherPayments?._attributes?.Clave,
        Concepto: convertedOtherPayments?._attributes?.Concepto,
        Importe: convertedOtherPayments?._attributes?.Importe,
        TipoOtroPago: convertedOtherPayments?._attributes?.TipoOtroPago,
      });
    }
    payrollBodyContent = { ...payrollBodyContent, OtrosPagos: otherPaymentsParsedData };

    // Code to extract percepts info
    perceptData = xmlData["nomina12:Percepciones"]?.["nomina12:Percepcion"];
    const perceptsParsedData: perceptsSingleContentType[] = [];
    if (Array.isArray(perceptData) && perceptData.length > 0) {
      perceptData.forEach((data) => {
        perceptsParsedData.push({
          Clave: data?._attributes?.Clave,
          Concepto: data?._attributes?.Concepto,
          ImporteExento: data?._attributes?.ImporteExento,
          ImporteGravado: data?._attributes?.ImporteGravado,
          TipoPercepcion: data?._attributes?.TipoPercepcion,
        });
      });
    } else if (perceptData !== undefined) {
      const convertedPercepts = perceptData as perceptDataType;
      perceptsParsedData.push({
        Clave: convertedPercepts?._attributes?.Clave,
        Concepto: convertedPercepts?._attributes?.Concepto,
        ImporteExento: convertedPercepts?._attributes?.ImporteExento,
        ImporteGravado: convertedPercepts?._attributes?.ImporteGravado,
        TipoPercepcion: convertedPercepts?._attributes?.TipoPercepcion,
      });
    }
    payrollBodyContent = { ...payrollBodyContent, Percepciones: perceptsParsedData };
  }

  return payrollBodyContent;
}
