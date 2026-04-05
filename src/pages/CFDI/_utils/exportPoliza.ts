import { message } from "antd";
import { CFDI_Types } from "@constants/Enums";
import { getExportSinglePolizaName } from "@utils/getExportFileName";
import http from "@api/_http";
import { FIELDS_POLICIES } from "./fieldsPolicies";

type ExportName = {
  group: string;
  subtitle: string;
  datesValue: string | null;
  rfc: string;
};

export const exportPoliza = async (options: {
  format: "PDF";
  selectedIds: string[];
  fields?: string[];
  company: string | null;
  tab?: CFDI_Types;
  exportName?: ExportName;
}) => {
  const { format, selectedIds, company, tab, exportName } = options;

  const domain: Domain = [];

  const idBlocks = [];
  if (format === "PDF") {
    idBlocks.push(selectedIds);
  }

  let file_name = "";

  if (exportName) {
    file_name = getExportSinglePolizaName(exportName);
  }

  try {
    const objs = [];

    const currentBlock = idBlocks[0];
    const idsDomain = [["identifier", "in", currentBlock]];
    const fullDomain = [...domain, ...idsDomain, ["company_identifier", "=", company]];

    if (tab === "N") {
      fullDomain.push(["TipoDeComprobante", "=", tab]);
    }

    const obj = (
      await http.post("/Poliza/export", {
        domain: fullDomain,
        fields: FIELDS_POLICIES,
        format,
        export_data: {
          file_name,
          type: "",
        },
      })
    ).data;
    objs.push(obj);

    if (idBlocks.length > 1) {
      const currentBlock = idBlocks[1];
      const idsDomain = [["identifier", "in", currentBlock]];
      const fullDomain = [...domain, ...idsDomain, ["company_identifier", "=", company]];
      const obj = (
        await http.post("/Poliza/export", {
          domain: fullDomain,
          fields: FIELDS_POLICIES,
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
      const idsDomain = [["identifier", "in", currentBlock]];
      const fullDomain = [...domain, ...idsDomain, ["company_identifier", "=", company]];
      const obj = (
        await http.post("/Poliza/export", {
          domain: fullDomain,
          fields: FIELDS_POLICIES,
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
      const idsDomain = [["identifier", "in", currentBlock]];
      const fullDomain = [...domain, ...idsDomain, ["company_identifier", "=", company]];
      const obj = (
        await http.post("/Poliza/export", {
          domain: fullDomain,
          fields: FIELDS_POLICIES,
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
  }
  return [];
};
