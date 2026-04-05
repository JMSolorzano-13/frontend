import { put, SagaReturnType } from "redux-saga/effects";
import { store } from "@store/store";
import {
  FETCH_INFORMATION_ACTION_ERROR,
  FETCH_INFORMATION_ACTION_ERROR_RETRY,
  FETCH_INFORMATION_ACTION_SUCCESS,
  FETCH_INFORMATION_ACTION_SUCCESS_RETRY,
  UPDATE_INFORMATION_ACTION_ERROR,
  UPDATE_INFORMATION_ACTION_SUCCESS,
} from "../_constants/informationConstants";
import { getTAXInformation, updateTAXInformation } from "@api/information";
import { AnyAction } from "@reduxjs/toolkit";

interface IFetchSaga extends AnyAction {
  payload: boolean;
  error: boolean;
}
type TGetInformation = SagaReturnType<typeof getTAXInformation>;

export function* fetchSagaInformation({ payload }: IFetchSaga) {
  try {
    const { company, rfc, oldCompany } = yield store.getState().auth;
    const response: TGetInformation = yield getTAXInformation(company, oldCompany, payload, rfc);

    yield put({
      type: FETCH_INFORMATION_ACTION_SUCCESS,
      payload: response,
      error: false,
    });
  } catch (error) {
    yield put({
      type: FETCH_INFORMATION_ACTION_ERROR,
      error: true,
    });
  }
}

export function* fetchSagaInformationretry({ payload }: IFetchSaga) {
  try {
    const { company, rfc, oldCompany } = yield store.getState().auth;
    const response: TGetInformation = yield getTAXInformation(company, oldCompany, payload, rfc);
    yield put({
      type: FETCH_INFORMATION_ACTION_SUCCESS_RETRY,
      payload: response,
      error: false,
    });
  } catch (error) {
    yield put({
      type: FETCH_INFORMATION_ACTION_ERROR_RETRY,
      error: true,
    });
  }
}

interface IUpdateSaga extends AnyAction {
  payload: boolean;
  error: boolean;
}
type TUpdateInformation = SagaReturnType<typeof getTAXInformation>;

export function* updateSagaInformation({ payload }: IUpdateSaga) {
  try {
    const { company, oldCompany } = yield store.getState().auth;
    const response: TUpdateInformation = yield updateTAXInformation(company, oldCompany, payload);
    yield put({
      type: UPDATE_INFORMATION_ACTION_SUCCESS,
      payload: response,
      error: false,
    });
  } catch (error) {
    yield put({
      type: UPDATE_INFORMATION_ACTION_ERROR,
      error: true,
    });
  }
}
