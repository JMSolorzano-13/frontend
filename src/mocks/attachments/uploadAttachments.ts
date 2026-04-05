import { rest } from "msw";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export const uploadAttachmentsHandlers = [
  rest.post(
    `${baseUrl}/Attachment/cc707d30-bb9c-4791-8bd1-dbd4ca592dab/cb4983fb-0ad6-4952-8f4d-52a94240c624`,
    async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          "test-1.png": "https://s3.amazonaws.com/mi-bucket/uploads/test-1.png",
          "test-2.png": "Error en archivo",
        })
      );
    }
  )
];
