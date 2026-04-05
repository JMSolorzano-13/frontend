import { ADD_CFDI_Types, Tables } from "@constants/Enums";
import {
  ADD_ALL_ISSUED_DEFAULT_COLUMNS,
  ADD_ALL_RECEIVED_DEFAULT_COLUMNS,
  ADD_ISSUED_DEFAULT_COLUMNS,
  ADD_RECEIVED_DEFAULT_COLUMNS,
} from "../_constants/ADDDefaultColumns";

const defaultADDIssuedColumnsPerTab = {
  ALL: ADD_ALL_ISSUED_DEFAULT_COLUMNS,
  I: ADD_ISSUED_DEFAULT_COLUMNS,
  E: ADD_ISSUED_DEFAULT_COLUMNS,
  T: ADD_ISSUED_DEFAULT_COLUMNS,
  N: ADD_ALL_ISSUED_DEFAULT_COLUMNS,
  P: ADD_ALL_ISSUED_DEFAULT_COLUMNS,
};

export function getDefaultADDIssuedColumns(tab: ADD_CFDI_Types): TableLayout {
  return defaultADDIssuedColumnsPerTab[tab];
}

const defaultADDReceivedColumnsPerTab = {
  ALL: ADD_ALL_RECEIVED_DEFAULT_COLUMNS,
  I: ADD_RECEIVED_DEFAULT_COLUMNS,
  E: ADD_RECEIVED_DEFAULT_COLUMNS,
  T: ADD_RECEIVED_DEFAULT_COLUMNS,
  N: ADD_ALL_RECEIVED_DEFAULT_COLUMNS,
  P: ADD_ALL_RECEIVED_DEFAULT_COLUMNS,
};

export function getDefaultADDReceivedColumns(tab: ADD_CFDI_Types): TableLayout {
  return defaultADDReceivedColumnsPerTab[tab];
}

const defaultADDIssuedTableIDs = {
  ALL: Tables.ADD_ALL_ISSUED,
  I: Tables.ADD_ISSUED,
  E: Tables.ADD_ISSUED,
  T: Tables.ADD_ISSUED,
  N: Tables.ADD_ALL_ISSUED,
  P: Tables.ADD_ALL_ISSUED,
};

export function getADDIssuedTableID(tab: ADD_CFDI_Types) {
  return defaultADDIssuedTableIDs[tab];
}

const defaultADDReceivedTableIDs = {
  ALL: Tables.ADD_ALL_RECEIVED,
  I: Tables.ADD_RECEIVED,
  E: Tables.ADD_RECEIVED,
  T: Tables.ADD_RECEIVED,
  N: Tables.ADD_ALL_RECEIVED,
  P: Tables.ADD_ALL_RECEIVED,
};

export function getADDReceivedTableID(tab: ADD_CFDI_Types) {
  return defaultADDReceivedTableIDs[tab];
}
