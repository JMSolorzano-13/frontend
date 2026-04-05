import { rest } from "msw";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export const cfdiAttachmentsHandlers = [
    rest.post(`${baseUrl}/CFDI/search`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                data: [
                    {
                        FechaFiltro: "2019-01-18T00:00:00",
                        UUID: 'cb4983fb-0ad6-4952-8f4d-52a94240c624',
                        attachments: [
                            {
                                identifier: "UUID-EXAMPLE-1234",
                                url: "https://via.placeholder.com/50",
                                status: true,
                                name: "imagen-1.png",
                            },
                            {
                                identifier: "UUID-EXAMPLE-5678",
                                url: "https://via.placeholder.com/50",
                                status: true,
                                name: "imagen-2.png",
                            },
                            {
                                identifier: "UUID-EXAMPLE-5678",
                                url: "https://via.placeholder.com/50",
                                status: true,
                                name: "imagen-3.png",
                            },
                            {
                                identifier: "UUID-EXAMPLE-5678",
                                url: "https://via.placeholder.com/50",
                                status: true,
                                name: "imagen-4.png",
                            }
                        ],
                    },
                    {
                        FechaFiltro: "2019-01-18T00:00:00",
                        polizas: [],
                        UUID: 'cb4983fb-0ad6-4952-8f4d-52a94240c624',
                    },
                ],
                next_page: false,
                total_records: 2,
            })
        );
    }),
];
