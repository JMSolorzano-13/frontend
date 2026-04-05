import { takeLatest } from "redux-saga/effects";

// Constant imports
import {
  FETCH_DOCTO_RELACIONADOS_ACTION,
  FETCH_EXCLUDE_DOCTOS_ACTION,
  FETCH_IVA_ACTION,
  FETCH_IVA_ACTIONFuzzy,
} from "@pages/IVA/_state/ivaConstants";
import {
  FETCH_ISR_CFDIS_ACTION,
  FETCH_ISR_TOTALS_ACTION,
  FETCH_ISR_TOTALS_DEDUCTIONS_ACTION,
  FETCH_UPDATE_ISR_CFDI_ACTION,
  EXPORT_ISR_TABLE,
  UPDATE_PERCENTAGE_DEDUCTIONS_ACTION,
  UPDATE_ISR_DOCTOS_ACTION,
} from "@pages/ISR/_constants/isrStateConstants";

// Sagas imports
import { fetchfuzzySaga, fetchSaga } from "@pages/IVA/_state/ivaSaga";
import {
  FETCH_INFORMATION_ACTION,
  FETCH_INFORMATION_ACTION_RETRY,
  UPDATE_INFORMATION_ACTION,
} from "@pages/TaxInformation/_constants/informationConstants";
import { getISRTotalsDeductionsSaga, getISRTotalsSaga } from "@pages/ISR/_state/ISRTotalsSaga";
import { updateISRPercentageDeductionsSaga } from "@pages/ISR/_state/ISRPercentage";
import { getISRCFDIsSaga } from "@pages/ISR/_state/ISRCFDIsSaga";
import { ISRUpdateCFDIsaga } from "@pages/ISR/_state/ISRUpdateCFDISaga";
import { getISRTableExports } from "@pages/ISR/_state/exportISRSaga";
import {
  fetchSagaInformation,
  fetchSagaInformationretry,
  updateSagaInformation,
} from "@pages/TaxInformation/_state/informationSaga";
import { relatedDoctosSaga } from "@pages/IVA/_state/relatedDoctosSaga";
import { excludeDoctosSaga } from "@pages/IVA/_state/excludeDoctosSaga";
import { updateISRDoctosSaga } from "@pages/ISR/_state/updateISRDoctosSaga";

function* rootSaga() {
  yield takeLatest(FETCH_IVA_ACTION, fetchSaga);
  yield takeLatest(FETCH_IVA_ACTIONFuzzy, fetchfuzzySaga);
  yield takeLatest(FETCH_INFORMATION_ACTION, fetchSagaInformation);
  yield takeLatest(FETCH_INFORMATION_ACTION_RETRY, fetchSagaInformationretry);
  yield takeLatest(UPDATE_INFORMATION_ACTION, updateSagaInformation);
  yield takeLatest(FETCH_ISR_TOTALS_ACTION, getISRTotalsSaga);
  yield takeLatest(FETCH_ISR_TOTALS_DEDUCTIONS_ACTION, getISRTotalsDeductionsSaga);
  yield takeLatest(UPDATE_PERCENTAGE_DEDUCTIONS_ACTION, updateISRPercentageDeductionsSaga);
  yield takeLatest(FETCH_ISR_CFDIS_ACTION, getISRCFDIsSaga);
  yield takeLatest(FETCH_UPDATE_ISR_CFDI_ACTION, ISRUpdateCFDIsaga);
  yield takeLatest(EXPORT_ISR_TABLE, getISRTableExports);
  yield takeLatest(FETCH_DOCTO_RELACIONADOS_ACTION, relatedDoctosSaga);
  yield takeLatest(FETCH_EXCLUDE_DOCTOS_ACTION, excludeDoctosSaga);
  yield takeLatest(UPDATE_ISR_DOCTOS_ACTION, updateISRDoctosSaga);
}

export default rootSaga;
