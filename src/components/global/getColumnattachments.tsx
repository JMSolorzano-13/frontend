import { Badge, GlobalToken, Tag, Tooltip } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@store/store";
import { activeAttachmentsSet } from "@store/cfdiSlice";

interface IGetPolicies {
  attachments: number;
  type: string,
  cfdi: CFDI,
  uuid: string
  token: GlobalToken | undefined;
  setModalVisible?: (visible: boolean) => void;
}

export default function GetColumnAttachments({ attachments, setModalVisible, uuid, type, cfdi }: IGetPolicies) {
  const dispatch = useAppDispatch()
  const isView = attachments > 0

  const onClick = (uuid: string) => {
    dispatch(activeAttachmentsSet({ uuid, type, cfdi }));
    setModalVisible && setModalVisible(true);
  };

  return (
    <>
      {
        isView ?
          <Tooltip title="Ver evidencias">
            <Tag
              onClick={() => onClick(uuid)}
              style={{
                cursor: "pointer",
                marginBottom: 5,
                color: "#000000",
                padding: 5,
                justifyContent: "center",
                display: "flex",
                minWidth: '40px',
                maxWidth: '40px',
                alignItems: "center",
              }}
            >
              <Badge count={attachments} offset={[10, -2]} showZero={false}>
                <ArrowUpOutlined style={{ fontSize: 12 }} />
              </Badge>
            </Tag>
          </Tooltip>
          :
          <Tooltip title="Agregar evidencias">
            <Tag
              onClick={() => onClick(uuid)}
              style={{
                cursor: "pointer",
                marginBottom: 5,
                color: "#000000",
                padding: 5,
                justifyContent: "center",
                display: "flex",
                minWidth: '40px',
                maxWidth: '40px',
                alignItems: "center",
              }}
            >
              <ArrowUpOutlined style={{ fontSize: 12 }} />
            </Tag>
          </Tooltip>
      }
    </>
  );
}
