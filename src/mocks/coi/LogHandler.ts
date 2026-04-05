import { rest } from "msw";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export const LogHandler = [
  rest.post(`${baseUrl}/Pasto/Sync/search`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          {
            xmls_to_send: 22,
            cfdis_to_cancel_pending: 22,
            state: "DRAFT",
            end: "2008-11-11 13:23:44",
            xmls_to_send_pending: 22,
            company_identifier: "a2ac66aa-e9ff-4b1b-afaf-59620e45c253",
            start: "2008-11-11 13:23:44",
            system: "mock",
            cfdis_to_cancel: 22,
            xmls_to_send_total: 22,
            cfdis_to_cancel_total: 22,
            created_at: "2008-11-11 13:23:44",
            manually_triggered: false,
          },
          {
            xmls_to_send: 22,
            cfdis_to_cancel_pending: 22,
            state: "SEND",
            end: "2008-11-11 13:23:44",
            xmls_to_send_pending: 22,
            company_identifier: "a2ac66aa-e9ff-4b1b-afaf-59620e45c253",
            start: "2008-11-11 13:23:44",
            system: "mock",
            cfdis_to_cancel: 22,
            xmls_to_send_total: 22,
            cfdis_to_cancel_total: 22,
            created_at: "2008-11-11 13:23:44",
            manually_triggered: false,
          },
          {
            xmls_to_send: 22,
            cfdis_to_cancel_pending: 22,
            state: "ERROR",
            end: "2008-11-11 13:23:44",
            xmls_to_send_pending: 22,
            company_identifier: "a2ac66aa-e9ff-4b1b-afaf-59620e45c253",
            start: "2008-11-11 13:23:44",
            system: "mock",
            cfdis_to_cancel: 22,
            xmls_to_send_total: 22,
            cfdis_to_cancel_total: 22,
            created_at: "2008-11-11 13:23:44",
            manually_triggered: false,
          },
        ],
      })
    );
  }),
];
