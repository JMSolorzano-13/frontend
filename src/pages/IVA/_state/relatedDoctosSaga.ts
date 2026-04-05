import { fetchDoctoRelacionados } from "@api/iva";
import { store } from "@store/store";
import { put } from "redux-saga/effects";
import { RelatedDocto } from "../_types/RelatedDocsTable";
import {
  FETCH_DOCTO_RELACIONADOS_ERROR_ACTION,
  FETCH_DOCTO_RELACIONADOS_SUCCESS_ACTION,
} from "./ivaConstants";
import { FetchDoctosType } from "../_types/StateTypes";
import { AnyAction } from "@reduxjs/toolkit";
interface IFetchDoctosSaga extends AnyAction {
  payload: FetchDoctosType;
  error: boolean;
}
export type RelatedDoctoResponseType = {
  doctoRelacionados: RelatedDocto[];
  hasNextPage: boolean;
  totalRecords: number;
};
export function* relatedDoctosSaga({ payload }: IFetchDoctosSaga) {
  try {
    const { company } = yield store.getState().auth;
    const datesSplitted = payload.dates.split("|");
    const datesDomain: DomainItem[] = [
      ["cfdi_related.TipoDeComprobante", "=", "I"],
      ["cfdi_related.from_xml", "=", true],
      ["cfdi_related.Estatus", "=", true],
      ["Estatus", "=", true],
      ["FechaPago", ">=", datesSplitted[0].slice(0, -1)],
      ["FechaPago", "<", datesSplitted[1].slice(0, -1)],
      ["ExcludeFromIVA", "=", false],
    ];
    payload.options.domain = [...datesDomain];
    const response: RelatedDoctoResponseType = yield fetchDoctoRelacionados(
      company,
      payload.options
    );
    yield put({
      type: FETCH_DOCTO_RELACIONADOS_SUCCESS_ACTION,
      payload: response,
      error: false,
    });
  } catch (error) {
    yield put({
      type: FETCH_DOCTO_RELACIONADOS_ERROR_ACTION,
      payload: "Error al obtener los documentos relacionados",
      error: true,
    });
  }
}
