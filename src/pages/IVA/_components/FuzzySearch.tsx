import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { TState } from "../_types/StateTypes";
import { useEffect, useState } from "react";
import { TableMeta } from "@hooks/useTableMeta";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { RelatedDocto } from "../_types/RelatedDocsTable";

interface Props {
  tab: TabIVAType;
  topTab: TState;
  fuzzySearch: string;
  loading: boolean;
  changefuzzySearch: (value: string) => void;
  loadCFDIs: () => void;
  loadTotals(): void;
  tableMeta: TableMeta<IVACFDI>;
  doctosTableMeta: TableMeta<RelatedDocto>;
  forceSetTableMeta: (value: React.SetStateAction<TableMeta<IVACFDI>>) => void;
  forceDoctosSetTableMeta: (value: React.SetStateAction<TableMeta<RelatedDocto>>) => void;
}

export const FuzzySearch = ({
  loadCFDIs,
  loadTotals,
  tab,
  topTab,
  fuzzySearch,
  changefuzzySearch,
  tableMeta,
  doctosTableMeta,
  forceDoctosSetTableMeta,
  forceSetTableMeta,
}: Props) => {
  const [isFocus, setIisFocus] = useState(false);
  useEffect(() => {
    if (!fuzzySearch && isFocus) {
      loadCFDIs();
      loadTotals();
    }
  }, [fuzzySearch]);

  if (
    tab === "ALL" ||
    (topTab === "period_creditable" && tab === "CREDIT") ||
    (topTab === "period_creditable" && tab === "EXCLUDED")
  ) {
    return null;
  }

  return (
    <Input.Search
      id="search-input"
      className="max-w-[220px]"
      placeholder="UUID, RFC o Nombre"
      value={fuzzySearch}
      onFocus={() => setIisFocus(true)}
      onBlur={() => setIisFocus(false)}
      onChange={(e) => changefuzzySearch(e.target.value)}
      enterButton={
        <Button
          onClick={() => {
            loadCFDIs();
            loadTotals();
            forceSetTableMeta({
              ...tableMeta,
              pagination: { ...tableMeta.pagination, current: 1, defaultCurrent: 1 },
              parsedOptions: { ...tableMeta.parsedOptions, offset: 0 },
            });
            forceDoctosSetTableMeta({
              ...doctosTableMeta,
              pagination: { ...doctosTableMeta.pagination, current: 1, defaultCurrent: 1 },
              parsedOptions: { ...doctosTableMeta.parsedOptions, offset: 0 },
            });
          }}
          type={fuzzySearch.length > 0 && isFocus ? "primary" : "default"}
          icon={<SearchOutlined />}
        />
      }
      allowClear
    />
  );
};
