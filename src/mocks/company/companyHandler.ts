import { rest, RestRequest } from "msw";

const base_url = import.meta.env.VITE_REACT_APP_BASE_URL;

type GetCompaniesPayload = {
  domain: Domain[];
  fields: string[];
};

export const companyHandler = [
  // POST
  rest.post(
    `${base_url}/Company/search`,
    async (req: RestRequest<GetCompaniesPayload>, rest, ctx) => {
      const body = await req.json();
      const companiesLength = body.domain[0][2].length;
      if (companiesLength > 10) {
        return rest(
          ctx.status(200),
          ctx.json({
            data: [
              {
                workspace: {
                  license: {
                    id: 1,
                    date_start: "2023-11-15",
                    date_end: "2025-11-15",
                    details: {
                      max_emails_enroll: {
                        source: "3.0",
                        parsedValue: 3,
                      },
                      max_companies: {
                        source: "10.0",
                        parsedValue: 10,
                      },
                      exceed_metadata_limit: false,
                      add_enabled: false,
                      products: [
                        {
                          identifier: "prod_MZAUw4gnheSoOT",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                      ],
                    },
                    stripe_status: "active",
                  },
                  valid_until: "2025-11-15T00:00:00",
                  owner: {
                    identifier: "a19ef354-c6fd-4b72-9fb1-05b6e18089ed",
                    email: "emilio.hernandez@finamo.mx",
                    id: 99199,
                  },
                  identifier: "1acac154-b206-46c2-ac32-1be04935bf7e",
                  id: 93886,
                  name: "emilio hernandez rangel's Workspace",
                },
                emails_to_send_errors:
                  '["emilio.hernandez@finamo.mx", "emily.garcia@finamo.mx", "nitcia.salazar@finamo.mx"]',
                pasto_last_metadata_sync: null,
                add_auto_sync: false,
                identifier: "95476aea-ec53-4069-ab4e-c7f88705a354",
                permission_to_sync: false,
                id: 102103,
                rfc: "ASO100305QD7",
                has_valid_certs: true,
                name: "ADMINISTRADORA DE SOLUCIONES SA DE CV SOFOM ENR",
                created_at: "2023-11-13T18:26:18.452582",
                emails_to_send_efos:
                  '["emilio.hernandez@finamo.mx", "emily.garcia@finamo.mx", "nitcia.salazar@finamo.mx"]',
                emails_to_send_canceled:
                  '["emilio.hernandez@finamo.mx", "emily.garcia@finamo.mx", "nitcia.salazar@finamo.mx"]',
                pasto_company_identifier: null,
                exceed_metadata_limit: false,
                have_certificates: true,
              },
              {
                workspace: {
                  license: {
                    id: 1,
                    date_start: "2023-06-29",
                    date_end: "2026-06-29",
                    details: {
                      max_emails_enroll: {
                        source: "5.0",
                        parsedValue: 5,
                      },
                      max_companies: "unlimited",
                      exceed_metadata_limit: false,
                      add_enabled: true,
                      products: [
                        {
                          identifier: "prod_MZAVa4wGwDTZJ9",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                        {
                          identifier: "prod_NVCDFElIGK8bpB",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                      ],
                    },
                    stripe_status: "active",
                  },
                  valid_until: "2026-06-29T00:00:00",
                  owner: {
                    identifier: "b9c4bffe-0aeb-4f76-9118-168d790dde3e",
                    email: "ahs0406@live.com.mx",
                    id: 32205,
                  },
                  identifier: "4ed5b579-22e6-435b-9d07-23585d2bef2a",
                  id: 30522,
                  name: "maria aracely huerta sifuentes's Workspace",
                },
                emails_to_send_errors: null,
                pasto_last_metadata_sync: null,
                add_auto_sync: false,
                identifier: "f2afe562-4161-4bf3-8e48-c8f44dd6a187",
                permission_to_sync: false,
                id: 129394,
                rfc: "AEI010719FG8",
                has_valid_certs: true,
                name: "ALTO EMPAQUE INDUSTRIAL SA DE CV",
                created_at: "2023-12-21T22:04:06.645753",
                emails_to_send_efos: null,
                emails_to_send_canceled: null,
                pasto_company_identifier: "337d1f75-ac8b-4bc1-885f-46be7f3f9935",
                exceed_metadata_limit: false,
                have_certificates: true,
              },
              {
                workspace: {
                  license: {
                    id: 1,
                    date_start: "2023-11-15",
                    date_end: "2025-11-15",
                    details: {
                      max_emails_enroll: {
                        source: "3.0",
                        parsedValue: 3,
                      },
                      max_companies: {
                        source: "10.0",
                        parsedValue: 10,
                      },
                      exceed_metadata_limit: false,
                      add_enabled: false,
                      products: [
                        {
                          identifier: "prod_MZAUw4gnheSoOT",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                      ],
                    },
                    stripe_status: "active",
                  },
                  valid_until: "2025-11-15T00:00:00",
                  owner: {
                    identifier: "a19ef354-c6fd-4b72-9fb1-05b6e18089ed",
                    email: "emilio.hernandez@finamo.mx",
                    id: 99199,
                  },
                  identifier: "1acac154-b206-46c2-ac32-1be04935bf7e",
                  id: 93886,
                  name: "emilio hernandez rangel's Workspace",
                },
                emails_to_send_errors:
                  '["emilio.hernandez@finamo.mx", "emily.garcia@finamo.mx", "nitcia.salazar@finamo.mx"]',
                pasto_last_metadata_sync: null,
                add_auto_sync: false,
                identifier: "dcffca54-496e-4922-897f-38a580606033",
                permission_to_sync: false,
                id: 117184,
                rfc: "AFI2205045F7",
                has_valid_certs: true,
                name: "ARRENDADORA FINAMO SA DE CV",
                created_at: "2023-12-02T20:03:09.386986",
                emails_to_send_efos:
                  '["emilio.hernandez@finamo.mx", "emily.garcia@finamo.mx", "nitcia.salazar@finamo.mx"]',
                emails_to_send_canceled:
                  '["emilio.hernandez@finamo.mx", "emily.garcia@finamo.mx", "nitcia.salazar@finamo.mx"]',
                pasto_company_identifier: null,
                exceed_metadata_limit: false,
                have_certificates: true,
              },
              {
                workspace: {
                  license: {
                    id: 1,
                    date_start: "2023-08-15",
                    date_end: "2025-08-15",
                    details: {
                      max_emails_enroll: {
                        source: "3.0",
                        parsedValue: 3,
                      },
                      max_companies: {
                        source: "10.0",
                        parsedValue: 10,
                      },
                      exceed_metadata_limit: true,
                      add_enabled: false,
                      products: [
                        {
                          identifier: "prod_MZAUw4gnheSoOT",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                        {
                          identifier: "prod_MZAYjOnimmlkE4",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                      ],
                    },
                    stripe_status: "past_due",
                  },
                  valid_until: "2025-08-15T00:00:00",
                  owner: {
                    identifier: "600af244-21f2-426d-a927-1409377e5304",
                    email: "nayra.alvarez@cargas.mx",
                    id: 77551,
                  },
                  identifier: "9afd74f1-e30d-4341-83e0-1e584a88d38f",
                  id: 74152,
                  name: "nayra alvarez calderon 's Workspace",
                },
                emails_to_send_errors: null,
                pasto_last_metadata_sync: null,
                add_auto_sync: false,
                identifier: "0965bf98-6c2d-4248-a164-86aefddc5974",
                permission_to_sync: false,
                id: 70918,
                rfc: "ASJ660823IA8",
                has_valid_certs: false,
                name: "AUTO SERVICIO JALISCO SA DE CV",
                created_at: "2023-08-11T19:43:32.355727",
                emails_to_send_efos: null,
                emails_to_send_canceled: null,
                pasto_company_identifier: null,
                exceed_metadata_limit: false,
                have_certificates: true,
              },
              {
                workspace: {
                  license: {
                    id: 1,
                    date_start: "2023-06-29",
                    date_end: "2026-06-29",
                    details: {
                      max_emails_enroll: {
                        source: "5.0",
                        parsedValue: 5,
                      },
                      max_companies: "unlimited",
                      exceed_metadata_limit: false,
                      add_enabled: true,
                      products: [
                        {
                          identifier: "prod_MZAVa4wGwDTZJ9",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                        {
                          identifier: "prod_NVCDFElIGK8bpB",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                      ],
                    },
                    stripe_status: "active",
                  },
                  valid_until: "2026-06-29T00:00:00",
                  owner: {
                    identifier: "b9c4bffe-0aeb-4f76-9118-168d790dde3e",
                    email: "ahs0406@live.com.mx",
                    id: 32205,
                  },
                  identifier: "4ed5b579-22e6-435b-9d07-23585d2bef2a",
                  id: 30522,
                  name: "maria aracely huerta sifuentes's Workspace",
                },
                emails_to_send_errors: null,
                pasto_last_metadata_sync: null,
                add_auto_sync: true,
                identifier: "314eca54-3524-4c67-9651-ba7daf8f6a16",
                permission_to_sync: false,
                id: 61183,
                rfc: "COA1510014F9",
                has_valid_certs: true,
                name: "COMERCIALIZADORA ORTIZ ANDONIE SA DE CV",
                created_at: "2023-07-04T18:51:22.362844",
                emails_to_send_efos: null,
                emails_to_send_canceled: null,
                pasto_company_identifier: "ddeb201b-7eef-4b27-9fc8-739cf1214c92",
                exceed_metadata_limit: false,
                have_certificates: true,
              },
              {
                workspace: {
                  license: {
                    id: 1,
                    date_start: "2023-08-15",
                    date_end: "2025-08-15",
                    details: {
                      max_emails_enroll: {
                        source: "3.0",
                        parsedValue: 3,
                      },
                      max_companies: {
                        source: "10.0",
                        parsedValue: 10,
                      },
                      exceed_metadata_limit: true,
                      add_enabled: false,
                      products: [
                        {
                          identifier: "prod_MZAUw4gnheSoOT",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                        {
                          identifier: "prod_MZAYjOnimmlkE4",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                      ],
                    },
                    stripe_status: "past_due",
                  },
                  valid_until: "2025-08-15T00:00:00",
                  owner: {
                    identifier: "600af244-21f2-426d-a927-1409377e5304",
                    email: "nayra.alvarez@cargas.mx",
                    id: 77551,
                  },
                  identifier: "9afd74f1-e30d-4341-83e0-1e584a88d38f",
                  id: 74152,
                  name: "nayra alvarez calderon 's Workspace",
                },
                emails_to_send_errors: null,
                pasto_last_metadata_sync: null,
                add_auto_sync: false,
                identifier: "8296adcd-7b9f-40e5-9495-799133cdd19b",
                permission_to_sync: true,
                id: 70920,
                rfc: "GEC030808DD6",
                has_valid_certs: false,
                name: "GRUPO EMPRESARIAL CACHANILLA SA DE CV",
                created_at: "2023-08-11T20:02:35.729542",
                emails_to_send_efos: null,
                emails_to_send_canceled: null,
                pasto_company_identifier: null,
                exceed_metadata_limit: true,
                have_certificates: true,
              },
              {
                workspace: {
                  license: {
                    id: 1,
                    date_start: "2025-01-03",
                    date_end: "2026-01-03",
                    details: {
                      max_emails_enroll: {
                        source: "5.0",
                        parsedValue: 5,
                      },
                      max_companies: "unlimited",
                      exceed_metadata_limit: false,
                      add_enabled: true,
                      products: [
                        {
                          identifier: "prod_MZAVa4wGwDTZJ9",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                        {
                          identifier: "prod_NVCDFElIGK8bpB",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                      ],
                    },
                    stripe_status: "active",
                  },
                  valid_until: "2026-01-03T00:00:00",
                  owner: {
                    identifier: "a60f4ffb-de35-472e-8487-f551eff0409a",
                    email: "rebeca.martin@gyl.com.mx",
                    id: 321173,
                  },
                  identifier: "e81a3e7b-4c66-4c63-bd01-0d266928b89e",
                  id: 297833,
                  name: "Rebeca Martin's Workspace",
                },
                emails_to_send_errors: '["guillermo.garcia@gyl.com.mx"]',
                pasto_last_metadata_sync: "2025-07-10T13:16:33.212531",
                add_auto_sync: true,
                identifier: "9f2deaa9-640e-4759-a097-282b62578b2f",
                permission_to_sync: false,
                id: 347634,
                rfc: "PDA200703EH4",
                has_valid_certs: true,
                name: "PROYECTOS Y DESARROLLOS AFROSTU SA DE CV",
                created_at: "2025-01-03T18:40:14.232628",
                emails_to_send_efos: '["guillermo.garcia@gyl.com.mx"]',
                emails_to_send_canceled: '["guillermo.garcia@gyl.com.mx"]',
                pasto_company_identifier: "87686535-c8c2-4d9e-b0da-4b5fb57cc678",
                exceed_metadata_limit: false,
                have_certificates: true,
              },
              {
                workspace: {
                  license: {
                    id: 1,
                    date_start: "2023-06-29",
                    date_end: "2026-06-29",
                    details: {
                      max_emails_enroll: {
                        source: "5.0",
                        parsedValue: 5,
                      },
                      max_companies: "unlimited",
                      exceed_metadata_limit: false,
                      add_enabled: true,
                      products: [
                        {
                          identifier: "prod_MZAVa4wGwDTZJ9",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                        {
                          identifier: "prod_NVCDFElIGK8bpB",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                      ],
                    },
                    stripe_status: "active",
                  },
                  valid_until: "2026-06-29T00:00:00",
                  owner: {
                    identifier: "b9c4bffe-0aeb-4f76-9118-168d790dde3e",
                    email: "ahs0406@live.com.mx",
                    id: 32205,
                  },
                  identifier: "4ed5b579-22e6-435b-9d07-23585d2bef2a",
                  id: 30522,
                  name: "maria aracely huerta sifuentes's Workspace",
                },
                emails_to_send_errors: null,
                pasto_last_metadata_sync: null,
                add_auto_sync: false,
                identifier: "019bc1db-52ca-437b-8109-1a2434ddae63",
                permission_to_sync: false,
                id: 228625,
                rfc: "SAR190412KF3",
                has_valid_certs: true,
                name: "SUPPLIER AROL SA DE CV",
                created_at: "2024-04-04T22:56:41.621583",
                emails_to_send_efos: null,
                emails_to_send_canceled: null,
                pasto_company_identifier: null,
                exceed_metadata_limit: false,
                have_certificates: true,
              },
              {
                workspace: {
                  license: {
                    id: 1,
                    date_start: "2023-11-21",
                    date_end: "2025-11-21",
                    details: {
                      max_emails_enroll: {
                        source: "1.0",
                        parsedValue: 1,
                      },
                      max_companies: {
                        source: "3.0",
                        parsedValue: 3,
                      },
                      exceed_metadata_limit: false,
                      add_enabled: false,
                      products: [
                        {
                          identifier: "prod_MZATTl8qbvFXJ7",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                      ],
                    },
                    stripe_status: "active",
                  },
                  valid_until: "2025-11-21T00:00:00",
                  owner: {
                    identifier: "752af996-9671-48c9-9ec4-35a3a8da970b",
                    email: "juani.romero.reyes@gmail.com",
                    id: 51235,
                  },
                  identifier: "323a982d-534e-4444-be60-e906670d90a2",
                  id: 49156,
                  name: "JUANA ROMERO REYES's Workspace",
                },
                emails_to_send_errors: null,
                pasto_last_metadata_sync: null,
                add_auto_sync: false,
                identifier: "ff021ac6-84d1-4728-807b-5dd189006e9c",
                permission_to_sync: false,
                id: 109186,
                rfc: "UED100902PU5",
                has_valid_certs: true,
                name: "UBIJUS, EDITORIAL SA DE CV",
                created_at: "2023-11-24T03:43:57.642728",
                emails_to_send_efos: null,
                emails_to_send_canceled: null,
                pasto_company_identifier: null,
                exceed_metadata_limit: false,
                have_certificates: true,
              },
              {
                workspace: {
                  license: {
                    id: 1,
                    date_start: "2023-06-29",
                    date_end: "2026-06-29",
                    details: {
                      max_emails_enroll: {
                        source: "5.0",
                        parsedValue: 5,
                      },
                      max_companies: "unlimited",
                      exceed_metadata_limit: false,
                      add_enabled: true,
                      products: [
                        {
                          identifier: "prod_MZAVa4wGwDTZJ9",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                        {
                          identifier: "prod_NVCDFElIGK8bpB",
                          quantity: {
                            source: "1.0",
                            parsedValue: 1,
                          },
                        },
                      ],
                    },
                    stripe_status: "active",
                  },
                  valid_until: "2026-06-29T00:00:00",
                  owner: {
                    identifier: "b9c4bffe-0aeb-4f76-9118-168d790dde3e",
                    email: "ahs0406@live.com.mx",
                    id: 32205,
                  },
                  identifier: "4ed5b579-22e6-435b-9d07-23585d2bef2a",
                  id: 30522,
                  name: "maria aracely huerta sifuentes's Workspace",
                },
                emails_to_send_errors: null,
                pasto_last_metadata_sync: null,
                add_auto_sync: true,
                identifier: "42b758b5-2b26-4a3a-9a4f-c9a39141028b",
                permission_to_sync: false,
                id: 60756,
                rfc: "UCT120803GT7",
                has_valid_certs: true,
                name: "UNI CADENA TEXTIL SA DE CV",
                created_at: "2023-07-03T20:42:05.156462",
                emails_to_send_efos: null,
                emails_to_send_canceled: null,
                pasto_company_identifier: "9975c28d-0ae4-44e3-9cce-4847ae507342",
                exceed_metadata_limit: false,
                have_certificates: true,
              },
            ],
            next_page: false,
            total_records: 10,
          })
        );
      } else {
        return rest(
          ctx.status(200),
          ctx.json({
            data: [
              {
                identifier: "019bc1db-52ca-437b-8109-1a2434ddae63",
                id: 228625,
                scrap_status_constancy: {
                  current_status: "scraped",
                  updated_at: "2024-04-04T22:56:41.621583",
                },
                scrap_status_opinion: {
                  current_status: "pending",
                  updated_at: "2024-04-04T22:56:41.621583",
                },
              },
            ],
            next_page: false,
            total_records: 10,
          })
        );
      }
    }
  ),
];
