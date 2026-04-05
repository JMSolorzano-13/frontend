export interface payrollParsedType {
  "cfdi:Comprobante": {
    "cfdi:Complemento": payrollComplementType;
  };
}

export interface payrollComplementType {
  "nomina12:Nomina": {
    "nomina12:Deducciones": payrollDeductionsType;
    "nomina12:OtrosPagos": payrollOtherPaymentsType;
    "nomina12:Percepciones": payrollPerceptsType;
  };
}

export interface payrollDeductionsType {
  "nomina12:Deduccion": deductionDataType[] | deductionDataType;
}

export interface deductionDataType {
  _attributes: {
    Clave: string;
    Concepto: string;
    Importe: string;
    TipoDeduccion: string;
  };
}

export interface payrollOtherPaymentsType {
  "nomina12:OtroPago": otherPaymentsDataType[] | otherPaymentsDataType;
}

export interface otherPaymentsDataType {
  _attributes: {
    Clave: string;
    Concepto: string;
    Importe: string;
    TipoOtroPago: string;
  };
}

export interface payrollPerceptsType {
  "nomina12:Percepcion": perceptDataType[] | perceptDataType;
}

export interface perceptDataType {
  _attributes: {
    Clave: string;
    Concepto: string;
    ImporteExento: string;
    ImporteGravado: string;
    TipoPercepcion: string;
  };
}
