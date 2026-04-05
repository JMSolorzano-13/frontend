import { useDisableButtonsTaxes } from "@hooks/useDisableButtonsTaxes";
import { Tabs } from "antd";
interface IVADetailsModalTabsType {
  ivaSection: "creditable" | "transferred";
  pastPeriodToDisplay: string;
  onChangeTab: (value: TabIVAType) => void;
  setType: (value: string) => void;
  loading: boolean;
  tab: TabIVAType;
  totalsCount: {
    cash: number;
    credit: number;
    withholdingCash: number;
    withholdingCredit: number;
    excluded: number;
    moved: number;
    creditNotes: number;
  };
  topTab: string;
  fuzzy_search: string;
}

export default function IVADetailsModalTabs(props: IVADetailsModalTabsType) {
  const { ivaSection, onChangeTab, setType, loading, totalsCount, tab, topTab, fuzzy_search } =
    props;

  const isTaxesButtonDisabled = useDisableButtonsTaxes();

  const TABS: { [key: string]: string } = {
    ALL: "ALL",
    CASH: "I",
    CREDIT: "P",
    WITHHOLDINGCASH: "I",
    WITHHOLDINGCREDIT: "P",
    EXCLUDED: "EXCLUDED",
    MOVED: "MOVED",
    CREDIT_NOTES: "CREDIT_NOTES",
  };
  const tabsItems = [
    {
      key: "ALL",
      label: topTab.includes("creditable")
        ? "Totales"
        : `Totales (${
            loading
              ? "..."
              : tab === "CASH" && fuzzy_search
              ? totalsCount.cash +
                totalsCount.credit +
                (totalsCount.withholdingCash ? totalsCount.withholdingCash : 0) +
                (totalsCount.withholdingCredit ? totalsCount.withholdingCredit : 0) +
                totalsCount.creditNotes
              : !fuzzy_search
              ? totalsCount.cash +
                totalsCount.credit +
                (totalsCount.withholdingCash ? totalsCount.withholdingCash : 0) +
                (totalsCount.withholdingCredit ? totalsCount.withholdingCredit : 0) +
                totalsCount.creditNotes
              : ""
          })`,
      disabled: isTaxesButtonDisabled,
    },
    {
      key: "CASH",
      label: (
        <>
          <div style={{ fontSize: 13.5 }}>{`Facturas de contado (${
            loading
              ? "..."
              : tab === "CASH" && fuzzy_search
              ? totalsCount.cash
              : !fuzzy_search
              ? totalsCount.cash
              : ""
          })`}</div>
        </>
      ),
      disabled: isTaxesButtonDisabled,
    },
    {
      key: "CREDIT",
      label: (
        <>
          <div style={{ fontSize: 13.5 }}>{`${
            ivaSection === "creditable" ? "Pago" : "Cobro"
          } facturas de crédito (${
            loading
              ? "..."
              : tab === "CASH" && fuzzy_search
              ? totalsCount.credit
              : !fuzzy_search
              ? totalsCount.credit
              : ""
          })`}</div>
        </>
      ),
      disabled: isTaxesButtonDisabled,
    },
    {
      key: "CREDIT_NOTES",
      label: (
        <>
          <div style={{ fontSize: 13.5 }}>Notas de crédito ({`${totalsCount.creditNotes}`})</div>
        </>
      ),
      disabled: isTaxesButtonDisabled,
    },
  ];

  tabsItems.push(
    {
      key: "EXCLUDED",
      label: (
        <div style={{ fontSize: 12 }}>
          {" "}
          No considerados IVA ({loading ? "..." : totalsCount.excluded ? totalsCount.excluded : 0})
        </div>
      ),
      disabled: isTaxesButtonDisabled,
    },
    {
      key: "MOVED",
      label: (
        <div style={{ fontSize: 12 }}>
          {" "}
          Periodo de IVA reasignado ({loading ? "..." : totalsCount.moved ? totalsCount.moved : 0})
        </div>
      ),
      disabled: isTaxesButtonDisabled,
    }
  );
  return (
    <Tabs
      id="EXCLUDE_TABS_ID"
      type="card"
      size="small"
      onChange={(key) => {
        onChangeTab(key as TabIVAType);
        setType(TABS[key as TabIVAType]);
      }}
      items={tabsItems}
      activeKey={tab}
    />
  );
}
