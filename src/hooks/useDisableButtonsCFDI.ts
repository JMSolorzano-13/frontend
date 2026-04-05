import { cfdiSelector } from "@store/cfdiSlice";
import { useSelector } from "react-redux";

export const useDisableButtonsCFDI = () => {
    const { isFetching, isFetchingTotals } = useSelector(cfdiSelector);
    return isFetching || isFetchingTotals;
}