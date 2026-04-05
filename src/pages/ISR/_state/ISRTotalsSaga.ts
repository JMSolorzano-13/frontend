import { put } from "@redux-saga/core/effects";
import { fetchISRTotals, fetchISRTotalsDeductions } from "../_api/ISRApi";
import {
  getISRCFDIsErrorAction,
  getISRTotalsSuccessAction,
  getISRTotalsDeductionsSuccessAction,
  getISRTotalsDeduccionsTabsSuccessAction,
} from "./ISRSlice";
import {
  ISRTotalsPayload,
  ISRTotalsResponseType,
  ISRTotalsResponseTypeDedcutions,
  ResponseTotalsDeductionsComplete,
} from "../_types/ISRTypes";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export function* getISRTotalsSaga({ payload: payload }: PayloadAction<ISRTotalsPayload>) {
  try {
    const response: ISRTotalsResponseType | ISRTotalsResponseTypeDedcutions = yield fetchISRTotals(
      payload
    );
    if (payload.isr_topTab === "incomes") {
      yield put(getISRTotalsSuccessAction(response));
    } else {
      yield put(getISRTotalsDeduccionsTabsSuccessAction(response));
    }
  } catch (err) {
    const error = err as AxiosError;
    const errorMessage = error?.message || "Ocurrió un error al cargar los CFDIs";

    yield put(getISRCFDIsErrorAction(errorMessage));
  }
}

export function* getISRTotalsDeductionsSaga({ payload: payload }: PayloadAction<ISRTotalsPayload>) {
  try {
    const response: ResponseTotalsDeductionsComplete = yield fetchISRTotalsDeductions(payload);
    yield put(getISRTotalsDeductionsSuccessAction(response));
  } catch (err) {
    const error = err as AxiosError;
    const errorMessage = error?.message || "Ocurrió un error al cargar los CFDIs";
    yield put(getISRCFDIsErrorAction(errorMessage));
  }
}
