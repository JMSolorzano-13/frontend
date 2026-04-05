import { rest } from "msw";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export const companyHandlers = [
  rest.post(`${baseUrl}/Company/search`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          {
            workspace: {
              license: {
                base_product_enable: false,
                id: 1,
                date_start: "2025-07-08",
                date_end: "2035-07-08",
                details: {
                  max_emails_enroll: "unlimited",
                  max_companies: "unlimited",
                  exceed_metadata_limit: false,
                  add_enabled: false,
                  products: [
                    {
                      identifier: "prod_MZAVa4wGwDTZJ9",
                      quantity: 1,
                    },
                  ],
                },
                stripe_status: "active",
              },
              valid_until: "2035-07-08T00:00:00",
              identifier: "efa5ce5e-0849-4e5c-920f-527a9a4aa664",
              name: "ffy2fiigh@mozmail.com's Workspace",
              owner: {
                email: "ffy2fiigh@mozmail.com",
                identifier: "393927a6-742a-4add-8add-39ce3487ffff",
                id: 101,
              },
              id: 101,
            },
            name: "JESSJAI SA DE CV",
            created_at: "2025-08-04T18:24:29.979800",
            emails_to_send_efos: null,
            have_certificates: true,
            emails_to_send_errors: null,
            rfc: "JES080604MN5",
            add_auto_sync: false,
            pasto_last_metadata_sync: null,
            exceed_metadata_limit: false,
            id: 332,
            identifier: "e3575d45-d49d-4f73-8267-8d278446a19b",
            permission_to_sync: false,
            emails_to_send_canceled: null,
            has_valid_certs: true,
            pasto_company_identifier: null,
          },
          {
            workspace: {
              license: {
                id: 1,
                date_start: "2025-07-08",
                date_end: "2035-07-08",
                details: {
                  max_emails_enroll: "unlimited",
                  max_companies: "unlimited",
                  exceed_metadata_limit: false,
                  add_enabled: false,
                  products: [
                    {
                      identifier: "prod_MZAVa4wGwDTZJ9",
                      quantity: 1,
                    },
                  ],
                },
                stripe_status: "active",
              },
              valid_until: "2035-07-08T00:00:00",
              identifier: "efa5ce5e-0849-4e5c-920f-527a9a4aa664",
              name: "ffy2fiigh@mozmail.com's Workspace",
              owner: {
                email: "ffy2fiigh@mozmail.com",
                identifier: "393927a6-742a-4add-8add-39ce3487ffff",
                id: 101,
              },
              id: 101,
            },
            name: "PLATAFORMA GDL S DE RL DE CV",
            created_at: "2025-07-08T00:39:50.140011",
            emails_to_send_efos: null,
            have_certificates: true,
            emails_to_send_errors: null,
            rfc: "PGD1009214W0",
            add_auto_sync: false,
            pasto_last_metadata_sync: null,
            exceed_metadata_limit: false,
            id: 1,
            identifier: "cc707d30-bb9c-4791-8bd1-dbd4ca592dab",
            permission_to_sync: false,
            emails_to_send_canceled: null,
            has_valid_certs: true,
            pasto_company_identifier: null,
          },
        ],
        next_page: false,
        total_records: 1,
      })
    );
  }),
  rest.post(`${baseUrl}/Company/get_cer`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        rfc: "RUCJ820922KX7",
        name: "JUAN MANUEL RUIZ CUETO",
        not_before: "2025-01-14T22:40:26",
        not_after: "2029-01-14T22:41:06",
        serial_number: "00001000000712566035",
      })
    );
  }),
];
