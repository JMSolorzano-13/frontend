import { Tag } from "antd";
import { ColumnGroupType, ColumnType } from "antd/lib/table";

interface Props {
  setCFDIToDisplay: (cfdi: string) => void;
  setIsRelatedModal: (status: boolean) => void;
}

export default function CFDIEgressRelatedColumns({
  setCFDIToDisplay,
  setIsRelatedModal,
}: Props): (ColumnGroupType<CFDIRelationType> | ColumnType<CFDIRelationType>)[] {
  return [
    {
      title: "UUID",
      dataIndex: "uuid_related",
      key: "uuid_origin",
      render: (val: string) => {
        return (
          <Tag
            onClick={() => {
              setCFDIToDisplay(val);
              setIsRelatedModal(true);
            }}
            style={{
              cursor: "pointer",
              marginBottom: 5,
              color: "#000000",
              backgroundColor: "rgba(9, 109, 217, 0.1)",
              border: "1px solid #1890FF",
              minWidth: "260px",
            }}
          >
            {val}
          </Tag>
        );
      },
      width: 320,
    },
    {
      title: "Tipo de relación",
      dataIndex: "TipoRelacion",
      key: "TipoRelacion",
      width: 120,
    },
  ];
}
