import { put, SagaReturnType } from "redux-saga/effects";
import { AnyAction } from "redux";
import { downloadISRTable } from "../_api/ISRApi";
import { EXPORT_ISR_TABLE_SUCCESS, EXPORT_ISR_TABLE_ERROR } from "../_constants/isrStateConstants";
import { store } from "@store/store";
import { IExportISRTable, ExportPayloadComplete } from "../_types/ISRTypes";
import {
  getExportISRDisplayNameDeductions,
  getExportISRName,
  getExportISRNameDeductions,
} from "@utils/getExportFileName";
import getISRDomain from "../_utils/getISRDomain";
import { getFieldsISRDeductions } from "../_utils/ISRFieldsDeductionsExport";

interface IDownloadISRSaga extends AnyAction {
  payload: IExportISRTable;
  error: boolean;
}

type TDownloadISRReturnType = SagaReturnType<typeof downloadISRTable>;

export function* getISRTableExports({ payload }: IDownloadISRSaga) {
  const { period, isr, issued, yearly, internalTab, tab, topTab, date, periodType } = payload;
  try {
    const { company, rfc } = yield store.getState().auth;

    const file_name_incomes = getExportISRName(rfc, {
      period,
      isr,
      issued,
      yearly,
    });

    const file_name_deductions = getExportISRNameDeductions(rfc, {
      period,
      tab,
      internalTab,
      yearly,
    });

    const display_name_deductions = getExportISRDisplayNameDeductions(rfc, {
      period,
      tab,
      internalTab,
      yearly,
    });

    const domain = getISRDomain({
      company,
      topTab,
      tab,
      internalTab,
      date,
      periodType,
    });

    const fields_Deductions = getFieldsISRDeductions(tab, internalTab);

    const newPayloadIncomes: ExportPayloadComplete = {
      company_identifier: company,
      file_name: file_name_incomes,
      export_data: {
        file_name: undefined,
        type: "",
      },
      ...payload,
    };

    const newPayloadDeductions: ExportPayloadComplete = {
      domain,
      file_name: file_name_deductions,
      topTab: "deductions",
      tab: tab,
      period: period,
      internalTab: internalTab,
      fields: fields_Deductions,
      isr: "all",
      issued: false,
      yearly: false,
      export_data: {
        file_name: undefined,
        type: "",
      },
      date: null,
      periodType: null,
      company_identifier: company,
      display_name_deductions,
    };

    const response: TDownloadISRReturnType = yield downloadISRTable(
      topTab === "incomes" ? newPayloadIncomes : newPayloadDeductions
    );
    yield put({
      type: EXPORT_ISR_TABLE_SUCCESS,
      payload: response,
      error: false,
    });
  } catch (error) {
    yield put({
      type: EXPORT_ISR_TABLE_ERROR,
      error: true,
    });
  }
}
