import { fetchRegimeCatalogue } from "@api/invoice";
import { createAsyncThunk } from "@reduxjs/toolkit";

type Out = {
  taxRegimeCatalogue: regimeCatalogue;
};

export const getRegimeCatalogue = createAsyncThunk<Out, void, { rejectValue: string }>(
  "invoice/getRegimeCatalogue",
  async (_, { rejectWithValue }) => {
    try {
      const { catalogue } = await fetchRegimeCatalogue();
      return {
        taxRegimeCatalogue: catalogue,
      };
    } catch (error) {
      console.error("Unexpected error in getRegimeCatalogue: ", error);
      return rejectWithValue("Error al obtener el catalogo de Régimen fiscal");
    }
  }
);
