import { rest } from "msw";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export const NotificationsHandler = [
  rest.get(`${baseUrl}/License/:cid`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          freeTrialActivationDate: "2026-01-15T00:00:00Z",
          status: 0,
        },
      })
    );
  }),
];
