import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { TreeSelect } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import { commonSelector, setDates } from "@store/common";
import editSearchParams from "@utils/editSearchParams";
import { useAppDispatch } from "@store/store";
import { IVA_ACCEPTED_YEAR } from "@constants/Extra";
import { isYearly } from "@utils/IVA/datesUtils";
import { useDisableButtonsCFDI } from "@hooks/useDisableButtonsCFDI";
import { useDisableButtonsTaxes } from "@hooks/useDisableButtonsTaxes";
import { useDisableButtonsADD } from "@hooks/useDisableButtonsADD";
import { getPeriodSelectorDates } from "@store/common/getPeriodSelectorDates";
import { disableYears } from "@utils/global/disableYears";

type PeriodSelectorType = {
  showAll?: boolean;
  sideEffect?: (isYear: boolean) => void;
};
export default function PeriodSelector({ showAll = true, sideEffect }: PeriodSelectorType) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<PeriodTree[]>([]);
  const [paramChecked, setParamChecked] = useState(false);
  const { periodsTree, datesValue } = useSelector(commonSelector);

  const diasbleCFDIButtons = useDisableButtonsCFDI();
  const diasbleTaxesButtons = useDisableButtonsTaxes();
  const diasbleADDButtons = useDisableButtonsADD();

  useEffect(() => {
    if (!periodsTree) {
      dispatch(getPeriodSelectorDates());
    }
  }, [dispatch]);

  useEffect(() => {
    function loadData() {
      if (!showAll && periodsTree) {
        const filtered = periodsTree.filter((item) => item.title.toLowerCase() !== "todos");
        setData(filtered);
      }
      if (
        (location.pathname.includes("iva") || location.pathname.includes("isr")) &&
        periodsTree &&
        datesValue
      ) {
        const filtered = periodsTree.filter((item) => parseInt(item.title) >= IVA_ACCEPTED_YEAR);
        const validateDate = datesValue.split("|");
        const readableYear = moment.utc(validateDate[0]).format("YYYY");
        if (parseInt(readableYear) < IVA_ACCEPTED_YEAR) {
          dispatch(setDates(String(filtered[0].value)));
        }
        if (location.pathname.includes("iva") || location.pathname.includes("isr")) {
          setData(disableYears(filtered));
          return;
        }
        setData(filtered);
      }
    }
    loadData();
  }, [showAll, periodsTree]);

  useEffect(() => {
    const period = new URLSearchParams(location.search).get("period");
    const locationPath = location.pathname;
    const isYear = isYearly(datesValue);
    let periodForSearch: string | null = null;
    if (
      (locationPath.includes("/tools") && isYear) ||
      (locationPath.includes("/iva") && isYear) ||
      (locationPath.includes("/isr") && isYear) ||
      (locationPath.includes("/add") && isYear)
    ) {
      return handleOnChange(
        `${moment().format("YYYY-MM")}-01T00:00:00.000Z|${moment()
          .add(1, "month")
          .format("YYYY-MM")}-01T00:00:00.000Z|${moment().format("YYYY")}-01-01T00:00:00.000Z`
      );
    }
    if (periodsTree) {
      if (!period && !paramChecked) {
        setParamChecked(true);
      }
      if (period && !paramChecked) {
        setParamChecked(true);
        for (let i = 0; i < periodsTree.length; i += 1) {
          const currP = periodsTree[i];
          const currPTitle = currP.title.replace(" - ", "-").toLowerCase();
          if (currPTitle === period) {
            periodForSearch = currPTitle;
            dispatch(setDates(currP.value));
            break;
          } else {
            for (let j = 0; j < currP.children.length; j += 1) {
              const currC = currP.children[j];
              const currCTitle = currC.title.replace(" - ", "-").toLowerCase();
              if (currCTitle === period) {
                periodForSearch = currCTitle;
                dispatch(setDates(currC.value));
                break;
              }
            }
          }
          if (periodForSearch) {
            break;
          }
        }
      } else {
        for (let i = 0; i < periodsTree.length; i += 1) {
          const currP = periodsTree[i];
          if (currP.value === datesValue) {
            periodForSearch = currP.title.replace(" - ", "-").toLowerCase();
            break;
          } else {
            for (let j = 0; j < currP.children.length; j += 1) {
              const currC = currP.children[j];
              if (currC.value === datesValue) {
                periodForSearch = currC.title.replace(" - ", "-").toLowerCase();
                break;
              }
            }
          }
          if (periodForSearch) {
            break;
          }
        }
      }
      if (period !== periodForSearch) {
        navigate(
          editSearchParams(location.search, [{ key: "period", value: periodForSearch }], {
            baseUrl: location.pathname,
          }),
          { replace: true }
        );
      }
    }
  }, [periodsTree, location.search, datesValue]);

  const handleOnChange = (value: string) => {
    const values = value.split("|");
    const firstDate = moment(values[0]).add({ year: 1 }).format("MM/DD/YYYY");
    const secondDate = moment(values[1]).format("MM/DD/YYYY");
    const isYear = isYearly(value);
    if (firstDate !== secondDate || showAll === true) {
      dispatch(setDates(String(value)));
    }
    sideEffect && sideEffect(isYear);
  };

  const isFetching = () => diasbleADDButtons || diasbleCFDIButtons || diasbleTaxesButtons;

  return (
    <TreeSelect
      style={{ width: 220 }}
      placeholder="Seleccionar tiempo"
      value={datesValue !== null && paramChecked ? datesValue : undefined}
      defaultValue={periodsTree && datesValue && periodsTree.length > 0 ? datesValue : undefined}
      treeData={data.length > 0 ? data : periodsTree ?? undefined}
      loading={!periodsTree}
      disabled={!periodsTree || isFetching()}
      onChange={handleOnChange}
      virtual={false}
      data-test="date-selector"
    />
  );
}
