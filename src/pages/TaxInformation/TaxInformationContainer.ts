import { connect, ConnectedProps } from "react-redux";
import { AppThunkDispatch, RootState } from "@store/store";
import {
  fetch_action_Information,
  update_action_Information,
  loading_action_Information,
  fetch_action_Information_Retry,
} from "./_state/informationActions";

const mapStateToProps = (state: RootState) => ({
  response: state.taxinformation.response,
  loading_tab: state.taxinformation.loading_tab,
  requesting_from_sat: state.taxinformation.requesting_from_sat,
  requesting_from_sat_retry: state.taxinformation.requesting_from_sat_retry,
  sqs_executable:  state.taxinformation.sqs_executable,
  document_received:  state.taxinformation.document_received,
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  actions: {
    fetchInformation: (payload: boolean) => {
      dispatch(fetch_action_Information(payload));
    },
    fetchInformationretry: (payload: boolean) => {
      dispatch(fetch_action_Information_Retry(payload));
    },
    updateInformation: (payload: boolean) => {
      dispatch(update_action_Information(payload));
    },
    loadingInformation: (payload: boolean) => {
      dispatch(loading_action_Information(payload));
    },
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector;
