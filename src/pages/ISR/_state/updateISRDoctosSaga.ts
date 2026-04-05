import { PayloadAction } from "@reduxjs/toolkit";
import { ISRUpdateDoctosPayload } from "../_types/ISRTypes";
import { put } from "redux-saga/effects";
import { StringColorFormat } from "@faker-js/faker";
import { fetchISRUpdateDoctos } from "../_api/ISRApi";
import { updateISRDoctosErrorAction, updateISRDoctosSuccessAction } from "./ISRSlice";

export function* updateISRDoctosSaga({ payload: payload }: PayloadAction<ISRUpdateDoctosPayload>) {
  try {
    yield fetchISRUpdateDoctos(payload);
    yield put(updateISRDoctosSuccessAction());
  } catch (error) {
    yield put(updateISRDoctosErrorAction(error as StringColorFormat));
  }
}
