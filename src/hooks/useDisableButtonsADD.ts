import { addSelector } from "@store/addSlice";
import { useSelector } from "react-redux";

export const useDisableButtonsADD = () => {
    const { loadingCFDIs, loadingTotals } = useSelector(addSelector)
    return loadingCFDIs || loadingTotals;
}