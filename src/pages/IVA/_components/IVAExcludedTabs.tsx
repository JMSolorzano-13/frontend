import { Tabs } from "antd";
import s from "./IVADetailsModalTabs.module.scss";

interface IVADetailsModalTabsType {
  onChangeTab: (value: TabIVAType) => void;
  setType: (value: string) => void;
  activeTab: TabIVAType;
}

export default function IVAExcludedTabs(props: IVADetailsModalTabsType) {
  const { onChangeTab, setType, activeTab } = props;

  const TABS: { [key: string]: string } = {
    NONE: "NONE",
    EXCLUDED: "EXCLUDED",
    RESIGNED: "RESIGNED",
  };

  return (
    <Tabs
      type="card"
      size="small"
      id="EXCLUDE_TABS_ID"
      onChange={(key) => {
        onChangeTab(key as ExcludedIVAType);
        setType(TABS[key as ExcludedIVAType]);
      }}
      style={{ marginLeft: 20, marginTop: 10 }}
      items={[
        {
          key: "NONE",
          id: "NONE_TAB",
          className: s.hideTab,
          label: <></>,
          style: { display: "none" },
        },
        {
          key: "EXCLUDED",
          label: (
            <div
              style={
                activeTab === "EXCLUDED"
                  ? { color: "rgba(24, 144, 255, 1)", height: 31 }
                  : { height: 31 }
              }
            >
              No Considerado IVA
            </div>
          ),
        },
        {
          key: "RESIGNED",
          label: (
            <div
              style={
                activeTab === "RESIGNED"
                  ? { color: "rgba(24, 144, 255, 1)", height: 31 }
                  : { height: 31 }
              }
            >
              Periodo IVA reasignado
            </div>
          ),
          style: { height: 31 },
        },
      ]}
    />
  );
}
