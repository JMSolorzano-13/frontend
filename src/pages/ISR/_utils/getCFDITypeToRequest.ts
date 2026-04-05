import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { ISRRecordType, TopTabSectionType } from "../_types/ISRTypes";
import { CFDI_Types } from "@constants/Enums";

export default function getCFDITypeToRequest(
  record: ISRRecordType | CFDI | IVACFDI | undefined,
  isPayment: boolean,
  topTab: TopTabSectionType
) {
  if (!record) {
    return CFDI_Types.INGRESS;
  }

  // Aparentemente el cfdi_origin puede ser un array o un objeto
  if (Array.isArray(record.cfdi_origin)) {
    return record?.cfdi_origin[0]?.TipoDeComprobante as CFDI_Types;
  } else if (isPayment && topTab === "deductions") {
    return record?.cfdi_origin?.TipoDeComprobante as CFDI_Types;
  }

  return record?.TipoDeComprobante as CFDI_Types;
}
