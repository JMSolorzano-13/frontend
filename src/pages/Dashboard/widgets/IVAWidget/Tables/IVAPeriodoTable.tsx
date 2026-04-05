import { Table, theme } from "antd";
import IVAPeriodColumns from "../Columns/IVAPeriodoColumns";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import * as P from "@constants/PageIds";

interface Props {
  ivaPeriodData: IvaPeriodWidget[] | null;
  isIVAWidgetFetching: boolean;
  datesValue: string;
  company: string;
}

const { useToken } = theme;

export const IVAPeriodoTable = ({
  ivaPeriodData,
  isIVAWidgetFetching,
  datesValue,
  company,
}: Props) => {
  const { token } = useToken();
  const navigate = useNavigate();

  const getPeriodData = (record: IvaPeriodWidget) => {
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
      columns={IVAPeriodColumns()}
      loading={isIVAWidgetFetching}
      dataSource={ivaPeriodData ?? []}
      scroll={{ x: "max-content" }}
      tableLayout="auto"
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
