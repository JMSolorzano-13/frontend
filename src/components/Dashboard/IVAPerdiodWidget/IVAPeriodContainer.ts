import { connect, ConnectedProps } from "react-redux";
import { AppThunkDispatch, RootState } from "@store/store";
import { getIVA } from "@store/ivaSlice/getIVA";

const mapStateToProps = (state: RootState) => ({
  iva: state.iva,
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  actions: {
    fetchIVA: (period: string) => {
      dispatch(getIVA({ payload: { period, fuzzy_search: "" } }));
    },
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector;
