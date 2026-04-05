import { rest, RestRequest } from "msw";

const base_url = import.meta.env.VITE_REACT_APP_BASE_URL;

type GetCompaniesPayload = {
  domain: Domain[];
  fields: string[];
};

export const totalDeduccionesCFDI_200 = [
  // POST
  rest.post(
    `${base_url}/CFDI/total_deducciones_cfdi`,
    async (req: RestRequest<GetCompaniesPayload>, rest, ctx) => {
      return rest(
        ctx.status(200),
        ctx.json({
          ConteoCFDIs: 123,
          SubTotal: 443.3312,
          DescuentoMXN: 48934.34,
          NetoMXN: 10.1,
          RetencionesISRMXN: 323.223,
        })
      );
    }
  ),
];
