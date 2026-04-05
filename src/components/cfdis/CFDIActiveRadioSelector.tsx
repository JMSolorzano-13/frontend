import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Radio, Select, Space } from "antd";
import { useSelector } from "react-redux";
import { commonSelector } from "@store/common";
import editSearchParams from "@utils/editSearchParams";
import { datesDifferenceBiggerThan } from "@utils/dateHelper";
import s from "./CFDIActiveRadioSelector.module.scss";
import { months } from "@constants/Extra";
import { useBasicPlan } from "@hooks/useBasicPlan";
import { IS_SIIGO } from "@utils/SIIGO/Global";

enum Value {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ALL = "ALL",
}

enum CancelValue {
  ALL = "ALL",
  GENERAL = "GENERAL",
  CMEA = "CMEA",
  EMCP = "EMCP",
}

type Props = {
  isEFOS?: boolean;
  setActiveRadioDomain: React.Dispatch<React.SetStateAction<Domain>>;
  disabled: boolean;
};

export default function CFDIActiveRadioSelector(props: Props) {
  const { isEFOS = false, setActiveRadioDomain, disabled } = props;
  const { isDownloadPlan } = useBasicPlan()
  const location = useLocation();
  const navigate = useNavigate();
  const { periodDates, efosPeriodDates, datesValue, efosDateValue } = useSelector(commonSelector);
  const firstRender = useRef(true);

  const [value, setValue] = useState(() => {
    const state = (new URLSearchParams(location.search).get("state") || "").toUpperCase();
    if (Value[state as keyof typeof Value]) {
      return Value[state as keyof typeof Value];
    }
    return Value.ACTIVE;
  });

  const [cancelledValue, setCancelledValue] = useState(() => {
    const cancelled = (new URLSearchParams(location.search).get("cancelled") || "").toUpperCase();

    const dates = isEFOS ? efosPeriodDates : periodDates;
    if (!dates) return CancelValue.GENERAL;
    const [startDate, endDate] = dates.split("|");
    const yearSelected = datesDifferenceBiggerThan(startDate, endDate, 32);

    if (CancelValue[cancelled as keyof typeof CancelValue]) {
      return CancelValue[cancelled as keyof typeof CancelValue];
    }
    if (yearSelected) {
      return isDownloadPlan ? CancelValue.GENERAL : CancelValue.ALL;
    }

    return CancelValue.GENERAL;
  });

  useEffect(() => {
    const dates = isEFOS ? efosPeriodDates : periodDates;
    if (!dates) return;
    const [startDate, endDate] = dates.split("|");
    const yearSelected = datesDifferenceBiggerThan(startDate, endDate, 32);
    if (value === Value.INACTIVE && yearSelected && cancelledValue !== CancelValue.GENERAL) {
      setCancelledValue(CancelValue.GENERAL);
    }
  }, [isEFOS, periodDates, efosPeriodDates]);

  // get Selected Period
  const selectedPeriod = (datesValue: string | null) => {
    if (datesValue !== null) {
      let selectedPeriodText = "";
      const splittedDateValues = datesValue.split("|");
      const [currD] = splittedDateValues;
      if (splittedDateValues.length < 3) {
        const [selectedYear] = currD.split("-");
        selectedPeriodText = selectedYear;
        return selectedPeriodText;
      }

      const [year, month] = currD.split("-");
      selectedPeriodText = `${year} - ${months[Number(month) - 1]}`;
      return selectedPeriodText;
    }
    return "";
  };

  useEffect(() => {
    const domain: Domain = [];
    const dates = isEFOS ? efosPeriodDates : periodDates;
    const [startDate, endDate] = dates ? dates.split("|") : "";
    navigate(
      editSearchParams(
        location.search,
        [
          { key: "state", value: value.toLowerCase() },
          {
            key: "cancelled",
            value: value === Value.INACTIVE ? cancelledValue.toLowerCase() : "",
          },
          {
            key: "period",
            value: selectedPeriod(periodDates),
          },
        ],
        { baseUrl: location.pathname }
      ),
      { replace: true }
    );

    if (value === Value.ACTIVE) {
      domain.push(["Estatus", "=", true]);
    }

    if (value === Value.INACTIVE) {
      domain.push(["Estatus", "=", false]);
      if (
        cancelledValue === CancelValue.CMEA &&
        dates &&
        datesValue !== "Todos" &&
        startDate !== "Todos"
      ) {
        if (datesDifferenceBiggerThan(startDate, endDate, 32)) {
          setCancelledValue(CancelValue.GENERAL);
          return;
        }

        domain.push([
          "FechaCancelacion",
          ">=",
          new Date(startDate).toISOString().replaceAll("Z", ""),
        ]);
        domain.push(["FechaCancelacion", "<", new Date(endDate).toISOString().replaceAll("Z", "")]);
        domain.push(["FechaFiltro", "<", new Date(startDate).toISOString().replaceAll("Z", "")]);
      } else if (
        cancelledValue === CancelValue.EMCP &&
        dates &&
        datesValue !== "Todos" &&
        startDate !== "Todos"
      ) {
        const [startDate, endDate] = dates.split("|");
        if (datesDifferenceBiggerThan(startDate, endDate, 32)) {
          setCancelledValue(CancelValue.GENERAL);
          return;
        }
        domain.push(["FechaFiltro", ">=", new Date(startDate).toISOString().replaceAll("Z", "")]);
        domain.push(["FechaFiltro", "<", new Date(endDate).toISOString().replaceAll("Z", "")]);
        domain.push([
          "FechaCancelacion",
          ">=",
          new Date(endDate).toISOString().replaceAll("Z", ""),
        ]);
      } else if (
        cancelledValue === CancelValue.GENERAL &&
        dates &&
        datesValue !== "Todos" &&
        startDate !== "Todos"
      ) {
        if (datesDifferenceBiggerThan(startDate, endDate, 32)) {
          setCancelledValue(CancelValue.GENERAL);
          setActiveRadioDomain(domain);
          return;
        }
        domain.push([
          "FechaCancelacion",
          ">=",
          new Date(startDate).toISOString().replaceAll("Z", ""),
        ]);
        domain.push(["FechaCancelacion", "<", new Date(endDate).toISOString().replaceAll("Z", "")]);
      }
    }
    setActiveRadioDomain((prev) => (firstRender.current ? prev : domain));

    firstRender.current = false;
  }, [value, cancelledValue, datesValue]);

  const period = useMemo(() => {
    if (isEFOS && efosDateValue) {
      if (efosDateValue.split("|").length > 2) {
        return { singular: "mes", plural: "meses" };
      }
      return { singular: "año", plural: "años" };
    }
    if (!isEFOS && datesValue) {
      if (datesValue.split("|").length > 2) {
        return { singular: "mes", plural: "meses" };
      }
      return { singular: "año", plural: "años" };
    }

    return { singular: "mes", plural: "meses" };
  }, [isEFOS, datesValue, efosDateValue]);

  const yearSelected = useMemo(() => {
    const dates = isEFOS ? efosPeriodDates : periodDates;
    if (!dates) return false;
    const [startDate, endDate] = dates.split("|");
    if (datesDifferenceBiggerThan(startDate, endDate, 32)) {
      return true;
    }
    return false;
  }, [isEFOS, efosPeriodDates, periodDates]);

  return (
    <Space className={s.Wrapper}>
      <Radio.Group
        buttonStyle="solid"
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
      >
        <Radio.Button id="filter-active-radio" value={Value.ACTIVE}>
          <span data-test="filter-active-radio">Vigentes</span>
        </Radio.Button>
        <Radio.Button id="filter-inactive-radio" value={Value.INACTIVE}>
          <span data-test="filter-inactive-radio">Cancelados</span>
        </Radio.Button>
        <Radio.Button id="filter-all-radio" value={Value.ALL}>
          <span data-test="filter-all-radio">Todos</span>
        </Radio.Button>
      </Radio.Group>
      {value === Value.INACTIVE && ((IS_SIIGO && !isDownloadPlan) || !IS_SIIGO )? (
        <Select
          id="filter-inactive-select"
          style={{ width: "fit-content" }}
          value={cancelledValue}
          disabled={disabled}
          onChange={(val) => setCancelledValue(val as CancelValue)}
          data-test="filter-inactive-select"
        >
          {!yearSelected ? (
            <Select.Option id="filter-inactive-opt-all" value={CancelValue.ALL}>
              Todos
            </Select.Option>
          ) : null}
          <Select.Option id="filter-inactive-opt-general" value={CancelValue.GENERAL}>
            Cancelados y emitidos en el {period.singular}
          </Select.Option>
          {!yearSelected ? (
            <>
              <Select.Option id="filter-inactive-opt-cmea" value={CancelValue.CMEA}>
                Cancelados en {period.singular}, emitidos en {period.plural} anteriores
              </Select.Option>
              <Select.Option id="filter-inactive-opt-emcp" value={CancelValue.EMCP}>
                Cancelados en {period.plural} posteriores
              </Select.Option>
            </>
          ) : null}
        </Select>
      ) : null}
    </Space>
  );
}
