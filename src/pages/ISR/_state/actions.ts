import { createAction } from "@reduxjs/toolkit";
import { EXPORT_ISR_TABLE, UPDATE_ISR_DOCTOS_ACTION } from "../_constants/isrStateConstants";
import type { IExportISRTable, ISRUpdateDoctosPayload } from "../_types/ISRTypes";

export const exportISRTable = createAction(EXPORT_ISR_TABLE, (payload: IExportISRTable) => {
  return {
    type: EXPORT_ISR_TABLE,
    payload,
    error: false,
  };
});

export const updateISRDoctosAction = createAction(
  UPDATE_ISR_DOCTOS_ACTION,
  (payload: ISRUpdateDoctosPayload) => {
    return {
      type: UPDATE_ISR_DOCTOS_ACTION,
      payload,
      error: false,
    };
  }
);
