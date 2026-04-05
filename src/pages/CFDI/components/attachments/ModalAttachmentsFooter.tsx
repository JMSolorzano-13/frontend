import { Button } from "antd";
import { useSelector } from "react-redux";
import { cfdiSelector } from "@store/cfdiSlice";

type Props = {
  closeModal: () => void;
  moduleID: CFDIModule;
  sendCFDI: () => void
};

export default function ModalAttachmentsFooter(props: Props) {
  const { closeModal, sendCFDI } = props;
  const { isFetchingAttachment, isFetchingUploadAttachment } = useSelector(cfdiSelector);

  if (isFetchingAttachment) return <></>

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        gap: 10
      }}
    >
      <div>
        <Button
          loading={isFetchingUploadAttachment}
          disabled={isFetchingUploadAttachment}
          type="primary" id="cfdi-modal-b" onClick={sendCFDI}>
          CFDI
        </Button>
      </div>
      <div>
        <Button
          loading={isFetchingUploadAttachment}
          disabled={isFetchingUploadAttachment}
          type="default" id="close-cfdi-modal" onClick={closeModal}>
          Cerrar
        </Button>
      </div>
    </div>
  );
}
