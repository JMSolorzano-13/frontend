import { Modal, message } from "antd";
import { useAppDispatch } from "@store/store";
import { useSelector } from "react-redux";
import { cfdiSelector, cleanErrorAttachment, inactiveAttachmentsSet } from "@store/cfdiSlice";
import { useEffect, useState } from "react";
import { CFDI_Types } from "@constants/Enums";
import ModalAttachmentsFooter from "./ModalAttachmentsFooter";
import ModalAttachmentsBody from "./ModalAttachmentsBody";
import { getAttachments } from "@store/cfdiSlice/getAttachments";
import { FIELDS_ATTACHMENTS } from "@pages/CFDI/_utils/fieldsAttachments";
import { getCFDI } from "@store/cfdiSlice/getCFDI";
import { defaultFieldsAttachments } from "./attachments_fields";

type Props = {
  visible: boolean;
  setVisible: (newState: boolean) => void;
  setCFDIToDisplay: (state: string) => void;
  setCFDIModalType: (state: string) => void;
  visibleAttachments: boolean;
  setVisibleAttachments: (visible: boolean) => void;
  moduleID: CFDIModule;
  setCFDITypeToRequest: (state: CFDI_Types) => void
  modalType: string;
};

export default function ModalAttachments(props: Props) {
  const {
    visible,
    setVisible,
    visibleAttachments,
    setVisibleAttachments,
    setCFDIToDisplay,
    setCFDIModalType,
    setCFDITypeToRequest,
    moduleID,
    modalType
  } = props;
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 8 });
  const { attachmentsActive, cfdiattachmentActiveUUID, cfdiattachmentActiveType, cfdiattachmentActive } = useSelector(cfdiSelector);


  const closeModal = () => {
    dispatch(inactiveAttachmentsSet());
    setVisibleAttachments(false);
    setFiles([])
  };

  const sendCFDI = () => {
    setVisible(true);
    setVisibleAttachments(false)
    dispatch(cleanErrorAttachment())
    setCFDIToDisplay(cfdiattachmentActiveUUID || '');
    setCFDITypeToRequest(cfdiattachmentActiveType as CFDI_Types || "I")
    setFiles([])
  }

  useEffect(() => {
    if (cfdiattachmentActiveUUID) {
      dispatch(
        getAttachments({
          uuid: cfdiattachmentActiveUUID,
          options: {
            domain: [["cfdi_uuid", "=", cfdiattachmentActiveUUID]],
            fields: FIELDS_ATTACHMENTS,
          },
        })
      );
      dispatch(
        getCFDI({
          options: {
            domain: [["UUID", "=", cfdiattachmentActiveUUID]],
            fields: defaultFieldsAttachments,
          },
        })
      );
    }
  }, [cfdiattachmentActiveUUID, visibleAttachments]);

  useEffect(() => {
    if (cfdiattachmentActive?.payments && cfdiattachmentActive?.payments.length > 0) {
      setCFDIModalType("ppd");
    } else if (
      !cfdiattachmentActive?.payments ||
      cfdiattachmentActive?.payments.length === 0 ||
      !cfdiattachmentActive.from_xml
    ) {
      setCFDIModalType("normal");
    }
  }, [cfdiattachmentActiveUUID]);

  return (
    <>
      {contextHolder}
      <Modal
        title="Adjuntar evidencia"
        closable={false}
        open={visibleAttachments}
        onCancel={closeModal}
        onOk={closeModal}
        bodyStyle={{
          maxHeight: "740px",
          overflowY: "auto",
          padding: "10px",
        }}
        width={950}
        footer={
          <ModalAttachmentsFooter
            closeModal={closeModal} moduleID={moduleID}
            sendCFDI={sendCFDI}
          />}
      >
        <ModalAttachmentsBody
          visible={visible}
          setVisible={setVisible}
          visibleAttachments={visibleAttachments}
          setVisibleAttachments={setVisibleAttachments}
          setCFDIToDisplay={setCFDIToDisplay}
          setCFDIModalType={setCFDIModalType}
          attachmentsActive={attachmentsActive || ([] as Attachment[])}
          setCFDITypeToRequest={setCFDITypeToRequest}
          cfdiattachmentActiveUUID={cfdiattachmentActiveUUID}
          messageApi={messageApi}
          files={files}
          setFiles={setFiles}
          cfdiattachmentActive={cfdiattachmentActive}
          cfdiattachmentActiveType={cfdiattachmentActiveType}
          modalType={modalType}
        />
      </Modal>
    </>
  );
}