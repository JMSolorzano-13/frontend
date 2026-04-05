import { rest } from "msw";

const base_url = "https://oovoqytmk2.execute-api.us-east-1.amazonaws.com/api";

export const policiesHandler = [
    rest.post(`${base_url}/Poliza/search`, async (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                data: [
                    {
                        concepto: "Registro contable de ingresos para Siigo fiscal.",
                        sistema_origen: "Siigo Fiscal",
                        tipo: "Tipo 1",
                        fecha: "2025-08-08T00:00:00",
                        numero: "Número 1",

                        relaciones: [
                            {
                                uuid_related: "240ababb-5f1f-4242-bbdf-cead69d9004d",
                            },
                            {
                                uuid_related: "739942f7-8448-4277-8824-3702d1ff549a",
                                cfdi_related: {
                                    Fecha: "2025-08-01T10:16:41",
                                    Folio: "2418",
                                    TipoDeComprobante: "E",
                                    Total: 15056.22,
                                    Serie: "LEOP",
                                    NombreEmisor: "PLATAFORMA GDL",
                                    RfcEmisor: "PGD1009214W0"
                                }
                            },
                            {
                                uuid_related: "240ababb-5f1f-4242-bbdf-cead69d9004d",
                                cfdi_related: {
                                    Fecha: "2025-08-01T10:16:41",
                                    Folio: "2418",
                                    TipoDeComprobante: "I",
                                    Total: 15056.22,
                                    Serie: "LEOP",
                                    NombreEmisor: "PLATAFORMA GDL",
                                    RfcEmisor: "PGD1009214W0"
                                }
                            },
                            {
                                uuid_related: "240ababb-5f1f-4242-bbdf-cead69d9004d",
                            }
                        ],

                        movimientos: [
                            {
                                numerador: "1",
                                cuenta_contable: "101-01",
                                nombre: "Caja",
                                cargo: 4040.0,
                                abono: 2130,
                                cargo_me: 0,
                                abono_me: 0,
                                concepto: "Registro de ingreso simple",
                                referencia: "REF-00128782328372387238237872387328",
                                poliza_identifier: "numerote-13"
                            },
                            {
                                numerador: "2",
                                cuenta_contable: "402-10",
                                nombre: "Ventas",
                                cargo: 1050,
                                abono: 2960.00,
                                cargo_me: 0,
                                abono_me: 0,
                                concepto: "Reconocimiento de ingreso contable",
                                referencia: "REF-002",
                                poliza_identifier: "numerote-13"
                            }
                        ]
                    }
                ],
                next_page: false,
                total_records: 1
            })
        );
    })
];
