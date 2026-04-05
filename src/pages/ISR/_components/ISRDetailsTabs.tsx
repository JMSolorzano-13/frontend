import { Tabs } from "antd";
import getDetailsTabs from "../_utils/getDetailsTabs";
import { ISRDetailsTabsType, TabType } from "../_types/ISRTypes";

export default function ISRDetailsTabs(props: ISRDetailsTabsType) {
  const { date, currentTopTab, tab, setTab, data, loading, periodType } = props;
  const tabsItems = getDetailsTabs({
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
        setTab(key as TabType);
      }}
    />
  );
}
