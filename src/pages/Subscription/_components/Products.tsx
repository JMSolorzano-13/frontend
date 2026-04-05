import { salesSelector } from "@store/salesSlice";
import { useSelector } from "react-redux";
import useGetProducts from "../_hooks/useGetProducts";
import s from "../SubscriptionPurchaseForm.module.scss";
import { message } from "antd";
import { Dispatch } from "react";

interface IProduct {
  setPackageSelected: Dispatch<React.SetStateAction<Product | null>>;
  packageSelected: Product | null;
  hasPendingPayment: boolean;
  isLocked: boolean;
  userSource: UserWithPermissions[] | undefined;
  openPayment: string;
  daysToExpire: number;
}

export default function Products(props: IProduct) {
  const {
    setPackageSelected,
    hasPendingPayment,
    packageSelected,
    isLocked,
    userSource,
    openPayment,
    daysToExpire,
  } = props;

  const { productsToDisplay, extraUsersProduct } = useSelector(salesSelector);

  function handleButtonClick(product: Product) {
    setPackageSelected(product);
    if (hasPendingPayment) {
      message.info(
        "Tienes un pago pendiente, para elegir un plan, realiza el pago y vuelve a intentar"
      );
    }
  }

  const { products, isLoading } = useGetProducts({
    packageSelected,
    productsToDisplay,
    extraUsersProduct,
    isLocked,
    userSource,
    openPayment,
    daysToExpire,
    handleButtonClick,
  });

  return <div className={s.FormWrapper}>{!!isLoading && products}</div>;
}
