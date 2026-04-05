import { TableMeta } from "@hooks/useTableMeta";

export default function parseTableMeta<T>(tableMeta: TableMeta<T>) {
  let orderBy = "";
  let limit = 100;
  let offset = 0;
  if (tableMeta) {
    const { sorter, pagination } = tableMeta;
    if (sorter.length > 0) {
      sorter.forEach((s) => {
        let order = "";
        if (s.order === undefined || s.column === undefined) return;
        order = s.order === "ascend" ? "asc" : "desc";
        orderBy += `"${s.column.dataIndex}" ${order} `;
      });
    }
    if (pagination) {
      limit = pagination.pageSize ?? 100;
      offset = pagination.current ? pagination.current - 1 : 0;
    }
  }

  return {
    orderBy,
    limit,
    offset,
  };
}
