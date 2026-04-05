import { useEffect, useRef } from "react";
import { Card, Col, Row, Spin } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import classes from "./IVAPeriodWidget.module.scss";
import Container, { PropsFromRedux } from "./IVAPeriodContainer";
import { commonSelector } from "@store/common";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { isPeriodEqual, isYearly } from "@utils/IVA/datesUtils";
import { authSelector } from "@store/authSlice";
import { IVAViewCards } from "../WidgetIVACard/IVAViewCards";

const IVAPeriodWidget = ({ actions, iva }: PropsFromRedux) => {
  const { periodDates, editMode } = useSelector(commonSelector);
  const period = new URLSearchParams(location.search).get("period")?.split("-");
  const { config } = useSelector(authSelector);
  const { dashboardIds } = config;
  const datesDifference = isYearly(periodDates);
  const is_not_big = useRef(dashboardIds.includes("nominal-income")).current || editMode;

  useEffect(() => {
    const currentPeriod = new URLSearchParams(location.search).get("period")?.split("-");
    const areEqual = isPeriodEqual(periodDates, currentPeriod, datesDifference);
    function loadIVAData() {
      if (periodDates && areEqual) {
        const periodDatesList = periodDates.split("|")[0];
        const ivaDate = periodDatesList.split("T");
        const dateToSend = datesDifference
          ? moment(ivaDate[0]).add(11, "months").format("YYYY-MM-DD")
          : ivaDate[0];
        actions.fetchIVA(dateToSend);
      }
    }
    loadIVAData();
  }, [periodDates]);

  function manageRightDate(amount: number): string {
    if (periodDates) {
      const periodDatesList = periodDates.split("|")[0];
      const ivaDate = periodDatesList.split("T");
      const year = moment(ivaDate).format("YYYY");
      if (parseInt(year) < 2023) {
        return "No Disponible";
      }
    }
    return formatDisplay(amount, DisplayType.MONEY) as string;
  }

  return (
    <Card
      style={{ minHeight: "160px" }}
      className={`col-span-7 ${
        is_not_big ? "xl:col-span-2 lg:col-span-2 2xl:col-span-2" : "xl:col-span-9"
      } h-auto overflow-hidden self-start`}
    >
      <h3 className="text-3xl mb-4">
        IVA - {period && period[1] ? period[1].charAt(0).toUpperCase() + period[1].slice(1) : ""}{" "}
        {period ? period[0] : ""}
      </h3>
      <Row gutter={4}>
        <Col
          span={24}
          style={
            iva.isFetching
              ? { display: "flex", justifyContent: "center", alignItems: "center" }
              : { minWidth: 160 }
          }
        >
          {iva.isFetching ? (
            <div className="flex justify-center items-center h-[160px]">
              <Spin />
            </div>
          ) : (
            <IVAViewCards
              iva={iva}
              is_not_big={is_not_big}
              datesDifference={datesDifference}
              manageRightDate={manageRightDate}
            />
          )}
        </Col>
      </Row>
    </Card>
  );
};

Container(IVAPeriodWidget);

export const IVAPeriodWidgetData = {
  id: "iva_period_widget_data",
  component: Container(IVAPeriodWidget) as any,
  className: classes.Widget,
};
