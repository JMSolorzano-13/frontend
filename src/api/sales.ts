import http from "./_http";

export const fetchProducts = async () => {
  const res = await http.get("/Product/get_all");
  const products = res.data.products as Product[];

  return {
    products,
  };
};

export const setLicense = async (
  workspace: string,
  products: {
    identifier: string;
    quantity: number;
  }[],
  prorateDate: number | null = null
) => {
  if (products.length < 1) throw new Error("Product list less than 1 item");

  const payload = {
    workspace_identifier: workspace,
    products,
    proration_date: prorateDate,
  };

  const res = await http.post("/License/set", payload);

  const invoiceUrl = res.data.invoice_url;

  return { invoiceUrl };
};

export const fetchLicense = async (workspace: string | null) => {
  if (!workspace) {
    throw new Error("No workspace for fetching license");
  }

  const payload = {
    workspace_identifier: workspace,
  };

  const response = await http.post("/License", payload);
  return response.data as License;
};
