import { put } from "@redux-saga/core/effects";
import { fetchISRTotalsAllTabs, updateISRPercentageDeductions } from "../_api/ISRApi";
import { getISRCFDIsErrorAction, getISRTotalsDeductionsSuccessAction } from "./ISRSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  ISRTotalsPayload,
  ISRUpdatePayload,
  ResponseTotalsDeductionsComplete,
} from "../_types/ISRTypes";

export function* updateISRPercentageDeductionsSaga({ payload }: PayloadAction<ISRUpdatePayload>) {
  try {
    const payload_data: ISRTotalsPayload = {
      company: payload.company,
      period: "2024-03-01",
      isr_topTab: "deductions",
      domain: [],
    };

    const response: ResponseTotalsDeductionsComplete = yield updateISRPercentageDeductions(payload);
    if (response) {
      const response_totals: ResponseTotalsDeductionsComplete = yield fetchISRTotalsAllTabs(
        payload_data
      );
      yield put(getISRTotalsDeductionsSuccessAction(response_totals));
    }
  } catch (error) {
    yield put(getISRCFDIsErrorAction(error as string));
  }
}
