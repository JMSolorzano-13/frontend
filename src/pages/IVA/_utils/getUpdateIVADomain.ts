import { IVACFDIsPayloadType, UpdateUUIDsType } from "../_types/StateTypes";

export default function getUpdateIVADomain(uuids: UpdateUUIDsType) {
  const uuidsToSend: IVACFDIsPayloadType = [];
  
  uuids.forEach((u) => {
    uuidsToSend.push({
      UUID: u.uuid,
      ExcludeFromIVA: !u.currentValue,
      is_issued: u.is_issued,
    });
  });

  return {
    cfdis: uuidsToSend,
  };
}

export function manageFilters(filters: any): false | DomainItem[] {
  const validate = Object.keys(filters).filter((i) => filters[i] !== null);
  if (validate) {
    return validate.map((i) => [i === "forma_pago_code" ? "FormaPago" : i, "in", filters[i]]);
  }
  return false;
}
