import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchIVAWidgetTotals } from "@api/iva";
import {
  getIVAAcreditableData,
  getIVAPeriodData,
  getIVATrasladadoData,
} from "@pages/Dashboard/widgets/IVAWidget/getIVADataToRender";

type Out = {
  ivaPeriodData: IvaPeriodWidget[] | null;
  ivaTrasladadoData: IvaTrasladadoWidget[] | null;
  ivaAcreditableData: IvaAcreditableWidget[] | null;
};

type In = {
  company: string;
  period: string;
};

export const getIVADashboard = createAsyncThunk<Out, In, { rejectValue: string; state: RootState }>(
  "cfdi/getIVADashboard",
  async ({ company, period }, { rejectWithValue, getState }) => {
    if (!company || !period) {
      console.error("Error in getNominalIncome: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }

    const rfc = getState().auth.rfc;

    try {
      const IVAtotals = await fetchIVAWidgetTotals(company, period);

      return {
        ivaPeriodData: getIVAPeriodData(IVAtotals, rfc as string),
        ivaTrasladadoData: getIVATrasladadoData(IVAtotals),
        ivaAcreditableData: getIVAAcreditableData(IVAtotals),
      };
    } catch (error: any) {
      console.error("Error in getNominalIncome:", error);
      return rejectWithValue(error);
    }
  }
);
