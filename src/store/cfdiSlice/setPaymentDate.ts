import { saveCFDIPaymentDate } from "@api/cfdi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store/store";
import { message } from "antd";

type In = {
  cfdiUUID: string;
  newPaymentDate: string;
  defaultPaymentDate: string;
  is_issued: boolean;
};

export const setPaymentDate = createAsyncThunk<void, In, { rejectValue: string; state: RootState }>(
  "cfdi/setPaymentDate",
  async (
    { cfdiUUID, newPaymentDate, defaultPaymentDate, is_issued },
    { rejectWithValue, getState }
  ) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in setPaymentDate: No company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }
    const defaultDateSplitted = defaultPaymentDate.includes("T")
      ? defaultPaymentDate.split("T")
      : defaultPaymentDate.split(" ");
    const dateSplitted = newPaymentDate.split("/");
    const dateWithTime = `${dateSplitted[2]}-${dateSplitted[0]}-${dateSplitted[1]}T${defaultDateSplitted[1]}`;

    const dateToSend = dateWithTime;
    try {
      await saveCFDIPaymentDate(company, cfdiUUID, dateToSend, is_issued);
      message.success("Se actualizó la fecha de pago del CFDI correctamente");
    } catch (error) {
      console.error("Unexpected error in setPaymentDate", error);
      return rejectWithValue("Error al actualizar la fecha de pago del CFDI");
    }
  }
);
