import { useEffect, useState } from "react";
import { SyncOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import * as P from "@constants/PageIds";
import useTableMeta from "@hooks/useTableMeta";
import ISRTabHeader from "./ISRTabHeader";
import { ISRPropsFromRedux } from "../_types/ISRStateTypes";
import {
  DoctosToUpdateType,
  InternalTabType,
  ISRRecordType,
  ISRTotalsResponseType,
  TabType,
  TopTabSectionType,
  UUIDsToUpdateType,
} from "../_types/ISRTypes";
import s from "../_styles/ISR.module.scss";
import { Alert, Row, Tag, Typography, message } from "antd";
import ISRDetailsTabs from "./ISRDetailsTabs";
import TotalsTable from "./TotalsTable";
import ISRCFDITable from "./ISRCFDITable";
import Container from "../_components/ISRPageContainer";
import getPeriodToSend from "../_utils/getPeriodToSend";
import getDatesAreEqual from "../_utils/getDatesAreEqual";
import getISRDomain from "../_utils/getISRDomain";
import { DEFAULT_ISR_TABLE_META } from "../_constants/ISRCFDIs";
import parseTableMeta from "@utils/CFDI/parseTableMeta";
import { getCFDITableHeader, getCFDITableHeaderDeductions } from "../_utils/getCFDITableHeader";
import DownloadISRTables from "./DownloadISRTables";
import getTotalsToIncludeExclude from "../_utils/getTotalsToIncludeExclude";
import PeriodSelector from "@components/PeriodSelector";
import getPeriodTypeAndDate from "../_utils/getPeriodTypeAndDate";
import Title from "antd/lib/typography/Title";
import { theme } from "antd";
import { tailwindColors } from "@utils/tailwindColors";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";
import { ISRTotalTable } from "./ISRTotalTable";
import ISRDetailsTabsDeductions from "./ISRDetailsTabsDeductions";
import { ISRInternalTabs } from "./ISRInternalTabs";
import getUpdateCFDIDomain from "../_constants/getUpdateCFDIDomain";
import { isPaymentColumn } from "../_utils/ISRColumnsDeductions";
import { getUpdateDoctosDomain } from "@pages/IVA/_utils/getExcludeDoctosDomain";

const { useToken } = theme;

function ISRPage({ actions, isr, cfdi, auth, periodDates }: ISRPropsFromRedux) {
  const { token } = useToken();
  const { company } = useSelector(authSelector);
  const [messageApi, contextHolder] = message.useMessage();
  const [topTab, setTopTab] = useState<TopTabSectionType>("incomes");
  const [tab, setTab] = useState<TabType>("ALL");
  const isDeductionsTab = topTab === "deductions" && tab === "ALL";
  const [internalTab, setInternalTab] = useState<InternalTabType>("DISCOUNTS-INCOMES");
  const [ISRTableMeta, setISRTableMeta, forceISRTableMeta] =
    useTableMeta<ISRRecordType>(DEFAULT_ISR_TABLE_META);
  const [uuidsToUpdate, setUUIDSToUpdate] = useState<UUIDsToUpdateType>([]);
  const [doctosToUpdate, setDoctosToUpdate] = useState<DoctosToUpdateType>([]);
  const { periodType, selectedDate } = getPeriodTypeAndDate(periodDates);

  useEffect(() => {
    if (isr.ISRCFDIsError) {
      messageApi.error("Ocurrió un error al cargar los CFDIs");
    }

    if (isr.updateCFDIError) {
      message.error("Ocurrió un error al excluir los CFDIs");
    }
  }, [isr.ISRCFDIsError, isr.updateCFDIError]);

  // useEffect to set TopTab when changing period
  useEffect(() => {
    if (periodType && periodType === "month" && topTab.includes("year")) {
      setTopTab("incomes");
    }
    setUUIDSToUpdate([]);
  }, [periodDates]);

  // useEffect Totals for Incomes
  useEffect(() => {
    if (topTab === "incomes") {
      const datesAreEqual = getDatesAreEqual(selectedDate, periodType);
      if (
        selectedDate &&
        ((selectedDate !== "" && datesAreEqual) || isr.updateSucceded || cfdi.setPaymentSucceded)
      ) {
        const periodToSend = getPeriodToSend(periodType, selectedDate);
        if (periodToSend) {
          const ISRDomain = getISRDomain({
            company: auth.company,
            topTab: topTab,
            tab: tab,
            internalTab: internalTab,
            date: selectedDate,
            periodType: periodType,
          });
          actions.getISRTotals({
            company: auth.company,
            period: periodToSend,
            isr_topTab: topTab,
            domain: ISRDomain,
          });
        }
      }
    }
  }, [periodDates, selectedDate, isr.updateSucceded, cfdi.setPaymentSucceded, topTab]);

  // useEffect Totals for Deductions
  useEffect(() => {
    const periodToSend = getPeriodToSend(periodType, selectedDate);
    const filters = ISRTableMeta.filters;
    const ISRDomain = getISRDomain({
      company: auth.company,
      topTab: topTab,
      tab: tab,
      internalTab: internalTab,
      date: selectedDate,
      periodType: periodType,
      filters: filters,
    });

    if (
      (topTab === "deductions" && isDeductionsTab && periodToSend) ||
      (topTab === "deductions" && periodToSend)
    ) {
      actions.getISRTotalsDeductions({
        company: auth.company,
        period: periodToSend,
        isr_topTab: topTab,
        domain: ISRDomain,
      });
    }

    if (topTab === "deductions" && !isDeductionsTab && periodToSend) {
      actions.getISRTotals({
        company: auth.company,
        period: periodToSend,
        isr_topTab: topTab,
        domain: ISRDomain,
        tab: tab,
        internalTab: internalTab,
      });
    }
  }, [
    periodDates,
    selectedDate,
    isr.updateSucceded,
    // cfdi.setPaymentSucceded,
    ISRTableMeta.filters,
  ]);

  // CFDIs Deductions & Incomes
  useEffect(() => {
    if (!isDeductionsTab) {
      const datesAreEqual = getDatesAreEqual(selectedDate, periodType);
      if (
        selectedDate &&
        ((selectedDate !== "" && datesAreEqual) || isr.updateSucceded || cfdi.setPaymentSucceded)
      ) {
        const filters = ISRTableMeta.filters;
        const ISRDomain = getISRDomain({
          company: auth.company,
          topTab: topTab,
          tab: tab,
          internalTab: internalTab,
          date: selectedDate,
          periodType: periodType,
          filters: filters,
        });
        const { orderBy, limit, offset } = parseTableMeta<ISRRecordType>(ISRTableMeta);
        actions.getISRCFDIs({
          domain: ISRDomain,
          limit,
          offset,
          orderBy,
          tab: tab,
          topTab: topTab,
          internalTab: internalTab,
        });
      }
    }
  }, [periodDates, ISRTableMeta, selectedDate, isr.updateSucceded, cfdi.setPaymentSucceded]);

  useEffect(() => {
    const fieldToSort =
      isPaymentColumn(tab, internalTab) && topTab === "deductions" ? "FechaPago" : "Fecha";

    forceISRTableMeta({
      ...ISRTableMeta,
      sorter: [
        {
          column: {
            dataIndex: fieldToSort,
          },
          columnKey: fieldToSort,
          order: "ascend",
          field: fieldToSort,
        },
      ],
      pagination: { ...ISRTableMeta.pagination, current: 1, defaultCurrent: 1 },
      filters: [],
    });
  }, [topTab, tab, internalTab, periodDates]);

  function handleExcludeCFDIs() {
    if (uuidsToUpdate.length > 0) {
      const updateCFDIDomain = getUpdateCFDIDomain(auth.company, uuidsToUpdate);
      actions.updateISRCFDI(updateCFDIDomain);
      setUUIDSToUpdate([]);
    }
    if (doctosToUpdate.length > 0) {
      // We use the same 'getUpdateCFDIDomain' because the field is the same
      const updateDoctosDomain = getUpdateDoctosDomain(
        auth.company,
        doctosToUpdate,
        "ExcludeFromISR"
      );
      actions.updateISRDoctos(updateDoctosDomain);
      setDoctosToUpdate([]);
    }
  }

  return (
    <>
      {isr.showISRExportBanner ? (
        <Alert
          type="success"
          message={
            <span>
              Tu petición ha sido enviada; ve al menú{" "}
              <Link
                to={`${P.MASSIVEEXPORT.path}/?cid=${company}&tab=isr`}
                style={{ color: tailwindColors.primary }}
                onClick={() => actions.closeBanner()}
              >
                Exportaciones
              </Link>{" "}
              para realizar la descarga.
            </span>
          }
          style={{ marginBottom: 10 }}
          onClose={() => actions.closeBanner()}
          closable
        />
      ) : null}
      {contextHolder}
      <div className={s.SearchBarMenu}>
        <Title level={5} style={{ fontWeight: 400 }} id="title-isr">
          ISR base flujo
        </Title>
        <Row justify="space-between" align="middle">
          <PeriodSelector />
          <Tag color="warning">
            <span style={{ color: "#5F5F5F" }}>
              <b>IMPORTANTE: </b> No están considerados CFDIs de pago 1.0
            </span>
          </Tag>
        </Row>
      </div>
      <ISRTabHeader
        date={selectedDate}
        currentTopTab={topTab}
        setTopTab={setTopTab}
        totals={isr.ISRTotals}
        totalsDeductions={isr.ISRTotalsDeductionsTable?.totals_table || []}
        loading={isr.fetchingTotals}
        periodType={periodType}
        setTab={setTab}
        company={auth?.company || ""}
        period={getPeriodToSend(periodType, selectedDate) || ""}
      />
      <div className={s.ContentContainer}>
        <Typography className={s.ContentTitle}>
          Detalles - {topTab.includes("incomes") ? "Ingresos acumulables " : "Deducciones "}
          {topTab.includes("incomes") ? "efectivamente cobrados" : ""}
        </Typography>
        {topTab === "deductions" ? (
          <ISRDetailsTabsDeductions
            date={selectedDate}
            currentTopTab={topTab}
            tab={tab}
            setTab={setTab}
            loading={isr.fetchingTotalsDeductionsTabs}
            data={isr.ISRTotalsDeductionsTable}
            periodType={periodType}
            setInternalTab={setInternalTab}
          />
        ) : (
          <ISRDetailsTabs
            date={selectedDate}
            currentTopTab={topTab}
            tab={tab}
            setTab={setTab}
            loading={isr.fetchingTotals}
            data={isr.ISRTotals as ISRTotalsResponseType}
            periodType={periodType}
            setInternalTab={setInternalTab}
          />
        )}
        {topTab === "deductions" && (
          <ISRInternalTabs
            tab={tab}
            setInternalTab={setInternalTab}
            loading={isr.fetchingTotalsDeductionsTabs}
            data={isr.ISRTotalsDeductionsTable}
            periodType={periodType}
            internalTab={internalTab}
          />
        )}

        <Row className={tab !== "EXCLUDED" ? s.TableTitleRow : s.TableTitleRow_Title}>
          <h6 style={{ paddingLeft: 15 }}>{tab !== "EXCLUDED" ? "Totales" : ""}</h6>
          {selectedDate && (
            <DownloadISRTables
              date={selectedDate}
              issued={topTab.includes("incomes")}
              tab={tab}
              isExercise={periodType === "year" || topTab.includes("exercise")}
              periodType={periodType}
              topTab={topTab}
              internalTab={internalTab}
              cfdis={isr.ISRCFDIs}
            />
          )}
        </Row>
        {isDeductionsTab && (
          <ISRTotalTable
            data={isr.ISRTotalsDeductionsTable?.totals_table || []}
            tab={tab}
            internalTab={internalTab}
            setTab={setTab}
            setInternalTab={setInternalTab}
            company={auth.company || ""}
            period={selectedDate || ""}
            updatePercentageDeductions={actions.updatePercentageDeductions}
            loading={isr.fetchingTotals}
          />
        )}

        {tab !== "EXCLUDED" && !isDeductionsTab ? (
          <>
            <TotalsTable
              topTab={topTab}
              tab={tab}
              data={topTab === "deductions" ? isr.ISRTotalsDeductions : isr.ISRTotals}
              loading={isr.fetchingTotalsDeductions}
              date={selectedDate}
              periodType={periodType}
              internalTab={internalTab}
              setTab={setTab}
            />{" "}
          </>
        ) : null}

        <Row className={s.TableTitleRow_Title}>
          {!isDeductionsTab && (
            <h6
              style={{
                padding: 15,
                marginTop: tab === "EXCLUDED" ? -50 : 0,
              }}
            >
              {" "}
              {topTab === "deductions"
                ? getCFDITableHeaderDeductions(tab, internalTab)
                : getCFDITableHeader(tab)}
            </h6>
          )}
        </Row>
        {(uuidsToUpdate.length > 0 || doctosToUpdate.length > 0) && (
          <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Alert
              type="info"
              message={
                <Row>
                  <span>{getTotalsToIncludeExclude(uuidsToUpdate, doctosToUpdate)}</span>
                  <Tag
                    icon={isr.isUpdatingCFDI ? <SyncOutlined spin /> : null}
                    color={token.colorPrimary}
                    style={{ cursor: "pointer", marginLeft: 15 }}
                    onClick={handleExcludeCFDIs}
                  >
                    Actualizar
                  </Tag>
                </Row>
              }
            />
          </Row>
        )}
        {!isDeductionsTab && (
          <ISRCFDITable
            tab={tab}
            topTab={topTab}
            data={isr.ISRCFDIs}
            dataQty={isr.ISRTotalCFDIs}
            tableMeta={ISRTableMeta}
            setTableMeta={setISRTableMeta}
            loading={isr.fetchingCFDIs}
            uuidsToUpdate={uuidsToUpdate}
            setUUIDSToUpdate={setUUIDSToUpdate}
            internalTab={internalTab}
            doctosToUpdate={doctosToUpdate}
            setDoctosToUpdate={setDoctosToUpdate}
          />
        )}
      </div>
    </>
  );
}

export default Container(ISRPage);
