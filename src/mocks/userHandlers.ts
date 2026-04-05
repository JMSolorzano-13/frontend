import { rest } from "msw";
import { userSuccess } from "./responses/User/getUser";
// import { userConfigSuccess } from "./responses/User/getUserConfig";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export const userHandlers = [
  rest.get(`${baseUrl}/User`, (req, res, ctx) => {
    return userSuccess(res, ctx);
  }),
  // rest.get(`${baseUrl}/User/config/:identifier`, (req, res, ctx) => {
  //   return userConfigSuccess(res, ctx);
  // }),
];
