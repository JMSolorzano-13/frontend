import { useState, useEffect, useMemo } from "react";
import { Row, Table, Tag, Alert, Typography, Space, Button, Tooltip, message } from "antd";
import { useLocation } from "react-router";
import { FileExcelOutlined, FileSearchOutlined, MoreOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import IVACFDIColumns, { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { DEFAULT_IVA_CFDI_TABLE_META } from "@constants/Extra";
import useTableMeta from "@hooks/useTableMeta";
import Container, { PropsFromRedux } from "./IVAPageContainer";
import parseTableMeta from "@utils/CFDI/parseTableMeta";
import * as UTILS from "./_utils";
import IVADetailsModalTabs from "./_components/IVADetailsModalTabs";
import DownloadIVATables from "./_components/DownloadIVATables";
import TabsIVASelector from "./_components/TabsIVASelector";
import IVAHeader from "./_components/IVAHeader";
import { updateDoctosType, UpdateUUIDsType, type TState } from "./_types/StateTypes";
import useGetTotals from "./_hooks/useGetTotals";
import getUpdateIVADomain from "./_utils/getUpdateIVADomain";
import getTotalsToIncludeExclude from "@pages/ISR/_utils/getTotalsToIncludeExclude";
import { CFDI_Types } from "@constants/Enums";
import { optionsPagination } from "@utils/global/numberPagination";
import s from "./IVAPageContainer.module.scss";
import DoctoRelacionadoTable from "./_components/DoctoRelacionadoTable";
import { RelatedDocto } from "./_types/RelatedDocsTable";
import { DEFAULT_DOCTOS_TABLE_META } from "./_constants/DoctoRelacionadosTableMeta";
import { IVATableCFDIs } from "./_components/IVATableCFDIs";
import IVAExcludedColumns from "@utils/ADD/IVAExcludedColumns";
import { loadCFDIs, loadIVAData, loadIVADataFuzzy } from "./functions/ivaFunctions";
import { IVAAllTableCFDIs } from "./_components/IVAAllTable";
import CFDIModal from "@components/cfdis/Modal/CFDIModal";
import { ISRRecordType } from "@pages/ISR/_types/ISRTypes";
import { getUpdateDoctosDomain } from "./_utils/getExcludeDoctosDomain";
import { theme } from "antd";

const { useToken } = theme;

const IVAPage = ({ actions, iva, cfdi, auth, periodDates }: PropsFromRedux) => {
  const { token } = useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const { ivaCFDIs, isFetching, IVAExportBanner } = cfdi;
  const { doctoRelacionados, isFetchingDoctos, error, totalDoctoRelacionados } = iva;
  const [periodSelected, setPeriodSelected] = useState("");
  const [tab, setTab] = useState<TabIVAType>("ALL");
  const [type, setType] = useState("ALL");
  const [cfdiModalVisible, setCFDIModalVisible] = useState(false);
  const [cfdiToDisplay, setCFDIToDisplay] = useState("");
  const [tempSearch, setTempSearch] = useState<string>("");
  const [cfdiModalType, setCFDIModalType] = useState("normal");
  const [cfdiFromRecord, setCFDIFromRecord] = useState<ISRRecordType | CFDI | IVACFDI>();
  const [tableMeta, setTableMeta, forceSetTableMeta] = useTableMeta<IVACFDI>(
    DEFAULT_IVA_CFDI_TABLE_META
  );
  const [doctosTableMeta, setDoctosTableMeta, forceDoctosSetTableMeta] =
    useTableMeta<RelatedDocto>(DEFAULT_DOCTOS_TABLE_META);
  const [IVASection, setIVASection] = useState<"creditable" | "transferred">("transferred");
  const [topTab, setTopTab] = useState<TState>("period_transferred");
  const datesDifference = UTILS.isYearly(periodDates);
  const periodToDisplay = UTILS.managePeriodToDisplay(periodSelected, datesDifference);
  const pastPeriodToDisplay = UTILS.managePastPeriodAndDates(periodSelected, datesDifference);
  const [uuids, setUUIDs] = useState<UpdateUUIDsType>([]);
  const [doctoUUIDs, setDoctoUUIDs] = useState<updateDoctosType>([]);
  const location = useLocation();
  const memoizedLocation = useMemo(() => location, []);

  useEffect(() => {
    setTempSearch("");
  }, [tab, topTab]);

  useEffect(() => {
    setUUIDs([]);
    setDoctoUUIDs([]);
  }, [periodDates]);

  useEffect(() => {
    if (cfdi.updateSucceded) {
      loadIVAData(periodDates, tempSearch, cfdi, actions, datesDifference, setPeriodSelected);
    }
  }, [
    periodDates,
    topTab,
    memoizedLocation.search,
    cfdi.updateSucceded,
    cfdi.setPaymentSucceded,
    iva.excludeDoctosSucceded,
  ]);

  // useEffect to get CFDI data
  useEffect(() => {
    if (cfdi.updateSucceded) {
      loadCFDIs(
        periodDates,
        cfdi,
        actions,
        topTab,
        tab,
        parseTableMeta,
        doctosTableMeta,
        type,
        datesDifference,
        IVASection,
        tableMeta,
        tempSearch
      );
    }
    setCFDIModalType("normal");
  }, [
    tableMeta,
    doctosTableMeta,
    memoizedLocation.search,
    cfdi.updateSucceded,
    cfdi.setPaymentSucceded,
    iva.excludeDoctosSucceded,
  ]);

  useEffect(() => {
    forceSetTableMeta({
      ...tableMeta,
      pagination: { ...tableMeta.pagination, current: 1, defaultCurrent: 1 },
      parsedOptions: { ...tableMeta.parsedOptions, offset: 0 },
      filters: [],
      sorter: [{}],
    });
    forceDoctosSetTableMeta({
      ...doctosTableMeta,
      pagination: { ...doctosTableMeta.pagination, current: 1, defaultCurrent: 1 },
      parsedOptions: { ...doctosTableMeta.parsedOptions, offset: 0 },
      filters: [],
      sorter: [{}],
    });
  }, [tab, periodDates, topTab]);

  const totalsCount = UTILS.handleTotalsCount(datesDifference, iva.response, IVASection);

  const totalsDataContent = UTILS.manageTotalsDataContent(
    iva.response,
    datesDifference,
    periodToDisplay,
    pastPeriodToDisplay,
    IVASection
  );

  const { totalsData } = useGetTotals({
    tab,
    ivaCFDIs,
    totalsData: totalsDataContent,
    iva: iva.response,
  });

  function manageUpdateExcluded() {
    if (uuids.length > 0) {
      const updateCFDIDomain = getUpdateIVADomain(uuids);
      actions.setCFDIConfig({ uuids: updateCFDIDomain.cfdis });
      setUUIDs([]);
    }

    if (doctoUUIDs.length > 0) {
      const excludeDoctosDomain = getUpdateDoctosDomain(auth.company, doctoUUIDs, "ExcludeFromIVA");
      actions.excludeDoctos(excludeDoctosDomain);
      setDoctoUUIDs([]);
    }
  }

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error,
      });
    }
  }, [error]);

  const extraCols: ColumnsType<IVACFDI> = [
    {
      title: <FileSearchOutlined style={{ marginTop: 7, marginLeft: 3, fontSize: 17 }} />,
      key: "action",
      render: (_, record: IVACFDI) => (
        <Space style={{ display: "flex" }}>
          <Tooltip title="Ver detalles">
            <Button
              size="small"
              type="text"
              icon={<MoreOutlined />}
              onClick={() => {
                setCFDIFromRecord(record);
                setCFDIToDisplay(record.UUID);
                setCFDIModalVisible(true);
              }}
            />
          </Tooltip>
          {record.is_too_big ? (
            <div style={{ display: "flex" }}>
              <Tooltip title="Sin XML" placement="left">
                <FileExcelOutlined width={20} style={{ marginLeft: -5, marginTop: 3 }} />
              </Tooltip>
            </div>
          ) : null}
        </Space>
      ),
      fixed: true,
      align: "center",
      width: 60,
    },
  ];

  const ExportButton = () => {
    return (
      <DownloadIVATables
        issued={IVASection === "transferred"}
        iva={tab}
        totalsCount={totalsCount}
      />
    );
  };

  return (
    <>
      {contextHolder}
      <div className={s.SearchBarMenu}>
        <IVAHeader
          closeBanner={actions.closeBanner}
          exportBanner={IVAExportBanner}
          setTopTab={setTopTab}
          periodDates={periodDates}
          topTab={topTab}
          setModalType={setIVASection}
          datesDifference={datesDifference}
          tab={tab}
          doctosTableMeta={doctosTableMeta}
          forceDoctosSetTableMeta={forceDoctosSetTableMeta}
          forceSetTableMeta={forceSetTableMeta}
          tableMeta={tableMeta}
          changefuzzySearch={setTempSearch}
          fuzzySearch={tempSearch}
          loadCFDIs={() =>
            loadCFDIs(
              periodDates,
              cfdi,
              actions,
              topTab,
              tab,
              parseTableMeta,
              doctosTableMeta,
              type,
              datesDifference,
              IVASection,
              tableMeta,
              tempSearch
            )
          }
          loadTotals={() =>
            loadIVADataFuzzy(
              periodDates,
              tempSearch,
              cfdi,
              actions,
              datesDifference,
              setPeriodSelected
            )
          }
          loading={isFetching}
        />
      </div>
      <div style={{ backgroundColor: "#f4f4f4" }}>
        <TabsIVASelector
          periodToDisplay={periodToDisplay}
          ivaResponse={iva.response}
          setModalType={setIVASection}
          loading={iva.isFetchingTotals}
          topTab={topTab}
          setTopTab={setTopTab}
          setTab={(value: TabIVAType) => {
            setTab(value);
            setType(value);
          }}
        />

        <div
          style={{
            padding: 25,
            backgroundColor: "white",
          }}
        >
          <Typography style={{ fontSize: 18, marginBottom: 10, fontWeight: 500, marginTop: -10 }}>
            Detalles - IVA {IVASection === "transferred" ? "trasladado " : "acreditable "}
            efectivamente {IVASection === "transferred" ? "cobrado" : "pagado"}
          </Typography>
          <IVADetailsModalTabs
            ivaSection={IVASection}
            pastPeriodToDisplay={pastPeriodToDisplay}
            onChangeTab={setTab}
            loading={iva.isFetchingTotals}
            totalsCount={totalsCount}
            setType={setType}
            tab={tab}
            topTab={topTab}
            fuzzy_search={tempSearch}
          />

          <Row
            style={{
              paddingTop: 15,
              justifyContent: "space-between",
              backgroundColor: "white",
              marginBottom: 15,
              alignItems: "flex-end",
            }}
          >
            <Typography.Title
              style={{ paddingLeft: 15, fontSize: "16px", alignItems: "center", margin: 0 }}
            >
              {tab !== "EXCLUDED" && tab !== "MOVED" ? "Totales" : ""}
            </Typography.Title>
            {tab !== "EXCLUDED" && tab !== "MOVED" && <ExportButton />}
          </Row>

          {tab !== "EXCLUDED" && tab !== "MOVED" && (
            <>
              <Table
                size="small"
                style={{ width: "fit-content" }}
                pagination={false}
                columns={UTILS.IVATotalColumns({
                  modalType: IVASection,
                  tab,
                  setTab,
                  setType,
                  topTab,
                  token,
                })}
                scroll={{ x: "max-content" }}
                loading={iva.isFetchingTotals}
                dataSource={
                  tab === "ALL"
                    ? UTILS.getIVATotalRows({ modalType: IVASection, data: totalsDataContent })
                    : totalsData
                }
                tableLayout="auto"
                onRow={({ context }) => ({
                  onMouseEnter: (e) => {
                    if (context === "Totales") return;
                    e.currentTarget.style.color = "#0070b3";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.color = "black";
                  },
                  style: { cursor: context !== "Totales" ? "pointer" : "default" },
                })}
              />
            </>
          )}

          <div style={{ display: "flex", marginTop: 10, flexDirection: "column" }}>
            {uuids.length > 0 || doctoUUIDs.length > 0 ? (
              <Row style={{ marginTop: 10, marginBottom: 10 }}>
                <Alert
                  type="info"
                  message={
                    <Row>
                      <span>{getTotalsToIncludeExclude(uuids, doctoUUIDs)}</span>
                      <Tag
                        color={token.colorPrimary}
                        style={{ cursor: "pointer", marginLeft: 15 }}
                        onClick={manageUpdateExcluded}
                      >
                        Actualizar
                      </Tag>
                    </Row>
                  }
                />
              </Row>
            ) : null}
          </div>

          {topTab.includes("creditable") && tab === "CREDIT" ? (
            <DoctoRelacionadoTable
              dataSource={doctoRelacionados}
              loading={isFetchingDoctos}
              doctosTableMeta={doctosTableMeta}
              setDoctosTableMeta={setDoctosTableMeta}
              totalDoctoRelacionados={totalDoctoRelacionados}
              tab={tab}
              setCFDIModalVisible={setCFDIModalVisible}
              setCFDIToDisplay={setCFDIToDisplay}
              doctoUUIDs={doctoUUIDs}
              setDoctoUUIDs={setDoctoUUIDs}
            />
          ) : topTab.includes("creditable") && tab === "ALL" ? (
            <IVAAllTableCFDIs
              IVACFDIColumns={() =>
                IVAExcludedColumns({
                  tab,
                  topTab,
                  uuids,
                  setUUIDs,
                  doctoUUIDs,
                  setDoctoUUIDs,
                  setCFDIModalVisible,
                  setCFDIToDisplay,
                  sorter: tableMeta.sorter,
                })
              }
              extraCols={extraCols}
              pageSizeOptions={optionsPagination}
              topTab={topTab}
              periodSelected={periodSelected}
              tab={tab}
              setUUIDs={setUUIDs}
              isFetching={isFetching}
              uuids={uuids}
              setTableMeta={setTableMeta}
              ivaCFDIs={ivaCFDIs}
              tableMeta={tableMeta}
            />
          ) : (
            <IVATableCFDIs
              IVACFDIColumns={
                topTab.includes("creditable") && tab === "EXCLUDED"
                  ? () =>
                      IVAExcludedColumns({
                        tab,
                        topTab,
                        uuids,
                        setUUIDs,
                        doctoUUIDs,
                        setDoctoUUIDs,
                        setCFDIModalVisible,
                        setCFDIToDisplay,
                        sorter: tableMeta.sorter,
                      })
                  : IVACFDIColumns
              }
              extraCols={extraCols}
              pageSizeOptions={optionsPagination}
              topTab={topTab}
              periodSelected={periodSelected}
              tab={tab}
              setUUIDs={setUUIDs}
              isFetching={isFetching}
              uuids={uuids}
              setTableMeta={setTableMeta}
              ivaCFDIs={ivaCFDIs}
              tableMeta={tableMeta}
            >
              <ExportButton />
            </IVATableCFDIs>
          )}
        </div>
      </div>

      {cfdiModalVisible && (
        <CFDIModal
          visible={cfdiModalVisible}
          setVisible={setCFDIModalVisible}
          cfdi={cfdiFromRecord}
          setCFDI={setCFDIFromRecord}
          cfdiToDisplay={cfdiToDisplay}
          setCFDIToDisplay={setCFDIToDisplay}
          modalType={cfdiModalType}
          setCFDIModalType={setCFDIModalType}
          CFDITypeToRequest={
            cfdiFromRecord ? (cfdiFromRecord?.TipoDeComprobante as CFDI_Types) : CFDI_Types.PAYMENT
          }
          ivaType="IVA"
          uuidsToExclude={uuids}
        />
      )}
    </>
  );
};

export default Container(IVAPage);
