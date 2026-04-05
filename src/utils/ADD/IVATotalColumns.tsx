import React, { ReactNode } from "react";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/lib/table";
import { tailwindColors } from "@utils/tailwindColors";

export type recordType = {
  key: React.Key;
  context: string | JSX.Element | ReactNode;
  totalCfdis: number;
  period: string;
  // totalIVAHoldings: number | null;
  baseIVA16: number | null;
  baseIVA8: number | null;
  baseIVA0: number | null;
  baseExemptIVA: number | null;
  creditableOrTransferredIVA16: number | null;
  creditableOrTransferredIVA8: number | null;
  IVAHoldings: number | null;
  totalCreditableOrTransferredIVA: number;
};

export type totalsRecordType = {
  cash: recordType;
  credit: recordType;
  withholdingCash: recordType;
  withholdingCredit: recordType;
};

interface propsType {
  modalType: "creditable" | "transferred";
  tab: string;
}

export default function IVATotalColumns(props: propsType): ColumnsType<recordType> {
  const { modalType, tab } = props;

  const getColumns: ColumnsType<recordType> = [
    {
      title: "",
      dataIndex: "context",
      key: "context",
      render: (value, record, index) => {
        if (index === 4) {
          return <b>{value}</b>;
        } else {
          return value;
        }
      },
    },
    {
      title: "Periodo",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Conteo de CFDIs",
      dataIndex: "totalCfdis",
      key: "totalCfdis",
    },
    {
      title: "Base IVA 16%",
      dataIndex: "baseIVA16",
      key: "baseIVA16",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Base IVA 8%",
      dataIndex: "baseIVA8",
      key: "baseIVA8",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Base IVA 0%",
      dataIndex: "baseIVA0",
      key: "baseIVA0",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: "Base IVA exento",
      dataIndex: "baseExemptIVA",
      key: "baseExemptIVA",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: modalType === "creditable" ? "IVA acreditable 16%" : "IVA trasladado 16%",
      dataIndex: "creditableOrTransferredIVA16",
      key: "creditableOrTransferredIVA16",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: modalType === "creditable" ? "IVA acreditable 8%" : "IVA trasladado 8%",
      dataIndex: "creditableOrTransferredIVA8",
      key: "creditableOrTransferredIVA8",
      render: (value) =>
        typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY),
      align: "right",
    },
    {
      title: () => {
        if (tab === "CASH" || tab === "CREDIT") {
          return "Retenciones IVA";
        }
        if (tab === "WITHHOLDINGCASH" || tab === "WITHHOLDINGCREDIT") {
          return "Retenciones IVA";
        }
        return "Retenciones IVA";
      },
      dataIndex: "IVAHoldings",
      key: "IVAHoldings",
      render: (value, record, index) => {
        if (typeof value === "string") return value;
        if (
          tab === "CASH" ||
          tab === "CREDIT" ||
          value < 0 ||
          (tab === "ALL" && (index === 0 || index === 1))
        ) {
          return (
            <div style={{ color: "red" }}>{formatDisplay(value, DisplayType.MONEY) as string}</div>
          );
        } else if (tab === "WITHHOLDINGCASH" || tab === "WITHHOLDINGCREDIT") {
          return (
            <div style={{ color: tailwindColors.primary }}>
              {formatDisplay(value, DisplayType.MONEY) as string}
            </div>
          );
        }
        return formatDisplay(value, DisplayType.MONEY) as string;
      },
      align: "right",
    },
    {
      title: modalType === "creditable" ? "IVA acreditable total" : "IVA trasladado total",
      dataIndex: "totalCreditableOrTransferredIVA",
      key: "totalCreditableOrTransferredIVA",
      render: (value, record, index) => {
        if (index === 4) {
          return (
            <p
              style={{
                color: tailwindColors.primary,
                fontWeight: "bold",
              }}
            >
              {formatDisplay(value, DisplayType.MONEY) as string}
            </p>
          );
        }
        return (
          <p
            style={{
              color: tailwindColors.primary,
            }}
          >
            {formatDisplay(value, DisplayType.MONEY) as string}
          </p>
        );
      },
      align: "right",
    },
  ];

  const getColumnsByTab = (tab: string): ColumnsType<recordType> => {
    const columns = getColumns;
    switch (tab) {
      case "ALL":
        return columns;
      case "CASH":
        return columns.filter((c) => {
          if (c.key) {
            return !["context", "totalIVAHoldings", "pastPeriodIVAHoldings"].includes(
              String(c.key)
            );
          }
          return true;
        });
      case "CREDIT":
        return columns.filter((c) => {
          if (c.key) {
            return !["context", "totalIVAHoldings", "pastPeriodIVAHoldings"].includes(
              String(c.key)
            );
          }
          return true;
        });

      case "WITHHOLDINGCASH":
        return columns.filter((c) => {
          if (c.key) {
            return !["context", "totalCreditableOrTransferredIVA", "periodIVAHoldings"].includes(
              String(c.key)
            );
          }
          return true;
        });
      case "WITHHOLDINGCREDIT":
        return columns.filter((c) => {
          if (c.key) {
            return !["context", "totalCreditableOrTransferredIVA", "periodIVAHoldings"].includes(
              String(c.key)
            );
          }
          return true;
        });
      default:
        return columns;
    }
  };

  return getColumnsByTab(tab);
}
