import { useMemo } from "react";
import _, { isArray } from "lodash";
import { Tag } from "antd";
import { CFDI_Types } from "@constants/Enums";
import { getADVSelections } from "@utils/CFDI/advSelectionsFunctions";

type Props = {
  advancedDomain: Domain;
  setAdvancedDomain: (domain: Domain) => void;
  disabled: boolean;
  tab: CFDI_Types;
  moduleId: CFDIModule;
  setOpenAdvancedFilter: (open: boolean) => void;
};

export default function CFDIAdvancedFilterTags(props: Props) {
  const { advancedDomain, setAdvancedDomain, disabled, tab, moduleId, setOpenAdvancedFilter } =
    props;

  const advSelectionsPerTab = getADVSelections({ tab, moduleId });

  function handleComparitionValue(val: string) {
    if (val === "!=") {
      return "<>";
    } else if (val === "in") {
      return "contiene";
    } else if (val === "not in") {
      return "no contiene";
    } else {
      return val;
    }
  }

  const tagsElements = useMemo(() => {
    const tags: JSX.Element[] = [];
    advancedDomain.forEach((f, i) => {
      const advSelected = advSelectionsPerTab.find((s) => s.value === f[0]);
      if (!advSelected) return;
      const { label, type } = advSelected;
      let formattedValue = f[2];
      if (type === "date" && f[2]) {
        formattedValue = new Date(String(f[2])).toLocaleDateString();
      }
      if ((type === "boolean" || type === "boolean_contains") && f[2] !== undefined) {
        formattedValue = f[2] ? "Sí" : "No";
      }
      if (type === "contains" && f[2]) {
        formattedValue =
          (f[1] === "in" || f[1] === "not in") && isArray(f[2]) ? f[2].join(", ") : f[2];
      }

      tags.push(
        <Tag
          key={_.uniqueId()}
          onClose={() => {
            const newDomain = [...advancedDomain];
            newDomain.splice(i, 1);
            setAdvancedDomain(newDomain);
          }}
          closable={disabled}
          onClick={() => {
            setOpenAdvancedFilter(true);
          }}
          style={{ cursor: "pointer" }}
          closeIcon={
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "2em",
                lineHeight: "1",
                marginLeft: "0.2em",
              }}
            >
              ×
            </span>
          }
        >
          {label} {handleComparitionValue(f[1])} {formattedValue}
        </Tag>
      );
    });
    return tags;
  }, [advancedDomain, setAdvancedDomain, disabled]);

  return <div className="flex mt-3">{tagsElements}</div>;
}
