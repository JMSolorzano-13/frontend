import { put } from "@redux-saga/core/effects";
import { fetchISRCFDIs } from "../_api/ISRApi";
import { getISRCFDIsErrorAction, getISRCFDIsSuccessAction } from "./ISRSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { ISRCFDIResponseType, ISRCFDIsPayload } from "../_types/ISRTypes";

export function* getISRCFDIsSaga({ payload: payload }: PayloadAction<ISRCFDIsPayload>) {
  try {
    const response: ISRCFDIResponseType = yield fetchISRCFDIs(payload);
    yield put(getISRCFDIsSuccessAction(response));
  } catch (error) {
    yield put(getISRCFDIsErrorAction(error as string));
  }
}
