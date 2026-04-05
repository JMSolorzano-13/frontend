import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import moment from "moment";

export default function getDisableSwitchIVA(record: IVACFDI) {
  // Rules for isIngreso
  const isIngreso = record.TipoDeComprobante === "I";


  // Rules for isEgreso
  const isEgreso =
    record.TipoDeComprobante === "E" &&
    record.Version === "4.0" &&
    moment(record.Fecha).isAfter("2022-12-31");

  if (isIngreso || isEgreso) {
    return false;
  } else {
    return true;
  }
}
