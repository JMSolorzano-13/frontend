import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/es/table";
import { ISRRowTable, ISRRowTableIcon, ISRRowTableZero } from "../_components/ISRRowTable";
import {
  InternalTabType,
  TabType,
  TabTotalsResponseRow,
  ISRUpdatePayload,
} from "../_types/ISRTypes";

interface PropsColumns {
  data: TabTotalsResponseRow[] | null;
  tab: TabType;
  internalTab: InternalTabType;
  setTab: (value: TabType) => void;
  setInternalTab: (value: InternalTabType) => void;
  updatePercentageDeductions: (payload: ISRUpdatePayload) => void;
  company: string;
  period: string;
}
export function ISRTabTotalColumnsDeductions({
  internalTab,
  tab,
  setInternalTab,
  setTab,
  updatePercentageDeductions,
  company,
  period,
}: PropsColumns): ColumnsType<TabTotalsResponseRow> {
  return [
    {
      title: "",
      dataIndex: "concepto",
      key: "concepto",
      width: 300,
      render: (value: string, record: TabTotalsResponseRow) => (
        <ISRRowTableIcon
          value={value}
          record={record}
          tab={tab}
          internalTab={internalTab}
          setInternalTab={setInternalTab}
          setTab={setTab}
          updatePercentageDeductions={updatePercentageDeductions}
          company={company}
          period={period}
        />
      ),
    },
    {
      title: "Conteo de CFDIs",
      dataIndex: "conteoCFDIs",
      key: "conteoCFDIs",
      width: 100,
      render: (value: string, record: TabTotalsResponseRow) => (
        <ISRRowTableZero
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

      render: (value: number, record: TabTotalsResponseRow) => (
        <ISRRowTable
          value={formatDisplay(value, DisplayType.MONEY)}
          record={record}
          tab={tab}
          internalTab={internalTab}
          setInternalTab={setInternalTab}
          setTab={setTab}
        />
      ),
      align: "right",
    },
    {
      title: "ISR retenido a cargo",
      dataIndex: "isr_cargo",
      key: "isr_cargo",
      width: "25%",

      render: (value: number, record: TabTotalsResponseRow) => (
        <ISRRowTable
          value={formatDisplay(
            value,
            record.concepto === "Compras y gastos facturas de contado" ||
              record.concepto === "Compras y gastos CFDIs de pago" ||
              record.concepto === "Compras y gastos no considerados en el pre-llenado"
              ? DisplayType.MONEY
              : DisplayType.MONEY_CLEAN
          )}
          record={record}
          tab={tab}
          internalTab={internalTab}
          setInternalTab={setInternalTab}
          setTab={setTab}
        />
      ),
      align: "right",
    },
  ];
}
