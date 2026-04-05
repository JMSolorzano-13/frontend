import http from "./_http";

export const fetchRegimeCatalogue = async () => {
  const res = await http.get("/RegimenFiscal");
  const catalogue = res.data;

  return { catalogue };
};

export const setFiscalData = async (data: invoiceData) => {
  const payload = {
    regimen_fiscal_id: Number(data.regimen_fiscal_id),
    nombre: data.nombre,
    rfc: data.rfc,
    cp: data.cp,
    email: data.email,
  };
  const res = await http.post("/User/update_fiscal_data", payload);
  return res.data;
};

export const fetchFiscalData = async () => {
  const res = await http.get("/User/update_fiscal_data");
  const fiscalData = res.data;

  return { fiscalData };
};
