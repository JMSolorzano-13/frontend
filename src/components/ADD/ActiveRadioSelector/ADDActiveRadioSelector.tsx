import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Radio, Space } from "antd";
import { useSelector } from "react-redux";
import { commonSelector } from "@store/common";
import editSearchParams from "@utils/editSearchParams";
import { datesDifferenceBiggerThan } from "@utils/dateHelper";
import { months } from "@constants/Extra";
import styles from "./ActiveRadioSelector.module.scss";

enum Value {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ALL = "ALL",
}

enum CancelValue {
  GENERAL = "GENERAL",
  CMEA = "CMEA",
  EMCP = "EMCP",
}

type Props = {
  isEFOS?: boolean;
  setActiveRadioDomain: (domain: Domain) => void;
  disabled?: boolean;
};

export default function ADDActiveRadioSelector(props: Props) {
  const { isEFOS, setActiveRadioDomain, disabled } = props;
  const location = useLocation();
  // const history = useHistory()
  const navigate = useNavigate();

  const [value, setValue] = useState(() => {
    const state = (new URLSearchParams(location.search).get("state") || "").toUpperCase();
    if (Value[state as keyof typeof Value]) {
      return Value[state as keyof typeof Value];
    }
    return Value.ALL;
  });

  const [cancelledValue, setCancelledValue] = useState(() => {
    const cancelled = (new URLSearchParams(location.search).get("cancelled") || "").toUpperCase();
    if (CancelValue[cancelled as keyof typeof CancelValue]) {
      return CancelValue[cancelled as keyof typeof CancelValue];
    }
    return CancelValue.GENERAL;
  });

  const { periodDates, efosPeriodDates, datesValue } = useSelector(commonSelector);

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
    }

    setActiveRadioDomain(domain);
  }, [value, cancelledValue, datesValue]);

  return (
    <Space className={styles.Wrapper}>
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
    </Space>
  );
}

ADDActiveRadioSelector.defaultProps = {
  isEFOS: false,
  disabled: false,
};
