import moment from "moment";
import http from "./_http";
import { fetchCompanies } from "./company";

const INFO_URLS = {
  GET_DOCUMENT: "Scraper/get_pdf_files",
  UPDATE_DOCUMENT: "Scraper/scrap_sat_pdf",
};

export const getTAXInformation = async (
  companyIdentifier: string,
  oldCompany: number,
  isConstancy: boolean,
  rfc?: string
) => {
  const fields = ["data"];
  const company_ids = [oldCompany];
  const user_data = await fetchCompanies(company_ids, undefined, fields);

  let { scrap_status_constancy, scrap_status_opinion } = user_data[0].data;

  if (!scrap_status_constancy) {
    scrap_status_constancy = {
      current_status: "",
      updated_at: "",
      export_data: {
        file_name: `${rfc?.replace(/[&ñ]/g, "_")}_ConstanciaSituacionFiscal_${moment().format(
          "DDMMMYYYY"
        )}`,
      },
    };
  }

  if (!scrap_status_opinion) {
    scrap_status_opinion = {
      current_status: "",
      updated_at: "",
      export_data: {
        file_name: `${rfc?.replace(/[&ñ]/g, "_")}_OpinionDeCumplimiento_${moment().format(
          "DDMMMYYYY"
        )}`,
      },
    };
  }

  let payload;

  if (isConstancy) {
    payload = {
      company_identifier: companyIdentifier,
      document_type: "constancy",
      export_data: {
        file_name: `${rfc?.replace(/[&ñ]/g, "_")}_ConstanciaSituacionFiscal_${moment().format(
          "DDMMMYYYY"
        )}`,
      },
    };
  } else {
    payload = {
      company_identifier: companyIdentifier,
      document_type: "opinion",
      export_data: {
        file_name: `${rfc?.replace(/[&ñ]/g, "_")}_OpinionDeCumplimiento_${moment().format(
          "DDMMMYYYY"
        )}`,
      },
    };
  }

  const { data } = await http.post(INFO_URLS.GET_DOCUMENT, payload);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return {
    url: data.url_pdf_content
      ? `${data.url_pdf_content}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`
      : "",
    urlDownload: data?.url_pdf_download,
    date: data?.last_update,
    scrap_status_constancy,
    scrap_status_opinion,
  } as InformationTAXResponse;
};

export const updateTAXInformation = async (
  companyIdentifier: string,
  oldCompany: number,
  isConstancy: boolean
) => {
  if (isConstancy) {
    const payload = {
      company_identifier: companyIdentifier,
      document_type: "constancy",
    };
    await http.post(INFO_URLS.UPDATE_DOCUMENT, payload);
  } else {
    const payload = {
      company_identifier: companyIdentifier,
      document_type: "opinion",
    };
    await http.post(INFO_URLS.UPDATE_DOCUMENT, payload);
  }

  await new Promise((resolve) => setTimeout(resolve, 12000));
  if (oldCompany) {
    const response = await fetchCompanies([oldCompany], undefined, ["data"]);
    const data = response[0].data;

    const { scrap_status_constancy, scrap_status_opinion } = data;

    return {
      url: "",
      urlDownload: "",
      date: isConstancy ? scrap_status_constancy.updated_at : scrap_status_opinion.updated_at,
      scrap_status_constancy,
      scrap_status_opinion,
    };
  }
};
