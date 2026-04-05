import { Typography } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import classes from "./IVACard.module.scss";
import { useSelector } from "react-redux";
import { commonSelector } from "@store/common";
import * as P from "@constants/PageIds";
import { authSelector } from "@store/authSlice";

interface IVACardType {
  amount?: number;
  primary?: boolean;
  modalType: "creditable" | "transferred";
  subtitle?: string;
  to?: TIVAPeriodTab;
}
export default function IVACardPerformance({
  primary = true,
  amount = 0,
  modalType,
  subtitle = "cobrado",
  to = "period_creditable",
}: IVACardType) {
  const { company } = useSelector(authSelector);
  const { periodDates } = useSelector(commonSelector);
  const currentPeriod = new URLSearchParams(location.search).get("period");

  const manageRightDates = (): string | null => {
    if (periodDates) {
      const periodDatesList = periodDates.split("|")[0];
      const ivaDate = periodDatesList.split("T");
      const year = moment(ivaDate).format("YYYY");
      if (parseInt(year) < 2023 || periodDatesList === "Todos") {
        return null;
      }
    }
    return formatDisplay(amount, DisplayType.MONEY) as string;
  };

  const currentPeriodIsYear = currentPeriod?.split("-");

  return (
    <>
      <Link
        to={`${P.IVA.path}?cid=${company}&ivaType=${to}&${
          currentPeriod
            ? `period=${
                currentPeriodIsYear && currentPeriodIsYear?.length < 2
                  ? `${currentPeriodIsYear[0]}-enero`
                  : currentPeriod
              }`
            : ""
        }`}
        className={`
        ${primary ? classes.PrimaryLeftBorder : classes.SecondaryLeftBorder}
        flex gap-x-10 items-center justify-between ms-3 cursor-pointer  hover:text-primary`}
      >
        <div className="flex flex-col ms-3">
          <Typography.Text style={{ color: "#474747", fontSize: 16, fontWeight: 500 }}>
            {modalType === "creditable" ? "Acreditable" : "Trasladado"}
          </Typography.Text>

          <Typography.Text style={{ color: "#474747", fontSize: 12, fontWeight: 500 }}>
            Efectivamente {subtitle}
          </Typography.Text>
        </div>
        {!manageRightDates() ? (
          <Typography.Title
            style={{
              fontSize: 18,
              margin: "5px 0 5px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Disponible
          </Typography.Title>
        ) : (
          <h3
            className="hover:text-primary"
            style={{
              fontSize: 20,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {manageRightDates()}
          </h3>
        )}
      </Link>
    </>
  );
}
