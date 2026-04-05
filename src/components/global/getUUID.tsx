import { UpOutlined } from "@ant-design/icons";
import { CFDI_Types } from "@constants/Enums";
import { tailwindColors } from "@utils/tailwindColors";
import { Tag, Tooltip } from "antd";
import { useState } from "react";

type Props = {
  uuid_related: string[];
  setModalVisible?: (visible: boolean) => void;
  setCFDIToDisplay?: (state: string) => void;
  setCFDITypeToRequest?: (state: CFDI_Types) => void;
  tab: string;
};

export const GetUUID = (props: Props) => {
  const { uuid_related, setCFDIToDisplay, setModalVisible, setCFDITypeToRequest, tab } = props;
  const [moreThan, setmoreThan] = useState(true);

  const handleTagClick = (uuid: string) => {
    if (setCFDITypeToRequest) {
      setCFDITypeToRequest(tab !== "N" ? CFDI_Types.PAYMENT : CFDI_Types.PAYROLL);
    }

    if (setModalVisible && setCFDIToDisplay) {
      setCFDIToDisplay(uuid);
      setModalVisible(true);
    }
  };

  const handleMoreThanClick = () => {
    setmoreThan(!moreThan);
  };

  return (
    <>
      {uuid_related?.length > 1 && moreThan ? (
        <div style={{ display: "flex" }}>
          {uuid_related.slice(0, 1).map((uuid) => (
            <Tag
              key={uuid}
              style={{
                cursor: "pointer",
                marginBottom: 5,
                backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
                border: `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
                minWidth: "255px",
              }}
              onClick={() => handleTagClick(uuid)}
            >
              {uuid}
            </Tag>
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
              {uuid_related.length - 1}+
            </Tag>
          </Tooltip>
        </div>
      ) : (
        <div className="flex items-end">
          <div className="flex flex-col">
            {uuid_related.map((uuid) => (
              <Tag
                key={uuid}
                style={{
                  cursor: "pointer",
                  marginBottom: 5,
                  backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
                  border: `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
                  minWidth: "255px",
                }}
                onClick={() => handleTagClick(uuid)}
              >
                {uuid}
              </Tag>
            ))}
          </div>
          {uuid_related?.length > 1 && !moreThan && (
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
