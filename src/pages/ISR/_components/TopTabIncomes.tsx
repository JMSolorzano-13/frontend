import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { Typography } from "antd";
import s from "../_styles/ISR.module.scss";
import { TopTabType } from "../_types/ISRTypes";
import { useDisableButtonsTaxes } from "@hooks/useDisableButtonsTaxes";
import { useEffect, useState } from "react";
import { getISRTotalIncomes } from "../_api/ISRApi";

export default function TopTabIncomes(props: TopTabType) {
  const [value, setvalue] = useState<{ total: number; retentions: number }>({
    total: 0.01,
    retentions: 0,
  });
  const {
    active,
    changeCurrentTopTab,
    section,
    currentTotals,
    loading,
    text,
    text2,
    setTab,
    currentTopTab,
    period,
    company,
  } = props;

  const isISRButtonDisabled = useDisableButtonsTaxes();

  useEffect(() => {
    if (currentTopTab === "deductions") {
      const sendData = async () => {
        try {
          const total = await getISRTotalIncomes(company, period);
          const totalValue = total?.period?.incomes?.total;
          const retentionsValue =
            (total?.period?.incomes?.invoice_pue?.RetencionesISRMXN ?? 0) +
            (total?.period?.incomes?.payments?.RetencionesISRMXN ?? 0);
          setvalue({
            total: totalValue,
            retentions: retentionsValue,
          });
        } catch (error) {
          console.error("Error fetching ISR total incomes:", error);
        }
      };

      sendData();
    }
  }, [period, currentTopTab]);
  const retentions =
    (currentTotals?.incomes?.invoice_pue?.RetencionesISRMXN ?? 0) +
    (currentTotals?.incomes?.payments?.RetencionesISRMXN ?? 0);
  return (
    <button
      id="im-isr-ingress"
      className={`${active ? s.ActiveButton : s.InactiveButton} ${
        isISRButtonDisabled ? s.Disabled : ""
      }`}
      onClick={() => {
        changeCurrentTopTab(section);
        setTab("ALL");
      }}
      disabled={isISRButtonDisabled}
    >
      <div className={s.HeaderTabsDiv}>
        <Typography.Text
          className={active ? s.ActiveHeaderText : s.InactiveHeaderText}
          style={{ textAlign: "left", minWidth: 140 }}
        >
          {text}
        </Typography.Text>
        <Typography.Text
          className={active ? s.ActiveContentText : s.InactiveContentText}
          style={{ textAlign: "right", minWidth: 110 }}
        >
          {loading
            ? "-"
            : formatDisplay(
                currentTopTab === "deductions" ? value?.total : currentTotals?.incomes?.total,
                DisplayType.MONEY
              )}
        </Typography.Text>
      </div>
      <div className={s.HeaderTabsDiv}>
        <Typography.Text
          className={active ? s.ActiveHeaderText : s.InactiveHeaderText}
          style={{ textAlign: "left", minWidth: 140 }}
        >
          {text2}
        </Typography.Text>
        <Typography.Text
          className={active ? s.ActiveContentText : s.InactiveContentText}
          style={{ textAlign: "right", minWidth: 110 }}
        >
          {loading
            ? "-"
            : formatDisplay(
                currentTopTab === "deductions" ? value?.retentions : retentions,
                DisplayType.MONEY
              )}
        </Typography.Text>
      </div>
    </button>
  );
}
