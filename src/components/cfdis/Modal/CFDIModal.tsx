import { Modal, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { cfdiSelector, inactiveAttachmentsSet, inactivePolicySet, setObtainedCFDI } from "@store/cfdiSlice";
import { getCFDI } from "@store/cfdiSlice/getCFDI";
import CFDIModalHeader from "./CFDIModalHeader";
import CFDIModalFooter from "./CFDIModalFooter";
import { useAppDispatch } from "@store/store";
import { setPaymentDate } from "@store/cfdiSlice/setPaymentDate";
import { CFDI_Types } from "@constants/Enums";
import getCurrentDomain from "./utils/getCurrentDomain";
import CFDIManageModalBody from "./CFDIManageModalBody";
import { ISRRecordType, UUIDsToUpdateType } from "@pages/ISR/_types/ISRTypes";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { UpdateUUIDsType } from "@pages/IVA/_types/StateTypes";

type Props = {
  visible: boolean;
  setVisible: (newState: boolean) => void;
  setModalVisiblePolicy?: (visible: boolean) => void;
  setAttachmentsModalVisible?: (visible: boolean) => void;
  cfdi: ISRRecordType | IVACFDI | CFDI | undefined;
  setCFDI?: (state: CFDI | undefined) => void;
  cfdiToDisplay: string;
  setCFDIToDisplay: (state: string) => void;
  modalType: string;
  setCFDIModalType: (state: string) => void;
  CFDITypeToRequest: CFDI_Types;
  ivaType?: "IVA" | "ISR";
  uuidsToExclude?: UUIDsToUpdateType | UpdateUUIDsType;
};

export default function CFDIModal(props: Props) {
  const {
    visible,
    setVisible,
    cfdi,
    setCFDI,
    cfdiToDisplay,
    setCFDIToDisplay,
    modalType,
    setCFDIModalType,
    CFDITypeToRequest,
    ivaType,
    uuidsToExclude,
    setModalVisiblePolicy,
    setAttachmentsModalVisible
  } = props;
  const { obtainedCFDI, isFetchingCFDI, updatingCFDIPaymentDate } = useSelector(cfdiSelector);
  const dispatch = useAppDispatch();
  const [newPaymentDate, setNewPaymentDate] = useState("");
  // New Rollover
  const [isRelatedModal, setIsRelatedModal] = useState(false);
  const [isPrincipalCFDI, setIsPrincipalCFDI] = useState("");
  const [isRelatedCFDI, setIsRelatedCFDI] = useState("");

  const requestedFields = getCurrentDomain({ CFDITypeToRequest });

  const closeModal = () => {
    if (setCFDIToDisplay && setCFDI) {
      setCFDIToDisplay("");
      setObtainedCFDI();
      setCFDI(undefined);
      setNewPaymentDate("");
    }
    setCFDIModalType("normal");
    setVisible(false);
    setIsRelatedModal(false);
    setIsPrincipalCFDI("");
    setIsRelatedCFDI("");

    dispatch(inactivePolicySet());
    dispatch(inactiveAttachmentsSet());
    setModalVisiblePolicy && setModalVisiblePolicy(false);
    setAttachmentsModalVisible && setAttachmentsModalVisible(false);
  };

  useEffect(() => {
    if (cfdiToDisplay) {
      setIsPrincipalCFDI(cfdiToDisplay);
    }
  }, [visible]);

  const saveAndClose = async () => {
    if (cfdi) {
      const dateSplitted = newPaymentDate.split("/");
      try {
        await dispatch(
          setPaymentDate({
            cfdiUUID: cfdi.UUID,
            newPaymentDate: `${dateSplitted[0]}/01/${dateSplitted[1]}`,
            defaultPaymentDate: cfdi.FechaFiltro ?? cfdi.Fecha,
            is_issued: cfdi.is_issued,
          })
        ).unwrap();
        closeModal();
      } catch (error) {
        message.error(`Error al actualizar la fecha de pago del CFDI`);
      }
    }
  };

  // useEffect to get requested CFDI
  useEffect(() => {
    if (visible && cfdiToDisplay) {
      dispatch(
        getCFDI({
          options: {
            domain: [["UUID", "=", cfdiToDisplay]],
            fields: requestedFields,
          },
        })
      );
    }
  }, [visible, cfdiToDisplay]);

  useEffect(() => {
    if (obtainedCFDI?.payments && obtainedCFDI?.payments.length > 0) {
      setCFDIModalType("ppd");
    } else if (
      !obtainedCFDI?.payments ||
      obtainedCFDI?.payments.length === 0 ||
      !obtainedCFDI.from_xml
    ) {
      setCFDIModalType("normal");
    }
  }, [isFetchingCFDI]);

  return (
    <>
      <Modal
        style={{ top: 20 }}
        bodyStyle={{ padding: "0px 20px 20px 20px" }}
        title={
          <CFDIModalHeader
            cfdi={obtainedCFDI}
            isFetchingCFDI={isFetchingCFDI}
            modalType={modalType}
          />
        }
        closable={false}
        open={visible}
        onCancel={closeModal}
        onOk={closeModal}
        width={1200}
        footer={
          <CFDIModalFooter
            cfdi={obtainedCFDI}
            closeModal={closeModal}
            newPaymentDate={newPaymentDate}
            saveAndClose={saveAndClose}
            updatingCFDIPaymentDate={updatingCFDIPaymentDate}
            setCFDIToDisplay={setCFDIToDisplay}
            isPrincipalCFDI={isPrincipalCFDI}
            isRelatedModal={isRelatedModal}
            setIsRelatedModal={setIsRelatedModal}
            isRelatedCFDI={isRelatedCFDI}
            setModalVisiblePolicy={setModalVisiblePolicy}
            setVisible={setVisible}
            setAttachmentsModalVisible={setAttachmentsModalVisible}
          />
        }
      >
        <CFDIManageModalBody
          obtainedCFDI={obtainedCFDI}
          cfdi={cfdi}
          // TODO: Inside this component use this prop to validate if the modal is for a CFDI or a PPD with a new PPD body component
          modalType={modalType}
          visible={visible}
          setVisible={setVisible}
          newPaymentDate={newPaymentDate}
          setNewPaymentDate={setNewPaymentDate}
          isFetchingCFDI={isFetchingCFDI}
          cfdiToDisplay={cfdiToDisplay}
          setCFDIToDisplay={setCFDIToDisplay}
          isRelatedModal={isRelatedModal}
          setIsRelatedModal={setIsRelatedModal}
          isRelatedCFDI={isRelatedCFDI}
          ivaType={ivaType}
          uuidsToExclude={uuidsToExclude}
        />
      </Modal>
    </>
  );
}
