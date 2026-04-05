import { useState } from "react";
import { Typography, Tag, Spin, Modal } from "antd";
import { useAppDispatch } from "@store/store";
import { getCFDI } from "@store/cfdiSlice/getCFDI";
import { CFDIPPDFields, CFDIFields } from "@constants/Fields";
import { useSelector } from "react-redux";
import { cfdiSelector, setObtainedCFDI } from "@store/cfdiSlice";
import { CFDI_Types } from "@constants/Enums";
import CFDIModal from "@components/cfdis/Modal/CFDIModal";
import PayrollDetailsModal from "@components/cfdis/Payroll/PayrollDetailsModal";

interface IRelatedCFDIsModal {
  uuid: string;
  setCFDITypeToRequest?: (state: CFDI_Types) => void;
}

export default function RelatedAddModal(props: IRelatedCFDIsModal) {
  const { uuid } = props;
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { obtainedCFDI, isFetchingCFDI } = useSelector(cfdiSelector);

  const closeModal = () => {
    setObtainedCFDI();
    setShow(false);
  };

  function handleShow() {
    if (!show) {
      dispatch(
        getCFDI({
          options: {
            domain:
              obtainedCFDI?.TipoDeComprobante === "P"
                ? [
                    ["TipoDeComprobante", "=", "P"],
                    ["UUID", "=", uuid],
                  ]
                : [["UUID", "=", uuid]],
            // search: uuid,
            fields: [...CFDIPPDFields, ...CFDIFields],
            limit: 1,
          },
        })
      );
    }
    setShow(!show);
  }

  if (!show) {
    return (
      <Tag
        style={{
          cursor: "pointer",
          backgroundColor: "rgba(9, 109, 217, 0.1)",
          border: "1px solid #1890FF",
          minWidth: "255px",
        }}
        onClick={handleShow}
      >
        {uuid}
      </Tag>
    );
  }
  if (!obtainedCFDI && show && !isFetchingCFDI) {
    return (
      <Modal
        style={{ top: 20 }}
        bodyStyle={{ padding: "0px 20px 20px 20px" }}
        open={show}
        onCancel={closeModal}
        onOk={closeModal}
      >
        <Typography>No tenemos información de este CFDI</Typography>
      </Modal>
    );
  }
  if (obtainedCFDI && show && !isFetchingCFDI) {
    if (obtainedCFDI.TipoDeComprobante !== "N") {
      return (
        <CFDIModal
          visible={show}
          setVisible={closeModal}
          cfdi={obtainedCFDI}
          cfdiToDisplay={""}
          setCFDIToDisplay={() => null}
          modalType={obtainedCFDI?.TipoDeComprobante === "P" ? "ppd" : "normal"}
          setCFDIModalType={() => null}
          CFDITypeToRequest={obtainedCFDI.TipoDeComprobante as CFDI_Types}
        />
      );
    }
    return <PayrollDetailsModal visible={show} setVisible={closeModal} cfdi={obtainedCFDI} />;
  }
  return (
    <div>
      <Spin />
    </div>
  );
}
