import { useEffect, useMemo } from "react";
import { message } from "antd";
import { useSelector } from "react-redux";
import { authSelector } from "../store/authSlice";
import { companySelector } from "../store/companySlice";
import { getCompanies } from "../store/companySlice/getCompanies";
import { salesSelector } from "../store/salesSlice";
import { getProducts } from "../store/salesSlice/getProducts";
import { useAppDispatch } from "@store/store";

export default function useSubscriptionData() {
  const dispatch = useAppDispatch();
  const { companies, isFetching } = useSelector(companySelector);
  const { workspace, userData } = useSelector(authSelector);
  const { products, extraUsersProduct, trialProduct, isFetchingProducts } =
    useSelector(salesSelector);

  useEffect(() => {
    if (companies.length === 0 && !isFetching) dispatch(getCompanies());
    if (products.length === 0 && !isFetchingProducts) dispatch(getProducts());
  }, []);

  const subscriptionData = useMemo(() => {
    if (workspace && userData && products.length > 0) {
      let license:
        | {
            date_start: string;
            date_end: string;
            details: {
              max_companies: number;
              max_emails_enroll: number;
              exceed_metadata_limit: boolean;
              products?: { identifier: string; quantity: number }[];
            };
          }
        | undefined;

      try {
        license = userData.access[workspace].license;
      } catch (error) {
        console.error(error);
        message.error("Hubo un error al obtener la licencia");
      }

      if (license) {
        let currentPlan: Product | null = null;
        let currentExtraUsers = 0;

        const udProducts = license.details.products;
        if (udProducts && udProducts.length > 0) {
          udProducts.forEach((udp) => {
            const productFetched = products.find((p) => p.identifier === udp.identifier);
            if (productFetched) {
              if (productFetched.identifier === extraUsersProduct?.identifier) {
                currentExtraUsers = udp.quantity;
              } else if (
                productFetched.characteristics.is_package === "1" ||
                productFetched.identifier === trialProduct?.identifier
              ) {
                currentPlan = productFetched;
              }
            }
          });
        }

        let currentCompanies = 0;
        companies.forEach((c) => {
          if (c.workspace.identifier === workspace) {
            currentCompanies += 1;
          }
        });

        const dateStart = new Date(license.date_start);
        if (!license.date_start?.includes("T")) {
          dateStart.setDate(dateStart.getDate() + 1);
        }
        const dateEnd = new Date(license.date_end);
        if (!license.date_end?.includes("T")) {
          dateEnd.setDate(dateEnd.getDate() + 1);
        }

        const stripeStatus = userData.access[workspace].stripe_status;

        const currentPlanChecked = currentPlan ? (currentPlan as Product) : currentPlan;

        let isTrialing = false;
        if (
          stripeStatus === "trialing" ||
          trialProduct?.identifier === currentPlanChecked?.identifier
        ) {
          isTrialing = true;
        }

        let isCanceled = false;
        if (stripeStatus === "canceled") isCanceled = true;

        return {
          dateStart,
          dateEnd,
          currentCompanies,
          currentPlan: currentPlanChecked,
          currentExtraUsers,
          maxCompanies: license.details.max_companies as number,
          maxUsers: license.details.max_emails_enroll as number,
          stripeStatus,
          isTrialing,
          isCanceled,
        };
      }
    }
    return {
      dateStart: null,
      dateEnd: null,
      currentCompanies: null,
      currentPlan: null,
      currentExtraUsers: 0,
      maxCompanies: null,
      maxUsers: null,
      stripeStatus: null,
      isTrialing: null,
      isCanceled: null,
    };
  }, [companies, products, workspace, userData]);

  return subscriptionData;
}
