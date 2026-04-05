import { ISRDoctosPayloadType } from "@pages/ISR/_types/ISRTypes";
import { updateDoctosType } from "../_types/StateTypes";

export function getUpdateDoctosDomain(
  companyIdentifier: string | null,
  doctoUUIDs: updateDoctosType,
  fieldToUpdate: string
) {
  const uuidsToSend: ISRDoctosPayloadType = [];

  doctoUUIDs.forEach((u) => {
    uuidsToSend.push({
      identifier: u.uuid,
      [fieldToUpdate]: !u.currentValue,
    });
  });

  return {
    company_identifier: companyIdentifier,
    cfdis: uuidsToSend,
  };
}
