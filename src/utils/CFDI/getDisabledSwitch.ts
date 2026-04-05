import { CFDI_Types } from "@constants/Enums";
import moment from "moment";

export default function getDisableSwitch(tab: CFDI_Types, record: CFDI) {
  const conditionsPerTab = {
    I: !(record.MetodoPago === "PUE" && record.Version === "4.0"),
    E: !(record.Version === "4.0" && moment(record.Fecha).isAfter("2022-12-31")),
    T: true,
    N: true,
    P: !(record.Version === "4.0"),
  };

  return conditionsPerTab[tab];
}
