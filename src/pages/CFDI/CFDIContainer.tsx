import { Key, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { ColumnsType } from "antd/lib/table";
import { Button, Col, Row, Space, Table, Tabs, message, Input, theme } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import columns, { paymentsColumns } from "@utils/CFDI/columns";
import { cfdiSelector, cleanErrors, updateReceivedCFDIsByID } from "@store/cfdiSlice";
import { updateIssuedCFDIsByID } from "@store/cfdiSlice";
import { getCFDIs } from "@store/cfdiSlice/getCFDIs";
import { commonSelector } from "@store/common";
import PeriodSelector from "@components/PeriodSelector";
import getTotalsRows, { getPayrollTotalsRows } from "@utils/CFDI/getTotalRows";
import { getTotals } from "@store/cfdiSlice/getTotals";
import getDataColumns from "@utils/CFDI/dataColumns";
import { authSelector } from "@store/authSlice";
import TableColumnsEditorModal from "@components/columns/TableColumnsEditorModal";
import { CFDI_Types, Tables } from "@constants/Enums";
import {
  CFDI_PAYMENTS_TOTALS_COLUMNS,
  CFDI_TOTALS_DEFAULT_COLUMNS,
  CFDI_TOTALS_PAYROLL_COLUMNS,
} from "@constants/DefaultColumns";
import CFDIActiveRadioSelector from "@components/cfdis/CFDIActiveRadioSelector";
import useTableMeta from "@hooks/useTableMeta";
import CFDIAdvancedFilter from "@components/cfdis/CFDIAdvancedFilter";
import editSearchParams from "@utils/editSearchParams";
import usePermissions from "@hooks/usePermissions";
import CFDIAdvancedFilterTags from "@components/cfdis/CFDIAdvancedFilterTags";
import { DEFAULT_CFDI_TABLE_META, DEFAULT_PAYROLL_CFDI_TABLE_META } from "@constants/Extra";
import ExportCFDIButton from "@components/cfdis/ExportCFDIButton";
import parseTableMeta from "@utils/CFDI/parseTableMeta";
import useCFDICColumns from "@hooks/cfdis/useCFDICColumns";
import s from "./CFDIContainer.module.scss";
import getExtraCols from "@utils/CFDI/getExtraCols";
import { getCFDICount } from "@store/cfdiSlice/getCFDICount";
import CFDIPPDInvoiceSelector from "@components/cfdis/CFDIPPDInvoiceSelector";
import CFDIModal from "@components/cfdis/Modal/CFDIModal";
import { getPaymentsCount } from "@store/cfdiSlice/getPaymentsCount";
import { useAppDispatch } from "@store/store";
import CFDITablesColumnEditorModal from "@components/columns/CFDITablesColumnEditorModal";
import { setCFDIConfig } from "@store/cfdiSlice/setCFDIConfig";
import MassiveExportView from "@components/cfdis/ExportSection/MassiveExportView";
import {
  getDefaultIssuedColumns,
  getDefaultReceivedColumns,
} from "@utils/IVA/CFDICustomDefaultColumns";
import getCFDITotalColumns from "@utils/CFDITotalTable/getCFDITotalColumns";
import CFDIDefaultTable from "@components/cfdis/CFDIDefaultTable";
import CFDIPayrollTable from "@components/cfdis/CFDIPayrollTable";
import payrollTotalColumns from "@utils/CFDI/PayrollTotalColumns";
import { getPayrollTotals } from "@store/cfdiSlice/getPayrollTotals";
import { UpdateUUIDsType } from "@pages/IVA/_types/StateTypes";
import getUpdateIVADomain from "@pages/IVA/_utils/getUpdateIVADomain";
import getCFDITabs from "@utils/CFDI/getCFDITabs";
import { blackListIdentifiers, blackListRFC } from "@utils/CFDI/fuzzy_search_blacklist";
import Title from "antd/lib/typography/Title";
import getDetailsColumns from "@utils/CFDI/getDetailsColumns";
import { IS_SIIGO } from "@utils/SIIGO/Global";
import ModalPolicies from "./components/policies/ModalPolicies";
import ModalAttachments from "./components/attachments/ModalAttachments";
import { useBasicPlan } from "@hooks/useBasicPlan";

type Props = {
  moduleID: CFDIModule;
  children?: React.ReactNode;
};

const { useToken } = theme;

export default function CFDIContainer({ moduleID }: Props) {
  const { token } = useToken();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { canAccessPayroll } = usePermissions();
  const {
    issuedCFDIs,
    receivedCFDIs,
    error,
    isFetching,
    isFetchingTotals,
    isFetchingCFDICount,
    isFetchingPayCFDICount,
    cfdiCount,
    payCfdiCount,
    payroll,
    updateAttachments
  } = useSelector(cfdiSelector);

  const cfdis = moduleID === "received" ? receivedCFDIs : issuedCFDIs;
  const titlePage = moduleID === "received" ? "recibidos" : "emitidos";
  const [tab, setTab] = useState<CFDI_Types>(() => {
    const tab = (new URLSearchParams(location.search).get("type") || "").toUpperCase();
    const tabType = CFDI_Types[tab as keyof typeof CFDI_Types];
    if (tabType) {
      if (tabType === CFDI_Types.PAYROLL && !canAccessPayroll) {
        return CFDI_Types.INGRESS;
      }

      return tabType;
    }
    return CFDI_Types.INGRESS;
  });
  const [CFDIToDisplay, setCFDIToDisplay] = useState("");
  const { rfc, company } = useSelector(authSelector);
  const { datesValue } = useSelector(commonSelector);
  const [search, setSearch] = useState<string>(
    new URLSearchParams(location.search).get("search") || ""
  );
  const [tempSearch, setTempSearch] = useState<string>(
    new URLSearchParams(location.search).get("search") || ""
  );

  const [isInputFocused, setIsInputFocus] = useState(false);

  const [tableMeta, setTableMeta, forceSetTableMeta] = useTableMeta<CFDI>(DEFAULT_CFDI_TABLE_META);
  const [payrollTableMeta, setPayrollTableMeta, forceSetPayrollTableMeta] = useTableMeta<CFDI>(
    DEFAULT_PAYROLL_CFDI_TABLE_META
  );

  const defaultColumns =
    moduleID === "issued" ? getDefaultIssuedColumns(tab) : getDefaultReceivedColumns(tab);

  const cfdiColumns = useCFDICColumns(
    moduleID,
    defaultColumns,
    tab === "N" ? payrollTableMeta.sorter : tableMeta.sorter,
    tab,
    token
  );

  const [uuidsToModify, setUUIDsToModify] = useState<UpdateUUIDsType>([]);

  const [activeRadioDomain, setActiveRadioDomain] = useState<Domain>([["Estatus", "=", true]]);
  const [customDomain, setCustomDomain] = useState<Domain>([]);
  const [advancedFilterDomain, setAdvancedFilterDomain] = useState<Domain>([]);
  const [selectedRows, setSelectedRows] = useState<Array<Key>>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Array<Key>>([]);
  const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
  const { isDownloadPlan } = useBasicPlan()
  // eslint-disable-next-line
  let keys: Array<Key> = [];

  // MODAL VARIABLES
  const [modalVisible, setModalVisible] = useState(false);
  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  const [attachmentsModalVisible, setAttachmentsModalVisible] = useState(false);
  const [cfdiOnModal, setCfdiOnModal] = useState<CFDI>();
  const [cfdiModalType, setCFDIModalType] = useState("normal");
  const [CFDITypeToRequest, setCFDITypeToRequest] = useState<CFDI_Types>(CFDI_Types.INGRESS);
  const firstRender = useRef(true);
  const tabRender = useRef(true);

  const allCFDIColumns = useMemo(
    () =>
      getDataColumns({
        module: moduleID,
        sorter: tableMeta.sorter,
        tab: tab,
        uuidsToModify,
        setUUIDsToModify,
        setPolicyModalVisible,
        setAttachmentsModalVisible,
        token,
        isDownloadPlan
      }),
    [moduleID, tableMeta.sorter, tab, uuidsToModify, setUUIDsToModify]
  );

  const fieldsToFetch = useMemo(() => {
    const defaultFields = [
      "FechaCancelacion",
      "from_xml",
      "TipoDeComprobante",
      "cfdi_related.Estatus",
      "cfdi_related.TipoDeComprobante",
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

    const finalFields =
      fields.includes("polizas") && IS_SIIGO
        ? fields
          .filter((f) => f !== "polizas")
          .concat(["polizas.fecha", "polizas.numero", "polizas.tipo", "polizas.identifier"])
        : fields;

    return Array.from(new Set([...defaultFields, ...finalFields]));
  }, [allCFDIColumns, tab]);

  useEffect(() => {
    if (uuidsToModify.length > 0) {
      const getUUIDsToModifyDomain = getUpdateIVADomain(uuidsToModify);
      dispatch(setCFDIConfig({ uuidsToModify: getUUIDsToModifyDomain.cfdis }));
      if (moduleID === "received") {
        dispatch(updateReceivedCFDIsByID(uuidsToModify));
      } else {
        dispatch(updateIssuedCFDIsByID(uuidsToModify));
      }
      setUUIDsToModify([]);
    }
  }, [uuidsToModify]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(cleanErrors());
    }
  }, [error]);

  // Update function for location search params
  const updateLocationSearch = () => {
    const currentSearch = new URLSearchParams(location.search).get("search");
    const currentType = new URLSearchParams(location.search).get("type");
    const newType = Object.keys(CFDI_Types)[Object.values(CFDI_Types).indexOf(tab)].toLowerCase();
    if (
      (currentSearch !== search && currentSearch !== null) ||
      (currentSearch === null && search !== "") ||
      currentType !== newType
    ) {
      navigate(
        editSearchParams(
          location.search,
          [
            { key: "search", value: search },
            {
              key: "type",
              value: Object.keys(CFDI_Types)[Object.values(CFDI_Types).indexOf(tab)].toLowerCase(),
            },
          ],
          { baseUrl: location.pathname }
        ),
        { replace: true }
      );
    }
  };

  // Extra cols for search table
  const extraCols: ColumnsType<CFDI> = useMemo(
    () =>
      getExtraCols({
        setCfdiOnModal,
        setModalVisible,
        setCFDIToDisplay,
        setCFDITypeToRequest,
        tab,
        activeRadioDomain,
        sorter: tableMeta.sorter,
      }),
    [activeRadioDomain, tableMeta.sorter, tab]
  );

  const {
    detailsExpandedColumns,
    detailsTableId,
    detailsDefaultColumns,
    detailsColumns,
    setDetailsColumns,
  } = getDetailsColumns(tab, moduleID);

  const [generalDetailsColumns] = useMemo(() => {
    return [[...detailsColumns], setDetailsColumns];
  }, [detailsColumns, tab]);

  //  Columns that are displayed on search
  const [generalColumns, setGeneralColumns, columnEditModalID] = useMemo(() => {
    const columnsData = cfdiColumns[tab];
    return [[...extraCols, ...columnsData.columns], columnsData.setColumns, columnsData.tableId];
  }, [tab, cfdiColumns, extraCols]);

  // useEffect for CFDICount
  useEffect(() => {
    if (!datesValue || !rfc) return;
    if (search.length > 0 || advancedFilterDomain.length > 0) return;
    const domain: Domain = [...activeRadioDomain, ...advancedFilterDomain];
    const paymentsDomain: Domain = [...activeRadioDomain, ...advancedFilterDomain, ...customDomain];
    const overridePeriodDates = activeRadioDomain.find((d) => d[0] === "FechaFiltro") !== undefined;

    dispatch(
      getCFDICount({
        module: moduleID,
        options: { domain, search: search, overridePeriodDates },
        cfdiType: tab,
      })
    );

    if (customDomain.length > 0) {
      dispatch(
        getPaymentsCount({
          module: moduleID,
          options: {
            domain: paymentsDomain,
            search: search,
            overridePeriodDates,
          },
          cfdiType: tab,
        })
      );
    }
  }, [activeRadioDomain, rfc, customDomain, tab, search, advancedFilterDomain]);

  // useEffect for totals table
  useEffect(() => {
    if (!datesValue || !rfc) return;
    if (tab === "N") {
      loadPayrollTotals();
    } else {
      const domain: Domain = [...activeRadioDomain, ...advancedFilterDomain];
      if (tab === "I") {
        domain.push(...customDomain);
      }
      const overridePeriodDates =
        activeRadioDomain.find((d) => d[0] === "FechaFiltro") !== undefined;
      dispatch(
        getTotals({
          module: moduleID,
          options: { domain, search: search, overridePeriodDates },
          cfdiTypes: [tab],
        })
      );
      setSelectedRows([]);
    }
  }, [search, activeRadioDomain, rfc, advancedFilterDomain, customDomain, tab]);

  // useEffect for search table
  useEffect(() => {
    if (!datesValue || !rfc) return;
    const { orderBy, limit, offset } =
      tab !== "N" ? parseTableMeta<CFDI>(tableMeta) : parseTableMeta<CFDI>(payrollTableMeta);
    const domain: Domain = [...activeRadioDomain, ...advancedFilterDomain];
    if (tab === "I") {
      domain.push(...customDomain);
    }
    const overridePeriodDates = activeRadioDomain.find((d) => d[0] === "FechaFiltro") !== undefined;

    updateLocationSearch();

    setSelectedRows([]);

    dispatch(
      getCFDIs({
        module: moduleID,
        type: tab,
        options: {
          domain,
          orderBy,
          search: search,
          limit,
          offset,
          overridePeriodDates,
          fields: fieldsToFetch,
        },
        isSearchOrFilter: search !== "" || advancedFilterDomain.length > 0,
      })
    );
  }, [tableMeta, payrollTableMeta, customDomain, updateAttachments]);

  function loadPayrollTotals() {
    const { orderBy, limit, offset } = parseTableMeta<CFDI>(tableMeta);
    const domain: Domain = [...activeRadioDomain, ...advancedFilterDomain];
    const overridePeriodDates = activeRadioDomain.find((d) => d[0] === "FechaFiltro") !== undefined;
    dispatch(
      getPayrollTotals({
        module: moduleID,
        options: {
          domain,
          orderBy,
          search: search,
          limit,
          offset,
          overridePeriodDates,
          // fields: ["xml_content"],
        },
      })
    );
  }
  useEffect(() => {
    updateLocationSearch();
  }, [location.search]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    forceSetTableMeta({
      ...tableMeta,
      pagination: { ...tableMeta.pagination, current: 1, defaultCurrent: 1 },
    });
    forceSetPayrollTableMeta({
      ...payrollTableMeta,
      pagination: { ...payrollTableMeta.pagination, current: 1, defaultCurrent: 1 },
    });
  }, [search, activeRadioDomain, rfc, advancedFilterDomain, customDomain, tab]);

  // Rerender the rows when sorting changes
  useEffect(() => {
    const cols = getDataColumns({
      module: moduleID,
      sorter: tab !== "N" ? tableMeta.sorter : payrollTableMeta.sorter,
      setModalVisible,
      setCFDIToDisplay,
      tab: tab,
      uuidsToModify,
      setUUIDsToModify,
      setCFDITypeToRequest,
      setPolicyModalVisible,
      setAttachmentsModalVisible,
      token,
      isDownloadPlan
    });
    setGeneralColumns(cols);
  }, [tableMeta.sorter, tab, payrollTableMeta.sorter]);

  // Reset debounced and adv filters when change tab.
  useEffect(() => {
    if (tabRender.current) {
      tabRender.current = false;
      return;
    }
    clearFilters();
    setExpandedRowKeys([]);
  }, [tab]);

  const clearFilters = () => {
    setTempSearch("");
    setSearch("");
    setAdvancedFilterDomain((prev) => (prev.length === 0 ? prev : []));
  };

  const clearButtonDisabled = useMemo(() => {
    if (search !== "" || advancedFilterDomain.length > 0) {
      return false;
    }
    return true;
  }, [search, advancedFilterDomain]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRows(newSelectedRowKeys);
  };

  function cleanRows() {
    setSelectedRows([]);
  }

  function getEditTableData() {
    switch (tab) {
      case "P": {
        return {
          tableId:
            moduleID === "issued"
              ? Tables.CFDI_ISSUED_PAYMENT_TOTALS
              : Tables.CFDI_RECEIVED_PAYMENT_TOTALS,
          defaultColumns: CFDI_PAYMENTS_TOTALS_COLUMNS,
          columns: paymentsColumns,
        };
      }
      case "N": {
        return {
          tableId:
            moduleID === "issued"
              ? Tables.CFDI_ISSUED_PAYROLL_TOTALS
              : Tables.CFDI_RECEIVED_PAYROLL_TOTALS,
          defaultColumns: CFDI_TOTALS_PAYROLL_COLUMNS,
          columns: payrollTotalColumns,
        };
      }
      default: {
        return {
          tableId: moduleID === "issued" ? Tables.CFDI_ISSUED_TOTALS : Tables.CFDI_RECEIVED_TOTALS,
          defaultColumns: CFDI_TOTALS_DEFAULT_COLUMNS,
          columns: columns,
        };
      }
    }
  }

  const EDIT_TABLES_DATA = getEditTableData();

  return (
    <>
      <Row gutter={[12, 12]}>
        <div className={s.SearchBarMenu}>
          <Col span={24}>
            <Title
              level={5}
              style={{ fontWeight: 400, display: "block" }}
              id={moduleID === "received" ? "title-cfdi-recibido" : "title-cfdi-emitido"}
            >
              CFDIs {titlePage}
            </Title>
          </Col>
          <Col span={24}>
            <Space className={s.TopMainWrapper}>
              <Space className={s.LeftWrapper}>
                <Space className={s.InnerLeftWrapper}>
                  <PeriodSelector />
                  <Space>
                    {(rfc && blackListRFC.includes(rfc)) ||
                      (company && blackListIdentifiers.includes(company)) ? null : (
                      <Input.Search
                        id="search-input"
                        placeholder={
                          moduleID === "received" ? "UUID, RFC o emisor" : "UUID, RFC o receptor"
                        }
                        value={tempSearch}
                        disabled={isFetching || isFetchingTotals}
                        onSearch={() => setSearch(tempSearch)}
                        onFocus={() => setIsInputFocus(true)}
                        onBlur={() => setIsInputFocus(false)}
                        onChange={(e) => {
                          setTempSearch(e.target.value);
                          if (e.target.value === "") {
                            setSearch("");
                          }
                        }}
                        enterButton={
                          <Button
                            type={tempSearch.length > 0 && isInputFocused ? "primary" : "default"}
                            icon={<SearchOutlined />}
                            disabled={isFetching || isFetchingTotals}
                          />
                        }
                        allowClear
                      />
                    )}
                    <CFDIAdvancedFilter
                      filterDomain={advancedFilterDomain}
                      setFilterDomain={setAdvancedFilterDomain}
                      moduleId={moduleID}
                      tab={tab}
                      openAdvancedFilter={openAdvancedFilter}
                      setOpenAdvancedFilter={setOpenAdvancedFilter}
                    />
                  </Space>
                </Space>
                <CFDIActiveRadioSelector
                  disabled={isFetching || isFetchingTotals}
                  setActiveRadioDomain={setActiveRadioDomain}
                />
                <CFDIPPDInvoiceSelector
                  disabled={isFetching || isFetchingTotals}
                  tab={tab}
                  setCustomDomain={setCustomDomain}
                />
              </Space>
              <Space>
                <ExportCFDIButton
                  selectedKeys={selectedRows}
                  columns={generalColumns}
                  datesValue={datesValue}
                  rfc={rfc}
                  activeRadioDomain={activeRadioDomain}
                  advancedFilterDomain={advancedFilterDomain}
                  moduleId={moduleID}
                  tab={tab}
                  debouncedSearch={search}
                  cfdiCount={cfdis.quantity}
                  PPDFilters={customDomain}
                  textButton="Exportar"
                  detailsColumn={detailsColumns}
                  exportDetails={true}
                />
                <Button
                  id="clear-filters-button"
                  type="default"
                  icon={<ClearOutlined />}
                  disabled={isFetching || isFetchingTotals || clearButtonDisabled}
                  onClick={clearFilters}
                />
              </Space>
            </Space>
          </Col>
          {advancedFilterDomain.length > 0 && (
            <Col span={24}>
              <Space>
                <CFDIAdvancedFilterTags
                  advancedDomain={advancedFilterDomain}
                  setAdvancedDomain={setAdvancedFilterDomain}
                  disabled={!isFetching || !isFetchingTotals}
                  tab={tab}
                  moduleId={moduleID}
                  setOpenAdvancedFilter={setOpenAdvancedFilter}
                />
              </Space>
            </Col>
          )}
        </div>
        <Col span={24} style={{ marginTop: -8 }}>
          <Tabs
            type="card"
            size="small"
            activeKey={tab}
            items={getCFDITabs({
              isFetchingCFDICount,
              isFetchingPayCFDICount,
              customDomain,
              payCfdiCount,
              cfdiCount,
              canAccessPayroll,
              search,
              advancedFilterDomain,
            })}
            onChange={(key) => setTab(key as CFDI_Types)}
          ></Tabs>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 15px 15px 15px",
              backgroundColor: "white",
            }}
          >
            <h6>Totales</h6>
            <TableColumnsEditorModal
              table={EDIT_TABLES_DATA.tableId}
              defaultColumns={EDIT_TABLES_DATA.defaultColumns}
              allColumns={EDIT_TABLES_DATA.columns}
              dataTest="edit-totals-table"
            />
          </div>
          <Table
            size="small"
            scroll={{ x: 10 }}
            style={{ padding: "0 15px 15px 15px", backgroundColor: "white" }}
            pagination={false}
            columns={getCFDITotalColumns(tab, moduleID) as any}
            loading={isFetchingTotals || !datesValue || !rfc}
            rowKey={(record) => `${Math.random() * 99999999}_${record.key}`}
            dataSource={
              tab !== "N"
                ? getTotalsRows(cfdis.totals, tab)
                : (getPayrollTotalsRows(payroll.totals) as any)
            }
          />

          <div
            style={{
              backgroundColor: "white",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              padding: "0 15px 5px 15px",
            }}
          >
            <h6>CFDIs</h6>
            {tab === "I" || tab === "N" || tab === "P" ? (
              <CFDITablesColumnEditorModal
                table={columnEditModalID}
                defaultColumns={
                  moduleID === "issued"
                    ? getDefaultIssuedColumns(tab)
                    : getDefaultReceivedColumns(tab)
                }
                allColumns={getDataColumns({
                  module: moduleID,
                  sorter: tableMeta.sorter,
                  tab: tab,
                  uuidsToModify,
                  setUUIDsToModify,
                  setPolicyModalVisible,
                  setAttachmentsModalVisible,
                  token,
                  isDownloadPlan
                })}
                detailsTable={detailsTableId}
                defaultDetailsColumns={detailsDefaultColumns}
                allDetailsColumns={detailsExpandedColumns()}
                tab={tab}
              />
            ) : (
              <TableColumnsEditorModal
                table={columnEditModalID}
                defaultColumns={
                  moduleID === "issued"
                    ? getDefaultIssuedColumns(tab)
                    : getDefaultReceivedColumns(tab)
                }
                allColumns={allCFDIColumns}
                dataTest="edit-cfdi-table"
              />
            )}
          </div>
          <MassiveExportView
            cfdis={selectedRows}
            cleanRows={cleanRows}
            groupedCFDIs={cfdis}
            columns={generalColumns}
            tab={tab}
            module={moduleID}
          />
          {tab !== "N" ? (
            <CFDIDefaultTable
              cfdiData={cfdis}
              expandedRowKeys={expandedRowKeys}
              company={company}
              generalDetailsColumns={generalDetailsColumns}
              tab={tab}
              setExpandedRowKeys={setExpandedRowKeys}
              selectedRows={selectedRows}
              onSelectChange={onSelectChange}
              setTableMeta={setTableMeta}
              tableMeta={tableMeta}
              generalColumns={generalColumns}
              isFetching={isFetching}
              datesValue={datesValue}
              rfc={rfc}
              isFetchingTotals={isFetchingTotals}
              keys={keys}
            />
          ) : (
            <CFDIPayrollTable
              generalPayrollColumns={generalColumns}
              dataSource={cfdis}
              tableMeta={payrollTableMeta}
              setTableMeta={setPayrollTableMeta}
              isFetching={isFetching}
              isFetchingTotals={isFetchingTotals}
              selectedRows={selectedRows}
              onSelectChange={onSelectChange}
              tab={tab}
              company={company}
              expandedRowKeys={expandedRowKeys}
              generalDetailsColumns={detailsColumns}
              keys={keys}
              setExpandedRowKeys={setExpandedRowKeys}
            />
          )}
        </Col>
      </Row>
      <CFDIModal
        visible={modalVisible}
        setVisible={setModalVisible}
        cfdi={cfdiOnModal}
        setCFDI={setCfdiOnModal}
        cfdiToDisplay={CFDIToDisplay}
        setCFDIToDisplay={setCFDIToDisplay}
        modalType={cfdiModalType}
        setCFDIModalType={setCFDIModalType}
        CFDITypeToRequest={CFDITypeToRequest}
        setModalVisiblePolicy={setPolicyModalVisible}
        setAttachmentsModalVisible={setAttachmentsModalVisible}
      />
      {
        IS_SIIGO &&
        <>
          <ModalPolicies
            visible={modalVisible}
            setVisible={setModalVisible}
            visiblePolicy={policyModalVisible}
            setVisiblePolicy={setPolicyModalVisible}
            setCFDIToDisplay={setCFDIToDisplay}
            setCFDIModalType={setCFDIModalType}
            moduleID={moduleID}
            setCFDITypeToRequest={setCFDITypeToRequest}
          />
        </>
      }
      <ModalAttachments
        visible={modalVisible}
        setVisible={setModalVisible}
        visibleAttachments={attachmentsModalVisible}
        setVisibleAttachments={setAttachmentsModalVisible}
        setCFDIToDisplay={setCFDIToDisplay}
        setCFDIModalType={setCFDIModalType}
        moduleID={moduleID}
        setCFDITypeToRequest={setCFDITypeToRequest}
        modalType={cfdiModalType}
      />
    </>
  );
}
