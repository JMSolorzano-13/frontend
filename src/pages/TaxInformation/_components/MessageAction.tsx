import { CloudSyncOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Row } from "antd";

interface PropsMessage {
  text?: string;
  buttonText?: string;
  buttonIcon?: React.ReactElement;
  updatePage?: () => void;
  type?: "warning" | "success" | "info" | "error";
  requesting_from_sat?: boolean;
  requesting_from_sat_retry?: boolean;
}

export const MessageAction = ({
  text,
  buttonText = "Obtener desde el SAT",
  updatePage,
  type = "warning",
  buttonIcon = <CloudSyncOutlined />,
  requesting_from_sat,
  requesting_from_sat_retry,
}: PropsMessage) => {
  return (
    <Row gutter={[0, 16]}>
      {text && (
        <Col span={24}>
          <Alert
            message={text}
            type={type}
            style={{ display: "flex", marginBottom: 10 }}
            showIcon
          />
        </Col>
      )}

      {updatePage && (
        <Col span={24}>
          <Button
            className={`${text ? "-mt-3" : "mt-2"}`}
            id="adv-save-button"
            type="primary"
            loading={requesting_from_sat || requesting_from_sat_retry}
            htmlType="submit"
            onClick={updatePage}
            icon={buttonIcon}
          >
            {buttonText}
          </Button>
        </Col>
      )}
    </Row>
  );
};
