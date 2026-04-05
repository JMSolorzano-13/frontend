import { useState } from "react";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";
import delayedDownload from "@utils/delayedDownload";
import { exportCFDI } from "@utils/exportCFDI";
import moment from "moment";

type Props = {
  cfdi: CFDI;
};

export default function DownloadButtons(props: Props) {
  const { cfdi } = props;
  const { company } = useSelector(authSelector);
  const [isDownloadingXML, setIsDownloadingXML] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const performExportCFDI = async (format: "CSV" | "PDF" | "XML" | "XLSX") => {
    exportCFDI({
      company,
      format,
      selectedIds: cfdi ? [cfdi.UUID] : [],
      exportName: {
        group: cfdi.is_issued ? "issued" : "received",
        subtitle: cfdi?.TipoDeComprobante,
        datesValue: `${moment(cfdi?.Fecha).format("MM-DD-YYYY")}`,
        rfc: cfdi.is_issued ? cfdi?.RfcEmisor : cfdi?.RfcReceptor,
      },
    })
      .then((links) => {
        delayedDownload(links);
      })
      .finally(() => {
        setIsDownloadingXML(false);
        setIsDownloadingPDF(false);
      });
  };

  return (
    <>
      <div>Descargar CFDI</div>
      <Button
        type="primary"
        loading={isDownloadingXML}
        style={{ height: 22, fontSize: 10 }}
        onClick={() => {
          performExportCFDI("XML");
          setIsDownloadingXML(true);
        }}
      >
        XML
      </Button>
      <Button
        type="primary"
        loading={isDownloadingPDF}
        style={{ height: 22, fontSize: 10 }}
        onClick={() => {
          performExportCFDI("PDF");
          setIsDownloadingPDF(true);
        }}
      >
        PDF
      </Button>
    </>
  );
}
