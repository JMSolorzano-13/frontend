import { message } from "antd";
import http from "../api/_http";
import { CFDIFields } from "../constants/Fields";
import { CFDI_Types } from "@constants/Enums";
import { getExportSingleCFDIName, getExportValidationName } from "./getExportFileName";

type ExportName = {
  group: string;
  subtitle: string;
  datesValue: string | null;
  rfc: string;
};

export const exportCFDI = async (options: {
  format: "PDF" | "CSV" | "XML" | "XLSX";
  selectedIds: string[];
  fields?: string[];
  company: string | null;
  tab?: CFDI_Types;
  exportName?: ExportName;
  exportType?: "validation" | "cfdi";
}) => {
  const { format, selectedIds, fields, company, tab, exportName, exportType } = options;

  let newfieldsRevised;

  if (tab === "I") {
    newfieldsRevised = fields && (format === "XLSX" || format === "CSV") ? fields : CFDIFields;
  } else {
    newfieldsRevised =
      fields && (format === "XLSX" || format === "CSV")
        ? fields.filter((field) => field !== "active_egresos.Total")
        : CFDIFields;
  }

  // Transform polizas to polizas_list for export
  if (newfieldsRevised && newfieldsRevised.length > 0) {
    const polizasIndex = newfieldsRevised.findIndex((field) => field === "polizas");
    if (polizasIndex !== -1) {
      newfieldsRevised = [...newfieldsRevised];
      newfieldsRevised[polizasIndex] = "polizas_list";
    }
  }

  const domain: Domain = [];

  const idBlocks = [];
  if (format === "PDF") {
    idBlocks.push(selectedIds.slice(0, 25));
    if (selectedIds.length > 25) {
      idBlocks.push(selectedIds.slice(25, 50));
    }
    if (selectedIds.length > 50) {
      idBlocks.push(selectedIds.slice(50, 75));
    }
    if (selectedIds.length > 75) {
      idBlocks.push(selectedIds.slice(75, 100));
    }
  } else {
    idBlocks.push(selectedIds);
  }

  let file_name = "";

  if (exportName) {
    file_name =
      exportType === "validation"
        ? getExportValidationName(exportName)
        : getExportSingleCFDIName(exportName);
  }

  try {
    const objs = [];

    const currentBlock = idBlocks[0];
    const idsDomain = [["UUID", "in", currentBlock]];
    const fullDomain = [...domain, ...idsDomain, ["company_identifier", "=", company]];

    if (tab === "N") {
      fullDomain.push(["TipoDeComprobante", "=", tab]);
    }
    // Agregamos campos de pagos
    // TODO: Pasar siempre la tab para evitar hacerlo acá
    newfieldsRevised = [...newfieldsRevised];

    const fieldsWithoutCompanyField = newfieldsRevised.filter((field) => field !== "company.name");

    const fieldsWithXMLContent =
      format === "XML" ? ["UUID", "xml_content"] : fieldsWithoutCompanyField;

    const obj = (
      await http.post(
        "/CFDI/export",
        tab === "N" || tab === "P"
          ? {
              domain: fullDomain,
              fields: format === "XML" ? fieldsWithXMLContent : fieldsWithoutCompanyField,
              TipoDeComprobante: tab,
              format,
              export_data: {
                file_name,
                type: "",
              },
            }
          : {
              domain: fullDomain,
              fields: format === "XML" ? fieldsWithXMLContent : fieldsWithoutCompanyField,
              format,
              export_data: {
                file_name,
                type: "",
              },
            }
      )
    ).data;
    objs.push(obj);

    if (idBlocks.length > 1) {
      const currentBlock = idBlocks[1];
      const idsDomain = [["UUID", "in", currentBlock]];
      const fullDomain = [...domain, ...idsDomain, ["company_identifier", "=", company]];
      const obj = (
        await http.post("/CFDI/export", {
          domain: fullDomain,
          fields: fieldsWithoutCompanyField,
          format,
          export_data: {
            file_name: `${file_name}_1`,
            type: "",
          },
        })
      ).data;
      objs.push(obj);
    }

    if (idBlocks.length > 2) {
      const currentBlock = idBlocks[2];
      const idsDomain = [["UUID", "in", currentBlock]];
      const fullDomain = [...domain, ...idsDomain, ["company_identifier", "=", company]];
      const obj = (
        await http.post("/CFDI/export", {
          domain: fullDomain,
          fields: fieldsWithoutCompanyField,
          format,
          export_data: {
            file_name: `${file_name}_2`,
            type: "",
          },
        })
      ).data;
      objs.push(obj);
    }

    if (idBlocks.length > 3) {
      const currentBlock = idBlocks[3];
      const idsDomain = [["UUID", "in", currentBlock]];
      const fullDomain = [...domain, ...idsDomain, ["company_identifier", "=", company]];
      const obj = (
        await http.post("/CFDI/export", {
          domain: fullDomain,
          fields: fieldsWithoutCompanyField,
          format,
          export_data: {
            file_name: `${file_name}_3`,
            type: "",
          },
        })
      ).data;
      objs.push(obj);
    }

    const links = [];
    for (let i = 0; i < objs.length; i += 1) {
      const currentObj = objs[i];

      const link = document.createElement("a");
      link.href = currentObj.url;
      link.target = "_blank";
      links.push(currentObj.url);
    }

    return links;
  } catch (error) {
    message.error("Ocurrió un error al hacer la descarga");
    return [];
  }
};
