import { RootState, AppThunkDispatch } from "@store/store";
import { connect } from "react-redux";
import {
  closeISRExportBanner,
  getISRCFDIsAction,
  getISRTotalsAction,
  getISRTotalsDeductionsAction,
  updateISRCFDIAction,
  updateISRPercentageDeductionsAction,
} from "../_state/ISRSlice";
import { exportISRTable, updateISRDoctosAction } from "../_state/actions";
import {
  IExportISRTable,
  ISRCFDIsPayload,
  ISRTotalsPayload,
  ISRUpdateCFDIPayload,
  ISRUpdateDoctosPayload,
  ISRUpdatePayload,
} from "../_types/ISRTypes";

const mapStateToProps = (state: RootState) => ({
  isr: state.isr,
  auth: state.auth,
  cfdi: {
    setPaymentSucceded: state.cfdi.setPaymentSucceded,
  },
  periodDates: state.common.periodDates,
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  actions: {
    getISRTotals: (payload: ISRTotalsPayload) => dispatch(getISRTotalsAction(payload)),
    getISRTotalsDeductions: (payload: ISRTotalsPayload) =>
      dispatch(getISRTotalsDeductionsAction(payload)),
    updatePercentageDeductions: (payload: ISRUpdatePayload) =>
      dispatch(updateISRPercentageDeductionsAction(payload)),
    getISRCFDIs: (payload: ISRCFDIsPayload) => dispatch(getISRCFDIsAction(payload)),
    updateISRCFDI: (payload: ISRUpdateCFDIPayload) => dispatch(updateISRCFDIAction(payload)),
    updateISRDoctos: (payload: ISRUpdateDoctosPayload) => dispatch(updateISRDoctosAction(payload)),
    exportISRTable: (payload: IExportISRTable) => dispatch(exportISRTable(payload)),
    closeBanner: () => dispatch(closeISRExportBanner()),
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector;
