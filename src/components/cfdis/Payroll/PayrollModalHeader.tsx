import { Space, Tag } from "antd";
import s from "../Modal/CFDIDisplayModal.module.scss";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";

type Props = {
  cfdi: IVACFDI | CFDI | undefined;
  isFetchingCFDI: boolean;
};

export default function PayrollModalHeader(props: Props) {
  const { cfdi, isFetchingCFDI } = props;

  return (
    <Space className={s.ModalTitle}>
      {!isFetchingCFDI || cfdi ? (
        <>
          <Space>
            <Tag color="blue">NÓMINA</Tag>
            {cfdi?.Estatus ? <Tag color="green">VIGENTE</Tag> : <Tag color="red">CANCELADA</Tag>}
            {!cfdi?.from_xml ? <Tag color="red">SIN XML</Tag> : null}
          </Space>
          <div>Folio: {cfdi?.Folio} </div>
          <div>Tipo de comprobante: N - Nómina</div>
        </>
      ) : null}
    </Space>
  );
}
