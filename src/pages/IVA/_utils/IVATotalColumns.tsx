import React, { ReactNode } from "react";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/lib/table";
import { TState } from "../_types/StateTypes";
import { GlobalToken } from "antd";

export type recordType = {
  key: React.Key;
  context: string | JSX.Element | ReactNode;
  totalCfdis: number;
  PaymentRelatedCount: number;
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
  creditNotes: recordType;
};

interface propsType {
  modalType: "creditable" | "transferred";
  tab: TabIVAType;
  setTab: (tab: TabIVAType) => void;
  setType: (value: string) => void;
  topTab: TState;
  token: GlobalToken;
}

export function IVATotalColumns(props: propsType): ColumnsType<recordType> {
  const { modalType, tab, topTab, setTab, setType, token } = props;

  const getColumns: ColumnsType<recordType> = [
    {
      title: "",
      dataIndex: "context",
      key: "context",
      render: (context) => {
        if (context === "Totales") return <b>{context}</b>;
        return (
          <span
            onClick={() => {
              if (context === "Facturas de contado") {
                setTab("CASH");
                setType("CASH");
              } else if (context === "Cobro facturas de crédito") {
                setTab("CREDIT");
                setType("CREDIT");
              } else if (context === "Pago facturas de crédito") {
                setTab("CREDIT");
                setType("CREDIT");
              } else if (context === "Notas de crédito") {
                setTab("CREDIT_NOTES");
                setType("CREDIT_NOTES");
              } else {
                setType("ALL");
                setTab("ALL");
              }
            }}
          >
            {context}
          </span>
        );
      },
    },
    {
      title: "Conteo de CFDIs",
      dataIndex: "totalCfdis",
      className: tab === "ALL" ? "cfdi-count-iva-totals-column" : "",
      key: "totalCfdis",
      render: (value, record) => {
        if (tab !== "ALL") {
          return value;
        } else {
          if (
            record.context === "Cobro facturas de crédito" ||
            record.context === "Pago facturas de crédito"
          ) {
            return topTab.includes("transferred") ? (
              <div>
                {value} / {record.PaymentRelatedCount}
              </div>
            ) : (
              <div>{value}</div>
            );
          } else if (record.context === "Totales") {
            return <b>{value}</b>;
          } else {
            return value;
          }
        }
      },
      width: tab === "ALL" ? 137 : 122,
    },
    {
      title: "# Relacionados",
      dataIndex: "PaymentRelatedCount",
      key: "PaymentRelatedCount",
      width: 130,
      fixed: false,
      render: (value, record) => {
        if (modalType === "creditable") {
          return record.totalCfdis;
        }
        return value;
      },
    },
    {
      title: "Base IVA 16%",
      dataIndex: "baseIVA16",
      key: "baseIVA16",
      render: (value, record) => {
        const valueToRender =
          typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY);

        if (record.context === "Totales") {
          return <b>{valueToRender}</b>;
        } else {
          return valueToRender;
        }
      },
      align: "right",
    },
    {
      title: "Base IVA 8%",
      dataIndex: "baseIVA8",
      key: "baseIVA8",
      render: (value, record) => {
        const valueToRender =
          typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY);

        if (record.context === "Totales") {
          return <b>{valueToRender}</b>;
        } else {
          return valueToRender;
        }
      },
      align: "right",
    },
    {
      title: "Base IVA 0%",
      dataIndex: "baseIVA0",
      key: "baseIVA0",
      render: (value, record) => {
        const valueToRender =
          typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY);

        if (record.context === "Totales") {
          return <b>{valueToRender}</b>;
        } else {
          return valueToRender;
        }
      },
      align: "right",
    },
    {
      title: "Base IVA exento",
      dataIndex: "baseExemptIVA",
      key: "baseExemptIVA",
      render: (value, record) => {
        const valueToRender =
          typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY);

        if (record.context === "Totales") {
          return <b>{valueToRender}</b>;
        } else {
          return valueToRender;
        }
      },
      align: "right",
    },
    {
      title: modalType === "creditable" ? "IVA acreditable 16%" : "IVA trasladado 16%",
      dataIndex: "creditableOrTransferredIVA16",
      key: "creditableOrTransferredIVA16",
      render: (value, record) => {
        const valueToRender =
          typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY);

        if (record.context === "Totales") {
          return <b>{valueToRender}</b>;
        } else {
          return valueToRender;
        }
      },
      align: "right",
    },
    {
      title: modalType === "creditable" ? "IVA acreditable 8%" : "IVA trasladado 8%",
      dataIndex: "creditableOrTransferredIVA8",
      key: "creditableOrTransferredIVA8",
      render: (value, record) => {
        const valueToRender =
          typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY);

        if (record.context === "Totales") {
          return <b>{valueToRender}</b>;
        } else {
          return valueToRender;
        }
      },
      align: "right",
    },
    {
      title: modalType === "creditable" ? "IVA acreditable total" : "IVA trasladado total",
      dataIndex: "totalCreditableOrTransferredIVA",
      key: "totalCreditableOrTransferredIVA",
      render: (value, record) => {
        const valueToRender = formatDisplay(value, DisplayType.MONEY) as string;
        return (
          <p
            style={{
              color: token.colorPrimary,
            }}
          >
            {record.context === "Totales" ? <b>{valueToRender}</b> : valueToRender}
          </p>
        );
      },
      align: "right",
    },
    {
      title: "Retenciones IVA",
      dataIndex: "IVAHoldings",
      key: "IVAHoldings",
      render: (value, record) => {
        const valueToRender =
          typeof value === "string" ? value : formatDisplay(value, DisplayType.MONEY);

        if (record.context === "Totales") {
          return <b>{valueToRender}</b>;
        } else {
          return valueToRender;
        }
      },
      align: "right",
    },
  ];

  const getColumnsByTab = (tab: string, topTab: TState): ColumnsType<recordType> => {
    const columns = getColumns;
    switch (tab) {
      case "ALL":
        return columns.filter((c) => {
          if (c.key) {
            return !["PaymentRelatedCount"].includes(String(c.key));
          }
          return true;
        });
      case "CASH":
        return columns.filter((c) => {
          if (c.key) {
            return ![
              "context",
              "totalIVAHoldings",
              "pastPeriodIVAHoldings",
              "PaymentRelatedCount",
            ].includes(String(c.key));
          }
          return true;
        });
      case "CREDIT":
        return columns.filter((c) => {
          if (c.key) {
            if (topTab.includes("creditable")) {
              return ![
                "context",
                "totalCfdis",
                "totalIVAHoldings",
                "pastPeriodIVAHoldings",
              ].includes(String(c.key));
            } else {
              return !["context", "totalIVAHoldings", "pastPeriodIVAHoldings"].includes(
                String(c.key)
              );
            }
          }
          return true;
        });

      case "CREDIT_NOTES":
        return columns.filter((c) => {
          if (c.key) {
            return !["PaymentRelatedCount"].includes(String(c.key));
          }
          return true;
        });
      default:
        return columns;
    }
  };

  return getColumnsByTab(tab, topTab);
}
