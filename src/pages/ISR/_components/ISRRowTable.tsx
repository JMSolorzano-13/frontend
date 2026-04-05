import { InternalTabType, ISRUpdatePayload, TabType } from "../_types/ISRTypes";
import { Select } from "antd";
import { useState } from "react";

type ISRRowTableProps = {
  value: string | number;
  record: any;
  tab: TabType;
  internalTab: InternalTabType;
  setTab: (value: TabType) => void;
  setInternalTab: (value: InternalTabType) => void;
  updatePercentageDeductions?: (payload: ISRUpdatePayload) => void;
  company?: string;
  period?: string;
};

export const ISRRowTableIcon = ({
  value,
  record,
  updatePercentageDeductions,
  company,
  period,
}: ISRRowTableProps) => {
  const deducible = String(record.deducible);
  const [valueSelected, setvalueSelected] = useState(String(Number(deducible) * 100));

  const handleChange = (valueS: string) => {
    if (!record.deducible) return;
    setvalueSelected(valueS);
    updatePercentageDeductions &&
      updatePercentageDeductions({
        company: company || "",
        percentage: Number(valueS) / 100,
        period: period || "",
      });
  };



  const icon = record.isPlus ? (
    "(+)"
  ) : record.isNeutral ? (
    <span style={{ color: "transparent" }}>(=)</span>
  ) : record.isEqual ? (
    "(=)"
  ) : (
    "(—)"
  );

  if (record.deducible) {
    return (
      <div className="flex gap-1 items-center">
        <span style={{ fontSize: "1em", marginRight: 8, marginTop: 2 }}>{icon}</span>
        <span className={`${record.isBlack ? "font-bold" : ""}`}>{value}</span>
        <div id="deducible-row">
          <Select
            defaultValue={valueSelected}
            style={{ width: 80 }}
            onChange={handleChange}
            value={`${valueSelected}%`}
            options={[
              { value: 53, label: "53%" },
              { value: 47, label: "47%" },
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <span className={`${record.isBlack ? "font-bold" : ""}`}  >
      <span style={{ fontSize: "1em", marginRight: 8, marginTop: 2 }}>{icon}</span>
      {value}
    </span>
  );
};

export const ISRRowTable = ({ value, record }: ISRRowTableProps) => {

  return (
    <span className={`${record.isBlack ? "font-bold" : ""}`}>
      {value === "-" ? " " : value}
    </span>
  );
};

export const ISRRowTableZero = ({ value, record }: ISRRowTableProps) => {

  return (
    <span className={`${record.isBlack ? "font-bold" : ""}`}>
      {value === 0 &&
        (record.concepto === "Gastos de nómina exenta deducible" ||
          record.concepto === "Gastos de nómina exenta" ||
          record.concepto === "Gastos de nómina deducibles")
        ? ""
        : value}
    </span>
  );
};

export const ISRRowTableExpandableTitle = ({
  value,
}: ISRRowTableProps) => {

  return (
    <span className={`pl-8`}>
      {value}
    </span>
  );
};

export const ISRRowTableExpandable = ({
  value,
  record,
}: ISRRowTableProps) => {

  return (
    <span className={`${record.isBlack ? "font-bold" : ""}`}>
      {value}
    </span>
  );
};
