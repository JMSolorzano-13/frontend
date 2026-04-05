import { Modal } from "antd";
import ModalPoliciesFooter from "./ModalPoliciesFooter";
import ModalPoliciesBody from "./ModalPoliciesBody";
import { useAppDispatch } from "@store/store";
import { useSelector } from "react-redux";
import { cfdiSelector, inactivePolicySet } from "@store/cfdiSlice";
import { useEffect, useState } from "react";
import { getPolicy } from "@store/cfdiSlice/getPolicy";
import { CFDI_Types } from "@constants/Enums";
import { FIELDS_POLICIES } from "@pages/CFDI/_utils/fieldsPolicies";

type Props = {
  visible: boolean;
  setVisible: (newState: boolean) => void;
  setCFDIToDisplay: (state: string) => void;
  setCFDIModalType: (state: string) => void;
  visiblePolicy: boolean;
  setVisiblePolicy: (visible: boolean) => void;
  moduleID: CFDIModule;
  setCFDITypeToRequest: (state: CFDI_Types) => void
};

export default function ModalPolicies(props: Props) {
  const {
    visible,
    setVisible,
    visiblePolicy,
    setVisiblePolicy,
    setCFDIToDisplay,
    setCFDIModalType,
    setCFDITypeToRequest,
    moduleID,
  } = props;
  const dispatch = useAppDispatch();
  const { policyActiveUUID, policyActive } = useSelector(cfdiSelector);
  const [tab, setTab] = useState<string>("movements");

  const closeModal = () => {
    dispatch(inactivePolicySet());
    setVisiblePolicy(false);
    setTab("movements")
  };

  useEffect(() => {
    if (policyActiveUUID) {
      dispatch(
        getPolicy({
          options: {
            domain: [["identifier", "=", policyActiveUUID]],
            fields: FIELDS_POLICIES,
          },
        })
      );
    }
  }, [policyActiveUUID]);

  return (
    <>
      <Modal
        title={"Póliza contable"}
        closable={false}
        open={visiblePolicy}
        onCancel={closeModal}
        onOk={closeModal}
        width={1200}
        footer={<ModalPoliciesFooter closeModal={closeModal} moduleID={moduleID} />}
      >
        <ModalPoliciesBody
          visible={visible}
          setVisible={setVisible}
          visiblePolicy={visiblePolicy}
          setVisiblePolicy={setVisiblePolicy}
          setCFDIToDisplay={setCFDIToDisplay}
          setCFDIModalType={setCFDIModalType}
          policyActive={policyActive || ({} as Poliza)}
          setCFDITypeToRequest={setCFDITypeToRequest}
          tab={tab}
          setTab={setTab}
        />
      </Modal>
    </>
  );
}
