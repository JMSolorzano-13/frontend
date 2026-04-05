import { PlusOutlined } from "@ant-design/icons";
import { SelectOptionType } from "@layouts/Workspace";
import { Button, Select } from "antd";

interface IEzCompanySelectorComponent {
  company: string | null;
  userData: UserData | null;
  companiesEl: SelectOptionType[];
  changeCompany: (nextCompany: string, userData: UserData | null, company: string | null) => void;
}

export default function EzCompanySelectorComponent(props: IEzCompanySelectorComponent) {
  const { company, userData, companiesEl, changeCompany } = props;

  const customDropdownRender = (menu: any) => (
    <>
      {menu}
      <Button
        type="link"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          localStorage.removeItem("lastCompany");
          localStorage.removeItem("lastWorkspace");
          window.location.replace("/create-company");
        }}
      >
        <PlusOutlined />
        <span>Nueva empresa</span>
      </Button>
    </>
  );

  return (
    <Select
      style={{ minWidth: 250, maxWidth: 420 }}
      bordered={false}
      defaultValue={company ?? ""}
      size="large"
      onChange={(val) => changeCompany(val, userData, company)}
      showSearch
      optionFilterProp="children"
      options={companiesEl}
      dropdownRender={customDropdownRender}
      filterOption={(input, option) => {
        return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
      }}
    />
  );
}
