import { ISRSelector } from "@pages/ISR/_state/ISRSlice";
import { cfdiSelector } from "@store/cfdiSlice";
import { ivaSelector } from "@store/ivaSlice";
import { useSelector } from "react-redux";

export const useDisableButtonsTaxes = () => {
    const { isFetching } = useSelector(cfdiSelector);
    const { isFetchingTotals: isIvaFetching, isFetchingDoctos } = useSelector(ivaSelector);
    const { fetchingTotals: isISRFetching, fetchingCFDIs: isIsrCFDIFetching } = useSelector(ISRSelector);
    return isIvaFetching || isISRFetching || isFetching || isIsrCFDIFetching || isFetchingDoctos;
}
