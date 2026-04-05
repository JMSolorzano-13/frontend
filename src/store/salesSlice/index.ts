import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getProducts } from "./getProducts";

interface SalesState {
  isFetchingProducts: boolean;
  productsError: string | null;
  products: Product[];
  productsToDisplay: Product[];
  extraUsersProduct: Product | null;
  highVolumeProduct: Product | null;
  trialProduct: Product | null;
  addProduct: Product | null;
  subNoCompany: boolean;
}

const initialState: SalesState = {
  isFetchingProducts: false,
  productsError: null,
  products: [],
  productsToDisplay: [],
  extraUsersProduct: null,
  highVolumeProduct: null,
  trialProduct: null,
  addProduct: null,
  subNoCompany: false,
};

export const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setSubNoCompany: (state, { payload }: { payload: { value: boolean } }) => {
      localStorage.setItem("subNoCompany", String(payload.value));
      state.subNoCompany = payload.value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, { payload }) => {
      state.isFetchingProducts = false;
      state.products = payload.products;
      state.productsToDisplay = payload.productsToDisplay;
      state.extraUsersProduct = payload.extraUsersProduct;
      state.highVolumeProduct = payload.highVolumeProduct;
      state.trialProduct = payload.trialProduct;
      state.addProduct = payload.addProduct;
    });
    builder.addCase(getProducts.pending, (state) => {
      state.isFetchingProducts = true;
      state.productsError = null;
    });
    builder.addCase(getProducts.rejected, (state, { payload }) => {
      state.isFetchingProducts = false;
      state.productsError = payload ?? null;
    });
  },
});

export const salesSelector = (state: RootState) => state.sales;
export const { setSubNoCompany } = salesSlice.actions;

export default salesSlice.reducer;
