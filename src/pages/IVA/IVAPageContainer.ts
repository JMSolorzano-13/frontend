import { connect, ConnectedProps } from "react-redux";
import { AppThunkDispatch, RootState } from "@store/store";
import { getCFDIs } from "@store/cfdiSlice/getCFDIs";
import { closeIVAExportBanner } from "@store/cfdiSlice";
import { setCFDIConfig } from "@store/cfdiSlice/setCFDIConfig";
import { FetchDoctosType, FetchFDIsType, updateIVACFDIPayloadType } from "./_types/StateTypes";
import {
  fetchDoctoRelacionadosAction,
  fetchExcludeDoctosAction,
  fetchIVAAction,
  fetchIVAActionFuzzy,
} from "./_state/ivaActions";
import { getExcludedCFDIs } from "@store/ivaSlice/getExcluded";
import { ISRUpdateDoctosPayload } from "@pages/ISR/_types/ISRTypes";

const mapStateToProps = (state: RootState) => ({
  iva: state.iva,
  auth: state.auth,
  cfdi: {
    ivaCFDIs: state.cfdi.ivaCFDIs,
    isFetching: state.cfdi.isFetching,
    IVAExportBanner: state.cfdi.IVAExportBanner,
    updateSucceded: state.cfdi.updateCFDIConfigSucceded,
    setPaymentSucceded: state.cfdi.setPaymentSucceded,
  },
  periodDates: state.common.periodDates,
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  actions: {
    fetchIVA: (period: string, fuzzy_search: string) => {
      dispatch(fetchIVAAction({ period, fuzzy_search }));
    },
    fetchIVAFuzzy: (period: string, fuzzy_search: string) => {
      dispatch(fetchIVAActionFuzzy({ period, fuzzy_search }));
    },
    fetchCFDIs: ({ ...rest }: FetchFDIsType) => {
      dispatch(getCFDIs({ ...rest }));
    },
    fetchDoctoRelacionados: ({ ...rest }: FetchDoctosType) => {
      dispatch(fetchDoctoRelacionadosAction({ ...rest }));
    },
    getExcludedCFDIs: (tab: TabIVAType, options: SearchOptions) => {
      dispatch(getExcludedCFDIs({ tab, options }));
    },
    closeBanner: () => {
      dispatch(closeIVAExportBanner());
    },
    setCFDIConfig: ({ uuids }: updateIVACFDIPayloadType) => {
      dispatch(setCFDIConfig({ uuidsToModify: uuids }));
    },
    excludeDoctos: (doctos: ISRUpdateDoctosPayload) => {
      dispatch(fetchExcludeDoctosAction(doctos));
    },
  },
});

const Container = connect(mapStateToProps, mapDispatchToProps);

export type PropsFromRedux = ConnectedProps<typeof Container>;

export default Container;
