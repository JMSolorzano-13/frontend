import { Card, Col, Row, Spin, Statistic } from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CFDI_Types } from "@constants/Enums";
import { useDebounce } from "@hooks/useDebounce";
import { cfdiSelector, removeValidationTotalsId } from "@store/cfdiSlice";
import { getTotals } from "@store/cfdiSlice/getTotals";
import { commonSelector } from "@store/common";
import ValidationModal from "./ValidationModal";
import { EditModeContext } from "./Validations";
import { useAppDispatch } from "@store/store";
import styles from "./ValidationCard.module.scss";
import moment from "moment";
import { tailwindColors } from "@utils/tailwindColors";
import { IS_SIIGO } from "@utils/SIIGO/Global";

type Props = {
  validationId: string;
  group: string;
  title: string;
  subtitle?: string;
  validationDomain: Domain;
  cfdiTypes: CFDI_Types[];
};

export default function ValidationCard(props: Props) {
  const { title, group, validationDomain, validationId, cfdiTypes, subtitle } = props;
  const dispatch = useAppDispatch();
  const { datesValue } = useSelector(commonSelector);
  const { validationCFDIs } = useSelector(cfdiSelector);
  const [debouncedVisible, visible, setVisible] = useDebounce(false, 500);
  const editMode = useContext(EditModeContext);
  const [isBefore2023, setIsBefore2023] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!editMode && datesValue) {
      dispatch(removeValidationTotalsId(validationId));
      dispatch(
        getTotals({
          module: "validation-simple",
          validationId,
          options: { domain: validationDomain },
          cfdiTypes,
        })
      );
    }
    if (datesValue) {
      const dates = datesValue.split("|");
      if (moment(dates[0]).year() + 1 < 2023) {
        setIsBefore2023(true);
      } else {
        setIsBefore2023(false);
      }
    }
  }, [dispatch, validationId, datesValue, editMode]);

  const [month, exercise] = useMemo(() => {
    const totals = validationCFDIs.totals[validationId];
    if (!totals) return [null, null];

    let month = totals?.filtered.count ?? 0;

    let exercise = totals?.excercise.count ?? 0;

    if (validationId === "recibidosIngresoPUENoBancarizado" && datesValue) {
      if (isBefore2023) {
        month = 0;
        exercise = 0;
      }
    }

    return [month, exercise];
  }, [validationCFDIs, validationId]);

  const isPeriodAYear = () => (datesValue?.split("|").length as number) === 2;

  return (
    <>
      <Card
        className={`${styles.validationCard} ${IS_SIIGO ? "siigo" : "ezaudita"}`}
        size="small"
        headStyle={{
          borderBottom: isHovered
            ? `1px solid ${IS_SIIGO ? tailwindColors.sg_primary["500"] : tailwindColors.primary}`
            : "1px solid #e5e7eb",
        }}
        title={
          <div style={{ width: "100%", margin: "1rem 0" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: isHovered
                  ? IS_SIIGO
                    ? tailwindColors.sg_primary["500"]
                    : tailwindColors.primary
                  : "#000",
              }}
            >
              {title}
            </p>
            <p style={{ fontSize: "12px", color: "#878787", marginTop: "5px" }}>{subtitle}</p>
          </div>
        }
        onClick={() => {
          if (month === null || exercise === null) return;
          setVisible(true);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        hoverable
      >
        <Row gutter={24}>
          {(month != null && exercise != null) || editMode ? (
            <>
              <Col span={12}>
                <span data-test={`${validationId}-month-statistic`}>
                  <div style={{ opacity: isPeriodAYear() ? "0.3" : "1" }}>
                    <Statistic title="Periodo" value={month ?? 99999} />
                  </div>
                </span>
              </Col>
              <Col span={12}>
                <Statistic
                  className=""
                  title={isPeriodAYear() ? "Ejercicio" : "Acumulado"}
                  value={exercise ?? 99999}
                />
              </Col>
            </>
          ) : (
            <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
              <Spin size="large" />
            </Col>
          )}
        </Row>
      </Card>
      {debouncedVisible || visible ? (
        <ValidationModal
          validationDomain={validationDomain}
          cfdiTypes={cfdiTypes}
          validationId={validationId}
          visible={visible}
          setVisible={setVisible}
          title={`${group} - ${title}`}
          exportName={{
            group,
            subtitle: subtitle as string,
          }}
        />
      ) : null}
    </>
  );
}
