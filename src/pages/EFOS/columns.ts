import { ColumnsType } from "antd/lib/table";

export const columns: ColumnsType<EFOS> = [
  { title: "No", dataIndex: "no", fixed: "left", width: 70 },
  { title: "RFC", dataIndex: "rfc", width: 130 },
  {
    title: "Nombre del contribuyente",
    dataIndex: "name",
    width: 400,
  },
  {
    title: "Situación del contribuyente",
    dataIndex: "state",
    width: 200,
  },
  {
    title: "Número y fecha de oficio global de presunción SAT",
    dataIndex: "sat_office_alleged",
    width: 400,
  },
  {
    title: "Publicación página SAT presuntos",
    dataIndex: "sat_publish_alleged_date",
    width: 250,
  },
  {
    title: "Número y fecha de oficio global de presunción DOF",
    dataIndex: "dof_office_alleged",
    width: 400,
  },
  {
    title: "Publicación página DOF presuntos",
    dataIndex: "dof_publish_alleged_date",
    width: 250,
  },
  {
    title: "Número y fecha de oficio global de contribuyentes que desvirtuaron SAT",
    dataIndex: "sat_office_distored",
    width: 480,
  },
  {
    title: "Publicación página SAT desvirtuados",
    dataIndex: "sat_publish_distored_date",
    width: 260,
  },
  {
    title: "Número y fecha de oficio global de contribuyentes que desvirtuaron DOF",
    dataIndex: "dof_office_distored",
    width: 480,
  },
  {
    title: "Publicación página DOF desvirtuados",
    dataIndex: "dof_publish_distored_date",
    width: 260,
  },
  {
    title: "Número y fecha de oficio global de definitivos SAT",
    dataIndex: "sat_office_definitive",
    width: 400,
  },
  {
    title: "Publicación página SAT definitivos",
    dataIndex: "sat_publish_definitive_date",
    width: 260,
  },
  {
    title: "Número y fecha de oficio global de definitivos DOF",
    dataIndex: "dof_office_definitive",
    width: 400,
  },
  {
    title: "Publicación página DOF definitivos",
    dataIndex: "dof_publish_definitive_date",
    width: 250,
  },
  {
    title: "Número y fecha de oficio global de Sentencia favorables SAT",
    dataIndex: "sat_office_favorable_judgement",
    width: 400,
  },
  {
    title: "Publicación página SAT Sentencia favorables",
    dataIndex: "sat_publish_favorable_judgement_date",
    width: 310,
  },
  {
    title: "Número y fecha de oficio global de Sentencia favorables DOF",
    dataIndex: "dof_office_favorable_judgement",
    width: 400,
  },
  {
    title: "Publicación página DOF Sentencia favorables",
    dataIndex: "dof_publish_favorable_judgement_date",
    width: 320,
  },
];
