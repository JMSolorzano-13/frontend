import { fetchProducts } from "@api/sales";
import { createAsyncThunk } from "@reduxjs/toolkit";

type Out = {
  products: Product[];
  productsToDisplay: Product[];
  trialProduct: Product | null;
  extraUsersProduct: Product | null;
  highVolumeProduct: Product | null;
  addProduct: Product | null;
};

export const getProducts = createAsyncThunk<Out, void, { rejectValue: string }>(
  "sales/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { products } = await fetchProducts();

      const envProdsToDisplayIds = import.meta.env.VITE_REACT_APP_PRODUCT_DISPLAYS;
      const envProdExtraUsersId = import.meta.env.VITE_REACT_APP_PRODUCT_EXTRAUSERS;
      const envProdHighVolumeId = import.meta.env.VITE_REACT_APP_PRODUCT_HIGHVOLUME;
      const envProdTrialId = import.meta.env.VITE_REACT_APP_PRODUCT_TRIAL;
      const envProdADD = import.meta.env.VITE_REACT_APP_PRODUCT_ADD;

      if (
        !envProdsToDisplayIds ||
        !envProdExtraUsersId ||
        !envProdHighVolumeId ||
        !envProdTrialId ||
        !envProdADD
      ) {
        return {
          products,
          productsToDisplay: [],
          trialProduct: null,
          extraUsersProduct: null,
          highVolumeProduct: null,
          addProduct: null,
        };
      }

      const envProdsToDisplayIdsList = envProdsToDisplayIds.split(",");

      const productsToDisplay: Product[] = [];
      let extraUsersProduct: Product | null = null;
      let highVolumeProduct: Product | null = null;
      let trialProduct: Product | null = null;
      let addProduct: Product | null = null;

      products.forEach((prod) => {
        if (envProdsToDisplayIdsList?.includes(prod.identifier)) {
          productsToDisplay.push(prod);
        }

        if (prod.identifier === envProdExtraUsersId) {
          extraUsersProduct = prod;
        } else if (prod.identifier === envProdHighVolumeId) {
          highVolumeProduct = prod;
        } else if (prod.identifier === envProdTrialId) {
          trialProduct = prod;
        } else if (prod.identifier === envProdADD) {
          addProduct = prod;
        }
      });

      return {
        products,
        productsToDisplay,
        extraUsersProduct,
        highVolumeProduct,
        trialProduct,
        addProduct,
      };
    } catch (error) {
      console.error("Unexpected error in getProducts: ", error);
      return rejectWithValue("Error al obtener los productos");
    }
  }
);
