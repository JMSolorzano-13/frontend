import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/lib/table";

export default function expandedPayrollRowColumns() {
  const cols: ColumnsType<CFDIDetails> = [
    {
      title: "Tipo",
      key: "NominaTipoImpuesto",
      dataIndex: "N.Complemento.Tipo",
      render: (_, record) => {
        return record["@TipoImpuesto"];
      },
      width: 40,
    },
    {
      title: "Clave SAT",
      key: "NominaTipo",
      dataIndex: "N.Complemento.Clave",
      render: (_, record) => {
        if (record.tipoNodo === "deduccion") {
          return record["@TipoDeduccion"];
        }
        if (record.tipoNodo === "percepcion") {
          return record["@TipoPercepcion"];
        }
        if (record.tipoNodo === "otro pago") {
          return record["@TipoOtroPago"];
        }
      },
      width: 40,
    },
    {
      title: "Clave",
      key: "NominaClave",
      dataIndex: "N.Complemento.TipoComplemento",
      render: (_, record) => {
        return record["@Clave"];
      },
      width: 40,
    },
    {
      title: "Concepto",
      key: "NominaConcepto",
      dataIndex: "N.Complemento.Concepto",
      render: (_, record) => {
        return record["@Concepto"];
      },
      width: 90,
    },
    {
      title: "Importe",
      key: "NominaImporte",
      dataIndex: "N.Complemento.Importe",
      render: (_, record) => {
        if (record.tipoNodo === "percepcion") {
          return formatDisplay(
            Number(record["@ImporteGravado"]) + Number(record["@ImporteExento"]),
            DisplayType.MONEY
          );
        }
        return formatDisplay(record["@Importe"], DisplayType.MONEY);
      },
      width: 40,
      align: "right",
    },
    {
      title: "Importe Gravado",
      key: "NominaImporteGravado",
      dataIndex: "N.Complemento.ImporteGravado",
      render: (_, record) => {
        return formatDisplay(record["@ImporteGravado"], DisplayType.MONEY);
      },
      width: 40,
      align: "right",
    },
    {
      title: "Importe Exento",
      key: "NominaImporteExento",
      dataIndex: "N.Complemento.ImporteExento",
      render: (_, record) => {
        return formatDisplay(record["@ImporteExento"], DisplayType.MONEY);
      },
      width: 40,
      align: "right",
    },
  ];

  return cols;
}
