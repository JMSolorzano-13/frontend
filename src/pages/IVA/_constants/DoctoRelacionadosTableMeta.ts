import { TableMeta } from "@hooks/useTableMeta";
import { RelatedDocto } from "../_types/RelatedDocsTable";
import { numberPagination } from "@utils/global/numberPagination";

export const DEFAULT_DOCTOS_TABLE_META: TableMeta<RelatedDocto> = {
  sorter: [
    {
      column: {
        dataIndex: "FechaPago",
      },
      columnKey: "FechaPago",
      order: "ascend",
      field: "payment_related.FechaPago",
    },
  ],
  pagination: {
    current: 1,
    pageSize: numberPagination,
    defaultCurrent: 1,
  },
  parsedOptions: { orderBy: "", limit: numberPagination, offset: 0 },
  filters: [],
};
