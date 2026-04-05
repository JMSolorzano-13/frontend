import { ColumnsType } from "antd/lib/table";
import { SorterResult } from "antd/lib/table/interface";
import { CFDI_Types } from "@constants/Enums";

type payrollColumnsType = {
  setModalVisible?: (visible: boolean) => void;
  setCFDIToDisplay?: (state: string) => void;
  setUUIDsToModify?: (state: string[]) => void;
  uuidsToModify?: string[];
  module: CFDIModule;
  sorter?: SorterResult<CFDI>[];
  tab: CFDI_Types;
};

export default function payrollDataColumns(data: payrollColumnsType): ColumnsType<CFDI> {
  const { module } = data;
  const getAllCols: ColumnsType<CFDI> = [
    {
      title: "Fecha de pago",
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: 170,
      fixed: false,
    },
    {
      title: "RFC",
      dataIndex: "rfc",
      key: "rfc",
      width: 300,
      fixed: false,
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: 300,
      fixed: false,
    },
    {
      title: "Tipo régimen",
      dataIndex: "regimeType",
      key: "regimeType",
      width: 170,
      fixed: false,
    },
    {
      title: "Percepciones",
      dataIndex: "percepts",
      key: "percepts",
      width: 170,
      fixed: false,
    },
    {
      title: "Deducciones",
      dataIndex: "deductions",
      key: "deductions",
      width: 170,
      fixed: false,
    },
    {
      title: "Otros pagos",
      dataIndex: "otherPayments",
      key: "otherPayments",
      width: 170,
      fixed: false,
    },
    {
      title: "Sueldos",
      dataIndex: "salary",
      key: "salary",
      width: 170,
      fixed: false,
    },
    {
      title: "Otras percepciones",
      dataIndex: "Other percepts",
      key: "Other percepts",
      width: 170,
      fixed: false,
    },
    {
      title: "Gravado",
      dataIndex: "taxed",
      key: "taxed",
      width: 300,
      fixed: false,
    },
    {
      title: "Exento",
      dataIndex: "exempt",
      key: "exempt",
      width: 170,
      fixed: false,
    },
    {
      title: "ISR retenido",
      dataIndex: "holdedISR",
      key: "holdedISR",
      width: 170,
      fixed: false,
    },
    {
      title: "Otras deducciones",
      dataIndex: "otherDeductions",
      key: "otherDeductions",
      width: 300,
      fixed: false,
    },
    {
      title: "Subsidio causado",
      dataIndex: "causedSubsidy",
      key: "causedSubsidy",
      width: 170,
      fixed: false,
    },
    {
      title: "Neto a pagar",
      dataIndex: "totalNet",
      key: "totalNet",
      width: 170,
      fixed: false,
    },
    {
      title: "Versión",
      dataIndex: "payrollVersion",
      key: "payrollVersion",
      width: 170,
      fixed: false,
    },
    {
      title: "Tipo Nómina",
      dataIndex: "payrollType",
      key: "payrollType",
      width: 170,
      fixed: false,
    },
    {
      title: "Fecha Inicial Pago",
      dataIndex: "initialPaymentDate",
      key: "initialPaymentDate",
      width: 170,
      fixed: false,
    },
    {
      title: "Fecha Final Pago",
      dataIndex: "endPaymentDate",
      key: "endPaymentDate",
      width: 170,
      fixed: false,
    },
    {
      title: "Número Días Pagados",
      dataIndex: "payDayQty",
      key: "payDayQty",
      width: 170,
      fixed: false,
    },
    {
      title: "Registro Patronal",
      dataIndex: "employerRegistry",
      key: "employerRegistry",
      width: 170,
      fixed: false,
    },
    {
      title: "CURP",
      dataIndex: "curp",
      key: "curp",
      width: 150,
      fixed: false,
    },
    {
      title: "Num Seguridad Social",
      dataIndex: "socialSecurityNumber",
      key: "socialSecurityNumber",
      width: 170,
      fixed: false,
    },
    {
      title: "Fecha Inicio Rel Laboral",
      dataIndex: "startWorkRelationDate",
      key: "startWorkRelationDate",
      width: 170,
      fixed: false,
    },
    {
      title: "Antigüedad",
      dataIndex: "antiquity",
      key: "antiquity",
      width: 170,
      fixed: false,
    },
    {
      title: "Tipo Contrato",
      dataIndex: "contractType",
      key: "contractType",
      width: 170,
      fixed: false,
    },
    {
      title: "Sindicalizado",
      dataIndex: "unionized",
      key: "unionized",
      width: 170,
      fixed: false,
    },
    {
      title: "Tipo Jornada",
      dataIndex: "dayType",
      key: "dayType",
      width: 170,
      fixed: false,
    },
    {
      title: "Num Empleado",
      dataIndex: "employeeNumber",
      key: "employeeNumber",
      width: 170,
      fixed: false,
    },
    {
      title: "Departamento",
      dataIndex: "department",
      key: "department",
      width: 170,
      fixed: false,
    },
    {
      title: "Puesto",
      dataIndex: "position",
      key: "position",
      width: 170,
      fixed: false,
    },
    {
      title: "Riesgo Puesto",
      dataIndex: "positionRisk",
      key: "positionRisk",
      width: 170,
      fixed: false,
    },
    {
      title: "Periodicidad pago",
      dataIndex: "paymentPeriodicity",
      key: "paymentPeriodicity",
      width: 170,
      fixed: false,
    },
    {
      title: "Banco",
      dataIndex: "bank",
      key: "bank",
      width: 170,
      fixed: false,
    },
    {
      title: "Cuenta bancaria",
      dataIndex: "bankAccount",
      key: "bankAccount",
      width: 170,
      fixed: false,
    },
    {
      title: "Sal Base Cot",
      dataIndex: "salBaseCot",
      key: "salBaseCot",
      width: 170,
      fixed: false,
    },
    {
      title: "Sal Diario Int",
      dataIndex: "salDiarioInt",
      key: "salDiarioInt",
      width: 170,
      fixed: false,
    },
    {
      title: "Clave Ent Fed",
      dataIndex: "claveEntFed",
      key: "claveEntFed",
      width: 170,
      fixed: false,
    },
    { title: "UUID", dataIndex: "UUID", key: "UUID", width: 320, fixed: false },
    {
      title: "Lugar de Expedición",
      dataIndex: "LugarExpedicion",
      key: "LugarExpedicion",
      width: 180,
      fixed: false,
    },
    {
      title: "Domicilio Fiscal",
      dataIndex: "DomicilioFiscalReceptor",
      key: "DomicilioFiscalReceptor",
      width: 180,
      fixed: false,
    },
  ];

  const getPayrollColumns = (module: CFDIModule): ColumnsType<CFDI> => {
    const cols = getAllCols;
    switch (module) {
      case "issued":
        return cols.filter((c) => {
          if (c.key) {
            return ![""].includes(String(c.key));
          }
          return true;
        });
      case "received":
        return cols.filter((c) => {
          if (c.key) {
            return ![""].includes(String(c.key));
          }
          return true;
        });
      case "efos":
        return cols.filter((c) => {
          if (c.key) {
            return ![
              "Fecha",
              "Version",
              "Serie",
              "Folio",
              "RfcReceptor",
              "NombreReceptor",
              "RegimenFiscalReceptor",
              "RegimenFiscalReceptorDesc",
              "balance",
              "paid_by",
              "ExcludeFromIVA",
            ].includes(String(c.key));
          }
          return true;
        });
      case "validation-complete":
        return cols.filter((c) => {
          if (c.key) {
            return !["balance", "paid_by", "ExcludeFromIVA"].includes(String(c.key));
          }
          return true;
        });

      default:
        return cols;
    }
  };

  return getPayrollColumns(module);
}
