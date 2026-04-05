import { rest, RestRequest } from "msw";

const base_url = import.meta.env.VITE_REACT_APP_BASE_URL;

type GetCompaniesPayload = {
  domain: Domain[];
  fields: string[];
};

export const total_get_isr = [
  // POST
  rest.post(
    `${base_url}/CFDI/get_isr`,
    async (req: RestRequest<GetCompaniesPayload>, rest, ctx) => {
      return rest(
        ctx.status(200),
        ctx.json({
          period: {
            incomes: {
              invoice_pue: {
                BaseIVA16: 1.09,
                BaseIVA8: 0.0,
                BaseIVA0: 0.0,
                BaseIVAExento: 0.0,
                RetencionesISRMXN: 0.0,
                qty: 294,
                total: 1557229.09,
              },
              payments: {
                BaseIVA16: 1.59,
                BaseIVA8: 0.0,
                BaseIVA0: 0.0,
                BaseIVAExento: 0.0,
                RetencionesISRMXN: 0.0,
                qty: 442,
                total: 3081840.59,
              },
              total: 99999.68,
              qty: 736,
              excluded_qty: 0,
              moved_qty: 0,
            },
            deductions: {
              invoice_pue: {
                BaseIVA16: 871790.61,
                BaseIVA8: 0.0,
                BaseIVA0: 0.0,
                BaseIVAExento: 0.0,
                RetencionesISRMXN: 158.75,
                qty: 61,
                total: 871790.61,
              },
              payments: {
                BaseIVA16: 3509032.9,
                BaseIVA8: 0.0,
                BaseIVA0: 0.0,
                BaseIVAExento: 0.0,
                RetencionesISRMXN: 69.01,
                qty: 64,
                total: 3509032.9,
              },
              total: 4380823.51,
              qty: 125,
              excluded_qty: 0,
              moved_qty: 0,
            },
          },
          exercise: {
            incomes: {
              invoice_pue: {
                BaseIVA16: 6858251.94,
                BaseIVA8: 0.0,
                BaseIVA0: 0.0,
                BaseIVAExento: 0.0,
                RetencionesISRMXN: 0.0,
                qty: 1363,
                total: 6858251.94,
              },
              payments: {
                BaseIVA16: 11012834.69,
                BaseIVA8: 0.0,
                BaseIVA0: 0.0,
                BaseIVAExento: 0.0,
                RetencionesISRMXN: 0.0,
                qty: 1619,
                total: 11012834.69,
              },
              total: 17871086.63,
              qty: 2982,
              excluded_qty: 0,
              moved_qty: 0,
            },
            deductions: {
              invoice_pue: {
                BaseIVA16: 4157505.35,
                BaseIVA8: 0.0,
                BaseIVA0: 2451.32,
                BaseIVAExento: 58250.0,
                RetencionesISRMXN: 1273.49,
                qty: 305,
                total: 4218206.67,
              },
              payments: {
                BaseIVA16: 11564554.56,
                BaseIVA8: 0.0,
                BaseIVA0: 0.0,
                BaseIVAExento: 0.0,
                RetencionesISRMXN: 94.03,
                qty: 169,
                total: 11564554.56,
              },
              total: 15782761.23,
              qty: 474,
              excluded_qty: 0,
              moved_qty: 0,
            },
          },
        })
      );
    }
  ),
];
