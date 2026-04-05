import { fetchPayrollModalContent } from "@api/cfdi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store/store";

type Out = {
  nada: null;
};

type In = {
  nada: string;
};

export const getPayrollContent = createAsyncThunk<
  Out,
  In,
  { rejectValue: string; state: RootState }
>("payroll/getPayrollContent", async (_, { rejectWithValue, getState }) => {
  const { company, rfc } = getState().auth;
  if (!company || !rfc) {
    console.error("Error in getPayrollContent: no company or rfc selected");
    return rejectWithValue("Sin compañía o RFC");
  }
  try {
    const payrollCall = await fetchPayrollModalContent();
    return {
      nada: payrollCall,
    };
  } catch (e) {
    console.error("Unexpected error in getPayrollContent: ", e);
    return rejectWithValue("Error al obtener los detalles del CFDI");
  }
});
