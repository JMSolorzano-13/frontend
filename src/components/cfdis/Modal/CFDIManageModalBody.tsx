import { Space, Spin } from "antd";
import PayrollModalBody from "../Payroll/PayrollModalBody";
import CFDIModalBody from "./CFDIModalBody";
import { CSSProperties } from "react";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";
import moment from "moment";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { ISRRecordType, UUIDsToUpdateType } from "@pages/ISR/_types/ISRTypes";
import { UpdateUUIDsType } from "@pages/IVA/_types/StateTypes";

type Props = {
  obtainedCFDI: CFDI | undefined;
  cfdi: ISRRecordType | IVACFDI | CFDI | undefined;
  modalType: string;
  visible: boolean;
  setVisible: (newState: boolean) => void;
  newPaymentDate?: string;
  setNewPaymentDate: (date: string) => void;
  isFetchingCFDI: boolean;
  cfdiToDisplay: string;
  setIsRelatedModal: (status: boolean) => void;
  isRelatedModal: boolean;
  isRelatedCFDI: string;
  setCFDIToDisplay: (cfdi: string) => void;
  ivaType?: "IVA" | "ISR";
  uuidsToExclude?: UUIDsToUpdateType | UpdateUUIDsType;
};

const emptyStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
};

export default function CFDIManageModalBody(props: Props) {
  const {
    obtainedCFDI,
    cfdi,
    modalType,
    visible,
    setVisible,
    newPaymentDate,
    setNewPaymentDate,
    isFetchingCFDI,
    cfdiToDisplay,
    setIsRelatedModal,
    isRelatedModal,
    isRelatedCFDI,
    setCFDIToDisplay,
    ivaType,
    uuidsToExclude,
  } = props;

  const { rfc, userData } = useSelector(authSelector);

  function rfcIsInCompany(cfdi: CFDI | undefined) {
    if (!cfdi) return false;
    return rfc === cfdi?.RfcEmisor || rfc === cfdi?.RfcReceptor;
  }

  if (!isFetchingCFDI) {
    const companyHasRFC = rfcIsInCompany(obtainedCFDI);
    if (!companyHasRFC && cfdiToDisplay === obtainedCFDI?.UUID) {
      // This section is for the case where the company has a different RFC than the one in the record
      if (userData) {
        const errorInfo = `${obtainedCFDI?.UUID}|${moment().format("DD-MM-YYYY")}|${rfc}|${
          obtainedCFDI?.RfcEmisor
        }|${obtainedCFDI?.RfcReceptor}|${obtainedCFDI.company_identifier}`;

        const data = {
          uid: userData.user.id,
          hadotherdataerror: errorInfo,
        };
        window?.InlineManual("update", data);
      }
      setVisible(false);
      return null;
    } else if (obtainedCFDI?.TipoDeComprobante !== "N") {
      return (
        // TODO: Create another component to use when modalType is PPD
        <CFDIModalBody
          cfdi={obtainedCFDI}
          cfdiFromRecord={cfdi}
          modalType={modalType}
          visible={visible}
          newPaymentDate={newPaymentDate}
          setNewPaymentDate={setNewPaymentDate}
          ivaType={ivaType ?? "IVA"}
          uuidsToExclude={uuidsToExclude}
          setIsRelatedModal={setIsRelatedModal}
          isRelatedModal={isRelatedModal}
          isRelatedCFDI={isRelatedCFDI}
          setCFDIToDisplay={setCFDIToDisplay}
        />
      );
    } else if (obtainedCFDI?.TipoDeComprobante === "N") {
      return <PayrollModalBody cfdi={obtainedCFDI} visible={visible} />;
    }
  } else if (isFetchingCFDI) {
    return (
      <Space style={emptyStyle}>
        <Spin size="large" />
      </Space>
    );
  } else {
    return null;
  }

  return null;
}
