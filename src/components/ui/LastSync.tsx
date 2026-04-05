import * as P from "@constants/PageIds";
import { useSelector } from "react-redux";
import { satSelector } from "@store/satSlice";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import useSubscriptionData from "@hooks/useSubscriptionData";
import s from "@components/ui/LastSync.module.scss";
import { useNavigate } from "react-router-dom";
import { authSelector } from "@store/authSlice";
import { Spin } from "antd";
import { IS_SIIGO } from "@utils/SIIGO/Global";

export default function LastSync() {
  const { newSatLog, manualSync, fetchingNewSatLog, isLoading } = useSelector(satSelector);
  const { stripeStatus } = useSubscriptionData();
  const { company, rfc, token, isLogged, isFetching } = useSelector(authSelector);
  const navigate = useNavigate();
  const dateToShow = newSatLog ? formatDisplay(manualSync.lastSyncDate, DisplayType.SIIGO) : "";
  const allDays = newSatLog.days;

  const allDaysHaveIncomplete = allDays.some((day) => day.status === "INCOMPLETE");
  const allDaysHaveMayHaveMissing = allDays.some((day) => day.status === "MAY_HAVE_MISSING");

  const downloadComplete =
    manualSync.allProcessed &&
    allDays.length > 0 &&
    !allDaysHaveIncomplete &&
    !allDaysHaveMayHaveMissing;

  const hasValidSuscription = stripeStatus === "active" || stripeStatus === null;

  const displayDate = IS_SIIGO
    ? downloadComplete && !fetchingNewSatLog
    : downloadComplete && !fetchingNewSatLog && hasValidSuscription;

  const canClick = IS_SIIGO ? true : hasValidSuscription;

  const isComplete = downloadComplete ? s.CompleteDot : s.IncompleteDot;

  if (isLoading || fetchingNewSatLog || (company && !rfc) || (!isLogged && token) || isFetching) {
    return (
      <>
        <Spin />
      </>
    );
  }

  return (
    <div
      className={s.LastSyncContainer}
      onClick={
        canClick
          ? () => navigate(`${P.SAT.path}/?cid=${company}`)
          : () => {
              return null;
            }
      }
    >
      <div className={s.LastSyncDotContainer}>
        <div className={`${s.LastSyncDotStatus} ${isComplete}`}></div>
      </div>
      <div className={s.LastSyncInfoContainer}>
        <p style={{ fontSize: "14px", lineHeight: "24px", cursor: "pointer" }}>
          {downloadComplete ? "Descarga completada" : "Descarga pendiente"}
        </p>
        {displayDate && !isLoading ? (
          <p
            style={{
              fontSize: "12px",
              lineHeight: "16px",
              fontWeight: 400,
              letterSpacing: 0,
              marginBottom: 2,
            }}
          >
            {dateToShow}
          </p>
        ) : null}
      </div>
    </div>
  );
}
