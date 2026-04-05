import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { Typography } from "antd";
import s from "../_styles/ISR.module.scss";
import { DeductionTopTabType } from "../_types/ISRTypes";
import { useDisableButtonsTaxes } from "@hooks/useDisableButtonsTaxes";

export default function DeductionTopTab(props: DeductionTopTabType) {
  const { active, changeCurrentTopTab, section, currentTotals, loading } = props;

  const isISRButtonDisabled = useDisableButtonsTaxes()

  return (
    <button
    className={`${active ? s.ActiveButton : s.InactiveButton} ${isISRButtonDisabled ? s.Disabled : ''}`}
      onClick={() => {
        changeCurrentTopTab(section);
      }}
      disabled={isISRButtonDisabled}
    >
      <Typography.Text className={active ? s.ActiveHeaderText : s.InactiveHeaderText}>
        Deducciones
      </Typography.Text>
      <Typography.Text className={active ? s.ActiveContentText : s.InactiveContentText}>
        {loading ? "-" : formatDisplay(currentTotals?.deductions.total, DisplayType.MONEY)}
      </Typography.Text>
    </button>
  );
}

