import { DefaultBodyType, ResponseComposition, RestContext } from "msw";

export const userSuccess = (res: ResponseComposition<DefaultBodyType>, ctx: RestContext) => {
  return res(
    ctx.status(200),
    ctx.json({

      "user": {
        "id": 101,
        "name": "ffy2fiigh@mozmail.com",
        "email": "ffy2fiigh@mozmail.com"
      },
      "access": {
        "efa5ce5e-0849-4e5c-920f-527a9a4aa664": {
          "id": 101,
          "license": {
            "id": 1,
            "date_start": "2025-07-08",
            "date_end": "2035-07-08",
            "details": {
              "max_emails_enroll": "unlimited",
              "max_companies": "unlimited",
              "exceed_metadata_limit": false,
              "add_enabled": false,
              "products": [
                {
                  "identifier": "prod_MZAVa4wGwDTZJ9",
                  "quantity": 1
                }
              ]
            },
            "stripe_status": "active",
            "base_product_enable": false
          },
          "name": "ffy2fiigh@mozmail.com's Workspace",
          "stripe_status": "active",
          "owner_id": 101,
          "pasto_worker_id": "68d5cac48f4e9c0019d464a6",
          "pasto_license_key": "034a1164-62df-42dd-85d5-ab2d1fc6c5cf",
          "pasto_installed": true,
          "companies": {
            "cc707d30-bb9c-4791-8bd1-dbd4ca592dab": {
              "id": 1,
              "name": "PLATAFORMA GDL S DE RL DE CV",
              "modules": [
                "SATSync",
                "Payroll"
              ]
            },
            "e3575d45-d49d-4f73-8267-8d278446a19b": {
              "id": 332,
              "name": "JESSJAI SA DE CV",
              "modules": [
                "SATSync",
                "Payroll"
              ]
            }
          }
        },
        "c0c6cba4-e416-4abc-89b9-6a685d9e0982": {
          "id": 1045,
          "license": {
            "id": 1,
            "date_start": "2025-07-08",
            "date_end": "2035-07-08",
            "details": {
              "max_emails_enroll": "unlimited",
              "max_companies": "unlimited",
              "exceed_metadata_limit": false,
              "add_enabled": false,
              "products": [
                {
                  "identifier": "prod_MZAVa4wGwDTZJ9",
                  "quantity": 1
                }
              ]
            },
            "stripe_status": "active"
          },
          "name": "None's Workspace",
          "stripe_status": "active",
          "owner_id": 1152,
          "pasto_worker_id": null,
          "pasto_license_key": null,
          "pasto_installed": null,
          "companies": {
            "7180b3dd-6e48-4d7d-a5f6-45c4e084942c": {
              "id": 1361,
              "name": "ESCUELA KEMPER URGATE SA DE CV",
              "modules": [
                "SATSync"
              ]
            }
          }
        }
      }
    }))
};

export const user401 = (res: ResponseComposition<DefaultBodyType>, ctx: RestContext) => {
  return res(ctx.status(401), ctx.json({ Code: "UnauthorizedError", Message: "Invalid token" }));
};
