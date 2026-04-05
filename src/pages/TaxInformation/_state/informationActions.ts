import { createAction } from "@reduxjs/toolkit";
import {
  FETCH_INFORMATION_ACTION,
  UPDATE_INFORMATION_ACTION,
  LOADING_INFORMATION_ACTION,
  ERROR_INFORMATION_ACTION,
  FETCH_INFORMATION_ACTION_RETRY
} from "../_constants/informationConstants";

export const fetch_action_Information = createAction(
  FETCH_INFORMATION_ACTION,
  (payload: boolean) => {
    return {
      type: FETCH_INFORMATION_ACTION,
      error: false,
      payload,
    };
  }
);

export const fetch_action_Information_Retry = createAction(
  FETCH_INFORMATION_ACTION_RETRY,
  (payload: boolean) => {
    return {
      type: FETCH_INFORMATION_ACTION_RETRY,
      error: false,
      payload,
    };
  }
);

export const update_action_Information = createAction(
  UPDATE_INFORMATION_ACTION,
  (payload: boolean) => {
    return {
      type: UPDATE_INFORMATION_ACTION,
      error: false,
      payload,
    };
  }
);
export const loading_action_Information = createAction(
  LOADING_INFORMATION_ACTION,
  (payload: boolean) => {
    return {
      type: LOADING_INFORMATION_ACTION,
      error: false,
      payload,
    };
  }
);

export const error_action_Information = createAction(ERROR_INFORMATION_ACTION);
