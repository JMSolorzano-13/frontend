import { useState, useEffect, useMemo, Key } from "react";
import { Alert, Row, Col, Input, Space, Typography, Button, Tooltip, Grid } from "antd";
import { useNavigate, useLocation } from "react-router";
import { Link } from "react-router-dom";
import PeriodSelector from "@components/PeriodSelector";
import ADDActiveRadioSelector from "@components/ADD/ActiveRadioSelector/ADDActiveRadioSelector";
import ADDTabs from "@components/ADD/ADDTabs";
import AddLastSynchDate from "@components/ADD/AddLastSynchDate";
import ADDModal from "@components/ADD/ADDModal";
import ADDEditColumns from "@components/ADD/ADDEditColumns";
import { useSelector } from "react-redux";
import { addSelector } from "@store/addSlice";
import { authSelector } from "@store/authSlice";
import { commonSelector } from "@store/common";
import parseTableMeta from "@utils/CFDI/parseTableMeta";
import useTableMeta from "@hooks/useTableMeta";
import { getCFDIsForAdd } from "@store/addSlice/getCFDIsForAdd";
import { ADD_CFDI_Types, CFDI_Types } from "@constants/Enums";
import getADDColumns from "@utils/ADD/ADDColumns";
import editSearchParams from "@utils/editSearchParams";
import { DEFAULT_ADD_TABLE_META } from "@constants/Extra";
import { getAvailableEzaudita } from "@store/addSlice/getAvailableEzaudita";
import { getAvailableADD } from "@store/addSlice/getAvailableAdd";
import { getCanceledEzaudita } from "@store/addSlice/getCanceledEzaudita";
import { getCanceledADD } from "@store/addSlice/getCanceledAdd";
import { getAvailableCanBeSend } from "@store/addSlice/getAvailableCanBeSend";
import { getAvailableCanNotBeSend } from "@store/addSlice/getAvailableCanNotBeSend";
import { getCanceledCanBeSend } from "@store/addSlice/getCanceledCanBeSend";
import { getCanceledCanNotBeSend } from "@store/addSlice/getCanceledCanNotBeSend";
import { useAppDispatch } from "@store/store";
import ExportCFDIButton from "@components/cfdis/ExportCFDIButton";
import { ColumnsType } from "antd/lib/table";
import { useCColumns } from "@hooks/useCColumns";
import getExtraCols from "@utils/ADD/getExtraCols";
import ADDTable from "@components/ADD/ADDTable";
import ADDTotalsTable from "@components/ADD/TotalsTable/ADDTotalsTable";
import usePermissions from "@hooks/usePermissions";
import { companySelector } from "@store/companySlice";
import NoDataYet from "@layouts/ADD/NoDataYet";
import moment from "moment";
import styles from "./ADDContainer.module.scss";
import * as PAGES_IDS from "@constants/PageIds";
import {
  getADDReceivedTableID,
  getADDIssuedTableID,
  getDefaultADDReceivedColumns,
  getDefaultADDIssuedColumns,
} from "@components/ADD/_utils/ADDCustomDefaultColumns";
import { blackListIdentifiers, blackListRFC } from "@utils/CFDI/fuzzy_search_blacklist";
import { DISABLE_FUZZY } from "@utils/DataFake/blockSections";
import Title from "antd/lib/typography/Title";
import { CompanyLastUpdate } from "@pages/Settings/ADD/_utils/Company_Last_Update";
import { useCOIEnabled } from "@hooks/useCOI";
import { IS_SIIGO } from '../../utils/SIIGO/Global';
import NoDataYetSiigo from "@layouts/ADD/NoDataYetSiigo";

type Props = {
  moduleID: CFDIModule;
};

const { useBreakpoint } = Grid;

export default function ADDContainer({ moduleID }: Props) {
  const getADDTableID = moduleID === "received" ? getADDReceivedTableID : getADDIssuedTableID;
  const getDefaultADDColumns =
    moduleID === "received" ? getDefaultADDReceivedColumns : getDefaultADDIssuedColumns;
  const location = useLocation();
  const [search, setSearch] = useState<string>(
    new URLSearchParams(location.search).get("search") || ""
  );
  const { coi_enabled } = useCOIEnabled()
  const { xl } = useBreakpoint();
  const [tab, setTab] = useState<ADD_CFDI_Types>(ADD_CFDI_Types.ALL);
  const table = getADDTableID(tab);
  const defaultColumns = getDefaultADDColumns(tab);
  const [modalVisible, setModalVisible] = useState(false);
  const [cfdiModalVisible, setCfdiModalVisible] = useState(false);
  const [activeRadioDomain, setActiveRadioDomain] = useState<Domain>([]);
  const dispatch = useAppDispatch();
  const { rfc, company } = useSelector(authSelector);

  const { companies } = useSelector(companySelector);

  const companyFound = companies.find((c) => c.identifier === company);

  const { datesValue } = useSelector(commonSelector);
  const navigate = useNavigate();
  const [tableMeta, setTableMeta, forceSetTableMeta] =
    useTableMeta<ADDCFDI>(DEFAULT_ADD_TABLE_META);
  const [selectedRows, setSelectedRows] = useState<Array<Key>>([]);
  const [cfdiToDisplay, setCFDIToDisplay] = useState("");
  const [cfdiOnModal, setCfdiOnModal] = useState<CFDI>();
  const [CFDITypeToRequest, setCFDITypeToRequest] = useState<CFDI_Types>(CFDI_Types.INGRESS);
  const [alert, setAlert] = useState(false);

  const {
    CFDIs,
    availableEzaudita,
    availableAdd,
    canceledAdd,
    canceledEzaudita,
    canceledCanBeSend,
    canceledCanNotBeSend,
    availableCanBeSend,
    availableCanNotBeSend,
    loadingCFDIs,
    loadingTotals,
  } = useSelector(addSelector);

  const [columns, setColumns] = useCColumns(
    getADDColumns({
      module: moduleID,
      sorter: tableMeta.sorter,
      setCFDITypeToRequest,
      setCFDIToDisplay,
    }),
    getADDTableID(tab),
    getDefaultADDColumns(tab)
  );

  const { canAccessPayroll } = usePermissions();

  const extraCols: ColumnsType<ADDCFDI> = useMemo(
    () =>
      getExtraCols({
        tab,
        setCFDIToDisplay,
        setCfdiOnModal,
        setModalVisible: setCfdiModalVisible,
        sorter: tableMeta.sorter,
        activeRadioDomain,
      }),
    [tab, tableMeta.sorter, activeRadioDomain]
  );

  const [generalColumns, setGeneralColumns] = useMemo(() => {
    return [[...extraCols, ...columns], setColumns];
  }, [columns, activeRadioDomain]);

  const allCFDIColumns = useMemo(
    () =>
      getADDColumns({
        module: moduleID,
        sorter: tableMeta.sorter,
      }),
    [moduleID, tableMeta.sorter, tab]
  );

  const fieldsToFetch = useMemo(() => {
    const defaultFields = [
      "from_xml",
      "TipoDeComprobante",
      "add_exists",
      "add_cancel_date",
      "paid_by.UUID",
      "paid_by.cfdi_related.Estatus",
      "is_issued",
    ];
    const fields = allCFDIColumns
      .map((c) => {
        const dataIndex = "dataIndex" in c ? (c.dataIndex as string) : undefined;
        if (dataIndex) {
          return dataIndex.startsWith("c_") ? `${dataIndex}.name` : dataIndex;
        }
        return undefined;
      })
      .filter((dataIndex): dataIndex is string => dataIndex !== undefined);

    return Array.from(new Set([...defaultFields, ...fields]));
  }, [allCFDIColumns, tab]);

  const updateLocationSearch = () => {
    const currentSearch = new URLSearchParams(location.search).get("search");
    if (
      (currentSearch !== search && currentSearch !== null) ||
      (currentSearch === null && search !== "")
    ) {
      navigate(
        editSearchParams(location.search, [{ key: "search", value: search }], {
          baseUrl: location.pathname,
        }),
        { replace: true }
      );
    }
  };

  // Code used to handle last company relation update
  function getLastUpdate(lastUpdateItem: string | null) {
    if (!lastUpdateItem) return undefined;

    if (lastUpdateItem.includes("last_update")) {
      return JSON.parse(lastUpdateItem).find(
        (e: CompanyLastUpdate) => e.companyIdentifier === company
      )?.last_update;
    } else {
      return lastUpdateItem;
    }
  }

  const lastUpdateItem = localStorage.getItem("LastPastoCompanyRelationUpdate");
  const lastUpdate = getLastUpdate(lastUpdateItem);

  const currentDate = moment(lastUpdate).locale("es-mx").format("YYYY-MM-DD HH:mm:ss");
  const elapsedTimeInSeconds = moment().locale("es-mx").diff(currentDate, "seconds");

  useEffect(() => {
    function loadCFDIs() {
      if (!datesValue || !rfc) return;
      if (
        (elapsedTimeInSeconds && elapsedTimeInSeconds <= 60) ||
        !companyFound?.pasto_last_metadata_sync
      )
        return;
      const { orderBy, limit, offset } = parseTableMeta<ADDCFDI>(tableMeta);
      const domain: Domain = [...activeRadioDomain];
      const overridePeriodDates =
        activeRadioDomain.find((d) => d[0] === "FechaFiltro") !== undefined;
      const currentTab = (new URLSearchParams(location.search).get("type") || "").toUpperCase();
      const tabType = ADD_CFDI_Types[currentTab as keyof typeof ADD_CFDI_Types];
      dispatch(
        getCFDIsForAdd({
          module: moduleID,
          type: tabType,
          options: {
            domain,
            orderBy,
            search: search,
            limit,
            offset,
            overridePeriodDates,
            fields: fieldsToFetch,
          },
        })
      );
    }
    loadCFDIs();
  }, [datesValue, tableMeta, activeRadioDomain, search]);

  useEffect(() => {
    updateLocationSearch();
  }, [location.search, search]);

  useEffect(() => {
    function loadTotals() {
      if (!datesValue || !rfc) return;
      if (
        (elapsedTimeInSeconds && elapsedTimeInSeconds <= 60) ||
        !companyFound?.pasto_last_metadata_sync
      )
        return;
      const domain: Domain = [...activeRadioDomain];
      const overridePeriodDates =
        activeRadioDomain.find((d) => d[0] === "FechaFiltro") !== undefined;
      dispatch(
        getAvailableEzaudita({
          module: moduleID,
          options: { domain, search: search, overridePeriodDates },
          cfdiTypes: [tab],
        })
      );
      dispatch(
        getAvailableADD({
          module: moduleID,
          options: { domain, search: search, overridePeriodDates },
          cfdiTypes: [tab],
        })
      );
      dispatch(
        getCanceledEzaudita({
          module: moduleID,
          options: { domain, search: search, overridePeriodDates },
          cfdiTypes: [tab],
        })
      );
      dispatch(
        getCanceledADD({
          module: moduleID,
          options: { domain, search: search, overridePeriodDates },
          cfdiTypes: [tab],
        })
      );

      dispatch(
        getAvailableCanBeSend({
          module: moduleID,
          options: { domain, search: search, overridePeriodDates },
          cfdiTypes: [tab],
        })
      );

      dispatch(
        getAvailableCanNotBeSend({
          module: moduleID,
          options: { domain, search: search, overridePeriodDates },
          cfdiTypes: [tab],
        })
      );
      dispatch(
        getCanceledCanBeSend({
          module: moduleID,
          options: { domain, search: search, overridePeriodDates },
          cfdiTypes: [tab],
        })
      );
      dispatch(
        getCanceledCanNotBeSend({
          module: moduleID,
          options: { domain, search: search, overridePeriodDates },
          cfdiTypes: [tab],
        })
      );
    }
    loadTotals();
  }, [tab, activeRadioDomain, search]);

  useEffect(() => {
    forceSetTableMeta({
      ...tableMeta,
      pagination: { ...tableMeta.pagination, current: 1, defaultCurrent: 1 },
    });
  }, [activeRadioDomain]);

  function manageDisableSyncButton() {
    if (datesValue && datesValue !== "Todos") {
      const values = datesValue?.split("|");
      const firstDate = moment(values[0]).add({ year: 1 }).format("MM/DD/YYYY");
      const secondDate = moment(values[1]).format("MM/DD/YYYY");
      return datesValue === "Todos" || activeRadioDomain.length !== 0 || firstDate === secondDate;
    }
    return datesValue === "Todos" || activeRadioDomain.length !== 0;
  }

  const manageCloseModal = (value: boolean) => {
    setModalVisible(value);
    setAlert(true);
  };

  if (!company) {
    return null
  }

  return (
    <>
      {(elapsedTimeInSeconds && elapsedTimeInSeconds <= 60) ? (
        <>
          {IS_SIIGO ? <NoDataYetSiigo /> : <NoDataYet />}
        </>
      ) : companyFound?.pasto_last_metadata_sync ? (
        <>
          <Row gutter={[12, 12]}>
            <div className={styles.SearchBarMenu}>
              <Col span={24} className={styles.TittleAndSyncDate}>
                <Space>
                  <Title
                    level={5}
                    style={{ fontWeight: 400 }}
                    id={moduleID === "received" ? "title-add-recibidos" : "title-add-emitidos"}
                  >
                    Conciliación {coi_enabled ? 'COI' : 'ADD'}  {moduleID === "received" ? "recibidos" : "emitidos"}
                  </Title>
                </Space>

                <AddLastSynchDate />
              </Col>
              {alert && (
                <Col span={24}>
                  <Space>
                    <Alert
                      type="success"
                      message={
                        <Typography.Text>
                          Tu petición de sincronización ha sido enviada; puedes consultar su estatus
                          desde{" "}
                          <Link
                            to={`${PAGES_IDS.ADDLOG.path}/?cid=${company}`}
                            style={{ color: "#0070b3" }}
                          >
                            Conciliación  {coi_enabled ? 'COI' : 'ADD'} / Bitácora.
                          </Link>
                        </Typography.Text>
                      }
                      style={{ marginTop: 10, marginBottom: 10 }}
                      closable
                    />
                  </Space>
                </Col>
              )}
              <Col span={24}>
                <Space className={styles.TopMainWrapper} style={{ flex: 2 }}>
                  <Space className={styles.LeftWrapper}>
                    <Space className={styles.InnerLeftWrapper}>
                      <PeriodSelector showAll={false} />
                      <Space>
                        {(rfc && blackListRFC.includes(rfc)) ||
                          (company && blackListIdentifiers.includes(company)) ||
                          DISABLE_FUZZY ? null : (
                          <Input.Search
                            id="search-input"
                            placeholder="Buscar..."
                            disabled={loadingCFDIs}
                            onSearch={setSearch}
                            allowClear
                          />
                        )}
                      </Space>

                      <Space style={{ marginLeft: 20 }}>
                        <ADDActiveRadioSelector setActiveRadioDomain={setActiveRadioDomain} />
                      </Space>
                    </Space>
                  </Space>
                  <Space
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      marginBottom: xl ? -40 : 0,
                    }}
                    className={styles.buttonSection}
                  >
                    <Space>
                      <ExportCFDIButton
                        selectedKeys={selectedRows}
                        columns={[]}
                        columnsADD={generalColumns}
                        datesValue={datesValue}
                        rfc={rfc}
                        activeRadioDomain={activeRadioDomain}
                        advancedFilterDomain={[]}
                        moduleId={moduleID}
                        tab={tab}
                        debouncedSearch={search}
                        cfdiCount={null}
                        textButton="Exportar Excel"
                        moduleType="ADD"
                      />
                      {
                        !coi_enabled && <Tooltip
                          title={`Activa el filtro "Todos" (Vigentes + Cancelados) para realizar una sincronización`}
                        >
                          <Button
                            onClick={() => setModalVisible(true)}
                            disabled={manageDisableSyncButton()}
                            type="primary"
                          >
                            Sincronizar todos
                          </Button>
                        </Tooltip>
                      }
                    </Space>
                  </Space>
                </Space>
              </Col>
            </div>

            <Col span={24}>
              <ADDTabs handleChange={setTab} />
              <Row gutter={[10, 10]} className={styles.TotalsWrapper}>
                {activeRadioDomain.length === 0 ||
                  (activeRadioDomain[0].includes("Estatus") && activeRadioDomain[0].includes("="),
                    activeRadioDomain[0].includes(true)) ? (
                  <ADDTotalsTable
                    isAvailable
                    ezauditaTotals={availableEzaudita}
                    addTotals={availableAdd}
                    canBeSend={availableCanBeSend}
                    canNotBeSend={availableCanNotBeSend}
                    loading={loadingTotals}
                    isActive={activeRadioDomain.length === 1}
                  />
                ) : null}
                {activeRadioDomain.length === 0 ||
                  (activeRadioDomain[0].includes("Estatus") &&
                    activeRadioDomain[0].includes("=") &&
                    activeRadioDomain[0].includes(false)) ? (
                  <ADDTotalsTable
                    isAvailable={false}
                    isActive={
                      activeRadioDomain.length > 0 && activeRadioDomain[0].includes("!=")
                        ? true
                        : false
                    }
                    canBeSend={canceledCanBeSend}
                    canNotBeSend={canceledCanNotBeSend}
                    ezauditaTotals={canceledEzaudita}
                    addTotals={canceledAdd}
                    loading={loadingTotals}
                  />
                ) : null}
              </Row>
              {!canAccessPayroll && tab === "N" ? null : (
                <>
                  <div className={styles.CFDIsSectionBackground}>
                    <h6>CFDIs</h6>
                    <ADDEditColumns
                      columns={getADDColumns({
                        module: moduleID,
                        sorter: tableMeta.sorter,
                      })}
                      defaultColumns={defaultColumns}
                      table={table}
                    />
                  </div>
                  <ADDTable
                    module={moduleID}
                    columns={generalColumns}
                    setColumns={setGeneralColumns}
                    dataSource={CFDIs}
                    currentTab={tab}
                    tableMeta={tableMeta}
                    setTableMeta={setTableMeta}
                    forceSetTableMeta={forceSetTableMeta}
                    setCFDIToDisplay={setCFDIToDisplay}
                    cfdiOnModal={cfdiOnModal}
                    setCfdiOnModal={setCfdiOnModal}
                    cfdiToDisplay={cfdiToDisplay}
                    setSelectedRows={setSelectedRows}
                    cfdiModalVisible={cfdiModalVisible}
                    setCfdiModalVisible={setCfdiModalVisible}
                    CFDITypeToRequest={CFDITypeToRequest}
                    setCFDITypeToRequest={setCFDITypeToRequest}
                  />
                </>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <>
          {IS_SIIGO ? <NoDataYetSiigo /> : <NoDataYet />}
        </>
      )}

      <ADDModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        moduleId={moduleID}
        debouncedSearch={search}
        manageCloseModal={manageCloseModal}
        emittedActiveCount={availableCanBeSend ? availableCanBeSend.filtered.count : 0}
        emittedCanceledCount={canceledCanBeSend ? canceledCanBeSend.filtered.count : 0}
        activeRadioDomain={activeRadioDomain}
        datesValue={datesValue}
      />
    </>
  );
}
