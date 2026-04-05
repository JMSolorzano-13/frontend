import { authSelector } from "@store/authSlice";
import { Alert, Space, Typography, Button } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";

interface IHasPendingPayment {
  hasLeftDays: boolean;
  actualPlan: string | undefined;
  paymentLimitDay: string;
  datePlusOneYear: moment.Moment;
  pendingPaymentLink: string | undefined;
}

export default function HasPendingPayment({
  hasLeftDays,
  actualPlan,
  paymentLimitDay,
  datePlusOneYear,
  pendingPaymentLink,
}: IHasPendingPayment) {
  const { hasPendingPayment, license } = useSelector(authSelector);
  if (hasPendingPayment || pendingPaymentLink) {
    return (
      <>
        <Alert
          message={
            <Space direction="vertical">
              {hasLeftDays ? (
                <Typography.Text>
                  Gracias por tu pedido, desde hoy ya tienes activo tu plan{" "}
                  <strong>{actualPlan}</strong>; tienes{" "}
                  <strong>
                    hasta el{" "}
                    {`${paymentLimitDay.split(" ")[0]} de ${
                      paymentLimitDay.split(" ")[1]
                    } para pagar.`}
                    .
                  </strong>
                </Typography.Text>
              ) : (
                <Typography.Text>
                  Para reactivar tu suscripción con tu plan <strong>{actualPlan}</strong> completa
                  el pago. <strong>Pagando hoy</strong>, la{" "}
                  <strong>
                    vigencia sería hasta el{" "}
                    {`${datePlusOneYear.format("DD")} de ${datePlusOneYear.format(
                      "MMMM"
                    )} del ${datePlusOneYear.format("YYYY")}`}
                  </strong>
                  .
                </Typography.Text>
              )}
              <a
                href={pendingPaymentLink ?? license?.latest_invoice?.hosted_invoice_url}
                rel="noreferrer"
                target="_blank"
              >
                <Button type="primary">Realizar pago</Button>
              </a>
            </Space>
          }
          type={hasLeftDays ? "info" : "warning"}
          style={{ marginBottom: 20 }}
        />
        <br />
      </>
    );
  }
  return null;
}
