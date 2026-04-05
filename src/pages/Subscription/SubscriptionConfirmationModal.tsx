import { Button, Modal } from "antd";
import moment from "moment";

type Props = {
  visible: boolean;
  setVisible: (newState: boolean) => void;
  applyChanges: () => void;
  total: string;
  packageSelected: Product | null;
  extraUsers: number;
  setPackageBought: (val: string) => void;
  setValidPaymentDay: (val: moment.Moment) => void;
};

export default function SubscriptionConfirmationModal(props: Props) {
  const { visible, setVisible, applyChanges } = props;

  const onCancel = () => {
    setVisible(false);
  };

  const onConfirm = () => {
    // const today = moment();
    // const lastValidDate = today.add(3, "days");
    // setValidPaymentDay(lastValidDate);
    applyChanges();
    setVisible(false);
    // if (packageSelected?.stripe_name) setPackageBought(packageSelected.stripe_name);
  };

  return (
    <Modal
      open={visible}
      closable={false}
      footer={[
        <Button type="default" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button type="primary" onClick={onConfirm}>
          Confirmar pedido
        </Button>,
      ]}
    >
      <p
        style={{
          lineHeight: 1.6,
          fontSize: 14,
        }}
      >
        Al confirmar la compra <strong> serán activados de inmediato los beneficios</strong>{" "}
        seleccionados, y será generada tu orden de compra que{" "}
        <strong>deberás pagar en un lapso máximo de 3 días.</strong>
      </p>
      <br />
    </Modal>
  );
}

SubscriptionConfirmationModal.defaultProps = {
  userSource: null,
};
