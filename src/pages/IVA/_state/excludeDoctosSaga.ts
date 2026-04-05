import { put } from "redux-saga/effects";
import {
  FETCH_EXCLUDE_DOCTOS_ERROR_ACTION,
  FETCH_EXCLUDE_DOCTOS_SUCCESS_ACTION,
} from "./ivaConstants";
// import { store } from "@store/store";
import { fetchSetExclude } from "@api/iva";

export function* excludeDoctosSaga({ payload }: any) {
  try {
    // const { company } = yield store.getState().auth;
    const doctos_to_exclude = payload;

    const jsonBody = doctos_to_exclude;

    yield fetchSetExclude(jsonBody);

    yield put({
      type: FETCH_EXCLUDE_DOCTOS_SUCCESS_ACTION,
      payload: "Related doctos, excluded/included succesfully",
      error: false,
    });
  } catch (error) {
    yield put({
      type: FETCH_EXCLUDE_DOCTOS_ERROR_ACTION,
      payload: "Error al excluir/incluir los documentos relacionados",
      error: true,
    });
  }
}
