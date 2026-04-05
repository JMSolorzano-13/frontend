import { useEffect, useState } from "react";
import { Grid, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { xml2js } from "xml-js";
import { useSelector } from "react-redux";
import getPayrollFromXML from "@utils/Payroll/XMLPayrollParser";
import { payrollParsedType } from "@utils/Payroll/types";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { authSelector } from "@store/authSlice";
import http from "src/api/_http";

type Props = {
  cfdi: CFDI | undefined;
  loading: boolean | undefined;
};

export default function PayrollTable(props: Props) {
  const { cfdi } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [perceptions, setPerceptions] = useState<PerceptsAndOtherPaymentsDataType[]>([]);
  const [deductions, setDeductions] = useState<DeductionsDataType[]>([]);
  const currentUrl = window.location.pathname;
  const { company } = useSelector(authSelector);

  useEffect(() => {
    async function handleLoadData() {
      if (cfdi && company) {
        try {
          setIsLoading(true);
          const payload = {
            domain: [
              ["company_identifier", "=", company],
              ["UUID", "=", cfdi.UUID],
              ["is_issued", "=", currentUrl.includes("issued") ? true : false],
            ],
            fields: ["xml_content", "UUID"],
          };
          const res = await http.post("/CFDI/search", payload);
          const data = res.data;
          const findXmlContent = data.data.find((i: any) => i.xml_content);
          const xmlParsed = xml2js(findXmlContent.xml_content, { compact: true });
          const dataFromXMLParsed = getPayrollFromXML(xmlParsed as payrollParsedType);
          const perceptData: PerceptsAndOtherPaymentsDataType[] = [];
          dataFromXMLParsed.Percepciones?.forEach((row, key) => {
            perceptData.push({
              key: key,
              Clave: row.Clave,
              Concepto: row.Concepto,
              Importe: (parseFloat(row.ImporteExento) + parseFloat(row.ImporteGravado)).toString(),
              ImporteExento: row.ImporteExento,
              ImporteGravado: row.ImporteGravado,
              TipoOtroPago: null,
              TipoPercepcion: row.TipoPercepcion,
            });
          });
          dataFromXMLParsed.OtrosPagos?.forEach((row, key) => {
            perceptData.push({
              key: key,
              Clave: row.Clave,
              Concepto: row.Concepto,
              Importe: row.Importe,
              ImporteExento: null,
              ImporteGravado: null,
              TipoOtroPago: row.TipoOtroPago,
              TipoPercepcion: null,
            });
          });
          setPerceptions(() => perceptData);
          // Fill deductions data
          const deductionsData: DeductionsDataType[] = [];
          dataFromXMLParsed.Deducciones?.forEach((row, key) => {
            deductionsData.push({
              key: key,
              Clave: row.Clave,
              Concepto: row.Concepto,
              Importe: row.Importe,
              TipoDeduccion: row.TipoDeduccion,
            });
          });
          setDeductions(() => deductionsData);
        } catch (error) {
          console.error("error", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    handleLoadData();
  }, [cfdi, currentUrl, company]);

  const { useBreakpoint } = Grid;
  const { md } = useBreakpoint();

  return (
    <section
      style={{
        display: "flex",
        width: "102%",
        marginLeft: "-10px",
        gap: "8px",
        flexDirection: md ? "row" : "column",
      }}
    >
      <Table
        columns={perceptColumns}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{`Gravado: ${formatDisplay(
              record.ImporteGravado,
              DisplayType.MONEY
            )} - Exento: ${formatDisplay(record.ImporteExento, DisplayType.MONEY)}`}</p>
          ),
          rowExpandable: (record) =>
            record.ImporteExento !== null || record.ImporteGravado !== null,
        }}
        dataSource={perceptions}
        style={md ? { width: "50%" } : { width: "100%" }}
        size="small"
        rowKey="key"
        scroll={perceptions.length > 5 ? { y: 200, x: 550 } : { x: 400 }}
        loading={isLoading}
        // bordered={true}
      />
      <Table
        columns={deductionsColumns}
        pagination={false}
        dataSource={deductions}
        loading={isLoading}
        style={md ? { width: "50%" } : { width: "100%" }}
        size="small"
        rowKey="key"
        scroll={deductions.length > 5 ? { y: 200, x: 495 } : { x: 400 }}
        // bordered={true}
      />
    </section>
  );
}

interface PerceptsAndOtherPaymentsDataType {
  key: React.Key;
  Clave: string;
  Concepto: string;
  Importe: string | null;
  ImporteExento: string | null;
  ImporteGravado: string | null;
  TipoOtroPago: string | null;
  TipoPercepcion: string | null;
}

const perceptColumns: ColumnsType<PerceptsAndOtherPaymentsDataType> = [
  { ...Table.EXPAND_COLUMN, width: "0%" },
  {
    title: "Percepciones y otros pagos",
    dataIndex: "Clave",
    key: "clave",
    width: "8%",
    colSpan: 3,
    align: "left",
  },
  {
    title: "Concepto",
    colSpan: 0,
    dataIndex: "Concepto",
    key: "concepto",
    width: "75%",
  },
  {
    title: "Importe",
    colSpan: 0,
    dataIndex: "Importe",
    render: (_, record: PerceptsAndOtherPaymentsDataType) => {
      return (
        <div style={{ marginRight: "10px" }}>
          {formatDisplay(record.Importe, DisplayType.MONEY)}
        </div>
      );
    },
    key: "Importe",
    align: "right",
    width: "18%",
  },
];

interface DeductionsDataType {
  key: React.Key;
  Clave: string;
  Concepto: string;
  Importe: string;
  TipoDeduccion: string;
}

const deductionsColumns: ColumnsType<DeductionsDataType> = [
  {
    title: "Deducciones",
    dataIndex: "Clave",
    key: "clave",
    width: "8%",
    colSpan: 3,
    align: "left",
  },
  {
    title: "Concepto",
    colSpan: 0,
    dataIndex: "Concepto",
    key: "concepto",
    width: "75%",
  },
  {
    title: "Importe",
    colSpan: 0,
    dataIndex: "Importe",
    render: (_, record: DeductionsDataType) => {
      return (
        <div style={{ marginRight: "10px" }}>
          {formatDisplay(record.Importe, DisplayType.MONEY)}
        </div>
      );
    },
    key: "Importe",
    align: "right",
    width: 70,
  },
];
