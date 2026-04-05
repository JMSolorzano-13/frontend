import { Button, Modal, Space, Spin, message } from "antd";
import { CSSProperties, useEffect } from "react";
import { useSelector } from "react-redux";
import PayrollModalHeader from "./PayrollModalHeader";
import PayrollModalBody from "./PayrollModalBody";
import DownloadButtons from "../Modal/DownloadButtons";
import { PayrollSelector } from "@store/payrollSlice";

const emptyStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
};

type Props = {
  visible: boolean;
  setVisible: (newState: boolean) => void;
  cfdi: CFDI | undefined;
};

export default function PayrollDetailsModal(props: Props) {
  const { visible, setVisible, cfdi } = props;
  const { loadingPayrollContent, payrollContentError } = useSelector(PayrollSelector);

  const closeModal = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (payrollContentError) {
      message.error(payrollContentError);
    }
  }, [payrollContentError]);

  return (
    <Modal
      style={{ top: 20, zIndex: 2000 }}
      bodyStyle={{ padding: "0px 20px 20px 20px" }}
      title={<PayrollModalHeader cfdi={cfdi} isFetchingCFDI={loadingPayrollContent} />}
      closable={false}
      open={visible}
      onCancel={closeModal}
      onOk={closeModal}
      width={1200}
      footer={[
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "5px" }}>
            {cfdi?.from_xml ? <DownloadButtons cfdi={cfdi as any} /> : null}
          </div>
          <div>
            <Button key="close" type="default" id="close-cfdi-modal" onClick={closeModal}>
              Cerrar
            </Button>
          </div>
        </div>,
      ]}
    >
      {!loadingPayrollContent ? (
        <PayrollModalBody cfdi={cfdi} visible={visible} />
      ) : (
        <Space style={emptyStyle}>
          <Spin size="large" />
        </Space>
      )}
    </Modal>
  );
}
