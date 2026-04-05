import { rest } from "msw";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const id_token = import.meta.env.VITE_ID_TOKEN_MOCK;
const refresh_token = import.meta.env.VITE_REFRESH_TOKEN_MOCK;

export const authHandlers = [
  rest.get(`${baseUrl}/User/auth/:code`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id_token: id_token,
        refresh_token: refresh_token,
        expires_in: 3600,
        token_type: "Bearer",
      })
    );
  }),
];
