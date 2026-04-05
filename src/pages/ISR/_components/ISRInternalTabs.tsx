import { InternalTabType, ResponseTotalsDeductionsComplete, TabType } from "../_types/ISRTypes";
import { Tabs } from "antd";
import getDetailsTabsInternals from "../_utils/getDetailsInternalTabs";

interface PropsInternalTabs {
  tab: TabType;
  internalTab: InternalTabType;
  setInternalTab: (value: InternalTabType) => void;
  data: ResponseTotalsDeductionsComplete | null;
  loading: boolean;
  periodType: string | null;
}

export const ISRInternalTabs = ({
  tab,
  internalTab,
  setInternalTab,
  data,
  loading,
}: PropsInternalTabs) => {
  const rawTabsItems = getDetailsTabsInternals(tab, data, loading);
  const tabsItems = Array.isArray(rawTabsItems) ? rawTabsItems.flat() : [];

  if (!tabsItems.length) return <></>;

  return (
    <div className="mt-8">
      <Tabs
        id="ISR_DETAILS_TABS_INTERNALS"
        size="small"
        tabBarGutter={24}
        activeKey={internalTab}
        onChange={(key) => setInternalTab(key as InternalTabType)}
        items={tabsItems}
      />
    </div>
  );
};
