import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { Typography } from "antd";
import s from "../_styles/ISR.module.scss";
import { TopTabTypeDeductions } from "../_types/ISRTypes";
import { useDisableButtonsTaxes } from "@hooks/useDisableButtonsTaxes";
import { getDeductionsTotal } from "../_utils/get_new_totals";

export default function TopTabDeductions(props: TopTabTypeDeductions) {
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
  } = props;

  const isISRButtonDisabled = useDisableButtonsTaxes();
  const total = getDeductionsTotal(currentTopTab, currentTotals);
  
  return (
    <button
      id="im-isr-deductions"
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
                currentTopTab === "incomes" ? (total?.Importe as any) : (total?.importe as any) || 0,
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
          {loading ? "-" : formatDisplay(total?.isr_cargo || 0, DisplayType.MONEY)}
        </Typography.Text>
      </div>
    </button>
  );
}
