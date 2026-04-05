import { Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import UserActions from "./UserActions";
import { ShowMoreCompanies } from "../ShowMoreCompanies";

export default function getUsersTableColumns(
  isWorkspaceOwner: boolean
): ColumnsType<UserWithPermissions> {
  const columns: ColumnsType<UserWithPermissions> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: 350,
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
      width: 300,
    },
    {
      title: "Acceso nóminas",
      dataIndex: "permissions",
      key: "paymentAccess",
      render: (permissions: UserCompanyRoles[]) => {
        const hasPayrollAccess = permissions.some((p) => p.roles.includes("PAYROLL"));
        if (hasPayrollAccess) {
          return <Tag color="green">Si</Tag>;
        }
        return <Tag color="red">No</Tag>;
      },
      width: 150,
    },
    {
      title: "Empresas",
      dataIndex: "permissions",
      key: "companies",
      render: (permissions: UserCompanyRoles[]) => {
        const companies: { id: number; name: string }[] = [];
        permissions.forEach((p) => {
          companies.push({
            id: p.companyId,
            name: p.companyName,
          });
        });

        return <ShowMoreCompanies companies={companies} />;
      },
      width: 350,
    },
    {
      title: "Acciones",
      key: "action",
      width: 90,
      render: (user: UserWithPermissions) => <UserActions user={user} />,
    },
  ];

  const getColumnsByUser = (isWorkspaceOwner: boolean) => {
    const cols = columns;
    if (isWorkspaceOwner) {
      return cols;
    } else {
      return cols.filter((c) => {
        if (c.key) {
          return !["action"].includes(String(c.key));
        }
        return true;
      });
    }
  };

  return getColumnsByUser(isWorkspaceOwner);
}
