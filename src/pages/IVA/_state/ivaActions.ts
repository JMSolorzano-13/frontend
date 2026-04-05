import { createAction } from "@reduxjs/toolkit";
import {
  FETCH_DOCTO_RELACIONADOS_ACTION,
  FETCH_EXCLUDE_DOCTOS_ACTION,
  FETCH_IVA_ACTION,
  FETCH_IVA_ACTIONFuzzy,
} from "./ivaConstants";
import { FetchDoctosType } from "../_types/StateTypes";

interface Props {
  period: string;
  fuzzy_search: string;
}

export const fetchIVAAction = createAction(FETCH_IVA_ACTION, (payload: Props) => {
  return {
    type: FETCH_IVA_ACTION,
    payload,
    error: false,
  };
});

export const fetchIVAActionFuzzy = createAction(FETCH_IVA_ACTIONFuzzy, (payload: Props) => {
  return {
    type: FETCH_IVA_ACTIONFuzzy,
    payload,
    error: false,
  };
});


export const fetchDoctoRelacionadosAction = createAction(
  FETCH_DOCTO_RELACIONADOS_ACTION,
  (payload: FetchDoctosType) => {
    return {
      type: FETCH_DOCTO_RELACIONADOS_ACTION,
      payload,
      error: false,
    };
  }
);
export const fetchExcludeDoctosAction = createAction(FETCH_EXCLUDE_DOCTOS_ACTION, (payload) => {
  return {
    type: FETCH_EXCLUDE_DOCTOS_ACTION,
    payload,
    error: false,
  };
});
