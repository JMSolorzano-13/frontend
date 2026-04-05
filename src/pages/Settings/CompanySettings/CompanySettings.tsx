import useTableMeta from "@hooks/useTableMeta";
import { authSelector } from "@store/authSlice";
import { companySelector } from "@store/companySlice";
import { numberPagination, optionsPagination } from "@utils/global/numberPagination";
import { getColumnsCompanies } from "@utils/Settings/companiesData";
import { getColsSettings } from "@utils/Settings/companyColumns";
import { Table, Typography } from "antd";
import { useSelector } from "react-redux";

export const CompanySettings = () => {
  const { userData } = useSelector(authSelector);
  const { companies } = useSelector(companySelector);
  const [tableMeta, setTableMeta] = useTableMeta<CompanyType>({
    sorter: [
      {
        column: {
          dataIndex: "rol",
        },
        columnKey: "rol",
        order: "ascend",
        field: "rol",
      },
    ],
    pagination: {
      current: 1,
      pageSize: numberPagination,
      defaultCurrent: 1,
    },
    parsedOptions: { orderBy: "", limit: numberPagination, offset: 0 },
    filters: [],
  });

  const data = getColumnsCompanies(companies, userData);
  return (
    <>
      <Typography.Title style={{ fontWeight: 500, fontSize: 18 }}>
        Empresas a las que tienen acceso:
      </Typography.Title>
      <Table
        rowKey={(record, key) => key + record.rfc + record.owner}
        columns={getColsSettings}
        dataSource={data}
        onChange={setTableMeta}
        style={{ backgroundColor: "white" }}
        size="small"
        scroll={{ y: 380, x: 10 }}
        pagination={{
          defaultCurrent: 1,
          current: tableMeta?.pagination.current,
          pageSizeOptions: optionsPagination,
          pageSize: tableMeta?.pagination.pageSize,
          total: companies.length,
          showSizeChanger: true,
          showTotal: (total) =>
            total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
        }}
      />
    </>
  );
};
