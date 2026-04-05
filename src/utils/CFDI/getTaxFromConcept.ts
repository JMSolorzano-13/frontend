import { DisplayType, formatDisplay } from "@utils/formatDisplay";

export function getRetencionTax(retenciones: any, tax: string, valueType: string, taxType: string) {
  let impuesto: string | number = "";
  if (retenciones) {
    if (Array.isArray(retenciones)) {
      retenciones.map((ret) => {
        if (ret["@Impuesto"] === taxType) {
          impuesto = formatDisplay(
            ret[tax],
            valueType === "money" ? DisplayType.MONEY : DisplayType.STRING
          );
        }
      });
    } else {
      impuesto =
        retenciones["@Impuesto"] === taxType
          ? formatDisplay(
              retenciones[tax],
              valueType === "money" ? DisplayType.MONEY : DisplayType.STRING
            )
          : "";
    }
  }
  return impuesto;
}

export function getTrasladoTax(traslados: any, tax: string, valueType: string, taxType: string) {
  let impuesto: string | number = "";
  if (traslados) {
    if (Array.isArray(traslados)) {
      traslados.map((ret) => {
        if (ret["@Impuesto"] === taxType) {
          impuesto = formatDisplay(
            ret[tax],
            valueType === "money" ? DisplayType.MONEY : DisplayType.STRING
          );
        }
      });
    } else {
      impuesto =
        traslados["@Impuesto"] === taxType
          ? formatDisplay(
              traslados[tax],
              valueType === "money" ? DisplayType.MONEY : DisplayType.STRING
            )
          : "";
    }
  }
  return impuesto;
}
