import { Space, Tag } from "antd";
import s from "./CFDIDisplayModal.module.scss";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";

type Props = {
  cfdi: IVACFDI | CFDI | undefined;
  isFetchingCFDI: boolean;
  modalType: string;
};

export default function CFDIModalHeader(props: Props) {
  const { cfdi, isFetchingCFDI } = props;

  return (
    <Space className={s.ModalTitle}>
      {!isFetchingCFDI || cfdi ? (
        <>
          <Space>
            {cfdi?.TipoDeComprobante === "P" ? (
              <Tag color="blue">PAGO</Tag>
            ) : cfdi?.TipoDeComprobante === "N" ? (
              <Tag color="blue">NÓMINA</Tag>
            ) : cfdi?.TipoDeComprobante === "T" ? (
              <Tag color="blue">TRASLADO</Tag>
            ) : cfdi?.TipoDeComprobante === "I" ? (
              <Tag color="blue">INGRESO</Tag>
            ) : cfdi?.TipoDeComprobante === "E" ? (
              <Tag color="blue">EGRESO</Tag>
            ) : null}
            {cfdi?.Estatus ? (
              <Tag color="green">VIGENTE</Tag>
            ) : (
              <Tag color="red">
                CANCELADA {formatDisplay(cfdi?.FechaCancelacion, DisplayType.PUREDATE).toString()}
              </Tag>
            )}
            {!cfdi?.from_xml ? <Tag color="red">SIN XML</Tag> : null}
          </Space>
          {cfdi?.TipoDeComprobante !== "N" && <div>Serie: {cfdi?.Serie}</div>}
          <div>Folio: {cfdi?.Folio}</div>
        </>
      ) : null}
    </Space>
  );
}
