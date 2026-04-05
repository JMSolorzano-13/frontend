import { rest } from "msw";

export const test1Handlers = [
    rest.put(
        "https://s3.amazonaws.com/mi-bucket/uploads/test-1.png",
        async (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json({})
            );
        }
    )
];
