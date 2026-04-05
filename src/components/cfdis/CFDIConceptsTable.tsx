import { useState } from "react";
import { Table } from "antd";
import { uniqueId } from "lodash";
import { ColumnGroupType, ColumnType } from "antd/lib/table";

type Props = {
  generalDetailsColumns?: (ColumnGroupType<CFDIDetails> | ColumnType<CFDIDetails>)[];
  concepts: CFDIDetails[];
  loading: boolean;
};

export default function CFDIConceptsTable({ generalDetailsColumns, concepts, loading }: Props) {
  const [page, setPage] = useState(1);

  return (
    <Table
      size="small"
      id="concepts-id-table"
      dataSource={concepts}
      columns={generalDetailsColumns}
      rowKey={() => uniqueId()}
      scroll={{ x: "max-content", y: 210 }}
      loading={loading}
      rowClassName={"secondary-concepts-table"}
      pagination={{
        defaultCurrent: 1,
        current: page,
        pageSize: 10,
        total: concepts.length,
        showSizeChanger: false,
        onChange: (newPage) => setPage(newPage),
        position: ["bottomCenter"],
        showTotal: (total) => (
          <span
            style={{
              fontFamily: "roboto",
              fontSize: 14,
              fontWeight: "bold",
              color: "#515151",
            }}
          >
            {new Intl.NumberFormat("es-MX").format(total)} conceptos
          </span>
        ),
        size: "small",
        style: {
          marginTop: 8,
          marginBottom: 8,
        },
      }}
    />
  );
}
