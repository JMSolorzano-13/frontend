import { CopyOutlined } from "@ant-design/icons";
import { Button, Card, Tabs, Tooltip } from "antd";
import s from "./IVAWidget.module.scss";
import { IVAPeriodoTable } from "./Tables/IVAPeriodoTable";
import { IVATrasladadoTable } from "./Tables/IVATrasladadoTable";
import { IVAAcreditableTable } from "./Tables/IVAAcreditableTable";
import { useAppDispatch } from "@store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { commonSelector } from "@store/common";
import { authSelector } from "@store/authSlice";
import { getIVADashboard } from "@store/ivaSlice/getIVADashboard";
import { ivaSelector } from "@store/ivaSlice";
import { useSearchParams } from "react-router-dom";
import { formatWidgetDate } from "@utils/formatWidgetDate";

export const IVAWidget = () => {
  const { datesValue } = useSelector(commonSelector);
  const { company } = useSelector(authSelector);
  const { ivaPeriodData, ivaTrasladadoData, ivaAcreditableData, isIVAWidgetFetching } =
    useSelector(ivaSelector);

  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const period = searchParams.get("period");

  const [activeTabKey, setActiveTabKey] = useState("periodo");

  useEffect(() => {
    if (!period || !company) return;
    dispatch(getIVADashboard({ company, period: formatWidgetDate(period as string) }));
  }, [period, company]);

  const copyPeriodTable = () => {
    if (!ivaPeriodData) return;

    const headers = Object.keys(ivaPeriodData[0] as IvaPeriodWidget) as (keyof IvaPeriodWidget)[];
    const headersToDisplay = [
      "Mes",
      "IVA trasladado",
      "IVA acreditable",
      "IVA a cargo",
      "Retenciones IVA",
    ];
    const copyData = [
      headersToDisplay.join("\t"),
      ...ivaPeriodData.map((row) => headers.map((header) => row[header]).join("\t")),
    ].join("\n");

    navigator.clipboard.writeText(copyData);
  };

  const copyTrasladadoTable = () => {
    if (!ivaTrasladadoData) return;

    const headers = Object.keys(
      ivaTrasladadoData[0] as IvaTrasladadoWidget
    ) as (keyof IvaTrasladadoWidget)[];
    const headersToDisplay = [
      "Mes",
      "Conteo CFDIs",
      "Base 16%",
      "Base 8%",
      "Base 0%",
      "Base Exento",
      "Trasladado 16%",
      "Trasladado 8%",
      "Trasladado Total",
      "Retenciones IVA",
    ];
    const copyData = [
      headersToDisplay.join("\t"),
      ...ivaTrasladadoData.map((row) => headers.map((header) => row[header]).join("\t")),
    ].join("\n");

    navigator.clipboard.writeText(copyData);
  };

  const copyAcreditadoTable = () => {
    if (!ivaAcreditableData) return;

    const headers = Object.keys(
      ivaAcreditableData[0] as IvaAcreditableWidget
    ) as (keyof IvaAcreditableWidget)[];
    const headersToDisplay = [
      "Mes",
      "Conteo CFDIs",
      "Base 16%",
      "Base 8%",
      "Base 0%",
      "Base Exento",
      "Acreditable 16%",
      "Acreditable 8%",
      "Acreditable Total",
      "Retenciones IVA",
    ];
    const copyData = [
      headersToDisplay.join("\t"),
      ...ivaAcreditableData.map((row) => headers.map((header) => row[header]).join("\t")),
    ].join("\n");

    navigator.clipboard.writeText(copyData);
  };

  const handleCopyTable = (key: string) => {
    switch (key) {
      case "periodo":
        copyPeriodTable();
        break;
      case "trasladado":
        copyTrasladadoTable();
        break;
      case "acreditable":
        copyAcreditadoTable();
        break;
      default:
        break;
    }
  };

  return (
    <Card className={s.Widget}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 4, marginBottom: 10 }}>
        <h3 className="text-3xl">IVA base flujo</h3>
        <Tooltip title="Copiar tabla">
          <Button icon={<CopyOutlined />} onClick={() => handleCopyTable(activeTabKey)} />
        </Tooltip>
      </div>

      <div className="iva-widget-tabs">
        <Tabs
          activeKey={activeTabKey}
          onChange={(key) => setActiveTabKey(key)}
          type="card"
          size="small"
          className={s.ActiveTab}
          items={[
            {
              label: `IVA por periodo`,
              key: "periodo",
              children: (
                <IVAPeriodoTable
                  ivaPeriodData={ivaPeriodData}
                  isIVAWidgetFetching={isIVAWidgetFetching}
                  company={company as string}
                  datesValue={datesValue as string}
                />
              ),
            },
            {
              label: `IVA trasladado`,
              key: "trasladado",
              children: (
                <IVATrasladadoTable
                  ivaTrasladadoData={ivaTrasladadoData}
                  isIVAWidgetFetching={isIVAWidgetFetching}
                  company={company as string}
                  datesValue={datesValue as string}
                />
              ),
            },
            {
              label: `IVA acreditable`,
              key: "acreditable",
              children: (
                <IVAAcreditableTable
                  ivaAcreditableData={ivaAcreditableData}
                  isIVAWidgetFetching={isIVAWidgetFetching}
                  company={company as string}
                  datesValue={datesValue as string}
                />
              ),
            },
          ]}
        />
      </div>
    </Card>
  );
};

export const ImprovedIVAData = {
  id: "improved-IVA",
  component: IVAWidget,
  className: s.Widget,
};
