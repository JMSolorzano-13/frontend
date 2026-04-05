import { useEffect, useState } from "react";
import { Typography } from "antd";
import http from "src/api/_http";
import { ColumnGroupType, ColumnType } from "antd/lib/table";
import { LoadingOutlined } from "@ant-design/icons";
import { CFDI_Types } from "@constants/Enums";
import CFDIConceptsTable from "@components/cfdis/CFDIConceptsTable";
import { DoctoRelacionadosFields } from "@constants/Fields";
import { IS_SIIGO } from "@utils/SIIGO/Global";

type Props = {
  record: CFDI;
  company: string | null;
  generalDetailsColumns?: (ColumnGroupType<CFDIDetails> | ColumnType<CFDIDetails>)[];
  expanded: boolean;
  tab?: CFDI_Types;
};

export default function GetExtraRows({
  record,
  company,
  expanded,
  generalDetailsColumns,
  tab,
}: Props) {
  const [concepts, setConcepts] = useState<CFDIDetails[]>([]);
  const [payrollConcepts, setPayrollConcepts] = useState<CFDIDetails[]>([]);
  const [paymentConcepts, setPaymentsConcepts] = useState<CFDIDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUrl = window.location.pathname;

  useEffect(() => {
    if (!expanded || !company) return;

    setLoading(true);

    switch (tab) {
      case "N":
        handleLoadPayrollConcepts();
        break;
      case "P":
        handleLoadPaymentConcepts();
        break;
      default:
        handleLoadConcepts();
        break;
    }

    async function handleLoadConcepts() {
      try {
        if (expanded && company) {
          const payload = {
            domain: [
              ["company_identifier", "=", company],
              ["UUID", "=", record.UUID],
              ["is_issued", "=", currentUrl.includes("issued") ? true : false],
            ],
            fields: ["Conceptos", "UUID"],
          };
          const res = await http.post("/CFDI/search", payload);
          const { data } = res?.data ?? null;
          if (data) {
            const conceptosData = JSON.parse(data[0].Conceptos);
            const conceptos = conceptosData.Concepto;

            const conceptosJSON = Array.isArray(conceptos)
              ? conceptos.map((concept: any) => ({
                  Conceptos: JSON.stringify({ Concepto: { ...concept } }),
                }))
              : [{ Conceptos: JSON.stringify({ Concepto: { ...conceptos } }) }];

            setConcepts(conceptosJSON);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("error while fetching concepts", error);
      } finally {
        setLoading(false);
      }
    }
    async function handleLoadPayrollConcepts() {
      try {
        if (expanded && company) {
          const payload = {
            domain: [
              ["company_identifier", "=", company],
              ["UUID", "=", record.UUID],
              ["is_issued", "=", currentUrl.includes("issued") ? true : false],
            ],
            fields: ["UUID", "nomina.Percepciones", "nomina.Deducciones", "nomina.OtrosPagos"],
          };
          const res = await http.post("/CFDI/search", payload);
          const { data } = res?.data ?? null;
          if (data) {
            const payrollData: PayrollType = data[0].nomina || [];
            let payrollConcepts = [];
            const payrollOtherPayments: CFDIPayrollDeduction[] = [];
            if (payrollData?.OtrosPagos) {
              if (Array.isArray(payrollData?.OtrosPagos)) {
                payrollData.OtrosPagos.map((val) => {
                  if (Array.isArray(val.OtroPago)) {
                    val.OtroPago.map((pago) => {
                      const otroPago = {
                        "@TipoImpuesto": "Otro pago",
                        "@Clave": pago["@Clave"],
                        "@Concepto": pago["@Concepto"],
                        "@Importe": pago["@Importe"],
                        "@ImporteGravado": null,
                        "@ImporteExento": null,
                        "@TipoOtroPago": pago["@TipoOtroPago"],
                        "@TipoDeduccion": null,
                        "@TipoPercepcion": null,
                        tipoNodo: "otro pago",
                      };
                      payrollOtherPayments.push(otroPago);
                    });
                  }
                });
              }
            }
            const payrollDeductions: CFDIPayrollDeduction[] = [];
            if (payrollData?.Deducciones) {
              if (Array.isArray(payrollData?.Deducciones)) {
                payrollData.Deducciones.map((val) => {
                  if (Array.isArray(val.Deduccion)) {
                    val.Deduccion.map((pago) => {
                      const otroPago = {
                        "@TipoImpuesto": "Deducción",
                        "@Clave": pago["@Clave"],
                        "@Concepto": pago["@Concepto"],
                        "@Importe": pago["@Importe"],
                        "@ImporteGravado": null,
                        "@ImporteExento": null,
                        "@TipoOtroPago": null,
                        "@TipoDeduccion": pago["@TipoDeduccion"],
                        "@TipoPercepcion": null,
                        tipoNodo: "deduccion",
                      };
                      payrollOtherPayments.push(otroPago);
                    });
                  }
                });
              }
            }
            const payrollPerceptions: CFDIPayrollDeduction[] = [];
            if (payrollData?.Percepciones) {
              if (Array.isArray(payrollData?.Percepciones)) {
                payrollData.Percepciones.map((val) => {
                  if (Array.isArray(val.Percepcion)) {
                    val.Percepcion.map((pago) => {
                      const otroPago = {
                        "@TipoImpuesto": "Percepción",
                        "@Clave": pago["@Clave"],
                        "@Concepto": pago["@Concepto"],
                        "@Importe": null,
                        "@ImporteGravado": pago["@ImporteGravado"],
                        "@ImporteExento": pago["@ImporteExento"],
                        "@TipoOtroPago": null,
                        "@TipoDeduccion": null,
                        "@TipoPercepcion": pago["@TipoPercepcion"],
                        tipoNodo: "percepcion",
                      };
                      payrollPerceptions.push(otroPago);
                    });
                  }
                });
              }
            }
            payrollConcepts = [
              ...payrollPerceptions,
              ...payrollDeductions,
              ...payrollOtherPayments,
            ];
            setPayrollConcepts(payrollConcepts);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("error while fetching concepts", error);
      } finally {
        setLoading(false);
      }
    }

    async function handleLoadPaymentConcepts() {
      try {
        if (expanded && company) {
          const payload = {
            domain: [
              ["UUID", "=", record.UUID],
              ["company_identifier", "=", company],
            ],
            fields: DoctoRelacionadosFields,
          };
          const res = await http.post("/DoctoRelacionado/search", payload);
          const { data } = res?.data ?? null;

          if (data) {
            setPaymentsConcepts(data);
          }
        }
      } catch (error) {
        console.error("error while fetching concepts", error);
      } finally {
        setLoading(false);
      }
    }
  }, [expanded, company, currentUrl, tab, record.UUID]);

  const conceptsToShow = tab === "N" ? payrollConcepts : tab === "P" ? paymentConcepts : concepts;

  const emptyMessage = () => {
    if (conceptsToShow.length === 0 && !loading) {
      return IS_SIIGO
        ? "No contamos con el XML relacionado para este CFDI"
        : "ezaudita no cuenta con el XML relacionado para este CFDI";
    } else if (conceptsToShow.length === 0) {
      return "Este CFDI no tiene conceptos evidencias";
    }
    return null;
  };
  const message = emptyMessage();

  return (
    <div className="secondary-concepts-table">
      <div id="table-container" className="secondary-concepts-table" style={{ padding: 4 }}>
        {!loading && conceptsToShow.length !== 0 ? (
          <CFDIConceptsTable
            generalDetailsColumns={generalDetailsColumns}
            concepts={conceptsToShow}
            loading={loading}
          />
        ) : loading ? (
          <LoadingOutlined style={{ margin: 20, fontSize: 20 }} />
        ) : (
          <Typography.Text style={{ margin: 10 }}>{message}</Typography.Text>
        )}
      </div>
    </div>
  );
}
