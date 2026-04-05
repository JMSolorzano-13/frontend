import { useState, useEffect } from "react";
import { Space, Table } from "antd";
import { uniqueId, flatten } from "lodash";
import { useSelector } from "react-redux";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { authSelector } from "@store/authSlice";
import http from "src/api/_http";
import { conceptColumns } from "@components/cfdis/ConceptColumns";
import { ISRRecordType } from "@pages/ISR/_types/ISRTypes";

type Props = {
  cfdi: CFDI | IVACFDI | undefined;
  visible: boolean;
  isLoading?: boolean;
  cfdiFromRecord: ISRRecordType | IVACFDI | CFDI | undefined;
  isRelatedModal: boolean;
};

export default function DefaultTable(props: Props) {
  const { cfdi, visible, isLoading, isRelatedModal } = props;
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const { company } = useSelector(authSelector);
  const [conceptsArray, setConceptsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const currentUrl = window.location.pathname;

  useEffect(() => {
    async function handleLoadConcepts() {
      try {
        if (cfdi && company && visible) {
          setConceptsArray([]);
          setLoading(true);
          const payload = {
            domain: [
              ["company_identifier", "=", company],
              ["UUID", "=", cfdi.UUID],
            ],
            fields: ["Conceptos", "UUID"],
          };

          const res = await http.post("/CFDI/search", payload);
          const data = res.data;

          const parsedConcepts = flatten(
            data.data.map((item: any) => {
              const parsedData = JSON.parse(item.Conceptos).Concepto;

              const parseConcept = (concept: any) => ({
                id: uniqueId(),
                ClaveProducto: concept["@ClaveProdServ"],
                Cantidad: concept["@Cantidad"],
                ClaveUnidad: concept["@ClaveUnidad"],
                Descripcion: concept["@Descripcion"],
                PrecioUnitario: concept["@ValorUnitario"],
                Importe: concept["@Importe"],
                Descuento: concept["@Descuento"],
                Impuestos: concept.Impuestos,
                CuentaPredial: Array.isArray(concept?.CuentaPredial)
                  ? concept.CuentaPredial.map((item: any) => item["@Numero"]).join(", ")
                  : concept?.CuentaPredial?.["@Numero"] || null,
              });

              if (Array.isArray(parsedData)) {
                return parsedData.map(parseConcept);
              } else {
                return parseConcept(parsedData);
              }
            })
          );

          if (parsedConcepts) {
            setConceptsArray(() => parsedConcepts as any);
            setLoading(false);
          }
        }
      } catch (error) {
        setLoading(false);
        setConceptsArray([]);
      } finally {
        setLoading(false);
      }
    }
    handleLoadConcepts();
  }, [cfdi, visible, company, currentUrl, isRelatedModal]);

  function getImpuestoLabel(impuestoCode: number) {
    if (impuestoCode.toString() === "001") {
      return "ISR";
    } else if (impuestoCode.toString() === "002") {
      return "IVA";
    } else if (impuestoCode.toString() === "003") {
      return "IEPS";
    }
  }

  return (
    <Table
      pagination={{
        defaultCurrent: 1,
        current: page,
        pageSize: 30,
        total: conceptsArray.length,
        showTotal: (total) =>
          total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
        showSizeChanger: false,
        onChange: (newPage) => setPage(newPage),
      }}
      rowKey={(record, key) =>
        key + record.id + record.Descripcion + record.ClaveUnidad + record.Impuestos
      }
      size="small"
      loading={loading || isLoading}
      style={{ marginTop: "16px" }}
      scroll={{ y: 400, x: 20 }}
      dataSource={loading ? [] : conceptsArray}
      columns={conceptColumns}
      expandable={{
        defaultExpandAllRows: true,
        rowExpandable: (record) => !!record.Impuestos || !!record.CuentaPredial,
        expandedRowClassName: () => "white-expanded-row",
        expandedRowKeys: expandedRows,
        onExpandedRowsChange: (expandedRows) => {
          setExpandedRows(expandedRows as string[]);
        },
        columnWidth: 25,
        expandedRowRender: (record) => {
          const trasladoTaxes = record?.Impuestos?.Traslados?.Traslado;
          let trasladoTaxesElement: JSX.Element | null = null;
          if (trasladoTaxes) {
            let trasladoTaxesToArray: CFDITaxes[] = [];
            if (!Array.isArray(trasladoTaxes)) {
              trasladoTaxesToArray = [record?.Impuestos?.Traslados?.Traslado];
            } else {
              trasladoTaxesToArray = trasladoTaxes;
            }
            const trasladoTaxesArray = trasladoTaxesToArray?.map((tax: CFDITaxes) => {
              return (
                <Space key={tax["@Impuesto"]}>
                  <p>Impuesto: {getImpuestoLabel(tax["@Impuesto"])}</p>
                  <p>Base: {formatDisplay(tax["@Base"], DisplayType.MONEY)}</p>
                  <p>Tasa: {tax["@TasaOCuota"]}</p>
                  <p>Importe: {formatDisplay(tax["@Importe"], DisplayType.MONEY)}</p>
                </Space>
              );
            });
            trasladoTaxesElement = (
              <Space align="start">
                <p style={{ marginRight: 15 }}>Traslados:</p>
                <div
                  key="translations"
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {trasladoTaxesArray}
                </div>
              </Space>
            );
          }

          const retencionTaxes = record?.Impuestos?.Retenciones?.Retencion;
          let retencionTaxesElement: JSX.Element | null = null;
          if (retencionTaxes) {
            let retencionTaxesToArray: CFDITaxes[] = [];
            if (!Array.isArray(retencionTaxes)) {
              retencionTaxesToArray = [record?.Impuestos?.Retenciones?.Retencion];
            } else {
              retencionTaxesToArray = retencionTaxes;
            }
            const retencionTaxesArray = retencionTaxesToArray.map((tax: CFDITaxes) => {
              return (
                <Space key={tax["@Impuesto"]}>
                  <p>Impuesto: {getImpuestoLabel(tax["@Impuesto"])}</p>
                  <p>Base: {formatDisplay(tax["@Base"], DisplayType.MONEY)}</p>
                  <p>Tasa: {tax["@TasaOCuota"]}</p>
                  <p>Importe: {formatDisplay(tax["@Importe"], DisplayType.MONEY)}</p>
                </Space>
              );
            });
            retencionTaxesElement = (
              <Space align="start">
                <p>Retenciones:</p>
                <div key="retentions" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {retencionTaxesArray}
                </div>
              </Space>
            );
          }

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div>{trasladoTaxesElement}</div>
              <div>{retencionTaxesElement}</div>
              {record?.CuentaPredial && (
                <div>
                  <p>Cuenta predial: {record?.CuentaPredial}</p>
                </div>
              )}
            </div>
          );
        },
      }}
    />
  );
}
