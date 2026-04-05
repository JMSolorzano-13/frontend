import { CFDI_Types } from "@constants/Enums";
import { fieldsPerType } from "../_constants/ModalFields";

export function getFieldsToRequest(CFDITypeToRequest: CFDI_Types) {
  return fieldsPerType[CFDITypeToRequest];
}
