import { DoctosToUpdateType, ISRRecordType, UUIDsToUpdateType } from "../_types/ISRTypes";

export function getISRCheckedSwitch(
  uuids: UUIDsToUpdateType,
  doctos: DoctosToUpdateType,
  record: ISRRecordType,
  isPayment: boolean
) {
  if (!isPayment) {
    return uuids.some((u) => u.uuid === record.UUID) && !record?.ExcludeFromISR
      ? true
      : record?.ExcludeFromISR && !uuids.some((u) => u.uuid === record.UUID)
      ? true
      : false;
  } else {
    return doctos.some((u) => u.uuid === record.identifier) && !record?.ExcludeFromISR
      ? true
      : record?.ExcludeFromISR && !doctos.some((u) => u.uuid === record.identifier)
      ? true
      : false;
  }
}

export function setISRCheckedSwitch(
  record: ISRRecordType,
  uuids: UUIDsToUpdateType,
  setUUIDs: (val: UUIDsToUpdateType) => void,
  doctos: DoctosToUpdateType,
  setDoctos: (val: DoctosToUpdateType) => void,
  isPayment: boolean
) {
  if (!isPayment) {
    if (!uuids.some((u) => u.uuid === record.UUID)) {
      setUUIDs([...uuids, { uuid: record.UUID, currentValue: record?.ExcludeFromISR, is_issued: record.is_issued }]);
    } else {
      const newArray = uuids.filter((u) => u.uuid !== record.UUID);
      setUUIDs(newArray);
    }
  } else {
    if (!doctos.some((u) => u.uuid === record.identifier)) {
      setDoctos([...doctos, { uuid: record.identifier, currentValue: record?.ExcludeFromISR }]);
    } else {
      const newArray = doctos.filter((u) => u.uuid !== record.identifier);
      setDoctos(newArray);
    }
  }
}
