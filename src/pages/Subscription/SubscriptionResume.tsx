import { Alert, Button, Tooltip } from "antd";
import { useEffect, useState } from "react";
import useSubscriptionData from "@hooks/useSubscriptionData";
import s from "./SubscriptionPurchaseForm.module.scss";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import moment from "moment";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { getMonthName } from "@utils/dateHelper";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";

type Props = {
  setConfirmModalVisible: (visible: boolean) => void;
  packageSelected: Product | null;
  extraUsers: number;
  applyButtonDisabled: boolean;
  isSelectOtherPlan: boolean;
  extraUsersProduct: Product | null;
  addProduct: Product | null;
  hasAdd: boolean;
  userSource: UserWithPermissions[] | undefined;
  license: License | null;
  hasPendingPayment: boolean;
  openPaymentLink: string | undefined;
  loading: boolean;
  prorateDate: number;
};

export default function SubscriptionResume(props: Props) {
  const {
    prorateDate,
    license,
    packageSelected,
    hasPendingPayment,
    extraUsers,
    extraUsersProduct,
    addProduct,
    hasAdd,
    userSource,
    openPaymentLink,
    loading,
    setConfirmModalVisible,
  } = props;
  const { addEnabled } = useSelector(authSelector);
  const { currentPlan, isTrialing, stripeStatus, dateEnd } = useSubscriptionData();
  const [actualTotal, setActualTotal] = useState(0);
  const today = moment.unix(prorateDate);
  const nextYear = moment().add(1, "year");

  // const validUntil = license?.valid_until ? moment(license?.valid_until * 1000) : null;
  // const daysLeft = validUntil ? validUntil.subtract(1, "day").diff(today, "days") : 0;
  const validPaymentDay = moment(license?.latest_invoice?.created_at).add(3, "days");
  const product = license?.latest_paid_invoice?.lines_data.find(
    (line) => line.price.product === currentPlan?.identifier
  );
  let productPrice = product ? product.price.unit_amount / 100 : 0;

  useEffect(() => {
    productPrice = productPrice === 0 && currentPlan ? currentPlan?.price / 100 : productPrice;
    if (packageSelected && !hasPendingPayment) {
      let total = packageSelected.price / 100;
      if (extraUsers > 0 && extraUsersProduct) {
        total += (extraUsers * extraUsersProduct.price) / 100;
      }
      if (addProduct && hasAdd && !addEnabled) {
        total += addProduct.price / 100;
      }
      if (!isTrialing && currentPlan && currentPlan.identifier !== packageSelected.identifier) {
        total -= productPrice;
      }
      if (packageSelected && packageSelected?.identifier === currentPlan?.identifier) {
        total -= packageSelected.price / 100;
      }
      setActualTotal(total);
    }
  }, [packageSelected, extraUsers, addProduct, hasAdd]);

  const seasonalDiscount = parseInt(import.meta.env.VITE_SEASONAL_DISCOUNT || 0);
  const isSelectOtherPlan =
    packageSelected?.identifier !== currentPlan?.identifier || hasPendingPayment;

  function manageExtraDiscount() {
    if (seasonalDiscount > 0) {
      return null;
    }
    if (userSource && !hasPendingPayment && userSource[0]?.sourceName && isTrialing) {
      return (
        <section className={s.Discount}>
          <div>
            <h6>Distribuidor</h6>
            <h4>Descuento 10%</h4>
          </div>
          <p>
            De <span className={s.OldPrice}>{formatDisplay(actualTotal, DisplayType.MONEY)}</span> a{" "}
            <span className={s.NewPrice}>
              {formatDisplay(actualTotal * 0.9, DisplayType.MONEY)}
            </span>
          </p>
        </section>
      );
    }
  }
  return (
    <div className={s.Resume}>
      {!hasPendingPayment && isTrialing && (
        <h4 className={s.Title}>{!isTrialing ? "Resumen de ajustes a contratar" : "Resumen"}</h4>
      )}

      {/* Content info */}
      <div className={s.Info}>
        {/* Resumen of plans */}
        {packageSelected && !hasPendingPayment && (
          <table>
            {/* Plan */}
            {isTrialing && isSelectOtherPlan && currentPlan && (
              <tr>
                <td>{!isTrialing ? "Mejora de plan" : "Plan"}</td>
                <td> </td>

                <td className={s.Label}>{packageSelected.stripe_name}</td>
                <td className={s.Label}></td>
                <td className={s.LabelResult}>
                  {!isTrialing
                    ? formatDisplay(
                        packageSelected.price / 100 - currentPlan?.price / 100,
                        DisplayType.MONEYWITHINTEGER
                      )
                    : formatDisplay(packageSelected.price / 100, DisplayType.MONEYWITHINTEGER)}
                  {/* {formatDisplay(packageSelected.price / 100, DisplayType.MONEY)} */}
                </td>
                {!isTrialing && (
                  <td className={s.LabelInfo}>
                    <Tooltip
                      id="tooltip"
                      title={`${packageSelected.stripe_name} ${formatDisplay(
                        packageSelected.price / 100,
                        DisplayType.MONEYWITHINTEGER
                      )} - 
                      ${currentPlan?.stripe_name} ${formatDisplay(
                        productPrice,
                        DisplayType.MONEYWITHINTEGER
                      )} =
                      ${formatDisplay(
                        packageSelected.price / 100 - productPrice,
                        DisplayType.MONEYWITHINTEGER
                      )}`}
                      overlayStyle={{ color: "#0070B3", width: "388" }}
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </td>
                )}
              </tr>
            )}

            {/* Extra users */}
            {(extraUsers > 0 || hasPendingPayment) && extraUsersProduct && isTrialing && (
              <tr>
                <td>Usuarios adicionales</td>
                <td> </td>
                <td className={s.LabelExtra}>{extraUsers}</td>
                <td className={s.Label}>=</td>
                <td className={s.LabelResult}>
                  {formatDisplay(
                    (extraUsers * extraUsersProduct.price) / 100,
                    DisplayType.MONEYWITHINTEGER
                  )}
                </td>
              </tr>
            )}
            {/* ADD PRODUCT */}
            {addProduct && hasAdd && !addEnabled && isTrialing && (
              <tr>
                <td>Módulo del ADD</td>
                <td></td>
                <td></td>
                <td className={s.Label}></td>
                <td className={s.LabelResult}>
                  {formatDisplay(addProduct.price / 100, DisplayType.MONEYWITHINTEGER)}
                </td>
              </tr>
            )}
            {/* Total */}
            {isTrialing ? (
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className={s.Label}>=</td>
                <td className={s.LabelTotal}>
                  {formatDisplay(actualTotal, DisplayType.MONEYWITHINTEGER)}
                </td>
              </tr>
            ) : null}
          </table>
        )}

        {/* New vigency */}
        {isTrialing && (
          <section className={s.Vigency}>
            <h6>Fecha de vigencia pagando hoy</h6>
            <span>
              {today.format("DD")} de {getMonthName(today.month() + 1)} de {nextYear.format("YYYY")}
            </span>
          </section>
        )}

        {/* Prorate */}
        {/* !hasPendingPayment && !isTrialing && license ? (
          <section className={s.Prorate}>
            <h6>Ajuste por fecha de vigencia</h6>
            <p>
              <span>{daysLeft > 365 ? "365" : daysLeft.toFixed(0)} </span>
              Dias restantes al{" "}
              <span>
                {validUntil?.format("DD")}
                {validUntil ? validUntil.format(" MMM ") : ""}
                {validUntil?.format("YYYY")}
              </span>
            </p>
            <div className={s.ProratePrice}>
              <p>
                {formatDisplay(actualTotal, DisplayType.MONEY)} ÷ 365 x{" "}
                {daysLeft < 365 ? daysLeft.toFixed(0) : "365"}{" "}
                <span>= {formatDisplay(calculateProrate(), DisplayType.MONEY)} </span>
              </p>
            </div>
          </section>
        ) : null */}

        {/* Discount for distribution */}
        {manageExtraDiscount()}

        {/* Total */}
        {hasPendingPayment ? (
          <section className={s.Total}>
            {<h6>Pago pendiente por</h6>}
            <h5>
              {license?.latest_invoice?.amount_due &&
                formatDisplay(
                  (license.latest_invoice?.amount_due || 0) / 100,
                  DisplayType.MONEY
                )}{" "}
              mxn
            </h5>
            <p>IVA incluido</p>
          </section>
        ) : null}

        {/* Button */}
        {openPaymentLink || hasPendingPayment ? (
          <a href={openPaymentLink} target="_blank" rel="noopener noreferrer">
            <Button size="large" type="primary">
              Realizar pago
            </Button>
          </a>
        ) : (
          <Button
            size="large"
            className="rounded-sm"
            onClick={() => setConfirmModalVisible(true)}
            disabled={(!packageSelected && (!extraUsers || loading || !hasAdd)) || loading}
            type="primary"
            loading={loading}
            id="generate-order-button"
          >
            Generar pedido
          </Button>
        )}
      </div>

      {/* Alerts */}
      <div className={s.Alerts}>
        {/* Alert for pending payment */}
        {(hasPendingPayment || openPaymentLink) && stripeStatus === "active" && currentPlan && (
          <Alert
            message={
              <p>
                <span className={s.BeginAlert}>Nota: </span>
                Gracias por tu pedido, desde hoy ya tienes activo{" "}
                <span>
                  {" "}
                  {openPaymentLink ? packageSelected?.stripe_name : currentPlan?.stripe_name}.{" "}
                </span>
                Tienes hasta el{" "}
                <span>
                  {validPaymentDay?.format("DD")} de {validPaymentDay?.format("MMMM")} para realizar
                  tu pago.
                </span>
              </p>
            }
            type="info"
            style={{
              backgroundColor: "#DDEBFA",
              border: "1px solid #BBD7F5",
            }}
          />
        )}
        {/* Alert for pending payment and cancelled */}
        {hasPendingPayment && stripeStatus && stripeStatus !== "active" && (
          <Alert
            message={
              <p>
                <span className={s.BeginAlert}>Importante: </span>
                Tienes un pago pendiente. Para poder seguir usando los beneficios de tus suscripción
                liquida tu pago.
              </p>
            }
            type="warning"
          />
        )}
        {/* Alert for prorate */}
        {!isTrialing && !hasPendingPayment && !openPaymentLink && (
          <Alert
            message={
              <p>
                <span className={s.BeginAlert}>Nota: </span>
                Los ajustes que contrates tendrán la misma vigencia de tu suscripción actual, por lo
                que el importe a pagar se acota al {moment(dateEnd).format("DD")} de{" "}
                {moment(dateEnd).format("MMMM")} del {moment(dateEnd).format("yyyy")}, considerando
                solo los días restantes.
              </p>
            }
            type="info"
          />
        )}
      </div>
    </div>
  );
}
