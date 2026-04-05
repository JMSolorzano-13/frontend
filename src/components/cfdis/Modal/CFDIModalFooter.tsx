import { Button } from "antd";
import DownloadButtons from "./DownloadButtons";
import { useSelector } from "react-redux";
import { activeAttachmentsSet, activePolicySet, cfdiSelector } from "@store/cfdiSlice";
import { useAppDispatch } from "@store/store";

type Props = {
  cfdi: CFDI | undefined;
  closeModal: () => void;
  newPaymentDate: string;
  saveAndClose: () => void;
  updatingCFDIPaymentDate: boolean;
  setCFDIToDisplay: (cfdi: string) => void;
  setIsRelatedModal: (status: boolean) => void;
  isPrincipalCFDI: string;
  isRelatedModal: boolean;
  isRelatedCFDI: string;
  setModalVisiblePolicy?: (visible: boolean) => void;
  setAttachmentsModalVisible?: (visible: boolean) => void;
  setVisible: (newState: boolean) => void;
};

export default function CFDIModalFooter(props: Props) {
  const {
    cfdi,
    closeModal,
    newPaymentDate,
    saveAndClose,
    updatingCFDIPaymentDate,
    setCFDIToDisplay,
    isPrincipalCFDI,
    isRelatedModal,
    setIsRelatedModal,
    setModalVisiblePolicy,
    setAttachmentsModalVisible,
    setVisible,
  } = props;

  const { policyActiveUUID, cfdiattachmentActiveUUID } = useSelector(cfdiSelector);
  const dispatch = useAppDispatch();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "5px" }}>
        {cfdi?.from_xml ? <DownloadButtons cfdi={cfdi} /> : null}
      </div>
      <div>
        {(cfdiattachmentActiveUUID && !isRelatedModal) && (
          <Button
            type="primary"
            disabled={updatingCFDIPaymentDate}
            className="mx-2"
            id="close-cfdi-modal"
            onClick={() => {
              dispatch(activeAttachmentsSet({ cfdi: cfdi || {} as CFDI, uuid: cfdiattachmentActiveUUID, type: cfdi?.TipoDeComprobante || '' }));
              setAttachmentsModalVisible && setAttachmentsModalVisible(true);
              setVisible(false);
              setCFDIToDisplay("");
            }}
          >
            Evidencia
          </Button>
        )}
        {(!cfdiattachmentActiveUUID) && (
          <Button
            type="primary"
            disabled={updatingCFDIPaymentDate}
            className="mx-2"
            id="close-cfdi-modal"
            onClick={() => {
              dispatch(activeAttachmentsSet({ cfdi: cfdi || {} as CFDI, uuid: cfdi?.UUID || '', type: cfdi?.TipoDeComprobante || '' }));
              setAttachmentsModalVisible && setAttachmentsModalVisible(true);
              setVisible(false);
              setCFDIToDisplay("");
            }}
          >
            Evidencia
          </Button>
        )}
        {(policyActiveUUID && !isRelatedModal) && (
          <Button
            type="primary"
            disabled={updatingCFDIPaymentDate}
            className="mx-2"
            // key="close_footer_modal_button"
            id="close-cfdi-modal"
            onClick={() => {
              dispatch(activePolicySet(policyActiveUUID));
              setModalVisiblePolicy && setModalVisiblePolicy(true);
              setVisible(false);
              setCFDIToDisplay("");
            }}
          >
            Regresar a la póliza
          </Button>
        )}
        {isRelatedModal && (
          <Button
            type="primary"
            disabled={updatingCFDIPaymentDate}
            // key="close_footer_modal_button"
            id="close-cfdi-modal"
            onClick={() => {
              setCFDIToDisplay(isPrincipalCFDI);
              setIsRelatedModal(false);
            }}
          >
            Regresar al CFDI anterior
          </Button>
        )}
        <Button
          disabled={updatingCFDIPaymentDate}
          // key="close_footer_modal_button"
          type="default"
          id="close-cfdi-modal"
          onClick={closeModal}
        >
          Cerrar
        </Button>
        {newPaymentDate && newPaymentDate !== "" && newPaymentDate !== cfdi?.PaymentDate ? (
          <Button
            // key="save-and-close"
            type="primary"
            id="save-and-close-modal"
            loading={updatingCFDIPaymentDate}
            onClick={saveAndClose}
          >
            Guardar y cerrar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
