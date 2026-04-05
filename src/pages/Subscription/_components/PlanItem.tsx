import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { DEFAULT_PRICE, RENEWAL_PRICE } from "../_constants/PriceConstants";
import s from "../SubscriptionPurchaseForm.module.scss";

type TPlanItem = {
  product: Product;
  bodyStyles: string[];
  disabled: boolean;
  handleButtonClick: () => void;
  daysToExpire: number;
  isTrialing: boolean | null;
  companies: number | "unlimited";
  users: number | "unlimited";
  openPayment: string;
  currentPlan: Product | null;
  activeLabelStyles: string[];
  isSelected: boolean;
  packageSelected: Product | null;
  showStrokePrice: boolean;
  seasonalDiscount: number;
};
export default function PlanItem({
  product,
  bodyStyles,
  disabled,
  handleButtonClick,
  daysToExpire,
  isTrialing,
  companies,
  users,
  openPayment,
  currentPlan,
  activeLabelStyles,
  isSelected,
  packageSelected,
  showStrokePrice,
  seasonalDiscount,
}: TPlanItem) {
  function handleShowDiscount() {
    if (
      ((daysToExpire <= 0 || isTrialing) && seasonalDiscount > 0 && showStrokePrice) ||
      (seasonalDiscount === 0 && currentPlan?.identifier === product?.identifier)
    ) {
      return (
        <h5 className={s.BuenFinDiscount}>
          {formatDisplay(
            DEFAULT_PRICE[
              product.stripe_name.replaceAll("ezaudita ", "") as keyof typeof DEFAULT_PRICE
            ],
            DisplayType.MONEYWITHINTEGER
          )}
          <span className={s.Cents}>.00</span>
          <div
            className={product.stripe_name !== "Despachos" ? s.LineThrough : s.LineThroughDespachos}
          ></div>
        </h5>
      );
    }
  }

  function getBluePrice() {
    if (currentPlan?.identifier === product.identifier) {
      return formatDisplay(
        RENEWAL_PRICE[
          product.stripe_name.replaceAll("ezaudita ", "") as keyof typeof RENEWAL_PRICE
        ],
        DisplayType.MONEY
      );
    }
    if (!showStrokePrice) {
      return formatDisplay(
        DEFAULT_PRICE[
          product.stripe_name.replaceAll("ezaudita ", "") as keyof typeof DEFAULT_PRICE
        ],
        DisplayType.MONEY
      );
    }
    return formatDisplay(product.price / 100, DisplayType.MONEY);
  }

  return (
    <span key={product.identifier} id={product.identifier} className={s.SubscriptionCardContainer}>
      <button
        type="button"
        onClick={handleButtonClick}
        key={product.identifier}
        className={`${bodyStyles.join(" ")}`}
        disabled={disabled}
      >
        <span
          style={
            currentPlan && currentPlan.identifier === product.identifier && seasonalDiscount > 0
              ? {
                  display: "flex",
                  height: 97,
                  flexDirection: "column",
                  justifyContent: "end",
                  paddingBottom: 5,
                  gap: 15,
                }
              : { display: "flex", flexDirection: "column", gap: 15 }
          }
        >
          <h6>{product.stripe_name.replaceAll("ezaudita ", "")}</h6>
          {handleShowDiscount()}

          <h3 style={{ color: "#0070b3" }}>
            {getBluePrice()}
            <div>mxn/año{currentPlan?.identifier === product.identifier ? "*" : ""}</div>
          </h3>
        </span>
        {currentPlan?.identifier === product.identifier ? (
          <p className={s.IVA}>*Precio renovación</p>
        ) : null}
        {/* <p className={s.IVA}>*Incluye IVA</p> */}
        <ul className={s.ProductDetails}>
          <li>
            {companies !== "unlimited" ? companies : null}{" "}
            {product.stripe_name.replaceAll("ezaudita ", "") === "Pyme" ? "RFC" : "RFCs"}{" "}
            {companies === "unlimited" ? "Ilimitados" : null}
          </li>
          <li>
            {users} usuario{typeof users === "number" && users > 1 ? "s" : ""}
          </li>
          {/* <li>Validaciones ilimitadas</li> */}
        </ul>
      </button>
      {!openPayment ? (
        currentPlan?.identifier === product.identifier ? (
          <span className={activeLabelStyles.join(" ")}>{"Activo"}</span>
        ) : (
          <span
            className={daysToExpire <= 0 || isTrialing ? s.LabelTagDiscount : s.LabelTag}
            style={isSelected ? { display: "inline" } : { display: "none" }}
          >
            {isSelected ? "Seleccionado" : ""}
          </span>
        )
      ) : packageSelected?.identifier === product.identifier ? (
        <span className={activeLabelStyles.join(" ")}>{"Activo"}</span>
      ) : null}
    </span>
  );
}
