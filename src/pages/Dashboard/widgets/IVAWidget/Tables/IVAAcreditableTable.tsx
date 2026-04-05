import { Table, theme } from "antd";
import IVAAcreditableColumns from "../Columns/IVAAcreditableColumns";
import moment from "moment";
import * as P from "@constants/PageIds";
import { useNavigate } from "react-router-dom";

interface Props {
  ivaAcreditableData: IvaAcreditableWidget[] | null;
  isIVAWidgetFetching: boolean;
  company: string;
  datesValue: string;
}

const { useToken } = theme;

export const IVAAcreditableTable = ({
  ivaAcreditableData,
  isIVAWidgetFetching,
  company,
  datesValue,
}: Props) => {
  const { token } = useToken();
  const navigate = useNavigate();

  const getPeriodData = (record: IvaAcreditableWidget) => {
    const datesString = datesValue?.split("|")[1] || "";
    const firstDate = new Date(datesString);

    if (record.mes === "Total anual") {
      return moment(firstDate).locale("es").format("YYYY-MMMM");
    }
    return `${moment(firstDate).locale("es").format("YYYY")}-${record.mes?.toLowerCase()}`;
  };

  return (
    <Table
      rowKey="identifier"
      size="small"
      columns={IVAAcreditableColumns()}
      loading={isIVAWidgetFetching}
      dataSource={ivaAcreditableData ?? []}
      scroll={{ x: 10, y: 550 }}
      pagination={false}
      rowClassName="hover:bg-transparent"
      onRow={(record) => ({
        onClick: () => {
          navigate(
            `${P.IVA.path}?cid=${company}&period=${getPeriodData(record)}&ivaType=period_creditable`
          );
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.color = token.colorPrimary;
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.color = "black";
        },
        style: { cursor: "pointer" },
      })}
    />
  );
};
