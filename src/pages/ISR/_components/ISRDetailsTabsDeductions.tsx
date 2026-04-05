import { Tabs } from "antd";
import { InternalTabType, ISRDetailsTabsTypeDeductions, TabType } from "../_types/ISRTypes";
import getDetailsTabsDeductions from "../_utils/getDetailsTabsDeductions";


export default function ISRDetailsTabsDeductions(props: ISRDetailsTabsTypeDeductions) {
  const { date, currentTopTab, tab, setTab, data, loading, periodType, setInternalTab } = props;
  const tabsItems = getDetailsTabsDeductions({
    date: date,
    currentTopTab: currentTopTab,
    data: data,
    loading: loading,
    periodType: periodType,
  });

  return (
    <Tabs
      id="ISR_DETAILS_TABS"
      type="card"
      size="small"
      items={tabsItems}
      activeKey={tab}
      onChange={(key) => {
        const electionTab =
          key === "EXCLUDED-PREFILLED"
            ? "EXCLUDED-PREFILLED-INCOMES"
            : key === "DISCOUNTS"
            ? "DISCOUNTS-INCOMES"
            : "CASH";
        setTab(key as TabType);
        setInternalTab(electionTab as InternalTabType);
      }}
    />
  );
}
