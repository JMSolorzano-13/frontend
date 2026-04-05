import { useEffect, useState } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import s from "../SubscriptionPurchaseForm.module.scss";
import { authSelector } from "@store/authSlice";
import useSubscriptionData from "@hooks/useSubscriptionData";
import PlanItem from "../_components/PlanItem";

interface IUseGetProducts {
  packageSelected: Product | null;
  productsToDisplay: Product[];
  extraUsersProduct: Product | null;
  isLocked: boolean;
  userSource: UserWithPermissions[] | undefined;
  openPayment: string;
  daysToExpire: number;
  handleButtonClick: (product: Product) => void;
}

type TState = {
  products: JSX.Element[];
  isLoading: boolean;
};
export default function useGetProducts({
  packageSelected,
  productsToDisplay,
  extraUsersProduct,
  isLocked,
  userSource,
  openPayment,
  daysToExpire,
  handleButtonClick,
}: IUseGetProducts) {
  const seasonalDiscount = parseInt(import.meta.env.VITE_SEASONAL_DISCOUNT || 0);
  const [state, setState] = useState<TState>({
    products: [],
    isLoading: true,
  });
  const { hasPendingPayment } = useSelector(authSelector);
  const { currentPlan, isTrialing } = useSubscriptionData();
  useEffect(() => {
    function loadProducts() {
      const components: JSX.Element[] = [];
      const orderedProducts = _.sortBy(productsToDisplay, ["price"]);
      orderedProducts.forEach((p) => {
        const users = p.characteristics.max_emails_enroll;
        const companies = p.characteristics.max_companies;

        if (!users || !companies) return;

        const isSelected = packageSelected?.identifier === p.identifier;

        const bodyStyles = [s.MainBody];
        if (isSelected) bodyStyles.push(s.SelectedBody);
        if (hasPendingPayment || openPayment) {
          bodyStyles.push(s.DisabledButton);
        } else {
          bodyStyles.push(s.ClickableButton);
        }

        let cantBeSelected = true;
        if (currentPlan) {
          if (p.price >= currentPlan.price) {
            cantBeSelected = false;
          } else {
            cantBeSelected = true;
          }
        }

        let showStrokePrice = true;
        if (currentPlan) {
          if (p.price > currentPlan.price) {
            showStrokePrice = true;
          } else {
            showStrokePrice = false;
          }
        }

        if (!cantBeSelected && seasonalDiscount > 0) {
          if (currentPlan && p.price === currentPlan.price) {
            bodyStyles.push(s.PlanCardCurrentCentered);
          } else {
            bodyStyles.push(s.PlanCardBetween);
          }
        }

        if (cantBeSelected || (currentPlan && p.price > currentPlan.price)) {
          bodyStyles.push(s.PlanCardCentered);
        }

        const activeLabelStyles =
          daysToExpire <= 0 || isTrialing ? [s.ActiveLabelTagDiscount] : [s.ActiveLabelTag];
        if ((isSelected && daysToExpire <= 0) || isTrialing) {
          activeLabelStyles.push(s.SelectedActiveLabelDiscount);
        } else if (isSelected) {
          activeLabelStyles.push(s.SelectedActiveLabel);
        }

        components.push(
          <PlanItem
            product={p}
            bodyStyles={bodyStyles}
            disabled={!!openPayment || hasPendingPayment || cantBeSelected}
            handleButtonClick={() => handleButtonClick(p)}
            daysToExpire={daysToExpire}
            isTrialing={isTrialing}
            companies={companies}
            users={users}
            openPayment={openPayment}
            currentPlan={currentPlan}
            activeLabelStyles={activeLabelStyles}
            isSelected={isSelected}
            packageSelected={packageSelected}
            showStrokePrice={showStrokePrice}
            seasonalDiscount={seasonalDiscount}
          />
        );
      });
      setState({
        ...state,
        products: components,
        isLoading: true,
      });
    }
    loadProducts();
  }, [
    packageSelected,
    productsToDisplay,
    extraUsersProduct,
    currentPlan,
    isLocked,
    userSource,
    openPayment,
  ]);
  return { ...state };
}
