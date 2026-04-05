import { PayloadAction } from "@reduxjs/toolkit";
import { ISRUpdateCFDIPayload } from "../_types/ISRTypes";
import { fetchISRUpdateCFDI } from "../_api/ISRApi";
import { updateISRCFDIErrorAction, updateISRCFDISuccessAction } from "./ISRSlice";
import { put } from "redux-saga/effects";
import { AxiosError } from "axios";

export function* ISRUpdateCFDIsaga({ payload: payload }: PayloadAction<ISRUpdateCFDIPayload>) {
  try {
    yield fetchISRUpdateCFDI(payload);
    yield put(updateISRCFDISuccessAction());
  } catch (err) {
    const error = err as AxiosError;
    const errorMessage =
      (error.response?.data as { message: string })?.message ??
      "Ocurrió un error al actualizar los CFDIs.";
    yield put(updateISRCFDIErrorAction(errorMessage));
  }
}
