import { rest } from "msw";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export const cfdiHandlers = [
  rest.post(`${baseUrl}/CFDI/search`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          {
            FechaFiltro: "2019-01-18T00:00:00",
            polizas: [
              {
                identifier: "UUID-EXAMPLE-1234",
                numero: "Número 1",
                fecha: "2025-09-07T00:00:00",
                tipo: "Tipo 1",
              },
              {
                identifier: "UUID-EXAMPLE-5678",
                numero: "Número 2",
                fecha: "2025-08-08T00:00:00",
                tipo: "Tipo 2",
              },
              {
                identifier: "UUID-EXAMPLE-5678",
                numero: "Número 3",
                fecha: "2025-08-09T00:00:00",
                tipo: "Tipo 3",
              },
              {
                identifier: "UUID-EXAMPLE-5678",
                numero: "Número 99921",
                fecha: "2025-08-19T00:00:00",
                tipo: "Tipo 99921",
              },
            ],
          },
          {
            FechaFiltro: "2019-01-18T00:00:00",
            polizas: [],
          },
        ],
        next_page: false,
        total_records: 16578,
      })
    );
  }),
];
