import { rest, RestRequest } from "msw";

const base_url = import.meta.env.VITE_REACT_APP_BASE_URL;

type GetCompaniesPayload = {
  domain: Domain[];
  fields: string[];
};

export const totalDeducciones_200 = [
  // POST
  rest.post(
    `${base_url}/CFDI/totales`,
    async (req: RestRequest<GetCompaniesPayload>, rest, ctx) => {
      return rest(
        ctx.status(200),
        ctx.json({
          totals_table: [
            {
              Concepto: "Gastos de nómina gravada",
              ConteoCFDIs: 52,
              Importe: 158000,
            },
            {
              Concepto: "Gastos de nómina exenta",
              Importe: 152000,
            },
            {
              Concepto: "Gastos de nómina exenta deducible",
              Importe: 8056,
              porcentaje: 0.47,
            },
            {
              Concepto: "Gastos de nómina deducibles",
              Importe: 166056,
            },
            {
              Concepto: "Compras y gastos facturas de contado",
              ConteoCFDIs: 62,
              Importe: 10497125,
              isr_cargo: 82499,
            },
            {
              Concepto: "Compras y gastos CFDIs de pago",
              ConteoCFDIs: 565,
              Importe: 157457,
              isr_cargo: 2499,
            },
            {
              Concepto: "Devoluciones, descuentos y bonificaciones facturadas",
              ConteoCFDIs: 258,
              Importe: 5000,
              concepts: [
                {
                  Concepto: "Devoluciones, descuentos y bonificaciones en ingresos emitidos",
                  ConteoCFDIs: 249,
                  Importe: 3000,
                },
                {
                  Concepto: "Devoluciones, descuentos y bonificaciones en egresos emitidos",
                  ConteoCFDIs: 9,
                  Importe: 2000,
                },
              ],
            },
            {
              Concepto: "Compras y gastos no considerados en el pre-llenado",
              ConteoCFDIs: 6,
              concepts: [
                {
                  Concepto: "No considerados en el pre-llenado: Ingresos PUE",
                  ConteoCFDIs: 6,
                },
                {
                  Concepto: "No considerados en el pre-llenado: Pagos",
                  ConteoCFDIs: 0,
                },
              ],
            },
            {
              Concepto: "Facturas de egresos recibidas por compras y gastos",
              ConteoCFDIs: 21,
              Importe: 3200,
            },
            {
              Concepto: "Compras y gastos",
              Importe: 1275373,
            },
            {
              Concepto: "Deducciones autorizadas sin inversiones",
              Importe: 1381429,
            },
            {
              Concepto: "Adquisiciones por Concepto de inversiones",
              ConteoCFDIs: 1,
              Importe: 17000,
            },
          ],
          totals_table_excluded: [
            {
              Concepto: "Compras y gastos facturas de contado",
              ConteoCFDIs: 1,
              Importe: 10497125,
              isr_cargo: 82499,
            },
            {
              Concepto: "Compras y gastos CFDIs de pago",
              ConteoCFDIs: 1,
              Importe: 157457,
              isr_cargo: 2499,
            },
            {
              Concepto: "Devoluciones, descuentos y bonificaciones facturadas",
              ConteoCFDIs: 258,
              Importe: 5000,
              concepts: [
                {
                  Concepto: "Devoluciones, descuentos y bonificaciones en ingresos emitidos",
                  ConteoCFDIs: 249,
                  Importe: 3000,
                },
                {
                  Concepto: "Devoluciones, descuentos y bonificaciones en egresos emitidos",
                  ConteoCFDIs: 9,
                  Importe: 2000,
                },
              ],
            },
            {
              Concepto: "Compras y gastos no considerados en el pre-llenado",
              ConteoCFDIs: 6,
              concepts: [
                {
                  Concepto: "No considerados en el pre-llenado: Ingresos PUE",
                  ConteoCFDIs: 6,
                },
                {
                  Concepto: "No considerados en el pre-llenado: Pagos",
                  ConteoCFDIs: 0,
                },
              ],
            },
            {
              Concepto: "Facturas de egresos recibidas por compras y gastos",
              ConteoCFDIs: 21,
              Importe: 3200,
            },
          ],
        })
      );
    }
  ),
];
