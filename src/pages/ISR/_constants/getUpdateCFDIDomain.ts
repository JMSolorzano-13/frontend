import { ISRCFDIsPayloadType, UUIDsToUpdateType } from "../_types/ISRTypes";

export default function getUpdateCFDIDomain(
  company: string | null,
  uuids: UUIDsToUpdateType,
) {
  const uuidsToSend: ISRCFDIsPayloadType = [];

  uuids.forEach((u) => {
    uuidsToSend.push({
      "UUID": u.uuid,
      "is_issued": u.is_issued,
      "ExcludeFromISR": !u.currentValue
    });
  });

  return {
    companyIdentifier: company,
    cfdis: uuidsToSend,
  };
}
