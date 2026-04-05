import { CFDI_Types } from "@constants/Enums";
import { getFieldsToRequest } from "./getFieldsToRequest";

type PropsType = {
  CFDITypeToRequest: CFDI_Types;
};

export default function getCurrentDomain(props: PropsType) {
  const { CFDITypeToRequest } = props;
  const fieldsToRequest = getFieldsToRequest(CFDITypeToRequest);

  return fieldsToRequest;
}
