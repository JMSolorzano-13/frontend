import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { TreeSelect } from "antd";
import { useSelector } from "react-redux";
import { commonSelector, setEfosDates } from "../store/common";
import { getEfosPeriods } from "../store/common/getEfosPeriods";
import editSearchParams from "../utils/editSearchParams";
import { useAppDispatch } from "@store/store";

export default function EfosPeriodSelector() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { efosDateValue, efosPeriodTree } = useSelector(commonSelector);
  const [paramChecked, setParamChecked] = useState(false);

  useEffect(() => {
    if (!efosPeriodTree) dispatch(getEfosPeriods());
  }, [dispatch]);

  useEffect(() => {
    const period = new URLSearchParams(location.search).get("period");
    let periodForSearch: string | null = null;
    if (efosPeriodTree) {
      if (!period && !paramChecked) {
        setParamChecked(true);
      }
      if (period && !paramChecked) {
        setParamChecked(true);
        for (let i = 0; i < efosPeriodTree.length; i += 1) {
          const currP = efosPeriodTree[i];
          const currPTitle = currP.title.replace(" - ", "-").toLowerCase();
          if (currPTitle === period) {
            periodForSearch = currPTitle;
            dispatch(setEfosDates(currP.value));
            break;
          } else {
            for (let j = 0; j < currP.children.length; j += 1) {
              const currC = currP.children[j];
              const currCTitle = currC.title.replace(" - ", "-").toLowerCase();
              if (currCTitle === period) {
                periodForSearch = currCTitle;
                dispatch(setEfosDates(currC.value));
                break;
              }
            }
          }
          if (periodForSearch) break;
        }
      } else {
        for (let i = 0; i < efosPeriodTree.length; i += 1) {
          const currP = efosPeriodTree[i];
          if (currP.value === efosDateValue) {
            periodForSearch = currP.title.replace(" - ", "-").toLowerCase();
            break;
          } else {
            for (let j = 0; j < currP.children.length; j += 1) {
              const currC = currP.children[j];
              if (currC.value === efosDateValue) {
                periodForSearch = currC.title.replace(" - ", "-").toLowerCase();
                break;
              }
            }
          }
          if (periodForSearch) break;
        }
      }
      if (period !== periodForSearch) {
        navigate(
          editSearchParams(
            location.search,
            [{ key: "period", value: periodForSearch }],
            { baseUrl: location.pathname }
          ),
          { replace: true }
        );
      }
    }
  }, [efosDateValue, efosPeriodTree, location.search]);

  return (
    <TreeSelect
      style={{ width: 220 }}
      dropdownStyle={{ maxHeight: 800, overflow: "auto" }}
      placeholder='Seleccionar tiempo'
      value={efosDateValue !== null && paramChecked ? efosDateValue : undefined}
      defaultValue={
        efosPeriodTree && efosDateValue && efosPeriodTree.length > 0
          ? efosDateValue
          : undefined
      }
      treeData={efosPeriodTree ?? undefined}
      loading={!efosPeriodTree}
      disabled={!efosPeriodTree}
      onChange={(val) => dispatch(setEfosDates(String(val)))}
      virtual={false}
      data-test='date-selector'
    />
  );
}
