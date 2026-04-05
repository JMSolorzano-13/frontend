import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { InputNumber, message, Popover, Spin, Switch, Typography } from "antd";
import { authSelector } from "@store/authSlice";
import s from "./SubscriptionPurchaseForm.module.scss";
import { salesSelector } from "@store/salesSlice";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { setLicense } from "@api/sales";
import useSubscriptionData from "@hooks/useSubscriptionData";
import SubscriptionConfirmationModal from "./SubscriptionConfirmationModal";
import SubscriptionResume from "./SubscriptionResume";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import { DEFAULT_PRICE } from "./_constants/PriceConstants";
import DiscountMessage from "./_components/DiscountMessage";
import Products from "./_components/Products";

const content = (
  <div>
    <div className={s.RequirementsHeader}>
      <p>Requerimientos</p>
    </div>
    <div className={s.RequirementsContainer}>
      <p className={s.RequirementsSubtitle}>Concilia y sincroniza CFDIs</p>
      <p className={s.RequirementsText}>con CONTPAQi® Contabilidad</p>
      <div className={s.RequirementsBody}>
        <p>Para su instalación se requiere:</p>
        <ul>
          <li>
            <b>Windows 10</b> o posterior
          </li>
          <li>
            <b>Windows server 2016</b> o posterior
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default function SubscriptionPurchaseForm(props: Props) {
  const {
    purchaseError = null,
    showErrors = true,
    userSource = undefined,
    openPayment = "",
    setPackageBought,
    setValidPaymentDay,
    dateEnd,
    openPaymentLink,
  } = props;
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const { currentPlan, currentExtraUsers, isTrialing, isCanceled } = useSubscriptionData();
  const [packageSelected, setPackageSelected] = useState<Product | null>(null);
  const [extraUsers, setExtraUsers] = useState(currentExtraUsers);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const { workspace, hasPendingPayment, license, addEnabled } = useSelector(authSelector);
  const { extraUsersProduct, addProduct, productsError, isFetchingProducts } =
    useSelector(salesSelector);
  const [hasADD, setHasADD] = useState(false);
  const isDetailed = false;
  const actualDate = moment();
  const validUntil = license?.valid_until;
  const subscriptionEndDate = validUntil ? moment.unix(validUntil) : moment();
  const prorateDate = moment(actualDate);
  const actualDateToSend = moment.utc(
    `${prorateDate.format("MM/DD/YYYY")} ${subscriptionEndDate.format("HH:mm:ss")}`
  );
  const dateToSend = moment(actualDateToSend.format("MM/DD/YYYY HH:mm:ss")).unix();
  const daysToExpire = moment().diff(moment(dateEnd), "days");
  const seasonalDiscount = parseInt(import.meta.env.VITE_SEASONAL_DISCOUNT || 0);

  // EFFECTS
  useEffect(() => {
    if (productsError) message.error(productsError);
  }, [productsError]);

  useEffect(() => {
    if (currentPlan && !packageSelected && !isTrialing && !isCanceled) {
      setPackageSelected(currentPlan);
    }
  }, [currentPlan]);

  useEffect(() => {
    setExtraUsers(0);
  }, [currentExtraUsers]);

  useEffect(() => {
    if (addEnabled) {
      setHasADD(true);
    } else {
      setHasADD(false);
    }
  }, [license]);

  const sendError = (error: SubsError) => {
    if (purchaseError) {
      purchaseError(error);
    }
    if (showErrors) {
      message.error(error.msg);
    }
  };

  const applyChanges = async () => {
    if (!workspace) return;
    if (!packageSelected) {
      message.error("Selecciona un plan para continuar");
      return;
    }
    if (!extraUsersProduct) {
      message.error("Error al obtener un producto");
      return;
    }

    if (!addProduct) {
      message.error("Error al obtener un producto");
      return;
    }

    setLoading(true);

    const productsToSet = [];

    if (currentPlan?.identifier !== packageSelected.identifier) {
      productsToSet.push({
        identifier: packageSelected.identifier,
        quantity: 1,
      });
    }

    if (extraUsers > 0) {
      productsToSet.push({
        identifier: extraUsersProduct.identifier,
        quantity: extraUsers + currentExtraUsers,
      });
    }

    if (hasADD && !addEnabled) {
      productsToSet.push({
        identifier: addProduct.identifier,
        quantity: 1,
      });
    }

    try {
      await setLicense(workspace, productsToSet, dateToSend);
      setIsLocked(true);
      // if (purchaseDone) purchaseDone(invoiceUrl);
      setTimeout(() => {
        location.reload();
        setLoading(false);
      }, 5000);
    } catch (error: any) {
      const errorMsg = error.response.data.Message as string;
      if (errorMsg?.toLowerCase().includes("companies exceed new limit")) {
        sendError({
          msg: "No se puede aplicar ese plan, número de compañías actuales excede el límite del plan",
        });
      } else if (errorMsg?.toLowerCase().includes("license requires a previous action")) {
        const paymentUrlArr = errorMsg.split("link: ");
        let paymentUrl: string | null = null;
        if (paymentUrlArr.length > 1) {
          const [, url] = paymentUrlArr;
          paymentUrl = url;
        }
        sendError({
          msg: "No se puede aplicar el cambio, se tiene un pago pendiente en la suscripción",
          data: {
            paymentUrl,
          },
        });
        setIsLocked(true);
      } else {
        sendError({
          msg: "Hubo un error al actualizar la licencia, intente de nuevo",
        });
      }
      setLoading(false);
    }
  };

  const total = useMemo(() => {
    let hasDiscount = false;

    if (userSource && userSource[0]?.sourceName && license && !license.any_invoice_paid) {
      hasDiscount = true;
    }
    if (!packageSelected || !extraUsersProduct || !addProduct) return 0;
    const extraUserPrice = !hasDiscount
      ? extraUsersProduct.price / 100
      : (extraUsersProduct.price / 100) * 0.9;
    const packageSelectedPrice = !hasDiscount
      ? packageSelected.price / 100
      : (packageSelected.price / 100) * 0.9;
    let addPrice = 0;
    if (hasADD) {
      addPrice = !hasDiscount ? addProduct.price / 100 : (addProduct.price / 100) * 0.9;
    }
    return formatDisplay(
      extraUserPrice * extraUsers + packageSelectedPrice + addPrice,
      DisplayType.MONEY
    );
  }, [extraUsers, packageSelected, extraUsersProduct, hasADD]);

  if (isFetchingProducts) {
    return (
      <div className={s.Spinning}>
        <Spin size="large" />
      </div>
    );
  }

  const applyButtonDisabled =
    packageSelected?.identifier === currentPlan?.identifier &&
    currentExtraUsers === extraUsers &&
    !isTrialing &&
    !isCanceled &&
    addEnabled === hasADD;

  const isSelectOtherPlan = packageSelected?.identifier !== currentPlan?.identifier;

  function getADDPrice() {
    if (addProduct && seasonalDiscount > 0 && hasADD) {
      return formatDisplay(DEFAULT_PRICE.ADD, DisplayType.MONEY);
    }

    return formatDisplay(addProduct ? addProduct?.price / 100 : 0, DisplayType.MONEY);
  }

  return (
    <>
      <DiscountMessage
        daysToExpire={daysToExpire}
        isTrialing={isTrialing}
        seasonalDiscount={seasonalDiscount}
      />
      <Products
        setPackageSelected={setPackageSelected}
        packageSelected={packageSelected}
        hasPendingPayment={hasPendingPayment}
        isLocked={isLocked}
        userSource={userSource}
        openPayment={openPayment}
        daysToExpire={daysToExpire}
      />
      <div className={s.BottomNote}>
        <br />
        <Typography.Text style={{ fontSize: 12 }}>
          <b>Nota:</b> Hasta 1 millón de CFDIs emitidos o recibidos por RFC. En caso de exceder el
          volumen serás contactado por uno de nuestros ejecutivos.
        </Typography.Text>
      </div>

      <Title level={5} className="mt-4">
        Elige los extras a agregar
      </Title>
      <div className={s.SecSection}>
        <div className={s.ExtraUsersSection}>
          <div className={s.ExtraUsers}>
            <h6>Usuarios adicionales</h6>
            {(daysToExpire <= 0 || isTrialing) && seasonalDiscount > 0 ? (
              <Typography.Text className={s.ExtraPriceDiscount}>
                {formatDisplay(DEFAULT_PRICE.ExtraUsers, DisplayType.MONEY)}
                <div className={s.LineThroughExtras}></div>
              </Typography.Text>
            ) : null}
            <Typography.Text className={s.ExtraPrice}>
              {formatDisplay(
                extraUsersProduct ? extraUsersProduct?.price / 100 : 0,
                DisplayType.MONEY
              )}
              mxn/año cada usuario
            </Typography.Text>
            {/* <p className={s.ExtrasIVA}>*Incluye IVA</p> */}
            {!openPayment ? (
              <div className={s.ExtraLabels}>
                <label>Cuantos:</label>
                <InputNumber
                  className={`${s.ExtraUsersInput}`}
                  value={extraUsers}
                  disabled={loading || isLocked || hasPendingPayment || !packageSelected}
                  onChange={(num) => setExtraUsers(Math.abs(num as number))}
                  min={0}
                />
              </div>
            ) : null}
          </div>
          <br />
          <Popover content={content} placement="right" overlayInnerStyle={{ padding: 0 }}>
            <div className={s.ExtraUsers}>
              <h6 data-test="Modulo oculto">Módulo de sincronización ADD</h6>
              {(daysToExpire <= 0 || isTrialing) && seasonalDiscount > 0 && !hasADD ? (
                <Typography.Text className={s.ExtraPriceDiscount}>
                  {formatDisplay(DEFAULT_PRICE.ADD, DisplayType.MONEY)}
                  <div className={s.LineThroughExtras}></div>
                </Typography.Text>
              ) : null}
              <Typography.Text className={s.ExtraPrice}>{getADDPrice()}mxn/año</Typography.Text>
              {/* <p className={s.ExtrasIVA}>*Incluye IVA</p> */}
              <Switch
                className={s.Switch}
                checked={hasADD}
                disabled={
                  loading || isLocked || hasPendingPayment || !packageSelected || addEnabled
                }
                onChange={() => setHasADD(!hasADD)}
                data-test="switch_add"
              />
            </div>
          </Popover>
        </div>

        <div className={s.PayButtonSection}>
          {!openPayment && !hasPendingPayment && isDetailed ? (
            <h6>
              Total: <strong>{total as string} MXN</strong> /año{" "}
              {userSource && userSource[0]?.sourceName ? "*" : null}
            </h6>
          ) : null}
        </div>
      </div>
      {(packageSelected && packageSelected?.identifier !== currentPlan?.identifier) ||
      hasPendingPayment ||
      extraUsers > 0 ||
      (license && hasADD && !addEnabled) ? (
        <SubscriptionResume
          prorateDate={dateToSend}
          loading={loading}
          setConfirmModalVisible={setConfirmModalVisible}
          license={license}
          hasPendingPayment={hasPendingPayment}
          userSource={userSource}
          addProduct={addProduct}
          hasAdd={hasADD}
          packageSelected={packageSelected}
          extraUsers={extraUsers}
          extraUsersProduct={extraUsersProduct}
          applyButtonDisabled={applyButtonDisabled}
          isSelectOtherPlan={isSelectOtherPlan}
          openPaymentLink={openPaymentLink}
        />
      ) : null}
      {/* <Typography.Text className={s.RecipientLabel}>
        <b>Beneficiario: </b> SolucionCP Ideas Empresariales SAPI de CV <br /> <b>RFC:</b>
        SIE200729UA0
      </Typography.Text> */}
      <SubscriptionConfirmationModal
        visible={confirmModalVisible}
        setVisible={setConfirmModalVisible}
        applyChanges={applyChanges}
        total={total as string}
        packageSelected={packageSelected}
        extraUsers={extraUsers}
        setPackageBought={setPackageBought}
        setValidPaymentDay={setValidPaymentDay}
      />
    </>
  );
}

export type SubsError = {
  msg: string;
  data?: {
    paymentUrl?: string | null;
  };
};

type Props = {
  purchaseDone?: (invoice_url: string) => void;
  purchaseError?: (error: SubsError) => void;
  showErrors?: boolean;
  userSource?: UserWithPermissions[];
  openPayment?: string;
  setPackageBought: (val: string) => void;
  setValidPaymentDay: (val: moment.Moment) => void;
  openPaymentLink: string | undefined;
  dateEnd: Date;
};
