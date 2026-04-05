import { UpdateUUIDsType } from "@pages/IVA/_types/StateTypes";
import { DoctosToUpdateType, UUIDsToUpdateType } from "../_types/ISRTypes";

export default function getTotalsToIncludeExclude(
  uuids: UUIDsToUpdateType | UpdateUUIDsType,
  doctoUUIDs: DoctosToUpdateType
) {
  // Get the CFDIs to include and exclude
  const uuidsToExclude: string[] = [];
  const uuidsToInclude: string[] = [];

  uuids.map((uuid) => {
    if (uuid.currentValue === false) {
      uuidsToExclude.push(uuid.uuid);
    } else {
      uuidsToInclude.push(uuid.uuid);
    }
  });

  // Get the doctos to include and exclude
  const doctoUUIDsToExclude: string[] = [];
  const doctoUUIDsToInclude: string[] = [];

  doctoUUIDs?.map((docto) => {
    if (docto.currentValue === false) {
      doctoUUIDsToExclude.push(docto.uuid);
    } else {
      doctoUUIDsToInclude.push(docto.uuid);
    }
  });

  const bothHave = uuidsToExclude.length > 0 && uuidsToInclude.length > 0;
  const bothDoctosHave = doctoUUIDsToExclude.length > 0 && doctoUUIDsToInclude.length > 0;

  // Message to exclude CFDI
  const excludeMsg =
    uuidsToExclude.length > 0
      ? `${uuidsToExclude.length} CFDI${isPlural(uuidsToExclude)} seleccionado${isPlural(
          uuidsToExclude
        )} para excluir`
      : "";

  // Message to include CFDI
  const includeMsg =
    uuidsToInclude.length > 0
      ? `${uuidsToInclude.length} CFDI${isPlural(uuidsToInclude)} seleccionado${isPlural(
          uuidsToInclude
        )} para incluir`
      : "";

  // Message to exclude doctos
  const excludeDoctoMsg =
    doctoUUIDsToExclude.length > 0
      ? `${doctoUUIDsToExclude.length} pago${isPlural(doctoUUIDsToExclude)} (documento${isPlural(
          doctoUUIDsToExclude
        )} relacionado${isPlural(doctoUUIDsToExclude)}) seleccionado${isPlural(
          doctoUUIDsToExclude
        )} para excluir`
      : "";

  // Message to include doctos
  const includeDoctoMsg =
    doctoUUIDsToInclude.length > 0
      ? `${doctoUUIDsToInclude.length} pago${isPlural(doctoUUIDsToInclude)} (documento${isPlural(
          doctoUUIDsToInclude
        )} relacionado${isPlural(doctoUUIDsToInclude)}) seleccionado${isPlural(
          doctoUUIDsToInclude
        )} para incluir`
      : "";

  // Build message
  let message = "";

  if (!bothHave && !bothDoctosHave) {
    // Check posible combinations if we don't have both actions in CFDI and doctos
    if (uuidsToExclude.length > 0 && doctoUUIDsToInclude.length > 0) {
      // We need to exclude at least one CFDI and include at least one docto
      message = `${excludeMsg} - ${includeDoctoMsg}`;
    } else if (uuidsToInclude.length > 0 && doctoUUIDsToExclude.length > 0) {
      // We need to include at least one CFDI and exclude at least one docto
      message = `${includeMsg} - ${excludeDoctoMsg}`;
    } else if (uuidsToInclude.length > 0 && doctoUUIDsToInclude.length > 0) {
      // We need to include at least one CFDI and also include at least one docto
      message = `${includeMsg} - ${includeDoctoMsg}`;
    } else if (uuidsToExclude.length > 0 && doctoUUIDsToExclude.length > 0) {
      // We need to exclude at least one CFDI and also exclude at least one docto
      message = `${excludeMsg} - ${excludeDoctoMsg}`;
    } else {
      // We need to exclude or include at least one thing
      message = excludeMsg || includeMsg || excludeDoctoMsg || includeDoctoMsg;
    }
  } else if (bothHave && !bothDoctosHave) {
    // CFDI have items to exclude and include and just one docto needs to be excluded or included
    message = `${excludeMsg} - ${includeMsg} - ${excludeDoctoMsg || includeDoctoMsg}`;
  } else if (!bothHave && bothDoctosHave) {
    // Docto have items to exclude and include and just one CFDI needs to be excluded or included
    message = `${excludeMsg || includeMsg} - ${excludeDoctoMsg} - ${includeDoctoMsg}`;
  } else if (bothHave && bothDoctosHave) {
    // CFDI and docto have items to exclude and include
    message = `${excludeMsg} - ${includeMsg} - ${excludeDoctoMsg} - ${includeDoctoMsg}`;
  }

  return `${message} - Haz clic para confirmar y actualizar los totales`;
}

function isPlural(array: string[]) {
  return array.length > 1 ? "s" : "";
}
