import { ConnectedProps } from "react-redux";
import connector from "../_components/ISRPageContainer";
import {
  ISRRecordType,
  ISRTotalsResponseType,
  ISRTotalsResponseTypeDedcutions,
  ResponseTotalsDeductionsComplete,
} from "./ISRTypes";

export type ISRState = {
  ISRTotals: ISRTotalsResponseType | ISRTotalsResponseTypeDedcutions | null;
  ISRTotalsDeductions: ISRTotalsResponseType | ISRTotalsResponseTypeDedcutions | null;
  ISRTotalsDeductionsTable: ResponseTotalsDeductionsComplete | null;
  fetchingTotals: boolean;
  fetchingTotalsDeductions: boolean;
  fetchingTotalsDeductionsTabs: boolean;
  ISRTotalsError: string;
  ISRCFDIs: ISRRecordType[];
  ISRTotalCFDIs: number;
  fetchingCFDIs: boolean;
  ISRCFDIsError: string;
  isFetchingISRExports: boolean;
  showISRExportBanner: boolean;
  updateSucceded: boolean;
  isUpdatingCFDI: boolean;
  updateCFDIError: string;
  percentage: boolean;
};

export type ISRPropsFromRedux = ConnectedProps<typeof connector>;
