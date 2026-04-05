import { UpOutlined } from "@ant-design/icons";
import { activePolicySet } from "@store/cfdiSlice";
import { useAppDispatch } from "@store/store";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { tailwindColors } from "@utils/tailwindColors";
import { GlobalToken, Tag, Tooltip } from "antd";
import { useState } from "react";

interface IGetPolicies {
  policies: Poliza[];
  token: GlobalToken | undefined;
  setModalVisible?: (visible: boolean) => void;
}

export default function GetPolicies({ policies, setModalVisible }: IGetPolicies) {
  const [moreThan, setmoreThan] = useState(true);
  const dispatch = useAppDispatch();
  const limit = 1;
  const newPolicies = Array.isArray(policies) ? policies : JSON.parse(policies) as Poliza[]
  const needPlusButton = newPolicies?.length > limit;

  const handleMoreThanClick = () => {
    setmoreThan(!moreThan);
  };

  const clickPolicy = (identifier: string) => {
    dispatch(activePolicySet(identifier));
    setModalVisible && setModalVisible(true);
  };

  function getPolicyText(fecha: string, tipo: string, numero: string) {
    return `${formatDisplay(fecha, DisplayType.PUREDATE)} - ${tipo.length > 6 ? tipo.slice(0, 6) + '...' : tipo} - ${numero.length > 11 ? numero.slice(0, 11) + '...' : numero}`;
  }

  const tagPolicyStyle = {
    marginBottom: 5,
    backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
    border: `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
    width: "90%",
    justifyContent: "center",
    cursor: "pointer",
    minWidth: '220px'
  };

  return (
    <>
      {needPlusButton && moreThan ? (
        <div style={{ display: "flex" }}>
          {newPolicies?.slice(0, limit).map((p) => (
            <Tag onClick={() => clickPolicy(p?.identifier)} style={tagPolicyStyle}>
              {getPolicyText(p.fecha, p.tipo, p.numero)}
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
                minWidth: "29px",
                justifyContent: "center",
              }}
              onClick={handleMoreThanClick}
            >
              {newPolicies?.length - limit}+
            </Tag>
          </Tooltip>
        </div>
      ) : (
        newPolicies?.map((p) => (
          <Tag onClick={() => clickPolicy(p?.identifier)} style={tagPolicyStyle}>
            {getPolicyText(p.fecha, p.tipo, p.numero)}
          </Tag>
        ))
      )}
      {needPlusButton && !moreThan && (
        <Tooltip title="Ver menos">
          <Tag
            style={{
              cursor: "pointer",
              marginBottom: 5,
              color: "#000000",
              backgroundColor: "rgba(9, 109, 217, 0.1)",
              border: "1px solid #1890FF",
              minWidth: "29px",
              justifyContent: "center",
            }}
            onClick={handleMoreThanClick}
          >
            <UpOutlined />
          </Tag>
        </Tooltip>
      )}
    </>
  );
}
