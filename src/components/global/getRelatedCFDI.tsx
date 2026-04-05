import { UpOutlined } from "@ant-design/icons";
import { CFDI_Types } from "@constants/Enums";
import { tailwindColors } from "@utils/tailwindColors";
import { Tag, Tooltip } from "antd";
import { useState } from "react";

type Props = {
  unrepeated: paidData[];
  setModalVisible?: (visible: boolean) => void;
  setCFDIToDisplay?: (state: string) => void;
  setCFDITypeToRequest?: (state: CFDI_Types) => void;
};

export const GetRelatedCFDI = (props: Props) => {
  const { unrepeated, setCFDIToDisplay, setModalVisible, setCFDITypeToRequest } = props;
  const [moreThan, setmoreThan] = useState(true);

  const handleTagClick = (paid: paidData) => {
    if (setCFDITypeToRequest) {
      setCFDITypeToRequest(CFDI_Types.PAYMENT);
    }

    if (setModalVisible && setCFDIToDisplay) {
      setCFDIToDisplay(paid.UUID);
      setModalVisible(true);
    }
  };

  const handleMoreThanClick = () => {
    setmoreThan(!moreThan);
  };

  return (
    <>
      {unrepeated?.filter((uuid) => uuid?.cfdi_related?.Estatus)?.length > 1 && moreThan ? (
        <div className="flex">
          {unrepeated
            ?.filter((uuid) => uuid?.cfdi_related?.Estatus)
            ?.slice(0, 1)
            ?.map(
              (e) =>
                e?.cfdi_related?.Estatus && (
                  <Tooltip
                    title={
                      e?.cfdi_related?.Estatus
                        ? ""
                        : "Se verá reflejado en el saldo en las próximas 24 horas"
                    }
                  >
                    <Tag
                      key={e.UUID}
                      style={{
                        cursor: "pointer",
                        marginBottom: 5,
                        color: e?.cfdi_related?.Estatus ? "#000000" : "#a9a9a9",
                        backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
                        border:
                          `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
                        minWidth: "260px",
                      }}
                      onClick={() => handleTagClick(e)}
                    >
                      {e.UUID}
                    </Tag>
                  </Tooltip>
                )
            )}
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
              {unrepeated.filter((uuid) => uuid?.cfdi_related?.Estatus).length - 1}+
            </Tag>
          </Tooltip>
        </div>
      ) : (
        <div className="flex items-end">
          <div className="flex flex-col flex-1">
            {unrepeated?.map(
              (e) =>
                e?.cfdi_related?.Estatus && (
                  <Tooltip
                    title={
                      e?.cfdi_related?.Estatus
                        ? ""
                        : "Se verá reflejado en el saldo en las próximas 24 horas"
                    }
                  >
                    <Tag
                      key={e.UUID}
                      style={{
                        cursor: "pointer",
                        marginBottom: 5,
                        color: e?.cfdi_related?.Estatus ? "#000000" : "#a9a9a9",
                        backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
                        border:
                          `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
                        minWidth: "260px",
                      }}
                      onClick={() => handleTagClick(e)}
                    >
                      {e.UUID}
                    </Tag>
                  </Tooltip>
                )
            )}
          </div>
          {unrepeated.filter((uuid) => uuid?.cfdi_related?.Estatus)?.length > 1 && !moreThan && (
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
