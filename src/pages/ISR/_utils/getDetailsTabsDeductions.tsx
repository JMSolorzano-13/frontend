import s from "../_styles/DetailsTabs.module.scss";
import { GetDetailsTabsTypeDeductions } from "../_types/ISRTypes";
import { useDisableButtonsTaxes } from "@hooks/useDisableButtonsTaxes";
import getCurrentDataDeductions from "./getCurrentDataDeductions";

export default function getDetailsTabsDeductions(props: GetDetailsTabsTypeDeductions) {
  const { data, loading } = props;
  const currentData = getCurrentDataDeductions(data);

  const isISRButtonDisabled = useDisableButtonsTaxes();

  const tabsItems = [
    {
      key: "ALL",
      label: `Totales`,
      disabled: isISRButtonDisabled,
    },
    {
      key: "CASH",
      label: (
        <>
          <div className={s.TitleTab}>{`Facturas de contado (${
            loading ? "..." : currentData.cash ? currentData.cash : "0"
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
            loading ? "..." : currentData.payments ? currentData.payments : "0"
          })`}</div>
        </>
      ),
      disabled: isISRButtonDisabled,
    },
    {
      key: "DISCOUNTS",
      label: (
        <>
          <div className={s.TitleTab}>{`Dev., desctos. y bonif. emitidos (${
            loading ? "..." : currentData.discounts ? currentData.discounts : "0"
          })`}</div>
        </>
      ),
      disabled: isISRButtonDisabled,
    },
    {
      key: "EXCLUDED-PREFILLED",
      label: (
        <>
          <div className={s.TitleTab}>{`No considerados pre-llenado (${
            loading ? "..." : currentData.excluded_prefilled ? currentData.excluded_prefilled : "0"
          })`}</div>
        </>
      ),
      disabled: isISRButtonDisabled,
    },
    {
      key: "EGRESS",
      label: (
        <>
          <div className={s.TitleTab}>{` Egresos recibidos (${
            loading ? "..." : currentData.egress ? currentData.egress : "0"
          })`}</div>
        </>
      ),
      disabled: isISRButtonDisabled,
    },
    {
      key: "INVESTMENTS",
      label: (
        <>
          <div className={s.TitleTab}>
            {" "}
            Inversiones ({loading ? "..." : currentData.investments ? currentData.investments : 0})
          </div>
        </>
      ),
      disabled: isISRButtonDisabled,
    },
  ];

  tabsItems.push({
    key: "EXCLUDED",
    label: (
      <div style={{ fontSize: 12.5 }}>
        {" "}
        No considerados ISR ({loading ? "..." : currentData.excluded ? currentData.excluded : 0})
      </div>
    ),
    disabled: isISRButtonDisabled,
  });

  return tabsItems;
}
