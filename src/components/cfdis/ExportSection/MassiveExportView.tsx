import { useState, Key, useEffect } from "react";
import { Row, Col, Typography, Tag, message } from "antd";
import { ColumnGroupType, ColumnType } from "antd/lib/table";
import { SyncOutlined } from "@ant-design/icons";
import { CloseCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useSelector } from "react-redux";
import { updateIssuedCFDIsByID, updateReceivedCFDIsByID } from "@store/cfdiSlice";
import { useAppDispatch } from "@store/store";
import { setCFDIConfig } from "@store/cfdiSlice/setCFDIConfig";
import { exportCFDI } from "@utils/exportCFDI";
import { authSelector } from "@store/authSlice";
import delayedDownload from "@utils/delayedDownload";
import { CFDI_Types } from "@constants/Enums";
import getUpdateIVADomain from "@pages/IVA/_utils/getUpdateIVADomain";
import { UpdateUUIDsType } from "@pages/IVA/_types/StateTypes";
import { commonSelector } from "@store/common";
import { theme } from "antd";

interface ExportViewType {
  cfdis: Key[];
  groupedCFDIs: GroupedCFDIs;
  columns: (ColumnType<CFDI> | ColumnGroupType<CFDI>)[];
  cleanRows: () => void;
  tab: CFDI_Types;
  module: CFDIModule;
}

type ActionType = "XML" | "PDF" | "XLSX" | "Consider" | "Not Consider" | "Unselect";

const { useToken } = theme;

export default function MassiveExportView({
  cfdis,
  groupedCFDIs,
  columns,
  cleanRows,
  tab,
  module,
}: ExportViewType) {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const [linksToDownload, setLinksToDownload] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { company, rfc } = useSelector(authSelector);
  const { datesValue } = useSelector(commonSelector);

  const fieldsToExport = columns
    .filter(
      (c: ColumnType<CFDI>) => c.dataIndex !== undefined && !String(c.dataIndex).includes("c_")
    )
    .map((c: ColumnType<CFDI>) => c.dataIndex as string);
  const uniqueFields = _.uniq(fieldsToExport);

  const handleExports = (action: ActionType) => async () => {
    setLoading(true);
    if (action === "Consider") {
      await considerForIVA();
      cleanRows();
    }
    if (action === "Not Consider") {
      await NotConsiderForIVA();
      cleanRows();
    }
    if (action === "PDF") {
      await performExportCFDI(action);
    }
    if (action === "XML") {
      await performExportCFDI(action);
    }
    if (action === "XLSX") {
      await performExportCFDI(action);
    }
    if (action === "Unselect") {
      cleanRows();
      setLoading(false);
    }
  };

  useEffect(() => {
    const downloadLinks = () => {
      if (linksToDownload.length > 0) {
        delayedDownload(linksToDownload);
        setLinksToDownload([]);
        setLoading(false);
        cleanRows();
      }
    };
    downloadLinks();
  }, [linksToDownload]);

  async function NotConsiderForIVA() {
    try {
      const filteredCFDIs: UpdateUUIDsType = groupedCFDIs.cfdis
        .filter((i) => i.Version === "4.0" && i.MetodoPago !== "PPD")
        .filter((i) => {
          const include = cfdis.find((j) => j === i.UUID);
          if (include && !i.ExcludeFromIVA) {
            return i;
          }
          return false;
        })
        .map((item) => {
          return { uuid: item.UUID, currentValue: item.ExcludeFromIVA, is_issued: item.is_issued };
        });
      const getUUIDsToModifyDomain = getUpdateIVADomain(filteredCFDIs);
      if (filteredCFDIs.length > 0 && module === "issued") {
        await dispatch(setCFDIConfig({ uuidsToModify: getUUIDsToModifyDomain.cfdis }));
        await dispatch(updateIssuedCFDIsByID(filteredCFDIs));
      }
      if (filteredCFDIs.length > 0 && module === "received") {
        await dispatch(setCFDIConfig({ uuidsToModify: getUUIDsToModifyDomain.cfdis }));
        await dispatch(updateReceivedCFDIsByID(filteredCFDIs));
      }
    } catch (error) {
      message.error("Hubo un error al considerar CFDIs en el IVA");
    } finally {
      message.open({
        type: "success",
        content: `CFDIs marcados como no considerados en el cálculo del IVA con éxito`,
      });
      setLoading(false);
    }
  }

  async function considerForIVA() {
    try {
      const filteredCFDIs: UpdateUUIDsType = groupedCFDIs.cfdis
        .filter((i) => i.Version === "4.0" && i.MetodoPago !== "PPD")
        .filter((i) => {
          const include = cfdis.find((j) => j === i.UUID);
          if (include && i.ExcludeFromIVA) {
            return i;
          }
          return false;
        })
        .map((item) => {
          return { uuid: item.UUID, currentValue: item.ExcludeFromIVA, is_issued: item.is_issued };
        });

      const getUUIDsToModifyDomain = getUpdateIVADomain(filteredCFDIs);
      if (filteredCFDIs.length > 0 && module === "issued") {
        await dispatch(setCFDIConfig({ uuidsToModify: getUUIDsToModifyDomain.cfdis }));
        await dispatch(updateIssuedCFDIsByID(filteredCFDIs));
      }
      if (filteredCFDIs.length > 0 && module === "received") {
        await dispatch(setCFDIConfig({ uuidsToModify: getUUIDsToModifyDomain.cfdis }));
        await dispatch(updateReceivedCFDIsByID(filteredCFDIs));
      }
    } catch (error) {
      message.error("Hubo un error al no considerar CFDIs en el IVA");
    } finally {
      message.open({
        type: "success",
        content: `CFDIs marcados como considerados en el cálculo del IVA con éxito`,
      });
      setLoading(false);
    }
  }

  async function performExportCFDI(format: "CSV" | "PDF" | "XML" | "XLSX") {
    if (cfdis.length === 0) {
      message.error("No se ha seleccionado ningún CFDI");
      return;
    }
    exportCFDI({
      company,
      format,
      selectedIds: cfdis as string[],
      fields: uniqueFields,
      tab,
      exportName: {
        group: module,
        subtitle: tab,
        datesValue,
        rfc: rfc as string,
      },
      exportType: "cfdi",
    })
      .then((links) => {
        setLinksToDownload(links);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleShow() {
    return (
      tab === CFDI_Types.PAYROLL ||
      tab === CFDI_Types.TRANSFER ||
      (module === "received" && tab === CFDI_Types.PAYMENT)
    );
  }
  return (
    <Col style={{ backgroundColor: "white", paddingLeft: 15, paddingBottom: 10 }}>
      {cfdis.length === 0 ? (
        <></>
      ) : (
        <Row
          style={{
            width: "100%",
            flex: 1,
            padding: 10,
            backgroundColor: "#CADCEF",
            alignItems: "center",
          }}
          className={cfdis.length > 0 ? `animate-fade-in-down` : `animate-fade-out-down`}
        >
          <Typography style={{ marginRight: 20, color: "#096DD9", marginLeft: 10 }}>
            {cfdis.length} CFDIs seleccionados
          </Typography>
          <Typography style={{ marginRight: 10 }}>Descargar:</Typography>
          <Tag
            color={token.colorPrimary}
            style={{ marginRight: 10, cursor: loading ? "not-allowed" : "pointer", height: 22 }}
            onClick={!loading ? handleExports("XML") : () => null}
            icon={loading ? <SyncOutlined spin /> : null}
          >
            XML
          </Tag>

          <>
            <Tag
              color={token.colorPrimary}
              style={{ marginRight: 10, cursor: loading ? "not-allowed" : "pointer", height: 22 }}
              onClick={!loading ? handleExports("PDF") : () => null}
              icon={loading ? <SyncOutlined spin /> : null}
            >
              PDF
            </Tag>
            <Tag
              color={token.colorPrimary}
              style={{ marginRight: 10, cursor: loading ? "not-allowed" : "pointer", height: 22 }}
              onClick={!loading ? handleExports("XLSX") : () => null}
              icon={loading ? <SyncOutlined spin /> : null}
            >
              Excel
            </Tag>
          </>
          <div style={{ height: 30, width: 1, backgroundColor: "#B1B3B8", marginRight: 10 }} />
          {!handleShow() && (
            <>
              <Tag
                color={token.colorPrimary}
                style={{ marginRight: 10, cursor: "pointer", height: 22 }}
                onClick={handleExports("Not Consider")}
              >
                No considerar IVA
              </Tag>
              <div style={{ height: 30, width: 1, backgroundColor: "#B1B3B8", marginRight: 10 }} />
            </>
          )}

          {!handleShow() && (
            <>
              <Tag
                color={token.colorPrimary}
                style={{ marginRight: 10, cursor: "pointer", height: 22 }}
                onClick={handleExports("Consider")}
              >
                Considerar IVA
              </Tag>
              <div style={{ height: 30, width: 1, backgroundColor: "#B1B3B8", marginRight: 10 }} />
            </>
          )}
          <Tag
            color="#F3F3F3"
            style={{ marginRight: 10, cursor: "pointer", color: "rgba(0, 0, 0, 0.75)" }}
            icon={<CloseCircleOutlined />}
            onClick={handleExports("Unselect")}
          >
            Deseleccionar todos
          </Tag>
        </Row>
      )}
    </Col>
  );
}
