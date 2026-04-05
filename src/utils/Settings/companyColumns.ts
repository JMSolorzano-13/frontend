import { ColumnsType } from "antd/es/table/interface";

export const getColsSettings: ColumnsType<CompanyType> = [
  {
    title: "Empresa",
    dataIndex: "empresa",
    key: "empresa",
    showSorterTooltip: false,
    width: 180,
    fixed: false,
  },
  {
    title: "RFC",
    dataIndex: "rfc",
    key: "rfc",
    sorter: (a: CompanyType, b: CompanyType) => a?.rfc?.localeCompare(b?.rfc || ""),
    showSorterTooltip: false,
    width: 160,
    fixed: false,
  },
  {
    title: "Rol",
    dataIndex: "rol",
    key: "rol",
    showSorterTooltip: false,
    width: 160,
    fixed: false,
    sorter: (a: CompanyType, b: CompanyType) => a?.rol?.localeCompare(b?.rol || ""),
    defaultSortOrder: "descend",
  },
  {
    title: "Con acceso a nóminas",
    dataIndex: "payroll",
    key: "payroll",
    showSorterTooltip: false,
    width: 120,
    fixed: false,
  },
  {
    title: "Propietario de la subscripcióm",
    dataIndex: "owner",
    key: "owner",
    showSorterTooltip: false,
    width: 160,
    fixed: false,
  },
];
