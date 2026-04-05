import { InternalTabType, ResponseTotalsDeductionsComplete, TabType } from "../_types/ISRTypes";
import s from "../_styles/DetailsTabs.module.scss";
import getCurrentDataDeductions from "./getCurrentDataDeductions";
import { useDisableButtonsTaxes } from "@hooks/useDisableButtonsTaxes";

export default function getDetailsTabsInternals(
  tab: TabType | InternalTabType,
  data: ResponseTotalsDeductionsComplete | null,
  loading: boolean
) {
  const currentData = getCurrentDataDeductions(data);
  const isISRButtonDisabled = useDisableButtonsTaxes();
  const tabsItems = [];
  if (tab === "DISCOUNTS") {
    tabsItems.push(
      {
        key: "DISCOUNTS-INCOMES",
        label: (
          <>
            <div className={s.TitleTab}>{`Dev., desctos. y bonif. en ingresos emitidos (${
              loading ? "..." : currentData ? currentData.discounts_incomes : "0"
            })`}</div>
          </>
        ),
        disabled: isISRButtonDisabled,
      },
      {
        key: "DISCOUNTS-EGRESS",
        label: (
          <>
            <div className={s.TitleTab}>{`Dev., desctos. y bonif. en egresos emitidos (${
              loading ? "..." : currentData ? currentData.discounts_egress : "0"
            })`}</div>
          </>
        ),
        disabled: isISRButtonDisabled,
      }
    );
  }

  if (tab === "EXCLUDED-PREFILLED") {
    tabsItems.push(
      {
        key: "EXCLUDED-PREFILLED-INCOMES",
        label: (
          <>
            <div className={s.TitleTab}>{`Ingresos PUE (${
              loading ? "..." : currentData ? currentData.excluded_prefilled_incomes : "0"
            })`}</div>
          </>
        ),
        disabled: isISRButtonDisabled,
      },
      {
        key: "EXCLUDED-PREFILLED-PAYMENT",
        label: (
          <>
            <div className={s.TitleTab}>{`Pagos (${
              loading ? "..." : currentData ? currentData.excluded_prefilled_payments : "0"
            })`}</div>
          </>
        ),
        disabled: isISRButtonDisabled,
      }
    );
  }

  if (tab === "EXCLUDED") {
    tabsItems.push([
      {
        key: "CASH",
        label: (
          <>
            <div className={s.TitleTab}>{`Facturas de contado (${
              loading ? "..." : currentData?.excluded_tab_cash ? currentData.excluded_tab_cash : "0"
            })`}</div>
          </>
        ),
        disabled: isISRButtonDisabled,
      },
      {
        key: "PAYMENT",
        label: (
          <>
            <div className={s.TitleTab}>{`Pagos (${
              loading
                ? "..."
                : currentData?.excluded_tab_payment
                ? currentData.excluded_tab_payment
                : "0"
            })`}</div>
          </>
        ),
        disabled: isISRButtonDisabled,
      },
      {
        key: "EXCLUDED-INCOMES",
        label: (
          <>
            <div className={s.TitleTab}>{`Ingresos (${
              loading
                ? "..."
                : currentData.excluded_tab_incomes
                ? currentData.excluded_tab_incomes
                : "0"
            })`}</div>
          </>
        ),
        disabled: isISRButtonDisabled,
      },
      {
        key: "EXCLUDED-EGRESS",
        label: (
          <>
            <div className={s.TitleTab}>{`Egresos (${
              loading
                ? "..."
                : currentData.excluded_tab_excluded_egress
                ? currentData.excluded_tab_excluded_egress
                : "0"
            })`}</div>
          </>
        ),
        disabled: isISRButtonDisabled,
      },
      {
        key: "EXCLUDED-INCOMES-PUE",
        label: (
          <>
            <div className={s.TitleTab}>{`Ingresos PUE (${
              loading
                ? "..."
                : currentData.excluded_tab_incomes_pue
                ? currentData.excluded_tab_incomes_pue
                : "0"
            })`}</div>
          </>
        ),
        disabled: isISRButtonDisabled,
      },
      {
        key: "EXCLUDED-PAYMENTS",
        label: (
          <>
            <div className={s.TitleTab}>{`Pagos (${
              loading
                ? "..."
                : currentData.excluded_tab_excluded_payment
                ? currentData.excluded_tab_excluded_payment
                : "0"
            })`}</div>
          </>
        ),
        disabled: isISRButtonDisabled,
      },

      {
        key: "EGRESS",
        label: (
          <>
            <div className={s.TitleTab}>{`Egresos recibidos (${
              loading
                ? "..."
                : currentData.excluded_tab_egress
                ? currentData.excluded_tab_egress
                : "0"
            })`}</div>
          </>
        ),
        disabled: isISRButtonDisabled,
      },
    ]);
  }

  return tabsItems;
}
