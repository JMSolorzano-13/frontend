import moment from "moment";
import { CloseOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, InputNumber, Select, Space, Grid } from "antd";
import { SELECTION_OPS } from "@utils/CFDI/advSelections";
import { CFDI_Types } from "@constants/Enums";
import { getADVSelections } from "@utils/CFDI/advSelectionsFunctions";
import { CSSProperties, useEffect, useRef, useState } from "react";
import type { Dayjs } from "dayjs";

const { useBreakpoint } = Grid;

type Props = {
  changeSingleDomain: (index: number, domain: DomainItem) => void;
  deleteSingleDomain: (index: number) => void;
  domain: DomainItem;
  index: number;
  moduleId: CFDIModule;
  tab: CFDI_Types;
  setTempSelector: (value: string) => void;
  tempSelector: string;
};

const InputStyles: CSSProperties = {
  width: 200,
  minHeight: 25.99,
};

export default function CFDIAdvancedFilterSelector(props: Props) {
  const { changeSingleDomain, deleteSingleDomain, domain, index, moduleId, tab, setTempSelector } =
    props;
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const reference = useRef<any>(null);
  const screens = useBreakpoint();
  useEffect(() => {
    if (reference.current) {
      setDateValue(null);
    }
  }, [domain[1]]);

  const advSelectionsPerTab: CFDISelection[] = getADVSelections({
    tab,
    moduleId,
  });

  if (
    advSelectionsPerTab.findIndex((s) => s.value === "RfcReceptor" || s.value === "RfcEmisor") !==
    -1
  ) {
    advSelectionsPerTab.shift();
  }

  if (
    advSelectionsPerTab.findIndex((s) => s.value === "RegimenFiscalReceptor") !== -1 &&
    tab === "P"
  ) {
    const index = advSelectionsPerTab.findIndex((obj) => obj.value === "RegimenFiscalReceptor");

    if (index !== -1) {
      advSelectionsPerTab.splice(index, 1);
    }
  }

  if (
    moduleId === "issued" &&
    advSelectionsPerTab.findIndex((s) => s.value === "RfcReceptor") === -1 &&
    tab !== "N"
  ) {
    advSelectionsPerTab.unshift({
      label: "RFC Receptor",
      value: "RfcReceptor",
      operators: SELECTION_OPS.STRING,
      type: "string",
    });
  }
  if (
    (moduleId === "received" || moduleId === "efos") &&
    advSelectionsPerTab.findIndex((s) => s.value === "RfcEmisor") === -1 &&
    tab !== "N"
  ) {
    advSelectionsPerTab.unshift({
      label: "RFC Emisor",
      value: "RfcEmisor",
      operators: SELECTION_OPS.STRING,
      type: "string",
    });
  }

  if (
    tab === "P" &&
    moduleId != "efos" &&
    moduleId === "received" &&
    advSelectionsPerTab.findIndex((s) => s.value === "RegimenFiscalReceptor") === -1
  ) {
    const receptorIndex = advSelectionsPerTab.findIndex((c) => c.label === "Receptor");
    advSelectionsPerTab.splice(receptorIndex + 1, 0, {
      label: "Régimen fiscal receptor",
      value: "RegimenFiscalReceptor",
      operators: SELECTION_OPS.STRING,
      type: "string",
    });
  }

  const options = advSelectionsPerTab.map((s) => (
    <Select.Option key={s.value} value={s.value}>
      {s.label}
    </Select.Option>
  ));

  let operators: JSX.Element[] = [];

  const selection = advSelectionsPerTab.find((s) => s.value === domain[0]);
  const ops = selection?.operators;

  if (ops) {
    operators = ops.map((op) => (
      <Select.Option key={op.value} value={op.value}>
        {op.label}
      </Select.Option>
    ));
  } else {
    operators = [
      <Select.Option key="=" value="=">
        =
      </Select.Option>,
    ];
  }

  let inputComponent: JSX.Element =
    domain[1] === "in" || domain[1] === "not in" ? (
      <Select
        mode="tags"
        placeholder={"Separa con enter"}
        options={[
          {
            value: "",
            label: "",
          },
        ]}
        style={InputStyles}
        size="small"
        onChange={(ev: any) => {
          const filteredValues = ev.filter((value: string) => value !== "");
          changeSingleDomain(index, [domain[0], domain[1], filteredValues]);
        }}
        showSearch
        onSearch={(value: string) => {
          setTempSelector(value);
        }}
      />
    ) : (
      <Input
        key="value"
        style={InputStyles}
        value={String(domain[2])}
        size="small"
        onChange={(ev) => {
          changeSingleDomain(index, [domain[0], domain[1], ev.target.value]);
        }}
        data-test="filter-value"
      />
    );

  if (selection) {
    if (selection.type === "string") {
      inputComponent = (
        <Input
          key="value"
          style={InputStyles}
          value={String(domain[2])}
          size="small"
          onChange={(ev) => {
            changeSingleDomain(index, [domain[0], domain[1], ev.target.value]);
          }}
          data-test="filter-value"
        />
      );
    } else if (selection.type === "number") {
      inputComponent = (
        <InputNumber
          key="value"
          style={InputStyles}
          value={domain[2] as number}
          size="small"
          onChange={(val) => {
            changeSingleDomain(index, [domain[0], domain[1], val]);
          }}
          data-test="filter-value"
        />
      );
    } else if (selection.type === "boolean") {
      let value = domain[2];
      if (value !== "") {
        value = value === true ? "true" : "false";
      }
      inputComponent = (
        <Select
          key="value"
          style={InputStyles}
          value={value}
          size="small"
          onChange={(val) => {
            changeSingleDomain(index, [domain[0], domain[1], val === "true"]);
          }}
        >
          <Select.Option value="true">Sí</Select.Option>
          <Select.Option value="false">No</Select.Option>
        </Select>
      );
    } else if (selection.type === "currency") {
      inputComponent = (
        <Input
          key="value"
          style={InputStyles}
          value={String(domain[2])}
          size="small"
          onChange={(ev) => {
            changeSingleDomain(index, [
              domain[0],
              domain[1],
              String(ev.target.value).toUpperCase(),
            ]);
          }}
          data-test="filter-value"
        />
      );
    } else if (selection.type === "boolean_contains") {
      let value = domain[2];
      if (value !== "") {
        value = value === true ? "true" : "false";
      }
      inputComponent = (
        <Select
          key="value"
          style={InputStyles}
          value={value}
          size="small"
          onChange={(val) => {
            changeSingleDomain(index, [domain[0], domain[1], val === "true"]);
          }}
        >
          <Select.Option value="true">Sí</Select.Option>
          <Select.Option value="false">No</Select.Option>
        </Select>
      );
    } else if (selection.type === "contains") {
      if (domain[1] == "in" || domain[1] == "not in") {
        inputComponent = (
          <Select
            mode="tags"
            placeholder={"Separa con enter"}
            value={domain[2] === "" ? [] : domain[2]}
            options={[
              {
                value: "",
                label: "",
              },
            ]}
            style={InputStyles}
            size="small"
            onChange={(ev: any) => {
              const filteredValues = ev.filter((value: string) => value !== "");
              changeSingleDomain(index, [domain[0], domain[1], filteredValues]);
            }}
            showSearch
            onSearch={(value: string) => {
              setTempSelector(value);
            }}
          />
        );
      } else {
        inputComponent = (
          <Input
            key="value"
            style={InputStyles}
            value={String(domain[2])}
            size="small"
            onChange={(ev) => {
              changeSingleDomain(index, [domain[0], domain[1], ev.target.value]);
            }}
            data-test="filter-value"
          />
        );
      }
    } else {
      inputComponent = (
        <DatePicker
          key="value"
          style={InputStyles}
          value={dateValue}
          size="small"
          format="DD/MM/YYYY"
          allowClear={false}
          ref={reference}
          onChange={(val) => {
            setDateValue(val);
            if (val) {
              const newDate = moment(val.toDate());
              newDate.set({
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
              });

              changeSingleDomain(index, [
                domain[0],
                domain[1],
                `${newDate.utc().format().replaceAll("Z", "").split("T")[0]}T00:00:00.000`,
              ]);
            }
          }}
          data-test="filter-value"
        />
      );
    }
  }

  function handleStringNormalization(text: string) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  return (
    <Space
      align="center"
      style={{
        marginBottom: 10,
        paddingBottom: 10,
        flexDirection: screens.sm ? "row" : "column",
        alignItems: screens.sm ? "flex-start" : "center",
        borderBottom: "1px solid #ebebeb",
      }}
    >
      <Select
        key="column"
        style={{ width: 200, minHeight: 25.99 }}
        value={domain[0]}
        size="small"
        showSearch
        filterOption={(input, option) => {
          if (option && option.children) {
            return handleStringNormalization(String(option.children)).includes(
              handleStringNormalization(input)
            );
          }
          return false;
        }}
        onChange={(val) => {
          const newOperators = advSelectionsPerTab.find((s) => s.value === val)?.operators;
          changeSingleDomain(index, [val, newOperators ? newOperators[0].value : "", ""]);
        }}
        data-test="filter-by"
      >
        {options}
      </Select>
      <Select
        key="operator"
        style={{ width: 120, minHeight: 25.99 }}
        value={domain[1]}
        size="small"
        onChange={(val) => {
          if (val === "!=" || val === "=") {
            changeSingleDomain(index, [domain[0], val, ""]);
          } else {
            changeSingleDomain(index, [domain[0], val, []]);
          }
        }}
        data-test="filter-operator"
      >
        {operators}
      </Select>
      {inputComponent}
      <Button
        type="text"
        icon={<CloseOutlined />}
        size="small"
        onClick={() => {
          deleteSingleDomain(index);
        }}
      />
    </Space>
  );
}
