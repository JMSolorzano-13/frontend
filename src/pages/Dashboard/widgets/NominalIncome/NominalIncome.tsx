import { Button, Card, Table, Tooltip } from "antd";
import s from "./NominalIncome.module.scss";
import NominalIncomeColumns from "./NominalIncomeColumns";
import { CopyOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { commonSelector } from "@store/common";
import { useNavigate } from "react-router-dom";
import * as P from "@constants/PageIds";
import { authSelector } from "@store/authSlice";
import moment from "moment";
import { useAppDispatch } from "../../../../store/store";
import { useEffect } from "react";
import { getNominalIncome } from "@store/cfdiSlice/getNominalIncome";
import { cfdiSelector } from "@store/cfdiSlice";
import { tailwindColors } from "@utils/tailwindColors";
import { IS_SIIGO } from "@utils/SIIGO/Global";

export default function NominalIncome() {
  const { datesValue } = useSelector(commonSelector);
  const { company } = useSelector(authSelector);
  const { nominalIncomeData, isFetchingNominalIncome } = useSelector(cfdiSelector);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!datesValue || !company) return;
    dispatch(getNominalIncome({ company, date: datesValue }));
  }, [datesValue, company]);

  const getPeriodData = (record: NominalData) => {
    const datesString = datesValue?.split("|")[1] || "";
    const firstDate = new Date(datesString);

    if (record.mes === "Total anual") {
      return moment(firstDate).locale("es").format("YYYY-MMMM");
    }
    return `${moment(firstDate).locale("es").format("YYYY")}-${record.mes?.toLowerCase()}`;
  };

  const copyTableData = () => {
    if (!nominalIncomeData) {
      return;
    }

    const headers = Object.keys(nominalIncomeData[0] as NominalData) as (keyof NominalData)[];
    const headersToDisplay = [
      "Mes",
      "Cancelados",
      "Vigentes",
      "Ingresos nominales",
      "Descuentos",
      "Ingresos netos",
    ];

    const copyData = [
      headersToDisplay.join("\t"),
      ...nominalIncomeData.map((row) => headers.map((header) => row[header]).join("\t")),
    ].join("\n");

    navigator.clipboard.writeText(copyData);
  };

  return (
    <Card className={s.Widget}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <h3 className="text-3xl">Ingresos nominales por mes</h3>
        <Tooltip title="Copiar tabla">
          <Button icon={<CopyOutlined />} onClick={copyTableData} />
        </Tooltip>
      </div>
      <Table
        rowKey="identifier"
        size="small"
        columns={NominalIncomeColumns()}
        loading={isFetchingNominalIncome}
        dataSource={nominalIncomeData ?? []}
        scroll={{ x: 10, y: 550 }}
        style={{ marginTop: 20 }}
        pagination={false}
        rowClassName="hover:bg-transparent"
        onRow={(record) => ({
          onClick: () => {
            if (record.emptyMonth) {
              return;
            }
            navigate(
              `${P.CFDIISSUED.path}?cid=${company}&period=${getPeriodData(
                record
              )}&state=active&type=ingress`
            );
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.color = IS_SIIGO
              ? tailwindColors.sg_primary["500"]
              : tailwindColors.primary;
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.color = "black";
          },
          style: { cursor: record.emptyMonth ? "default" : "pointer" },
        })}
      />
    </Card>
  );
}

export const NominalIncomeData = {
  id: "nominal-income",
  component: NominalIncome,
  className: s.Widget,
};
