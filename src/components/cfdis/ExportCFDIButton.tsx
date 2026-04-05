import { DownloadOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { ColumnGroupType, ColumnType } from "antd/lib/table";
import { Key, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { ADD_CFDI_Types, CFDI_Types } from "@constants/Enums";
import { months } from "@constants/Extra";
import { cfdiSelector } from "@store/cfdiSlice";
import { getMassiveExport } from "@store/cfdiSlice/getMassiveExport";
import delayedDownload from "@utils/delayedDownload";
import { useAppDispatch } from "@store/store";
import { ColumnsType } from "antd/es/table";
import expandedRowColumns from "@utils/CFDI/expandedRowColumns";
import {
  fieldsDoctoRelacionadosEmisor,
  fieldsDoctoRelacionadosReceptor,
} from "@utils/CFDI/fieldsDoctoRelacionados";

type Props = {
  selectedKeys: Key[];
  columns: (ColumnType<CFDI> | ColumnGroupType<CFDI>)[];
  columnsADD?: (ColumnType<ADDCFDI> | ColumnGroupType<ADDCFDI>)[];
  datesValue: string | null;
  rfc: string | null;
  activeRadioDomain: Domain;
  advancedFilterDomain: Domain;
  moduleId: CFDIModule;
  tab: CFDI_Types | ADD_CFDI_Types;
  debouncedSearch: string;
  cfdiCount: CFDICount | number | null;
  textButton: string;
  moduleType?: string;
  PPDFilters?: Domain;
  detailsColumn?: ColumnsType<CFDIDetails>;
  exportDetails?: boolean;
};

export default function ExportCFDIButton(props: Props) {
  const {
    selectedKeys,
    columns,
    datesValue,
    rfc,
    activeRadioDomain,
    advancedFilterDomain,
    moduleId,
    tab,
    debouncedSearch,
    cfdiCount,
    columnsADD,
    textButton,
    moduleType,
    PPDFilters,
    detailsColumn,
    exportDetails,
  } = props;
  const [linksToDownload, setLinksToDownload] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { isFetchingMassiveExports } = useSelector(cfdiSelector);
  const [periodTextToDisplay, setPeriodTextToDisplay] = useState<string>();

  // get Selected Period
  const selectedPeriod = (datesValue: string | null) => {
    if (datesValue !== null) {
      let selectedPeriodText = "";
      const splittedDateValues = datesValue.split("|");
      const [currD] = splittedDateValues;
      if (splittedDateValues.length < 3) {
        const [selectedYear] = currD.split("-");
        selectedPeriodText = selectedYear;
        return selectedPeriodText;
      }

      const [year, month] = currD.split("-");
      selectedPeriodText = `${year} - ${months[Number(month) - 1]}`;
      return selectedPeriodText;
    }
    return "";
  };

  let fieldsToExport: string[];
  const customConcepts: string[] =
    detailsColumn?.map((c: ColumnType<CFDIDetails>) => c.dataIndex as string) || [];
  const defaultConcepts = expandedRowColumns().map(
    (c: ColumnType<CFDIDetails>) => c.dataIndex as string
  );
  const conceptsToExport = tab === "I" || tab === "N" ? customConcepts : defaultConcepts;

  if (columnsADD) {
    fieldsToExport = columnsADD
      .filter(
        (c: ColumnType<ADDCFDI>) =>
          c.dataIndex !== undefined && !String(c.dataIndex).includes("action")
      )
      .map((c: ColumnType<ADDCFDI>) =>
        c.dataIndex?.toLocaleString().startsWith("c_")
          ? `${c.dataIndex}.name`
          : (c.dataIndex as string)
      );
  } else {
    fieldsToExport = columns
      .filter((c: ColumnType<CFDI>) => c.dataIndex !== undefined)
      .map((c: ColumnType<CFDI>) =>
        c.dataIndex?.toLocaleString().startsWith("c_")
          ? `${c.dataIndex}.name`
          : (c.dataIndex as string)
      );
  }

  const downloadLinks = () => {
    if (linksToDownload.length > 0) {
      delayedDownload(linksToDownload);
      setLinksToDownload([]);
    }
  };

  const efosIndex = fieldsToExport.findIndex((field) => field === "efos");
  const paidByIndex = fieldsToExport.findIndex((field) => field === "paid_by");
  const polizasIndex = fieldsToExport.findIndex((field) => field === "polizas");

  if (efosIndex !== -1) {
    fieldsToExport[efosIndex] = "efos.state";
  }

  if (paidByIndex !== -1) {
    fieldsToExport[paidByIndex] = "paid_by.UUID";
  }

  if (polizasIndex !== -1) {
    fieldsToExport[polizasIndex] = "polizas_list";
  }

  const uniqueFields = _.uniq(fieldsToExport);

  /* const performExportCFDI = async (format: "CSV" | "PDF" | "XML" | "XLSX") => {
    if (selectedKeys.length === 0) {
      message.error("No se ha seleccionado ningún CFDI");
      return;
    }
    setIsExporting(true);
    exportCFDI({
      company,
      format,
      selectedIds: selectedKeys as string[],
      fields: uniqueFields,
    })
      .then((links) => {
        setLinksToDownload(links);
      })
      .finally(() => {
        setIsExporting(false);
      });
  };*/
  useEffect(() => {
    if (datesValue === "Todos") {
      setPeriodTextToDisplay(
        `No se puede descargar el Periodo seleccionado (${selectedPeriod(datesValue)})`
      );
    } else if (tab === "ALL") {
      setPeriodTextToDisplay("No se puede descargar por Periodo en la pestaña actual ('Todos')");
    } else {
      setPeriodTextToDisplay(`Descargar periodo seleccionado (${selectedPeriod(datesValue)}):`);
    }
  }, [tab, datesValue]);

  const performMassiveExportCFDI = async (
    format: "XML" | "XLSX",
    withCocenpts = false,
    module?: string,
    exportType?: "doctos" | "conceptos"
  ) => {
    let fields = [];
    if (!datesValue || !rfc) return;
    const domain: Domain =
      PPDFilters && tab === "I"
        ? [...activeRadioDomain, ...advancedFilterDomain, ...PPDFilters]
        : [...activeRadioDomain, ...advancedFilterDomain];
    const overridePeriodDates = activeRadioDomain.find((d) => d[0] === "FechaFiltro") !== undefined;

    if (moduleId === "efos") {
      domain.push(["efos", "=", "any"]);
      domain.push(["is_issued", "=", false]);
    }
    if (format === "XML") {
      fields = ["UUID", "xml_content"];
    } else {
      if (withCocenpts && (tab === "I" || tab === "E" || tab === "N")) {
        fields = [...uniqueFields, ...conceptsToExport];
      } else if (withCocenpts && tab === "P") {
        fields = [
          ...(module === "issued"
            ? fieldsDoctoRelacionadosEmisor
            : fieldsDoctoRelacionadosReceptor),
        ];
      } else {
        fields = [...uniqueFields];
      }
    }

    dispatch(
      getMassiveExport(
        withCocenpts
          ? {
              module: moduleId,
              type: tab,
              options: {
                domain,
                search: debouncedSearch,
                overridePeriodDates,
                format,
              },
              fields: [...fields],
              seccionType: moduleType || null,
              exportType,
            }
          : {
              module: moduleId,
              type: tab,
              options: {
                domain,
                search: debouncedSearch,
                overridePeriodDates,
                format,
              },
              fields: [...fields],
              seccionType: moduleType || null,
            }
      )
    );
  };

  const menu = useMemo<MenuProps["items"]>(() => {
    const menuItems: MenuProps["items"] = [
      {
        key: "period-desc-text",
        label: periodTextToDisplay,
      },
    ];
    menuItems.push({
      key: "export-period-xlsx",
      icon: <DownloadOutlined />,
      disabled: datesValue === "Todos" || tab === "ALL",
      onClick: () => {
        performMassiveExportCFDI("XLSX");
      },
      label: "Excel",
    });
    if (exportDetails && tab !== "T" && tab !== "P") {
      menuItems.push({
        key: "export-period-xlsx-details",
        icon: <DownloadOutlined />,
        disabled: datesValue === "Todos" || tab === "ALL",
        onClick: () => {
          performMassiveExportCFDI("XLSX", true, undefined, "conceptos");
        },
        label: "Excel con conceptos",
      });
    }
    if (exportDetails && tab === "P") {
      menuItems.push({
        key: "export-period-xlsx-related-docs",
        icon: <DownloadOutlined />,
        disabled: datesValue === "Todos",
        onClick: () => {
          performMassiveExportCFDI("XLSX", true, moduleId, "doctos");
        },
        label: "Excel con documentos relacionados",
      });
    }
    if (!textButton.includes("Excel")) {
      menuItems.push({
        key: "export-period-xml",
        icon: <DownloadOutlined />,
        label: "XML",
        disabled: datesValue === "Todos" || tab === "ALL",
        onClick: () => {
          performMassiveExportCFDI("XML");
        },
      });
    }
    return menuItems;
  }, [
    selectedKeys,
    datesValue,
    rfc,
    activeRadioDomain,
    advancedFilterDomain,
    moduleId,
    tab,
    debouncedSearch,
    columns,
  ]);

  if (linksToDownload.length > 0) {
    return (
      <Button
        id="download-button"
        type="primary"
        icon={<DownloadOutlined />}
        onClick={() => {
          downloadLinks();
        }}
      >
        Descargar archivos
      </Button>
    );
  }

  return (
    <Dropdown
      menu={{ items: menu }}
      placement="bottomRight"
      disabled={
        (datesValue === "Todos" && selectedKeys.length === 0) ||
        (typeof cfdiCount === "object" ? cfdiCount?.[tab] === "0" : cfdiCount === 0)
      }
    >
      <Button id="export-button">{isFetchingMassiveExports ? "Exportando..." : textButton}</Button>
    </Dropdown>
  );
}
