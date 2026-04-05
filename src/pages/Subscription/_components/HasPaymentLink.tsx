import { Alert, Typography, Space, Button } from "antd";
import moment from "moment";
//
interface IHasPaymentLink {
  paymentLink: string | undefined;
  validPaymentDay: moment.Moment | undefined;
  packageBought: string;
}
export default function HasPaymentLink({
  paymentLink,
  validPaymentDay,
  packageBought,
}: IHasPaymentLink) {
  if (paymentLink && validPaymentDay) {
    <>
      <Alert
        message={
          <Space direction="vertical">
            <Typography.Text>
              Gracias por tu pedido, desde hoy ya tienes activo tu plan{" "}
              <strong>{packageBought}</strong>; tienes{" "}
              <strong>
                hasta el {`${validPaymentDay.format("DD")} de ${validPaymentDay.format("MMMM")}`}{" "}
                para pagar.
              </strong>
            </Typography.Text>
            <a href={paymentLink} rel="noreferrer" target="_blank">
              <Button type="primary">Realizar pago</Button>
            </a>
          </Space>
        }
        style={{ marginBottom: 20 }}
      />
      <br />
    </>;
  }
  return null;
}
