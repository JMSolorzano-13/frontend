import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { MenuOutlined } from "@ant-design/icons";
import { Grid, Switch, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import {
  authSelector,
  setTableColumns,
  setTableColumnsOrder,
  toggleColumn,
} from "@store/authSlice";

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: "grab", color: "#999" }} />);
const SortableItem = SortableElement((props: any) => <tr {...props} />);
const SortableBody = SortableContainer((props: any) => <tbody {...props} />);

type Props = {
  table: string;
  defaultColumns: TableLayout;
  allColumns: ColumnsType<any>;
};

type ColType = { column: string; visible: boolean };

export default function TableColumnsEditor(props: Props) {
  const { useBreakpoint } = Grid;
  const { xl } = useBreakpoint();
  const { table, defaultColumns, allColumns } = props;
  const { config } = useSelector(authSelector);
  const { tableColumns } = config;
  const dispatch = useDispatch();
  const editorColumns = useMemo(() => {
    return [
      {
        title: "Orden",
        dataIndex: "order",
        width: 60,
        className: "drag-visible",
        render: (_, record) =>
          record.column !== "attachments_count" ? <DragHandle /> : null,
      },
      {
        title: "Columna",
        dataIndex: "column",
        className: "drag-visible",
        render: (column: string) => {
          const col = allColumns.find((c) => c.key === column);
          if (column === "attachments_count") return "Adjuntar evidencia";
          if (col) return col.title;
          return column;
        },
      },
      {
        title: "Visible",
        width: 80,
        className: "drag-invisible",
        render: (row) => (
          <Switch
            checked={row.visible}
            onChange={() => dispatch(toggleColumn({ table, column: row.column }))}
          />
        ),
      },
    ] as ColumnsType<ColType>;
  }, [table]);

  const columns = useMemo(() => {
    if (tableColumns[table]) {
      let needsSync = false;
      const syncedColumns: TableLayout = [];
      defaultColumns.forEach((line) => {
        const found = tableColumns[table].find((c) => c.column === line.column);
        if (!found) {
          syncedColumns.push(line);
          needsSync = true;
        } else {
          syncedColumns.push(found);
        }
      });

      if (needsSync) {
        const columnsToReturn: TableLayout = [];
        columnsToReturn.push(...tableColumns[table]);
        const userMissingColumns = defaultColumns.filter(
          (column) => !tableColumns[table].some((userColumn) => userColumn.column === column.column)
        );

        userMissingColumns.map((column) => {
          const indice = defaultColumns.findIndex((c) => c.column === column.column);
          const itemBefore = defaultColumns[indice - 1];
          const itemAfter = defaultColumns[indice + 1];
          const itemBeforeUserIndex = tableColumns[table].findIndex(
            (c) => c.column === itemBefore?.column
          );
          const itemAfterUserIndex = tableColumns[table].findIndex(
            (c) => c.column === itemAfter?.column
          );

          if (
            !tableColumns[table][itemBeforeUserIndex]?.visible &&
            !tableColumns[table][itemAfterUserIndex]?.visible
          ) {
            columnsToReturn.push(column);
          } else if (tableColumns[table][itemBeforeUserIndex]?.visible) {
            columnsToReturn.splice(itemBeforeUserIndex + 1, 0, column);
          } else if (tableColumns[table][itemAfterUserIndex]?.visible) {
            columnsToReturn.splice(itemAfterUserIndex, 0, column);
          }
        });
        dispatch(setTableColumns({ table, columns: columnsToReturn }));
        return columnsToReturn;
      }

      const columnsToReturn: TableLayout = [];
      tableColumns[table].forEach((column) => {
        const found = defaultColumns.find((c) => c.column === column.column);
        if (found) {
          columnsToReturn.push(column);
        }
      });

      return columnsToReturn;
    }
    dispatch(setTableColumns({ table, columns: defaultColumns }));
    return defaultColumns;
  }, [tableColumns, table]);

  const handleSortEnd = ({ oldIndex, newIndex }: any) => {
    const attachmentsIndex = columns.findIndex((c) => c.column === "attachments_count");

    if (attachmentsIndex === 0) {
      if (oldIndex === 0 || newIndex === 0) return;
    }

    if (oldIndex !== newIndex) {
      const newColumns = arrayMoveImmutable<ColType>(
        [...columns],
        oldIndex,
        newIndex
      ).filter(Boolean);

      const idx = newColumns.findIndex((c) => c.column === "attachments_count");
      if (idx > 0) {
        const [att] = newColumns.splice(idx, 1);
        newColumns.unshift(att);
      }

      dispatch(
        setTableColumnsOrder({
          table,
          columns: newColumns.map((el) => el.column),
        })
      );
    }
  };

  const DraggableContainer = (props: any) => (
    <SortableBody
      useDragHandle
      disableautoscroll="true"
      helperClass="row-dragging"
      onSortEnd={handleSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = (props: any) => {
    const index = columns.findIndex((el) => el.column === props["data-row-key"]);
    return <SortableItem index={index} {...props} />;
  };

  return (
    <Table
      size="small"
      style={xl ? { marginTop: 10, width: 465 } : { width: 500 }}
      pagination={false}
      dataSource={columns}
      columns={editorColumns}
      rowKey="column"
      scroll={xl ? { y: 450 } : { y: 250 }}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
      data-test="modal-editor-table"
    />
  );
}
