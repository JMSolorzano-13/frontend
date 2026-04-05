import { SATStatusList } from "@utils/SATLogStatusList";
import { Tag } from "antd";
import { ColumnsType } from "antd/lib/table";

interface SATStatusType {
  tagInfo: {
    color: string;
    text: string;
  };
  description: string;
}

export const SATStatusColumns: ColumnsType<SATStatusType> = [
  {
    key: "tagInfo",
    title: "Etiqueta",
    dataIndex: "tagInfo",
    render: (tagInfo) => <Tag color={tagInfo.color}> {tagInfo.text} </Tag>,
    width: 170,
  },
  {
    key: "description",
    title: "Descripción",
    dataIndex: "description",
  },
];

export const SATStatusData: SATStatusType[] = [];

Object.values(SATStatusList).forEach((val) => SATStatusData.push(val));

SATStatusData.push({
  tagInfo: { color: "blue", text: "Respuesta Inesperada" },
  description:
    "Hemos recibido una respuesta inesperada por parte del SAT, haremos un nuevo intento en otra petición.",
});
