import { Button, Modal, Table } from "antd";
import { SATStatusColumns, SATStatusData } from "./SATStatusTable";

type propsType = {
  visible: boolean;
  setVisible: (value: boolean) => void;
};

export default function SATStatusModal(props: propsType) {
  const { visible, setVisible } = props;

  return (
    <Modal
      title='Ayuda: Referencia de Estatus de Descarga'
      open={visible}
      width='50%'
      onCancel={() => setVisible(false)}
      footer={[
        <Button
          key='submit'
          id='profile-modal-submit'
          type='default'
          onClick={() => setVisible(false)}>
          Cerrar
        </Button>,
      ]}>
      <Table
        columns={SATStatusColumns}
        size='small'
        dataSource={SATStatusData}
        pagination={false}
        scroll={{ x: 10, y: 500 }}
      />
    </Modal>
  );
}
