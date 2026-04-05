import { Typography } from "antd";
import s from "../SubscriptionPurchaseForm.module.scss";

interface IDiscountMessage {
  daysToExpire: number;
  isTrialing: boolean | null;
  seasonalDiscount: number;
}

export default function DiscountMessage(props: IDiscountMessage) {
  const { daysToExpire, isTrialing, seasonalDiscount } = props;

  const discountMonth = "noviembre";
  const discountYear = 2025;

  return (daysToExpire <= 0 || isTrialing) && seasonalDiscount ? (
    <div className={s.BuenFinSection}>
      <Typography.Text style={{ fontSize: 18, color: "#0070b3" }}>
        {isTrialing
          ? `Aprovecha el descuento del ${seasonalDiscount}% durante el mes de ${discountMonth} ${discountYear} en los planes y extras`
          : `Aprovecha el descuento del ${seasonalDiscount}% durante el mes de ${discountMonth} ${discountYear} al crecer tu plan o adquirir extras`}
      </Typography.Text>
      {/* <Typography.Text style={{ fontSize: 18, color: "#0070b3" }}>
        <span className={s.BuenFinBold}>
          <i>*No aplica para renovaciones.</i>
        </span>
      </Typography.Text> */}
    </div>
  ) : null;
}
