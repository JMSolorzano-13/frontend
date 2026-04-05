import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/es/table";
import { ISRRowTableExpandable, ISRRowTableExpandableTitle } from "../_components/ISRRowTable";
import { InternalTabType, TabType, TabTotalsResponseRow } from "../_types/ISRTypes";

interface PropsColumns {
  data: TabTotalsResponseRow[] | null;
  tab: TabType;
  internalTab: InternalTabType;
  setTab: (value: TabType) => void;
  setInternalTab: (value: InternalTabType) => void;
}
export function ISRTabTotalColumnsDeductionsExpanded({
  internalTab,
  tab,
  setInternalTab,
  setTab,
}: PropsColumns): ColumnsType<TabTotalsResponseRow> {
  return [
    {
      title: "",
      dataIndex: "expand_icon_placeholder",
      key: "expand_icon_placeholder",
      width: 46,
      render: () => null,
    },
    {
      title: "Concepto",
      dataIndex: "concepto",
      key: "concepto",
      width: 300,
      render: (value: string, record: TabTotalsResponseRow) => (
        <ISRRowTableExpandableTitle
          value={value}
          record={record}
          tab={tab}
          internalTab={internalTab}
          setInternalTab={setInternalTab}
          setTab={setTab}
        />
      ),
    },
    {
      title: "Conteo de CFDIs",
      dataIndex: "conteoCFDIs",
      key: "conteoCFDIs",
      width: 100,

      render: (value: string, record: TabTotalsResponseRow) => (
        <ISRRowTableExpandable
          value={value}
          record={record}
          tab={tab}
          internalTab={internalTab}
          setInternalTab={setInternalTab}
          setTab={setTab}
        />
      ),
    },
    {
      title: "Importe",
      dataIndex: "importe",
      key: "importe",
      width: "18%",

      align: "right",
      render: (value: number, record: TabTotalsResponseRow) => (
        <ISRRowTableExpandable
          value={formatDisplay(value, DisplayType.MONEY).toString()}
          record={record}
          tab={tab}
          internalTab={internalTab}
          setInternalTab={setInternalTab}
          setTab={setTab}
        />
      ),
    },
    {
      title: "ISR retenido a cargo",
      dataIndex: "isr_cargo",
      key: "isr_cargo",
      width: "25%",

      align: "right",
      render: (value: number, record: TabTotalsResponseRow) => (
        <ISRRowTableExpandable
          value={formatDisplay(
            value,
            record.concepto === "No considerados en el pre-llenado: Ingresos PUE" ||
              record.concepto === "No considerados en el pre-llenado: Pagos"
              ? DisplayType.MONEY
              : DisplayType.MONEY_CLEAN
          ).toString()}
          record={record}
          tab={tab}
          internalTab={internalTab}
          setInternalTab={setInternalTab}
          setTab={setTab}
        />
      ),
    },
  ];
}
