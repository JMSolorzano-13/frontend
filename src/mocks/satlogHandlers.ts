import { rest } from "msw";
import {
  /* SATLogSuccessComplete, */ SATLogSuccessIncomplete,
} from "./responses/SATLog/SATLogSuccess";
// import { SATLogEmpty } from "./responses/SATLog/SATLogEmpty";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export const satHandlers = [
  rest.post(`${baseUrl}/SATQuery/log`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(SATLogSuccessIncomplete));
  }),
  rest.post(`${baseUrl}/SATQuery/can_manual_request`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: "ok",
        reason: "",
        can_request: true,
        last_manual_sync_requested: "2025-07-08T17:39:34.703209",
        last_sync_processed: "2025-07-17T05:05:38.586848",
        all_cfdis_processed: true,
      })
    );
  }),
];
