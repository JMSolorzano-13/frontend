import { rest, RestRequest } from "msw";

const base_url = import.meta.env.VITE_REACT_APP_BASE_URL;

type GetCompaniesPayload = {
  domain: Domain[];
  fields: string[];
};

// 200
export const totalDeduccionesPagos_200 = [
  // POST
  rest.post(
    `${base_url}/CFDI/total_deducciones_pagos`,
    async (req: RestRequest<GetCompaniesPayload>, rest, ctx) => {
      return rest(
        ctx.status(200),
        ctx.json({
          ConteoCFDIs: 100,
          BaseIVA16: 1223.08,
          BaseIVA8: 234.834,
          BaseIVA0: 6743.3,
          BaseIVAExento: 23.02,
          Neto: 48.23,
          RetencionesISR: 65.9,
        })
      );
    }
  ),
];


// 500
export const totalDeduccionesPagos_500  = [
  // POST
  rest.post(
    `${base_url}/CFDI/total_deducciones_pagos`,
    async (req: RestRequest<GetCompaniesPayload>, rest, ctx) => {
      return rest(
        ctx.status(500),
        ctx.json({
          error: "Internal Server Error",
        })
      );
    }
  ),
];