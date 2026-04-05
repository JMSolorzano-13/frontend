import { rest } from "msw";

const base_url = import.meta.env.VITE_REACT_APP_BASE_URL;

export const getPDFFilesHandlers = [
  rest.post(`${base_url}/Scraper/get_pdf_files`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        url_pdf_content:
          "https://document-sat-prod.s3.amazonaws.com/cf_89e8e5ff-8621-45be-9653-b706f7d7fdff.pdf?response-content-type=application%2Fpdf&response-content-disposition=inline&AWSAccessKeyId=AKIAQLWWJNI5SJ45VN4I&Signature=SSj7Xo4JqaKMAClHCX5Q7Tlh4p8%3D&Expires=1766471971",
        url_pdf_download:
          "https://document-sat-prod.s3.amazonaws.com/cf_89e8e5ff-8621-45be-9653-b706f7d7fdff.pdf?response-content-disposition=attachment%3Bfilename%3DCFO1010219Z8_ConstanciaSituacionFiscal_22Dec2025.pdf&AWSAccessKeyId=AKIAQLWWJNI5SJ45VN4I&Signature=kT%2BskB7cA%2FKi8nJZPyZV4lf1gPo%3D&Expires=1766471971",
        last_update: "2025-10-09 22:31:28",
        error: "",
      })
    );
  }),
];
