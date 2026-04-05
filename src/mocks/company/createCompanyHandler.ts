import { rest } from "msw";

const base_url = "https://api-prod.ezaudita.com";

export const createCompanyHandler = [
  rest.post(`${base_url}/Company`, async (req, res, ctx) => {
    return res(
      ctx.status(408),
      ctx.json({ data: "408 Request Timeout" })
    );
  }),
];
