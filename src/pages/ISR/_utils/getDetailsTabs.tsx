import s from "../_styles/DetailsTabs.module.scss";
import { GetDetailsTabsType } from "../_types/ISRTypes";
import getCurrentData from "./getCurrentData";
import getPeriodToDisplay from "./getPeriodToDisplay";
import { useDisableButtonsTaxes } from "@hooks/useDisableButtonsTaxes";

export default function getDetailsTabs(props: GetDetailsTabsType) {
  const { date, currentTopTab, data, loading, periodType } = props;
  const periods = getPeriodToDisplay(date, periodType);
  const currentData = getCurrentData(currentTopTab, data);

  const isISRButtonDisabled = useDisableButtonsTaxes();

  const periodToDisplay = currentTopTab.includes("period")
    ? `Periodo ${periods.periodDate}`
    : `Ejercicio ${periods.exerciseDate}`;

  return [
    {
      key: "ALL",
      label: `Totales (${loading ? "..." : currentData ? currentData.qty : "0"})`,
      disabled: isISRButtonDisabled,
    },
    {
      key: "CASH",
      label: (
        <>
          <div className={s.TitleTab}>{`Facturas contado (${
            loading ? "..." : currentData ? currentData.invoice_pue.qty : "0"
          })`}</div>
          <div className={s.SubtitleTab}>{periodToDisplay}</div>
        </>
      ),
      disabled: isISRButtonDisabled,
    },
    {
      key: "PAYMENT",
      label: (
        <>
          <div className={s.TitleTab}>{`CFDI de pagos (${
            loading ? "..." : currentData ? currentData.payments.qty : "0"
          })`}</div>
          <div className={s.SubtitleTab}>{periodToDisplay}</div>
        </>
      ),
      disabled: isISRButtonDisabled,
    },
    {
      key: "EXCLUDED",
      label: (
        <div style={{ fontSize: 12 }}>
          {" "}
          No considerados ISR ({loading ? "..." : currentData ? currentData.excluded_qty : 0})
        </div>
      ),
      disabled: isISRButtonDisabled,
    },
  ];
}
