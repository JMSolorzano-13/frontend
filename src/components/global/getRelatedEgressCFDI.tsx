import { UpOutlined } from "@ant-design/icons";
import { CFDI_Types } from "@constants/Enums";
import { Tag, Tooltip } from "antd";
import { tailwindColors } from "@utils/tailwindColors";
import { useState } from "react";

type RelatedEgressPropsType = {
  uuid_related: CFDIRelationType[];
  setModalVisible?: (visible: boolean) => void;
  setCFDIToDisplay?: (state: string) => void;
  setCFDITypeToRequest?: (state: CFDI_Types) => void;
};

export const GetRelatedEgressCFDI = (props: RelatedEgressPropsType) => {
  const { uuid_related, setModalVisible, setCFDIToDisplay, setCFDITypeToRequest } = props;
  const [moreThan, setmoreThan] = useState(true);

  const filteredActiveUUIDs = uuid_related.filter((c) => c.Estatus && c.TipoDeComprobante === "E");

  const handleTagClick = (uuid_related: string) => {
    if (setModalVisible && setCFDIToDisplay) {
      if (setCFDITypeToRequest) {
        setCFDITypeToRequest(CFDI_Types.EGRESS);
      }

      setCFDIToDisplay(uuid_related);
      setModalVisible(true);
    }
  };

  const handleMoreThanClick = () => {
    setmoreThan(!moreThan);
  };

  return (
    <>
      {filteredActiveUUIDs?.length > 1 && moreThan ? (
        <div style={{ display: "flex" }}>
          {filteredActiveUUIDs?.slice(0, 1).map((uuid) => (
            <Tooltip>
              <Tag
                key={uuid?.uuid_origin}
                style={{
                  cursor: "pointer",
                  marginBottom: 5,
                  backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
                  border: `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
                  minWidth: "260px",
                }}
                onClick={() => handleTagClick(uuid?.uuid_origin)}
              >
                {uuid?.uuid_origin}
              </Tag>
            </Tooltip>
          ))}
          <Tooltip title="Ver más">
            <Tag
              style={{
                cursor: "pointer",
                marginBottom: 5,
                color: "#000000",
                backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
                border: `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
              }}
              onClick={handleMoreThanClick}
            >
              {filteredActiveUUIDs?.length - 1}+
            </Tag>
          </Tooltip>
        </div>
      ) : (
        <div className="flex items-end">
          <div className="flex flex-col">
            {filteredActiveUUIDs?.map((uuid) => (
              <Tag
                key={uuid?.uuid_origin}
                style={{
                  cursor: "pointer",
                  marginBottom: 5,
                  backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
                  border: `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
                  minWidth: "260px",
                }}
                onClick={() => handleTagClick(uuid?.uuid_origin)}
              >
                {uuid?.uuid_origin}
              </Tag>
            ))}
          </div>
          {filteredActiveUUIDs?.length > 1 && !moreThan && (
            <Tooltip title="Ver menos">
              <Tag
                style={{
                  cursor: "pointer",
                  marginBottom: 5,
                  color: "#000000",
                  backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
                  border: `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
                  padding: 3,
                  minWidth: "29px",
                  display: "flex",
                  justifyContent: "center",
                }}
                onClick={handleMoreThanClick}
              >
                <UpOutlined />
              </Tag>
            </Tooltip>
          )}
        </div>
      )}
    </>
  );
};
