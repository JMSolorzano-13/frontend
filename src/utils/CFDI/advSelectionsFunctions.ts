import { CFDI_Types } from "@constants/Enums";
import {
  advSelections,
  ingressADVSelections,
  payrollADVSelections,
  paymentADVSelectionsV2,
  egressADVSelections,
} from "./advSelections";

type getADVSelectionsProps = {
  tab: CFDI_Types;
  moduleId: CFDIModule;
};

export function getADVSelections({ tab, moduleId }: getADVSelectionsProps) {
  if (tab === "I" && moduleId !== "efos") {
    return ingressADVSelections;
  } else if (tab === "E" && moduleId !== "efos") {
    return egressADVSelections;
  } else if (tab === "N" && moduleId !== "efos") {
    return payrollADVSelections;
  } else if (tab === "P" && moduleId != "efos") {
    return paymentADVSelectionsV2;
  }
  return advSelections;
}
