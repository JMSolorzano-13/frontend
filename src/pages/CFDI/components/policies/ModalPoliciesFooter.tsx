import { authSelector } from "@store/authSlice";
import delayedDownload from "@utils/delayedDownload";
import { Button } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { cfdiSelector } from "@store/cfdiSlice";
import moment from "moment";
import { exportPoliza } from "@pages/CFDI/_utils/exportPoliza";

type Props = {
  closeModal: () => void;
  moduleID: CFDIModule;
};

export default function ModalPoliciesFooter(props: Props) {
  const { closeModal, moduleID } = props;
  const { company, rfc } = useSelector(authSelector);
  const { policyActiveUUID, policyActive, isFetchingPolicy } = useSelector(cfdiSelector);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const performExportCFDI = async (format: "PDF") => {
    exportPoliza({
      company,
      format,
      selectedIds: policyActiveUUID ? [policyActiveUUID] : [],
      exportName: {
        group: moduleID,
        subtitle: policyActive?.tipo || "",
        datesValue: `${moment(policyActive?.fecha).format("MM-DD-YYYY")}`,
        rfc: rfc || "",
      },
    })
      .then((links) => {
        delayedDownload(links);
      })
      .finally(() => {
        setIsDownloadingPDF(false);
      });
  };

  if(isFetchingPolicy) return <></>

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
        <div>Descargar póliza: </div>
        <Button
          type="primary"
          style={{ height: 22, fontSize: 10 }}
          loading={isDownloadingPDF}
          onClick={() => {
            performExportCFDI("PDF");
            setIsDownloadingPDF(true);
          }}
        >
          PDF
        </Button>
      </div>
      <div>
        <Button type="default" id="close-cfdi-modal" onClick={closeModal}>
          Cerrar
        </Button>
      </div>
    </div>
  );
}
