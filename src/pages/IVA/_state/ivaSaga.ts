import { put, SagaReturnType } from "redux-saga/effects";
import { AnyAction } from "redux";
import { getIVAForDashboard } from "@api/iva";
import { store } from "@store/store";
import { FETCH_IVA_ACTION_ERROR, FETCH_IVA_ACTION_ERRORFuzzy, FETCH_IVA_ACTION_SUCCESS, FETCH_IVA_ACTION_SUCCESSFuzzy } from "./ivaConstants";

interface IFetchSaga extends AnyAction {
  payload: {
    period: string;
    fuzzy_search: string;
  };
  error: boolean;
}
type TGetIVa = SagaReturnType<typeof getIVAForDashboard>;

export function* fetchSaga({ payload }: IFetchSaga) {
  try {
    const { company } = yield store.getState().auth;
    const response: TGetIVa = yield getIVAForDashboard(company, payload);
    yield put({
      type: FETCH_IVA_ACTION_SUCCESS,
      payload: response,
      error: false,
    });
  } catch (error) {
    yield put({
      type: FETCH_IVA_ACTION_ERROR,
      error: true,
    });
  }
}


export function* fetchfuzzySaga({ payload }: IFetchSaga) {
  try {
    const { company } = yield store.getState().auth;
    const response: TGetIVa = yield getIVAForDashboard(company, payload);
    yield put({
      type: FETCH_IVA_ACTION_SUCCESSFuzzy,
      payload: response,
      error: false,
    });
  } catch (error) {
    yield put({
      type: FETCH_IVA_ACTION_ERRORFuzzy,
      error: true,
    });
  }
}
