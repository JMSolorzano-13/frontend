import { createAsyncThunk } from "@reduxjs/toolkit";
import { exportIVATable } from "@api/iva";
import { RootState } from "@store/store";
import { getExportIVAName } from "@utils/getExportFileName";

type Out = {
  response: IVAResponse;
};

type In = {
  period: string;
  yearly: boolean;
  iva: IVAAPITYPE;
  issued: boolean;
  company_identifier: string;
  domain?: DomainItem;
  order_by: string;
};

export const getExportToExcel = createAsyncThunk<
  Out,
  In,
  { rejectValue: string; state: RootState }
>(
  "cfdi/export_to_excel",
  async (
    { company_identifier, issued, iva, period, yearly, domain, order_by },
    { rejectWithValue, getState }
  ) => {
    const { company, rfc } = getState().auth;
    if (!company || !rfc) {
      console.error("Error in getIVA: no company or rfc selected");
      return rejectWithValue("Sin compañía o RFC");
    }
    const file_name = getExportIVAName(rfc, {
      issued,
      iva,
      period,
    });
    try {
      const ivaResponse = await exportIVATable({
        company_identifier,
        issued,
        iva,
        period,
        yearly,
        file_name,
        domain,
        order_by,
      });
      return {
        response: ivaResponse,
      };
    } catch (error) {
      console.error("Unexpected error in getIVA: ", error);
      return rejectWithValue("Error al descargar el archivo de Excel");
    }
  }
);
