import { SelectOptionType } from "@layouts/Workspace";
import { Select } from "antd";

interface ISiigoCompanySelectorComponent {
  company: string | null;
  userData: UserData | null;
  companiesEl: SelectOptionType[];
  changeCompany: (nextCompany: string, userData: UserData | null) => void;
}

export default function SiigoCompanySelectorComponent(props: ISiigoCompanySelectorComponent) {
  const { company, userData, companiesEl, changeCompany } = props;

  return (
    <div className="custom-select">
      <Select
        styles={{
          root: { minWidth: 250, maxWidth: 420, color: 'theme("colors.primary")' },
        }}
        defaultValue={company ?? ""}
        id="ws-company-select"
        size="large"
        onChange={(val) => changeCompany(val, userData)}
        optionFilterProp="children"
        options={companiesEl}
        bordered={false}
        filterOption={(input, option) => {
          return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
        }}
      />
    </div>
  );
}
