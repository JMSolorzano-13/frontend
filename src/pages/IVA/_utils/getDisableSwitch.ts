import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import moment from "moment";

export default function getDisableSwitch(record: IVACFDI) {
  // Rules for isIngreso
  const isIngreso = record.is_issued
    ? record.TipoDeComprobante === "I" && record.MetodoPago === "PUE" && record.Version === "4.0"
    : record.TipoDeComprobante === "I" && record.Version === "4.0";

  // Rules for isPago
  const isPago = record.TipoDeComprobante === "P" && record.Version === "4.0";

  // Rules for isEgreso
  const isEgreso =
    record.TipoDeComprobante === "E" &&
    record.Version === "4.0" &&
    moment(record.Fecha).isAfter("2022-12-31");

  if (isIngreso || isPago || isEgreso) {
    return false;
  } else {
    return true;
  }
}
