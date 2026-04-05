import { Table, theme } from "antd";
import moment from "moment";
import * as P from "@constants/PageIds";
import { useNavigate } from "react-router-dom";
import IVATrasladadoColumns from "../Columns/IVATrasladadoColumns";

interface Props {
  ivaTrasladadoData: IvaTrasladadoWidget[] | null;
  isIVAWidgetFetching: boolean;
  company: string;
  datesValue: string;
}

const { useToken } = theme;

export const IVATrasladadoTable = ({
  ivaTrasladadoData,
  isIVAWidgetFetching,
  company,
  datesValue,
}: Props) => {
  const { token } = useToken();
  const navigate = useNavigate();

  const getPeriodData = (record: IvaTrasladadoWidget) => {
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
      columns={IVATrasladadoColumns()}
      loading={isIVAWidgetFetching}
      dataSource={ivaTrasladadoData ?? []}
      scroll={{ x: 10, y: 550 }}
      pagination={false}
      rowClassName="hover:bg-transparent"
      onRow={(record) => ({
        onClick: () => {
          navigate(
            `${P.IVA.path}?cid=${company}&period=${getPeriodData(
              record
            )}&ivaType=period_transferred`
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
