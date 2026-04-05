import { ColumnsType } from "antd/lib/table";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { authSelector } from "../store/authSlice";

export const useCColumns = <T>(
  initialColumns: ColumnsType<T>,
  tableId: string,
  defaultColumns?: TableLayout
) => {
  const [columns, setColumns] = useState(initialColumns); // columns from data columns (file)
  const { config } = useSelector(authSelector);
  const { tableColumns } = config; // table columns configured by user

  const processedColumns: ColumnsType<T> = useMemo(() => {
    const cTableColumns = tableColumns[tableId] ?? defaultColumns;

    if (cTableColumns && defaultColumns) {
      const columnsToIterate: TableLayout = [];
      const filteredColumns: ColumnsType<T> = [];
      if (cTableColumns.length === defaultColumns?.length) {
        columnsToIterate.push(...cTableColumns);
      } else {
        columnsToIterate.push(...cTableColumns);
        const userMissingColumns = defaultColumns.filter(
          (column) => !cTableColumns.some((userColumn) => userColumn.column === column.column)
        );

        userMissingColumns.map((column) => {
          const indice = defaultColumns.findIndex((c) => c.column === column.column);
          const itemBefore = defaultColumns[indice - 1];
          const itemAfter = defaultColumns[indice + 1];
          const itemBeforeUserIndex = tableColumns[tableId].findIndex(
            (c) => c.column === itemBefore?.column
          );
          const itemAfterUserIndex = tableColumns[tableId].findIndex(
            (c) => c.column === itemAfter?.column
          );

          if (
            !tableColumns[tableId][itemBeforeUserIndex]?.visible &&
            !tableColumns[tableId][itemAfterUserIndex]?.visible
          ) {
            columnsToIterate.push(column);
          } else if (tableColumns[tableId][itemBeforeUserIndex]?.visible) {
            columnsToIterate.splice(itemBeforeUserIndex + 1, 0, column);
          } else if (tableColumns[tableId][itemAfterUserIndex]?.visible) {
            columnsToIterate.splice(itemAfterUserIndex, 0, column);
          }
        });
      }
      // Push the columns that must be shown using the filter
      columnsToIterate.forEach((col) => {
        if (!col.visible) return;
        const found = columns.find((c) => {
          return col.column === c.key;
        });
        if (found) {
          filteredColumns.push(found);
        }
      });

      // Push the columns that are not found in the filter
      columns.forEach((col) => {
        const found = columnsToIterate.find((c) => {
          return c.column === col.key;
        });
        if (!found) {
          filteredColumns.push(col);
        }
      });
      return filteredColumns;
    }
    return columns;
  }, [tableColumns, columns]);

  return [processedColumns, setColumns] as [
    ColumnsType<T>,
    React.Dispatch<React.SetStateAction<ColumnsType<T>>>
  ];
};
