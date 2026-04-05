import { UserOutlined } from "@ant-design/icons";
import { IS_SIIGO } from "@utils/SIIGO/Global";
import { Button, Dropdown, MenuProps } from "antd";

interface ICompanyDropdown {
  userMenuItems: MenuProps["items"];
}

export default function CompanyDropdown(props: ICompanyDropdown) {
  const { userMenuItems } = props;

  return (
    <Dropdown menu={{ items: userMenuItems }} placement="bottomLeft" trigger={["click"]}>
      <Button
        id="ws-user-menu"
        shape="circle"
        className="mt-4"
        size="large"
        icon={
          <UserOutlined
            className={`mt-7 ${IS_SIIGO && "text-primary mt-[23px]"}`}
            style={{ fontSize: "22px" }}
          />
        }
      />
    </Dropdown>
  );
}
