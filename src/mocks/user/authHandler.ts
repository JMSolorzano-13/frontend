import { rest, RestRequest } from "msw";

const base_url = "http://127.0.0.1:8000";

type LoginPayload = {
  flow: string;
  params: {
    USERNAME: string;
    PASSWORD: string;
  };
};

export const authHandler = [
  // POST
  rest.post(`${base_url}/User/auth`, async (req: RestRequest<LoginPayload>, rest, ctx) => {
    // const body = await req.json();
    return rest(ctx.status(404), ctx.json({ data: "user not founded" }));
  }),
];
