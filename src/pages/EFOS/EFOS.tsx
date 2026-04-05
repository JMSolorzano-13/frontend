import { Key, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { ColumnsType } from "antd/lib/table";
import { Button, Col, Row, Space, Table, Tabs, message, Input, theme } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { cfdiSelector, cleanErrors } from "@store/cfdiSlice";
import { commonSelector } from "@store/common";
import { getTotals } from "@store/cfdiSlice/getTotals";
import { getCFDIs } from "@store/cfdiSlice/getCFDIs";
import getDataColumns from "@utils/CFDI/dataColumns";
import getTotalsRows from "@utils/CFDI/getTotalRows";
import columns from "@utils/CFDI/columns";
import EFOSModal from "./EFOSModal";
import EfosPeriodSelector from "@components/EfosPeriodSelector";
import { useCColumns } from "@hooks/useCColumns";
import { CFDI_Types, Tables } from "@constants/Enums";
import TableColumnsEditorModal from "@components/columns/TableColumnsEditorModal";
import { CFDI_EFOS_DEFAULT_COLUMNS, CFDI_TOTALS_DEFAULT_COLUMNS } from "@constants/DefaultColumns";
import { authSelector } from "@store/authSlice";
import CFDIActiveRadioSelector from "@components/cfdis/CFDIActiveRadioSelector";
import useTableMeta from "@hooks/useTableMeta";
import CFDIAdvancedFilter from "@components/cfdis/CFDIAdvancedFilter";
import editSearchParams from "@utils/editSearchParams";
import usePermissions from "@hooks/usePermissions";
import CFDIAdvancedFilterTags from "@components/cfdis/CFDIAdvancedFilterTags";
import { DEFAULT_CFDI_TABLE_META } from "@constants/Extra";
import useCFDICColumns from "@hooks/cfdis/useCFDICColumns";
import parseTableMeta from "@utils/CFDI/parseTableMeta";
import ExportCFDIButton from "@components/cfdis/ExportCFDIButton";
import s from "./EFOS.module.scss";
import getExtraCols from "@utils/CFDI/getExtraCols";
import { getCFDICount } from "@store/cfdiSlice/getCFDICount";
import CFDIModal from "@components/cfdis/Modal/CFDIModal";
import { useAppDispatch } from "@store/store";
import { blackListIdentifiers, blackListRFC } from "@utils/CFDI/fuzzy_search_blacklist";
import { DISABLE_FUZZY } from "@utils/DataFake/blockSections";
import { optionsPagination } from "@utils/global/numberPagination";
import Title from "antd/lib/typography/Title";

const MODULE_ID: CFDIModule = "efos";
const { useToken } = theme;

export default function EFOS() {
  const { token } = useToken();
  const dispatch = useAppDispatch();
  const location = useLocation();
  // const history = useHistory()
  const navigate = useNavigate();
  const { canAccessPayroll } = usePermissions();
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

  const { efosCFDIs, error, isFetching, isFetchingTotals, isFetchingCFDICount, cfdiCount } =
    useSelector(cfdiSelector);
  const { rfc, company } = useSelector(authSelector);
  const { efosDateValue, efosPeriodDates } = useSelector(commonSelector);
  const [search, setSearch] = useState<string>(
    new URLSearchParams(location.search).get("search") || ""
  );
  const [tempSearch, setTempSearch] = useState<string>(
    new URLSearchParams(location.search).get("search") || ""
  );
  const [totalsColumns] = useCColumns(columns, Tables.CFDI_EFOS_TOTALS);

  const [tableMeta, setTableMeta, forceSetTableMeta] = useTableMeta<CFDI>(DEFAULT_CFDI_TABLE_META);

  const cfdiColumns = useCFDICColumns(
    MODULE_ID,
    CFDI_EFOS_DEFAULT_COLUMNS,
    tableMeta.sorter,
    tab,
    token
  );

  const [activeRadioDomain, setActiveRadioDomain] = useState<Domain>([
    ["FechaCancelacion", "=", null],
  ]);
  const [advancedFilterDomain, setAdvancedFilterDomain] = useState<Domain>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [efosModalVisible, setEfosModalVisible] = useState(false);
  const [cfdiOnModal, setCfdiOnModal] = useState<CFDI>();
  const [cfdiModalType, setCFDIModalType] = useState("normal");
  const [CFDIToDisplay, setCFDIToDisplay] = useState("");
  const [CFDITypeToRequest, setCFDITypeToRequest] = useState<CFDI_Types>(CFDI_Types.INGRESS);
  const [selectedRows, setSelectedRows] = useState<Array<Key>>([]);
  const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);

  const allCFDIColumns = useMemo(
    () =>
      getDataColumns({
        module: MODULE_ID,
        sorter: tableMeta.sorter,
        tab,
        token,
        isDownloadPlan: false
      }),
    [MODULE_ID, tableMeta.sorter, tab]
  );

  const fieldsToFetch = useMemo(() => {
    const defaultFields = ["from_xml", "TipoDeComprobante", "is_issued"];
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
      // history.replace(
      //   editSearchParams(
      //     location.search,
      //     [
      //       {key: 'search', value: search},
      //       {
      //         key: 'type',
      //         value:
      //           Object.keys(CFDI_Types)[
      //             Object.values(CFDI_Types).indexOf(tab)
      //           ].toLowerCase(),
      //       },
      //     ],
      //     {baseUrl: location.pathname}
      //   )
      // )
    }
  };

  // Extra cols for search table
  const extraCols: ColumnsType<CFDI> = useMemo(
    () =>
      getExtraCols({
        setCfdiOnModal,
        setModalVisible,
        setCFDITypeToRequest,
        setCFDIToDisplay,
        tab,
        activeRadioDomain,
        sorter: tableMeta.sorter,
        isEFOS: true,
      }),
    [activeRadioDomain, tableMeta.sorter]
  );

  //  Columns that are displayed on search
  const [generalColumns, setGeneralColumns, columnEditModalID] = useMemo(() => {
    const columnsData = cfdiColumns[tab];
    return [[...extraCols, ...columnsData.columns], columnsData.setColumns, columnsData.tableId];
  }, [tab, cfdiColumns, extraCols]);

  // useEffect for CFDICount
  useEffect(() => {
    if (!efosDateValue || !rfc) return;
    const domain: Domain = [...activeRadioDomain, ...advancedFilterDomain];

    domain.push(["efos", "=", "any"]);
    domain.push(["is_issued", "=", false]);

    dispatch(
      getCFDICount({
        module: MODULE_ID,
        options: { domain, search: search },
      })
    );
  }, [search, activeRadioDomain, efosDateValue, rfc, advancedFilterDomain]);

  // useEffect for totals table
  useEffect(() => {
    if (!efosDateValue || !rfc) return;
    const domain: Domain = [...activeRadioDomain, ...advancedFilterDomain];

    domain.push(["efos", "=", "any"]);
    domain.push(["is_issued", "=", false]);
    domain.push(["TipoDeComprobante", "=", "I"]);

    dispatch(
      getTotals({
        module: MODULE_ID,
        options: { domain, search: search },
        cfdiTypes: [tab],
      })
    );
  }, [dispatch, search, activeRadioDomain, efosDateValue, rfc, advancedFilterDomain, tab]);

  // useEffect for search table
  useEffect(() => {
    if (!efosDateValue || !rfc) return;
    const { orderBy, limit, offset } = parseTableMeta<CFDI>(tableMeta);
    const domain: Domain = [...activeRadioDomain, ...advancedFilterDomain];
    const overridePeriodDates = activeRadioDomain.find((d) => d[0] === "FechaFiltro") !== undefined;

    domain.push(["efos", "=", "any"]);
    domain.push(["is_issued", "=", false]);

    updateLocationSearch();

    dispatch(
      getCFDIs({
        module: MODULE_ID,
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
      })
    );
  }, [tableMeta, dispatch]);

  useEffect(() => {
    updateLocationSearch();
  }, [location.search]);

  useEffect(() => {
    forceSetTableMeta({
      ...tableMeta,
      pagination: { ...tableMeta.pagination, current: 1, defaultCurrent: 1 },
    });
  }, [tab, efosDateValue, search, activeRadioDomain, advancedFilterDomain, rfc]);

  const clearFilters = () => {
    setSearch("");
    setAdvancedFilterDomain([]);
  };

  // Rerender the rows when sorting changes
  useEffect(() => {
    const cols = getDataColumns({
      module: MODULE_ID,
      sorter: tableMeta.sorter,
      tab,
      token,
      isDownloadPlan: false
    });
    setGeneralColumns(cols);
  }, [tableMeta.sorter]);

  const clearButtonDisabled = useMemo(() => {
    if (search !== "" || advancedFilterDomain.length > 0) {
      return false;
    }
    return true;
  }, [search, advancedFilterDomain]);

  return (
    <>
      <Row gutter={[12, 12]}>
        <div className={s.SearchBarMenu}>
          <Col span={24}>
            <Space>
              <Title level={5} style={{ fontWeight: 400 }} id="title-efos">
                EFOS
              </Title>
            </Space>
          </Col>
          <Col span={24}>
            <Space className={s.TopMainWrapper}>
              <Space className={s.LeftWrapper}>
                <Space className={s.InnerLeftWrapper}>
                  <EfosPeriodSelector />
                  <Space>
                    {(rfc && blackListRFC.includes(rfc)) ||
                    (company && blackListIdentifiers.includes(company)) ||
                    DISABLE_FUZZY ? null : (
                      <Input.Search
                        id="search-input"
                        placeholder="Buscar..."
                        onSearch={() => setSearch(tempSearch)}
                        disabled={isFetching || isFetchingTotals}
                        value={tempSearch}
                        onChange={(e) => {
                          setTempSearch(e.target.value);
                          if (e.target.value === "") {
                            setSearch("");
                          }
                        }}
                        allowClear
                      />
                    )}
                    <CFDIAdvancedFilter
                      filterDomain={advancedFilterDomain}
                      setFilterDomain={setAdvancedFilterDomain}
                      moduleId={MODULE_ID}
                      tab={tab}
                      openAdvancedFilter={openAdvancedFilter}
                      setOpenAdvancedFilter={setOpenAdvancedFilter}
                    />
                  </Space>
                </Space>
                <CFDIActiveRadioSelector
                  disabled={isFetching || isFetchingTotals}
                  setActiveRadioDomain={setActiveRadioDomain}
                  isEFOS
                />
              </Space>
              <Space>
                <Button
                  id="view-efos-list"
                  type="primary"
                  onClick={() => setEfosModalVisible(true)}
                  disabled={!efosPeriodDates}
                >
                  Ver listado de EFOS
                </Button>
                <ExportCFDIButton
                  selectedKeys={selectedRows}
                  columns={generalColumns}
                  datesValue={efosDateValue}
                  rfc={rfc}
                  activeRadioDomain={activeRadioDomain}
                  advancedFilterDomain={advancedFilterDomain}
                  moduleId={MODULE_ID}
                  tab={tab}
                  debouncedSearch={search}
                  cfdiCount={cfdiCount}
                  textButton="Acciones"
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
            <Col span={24} style={{ marginTop: -4 }}>
              <Space>
                <CFDIAdvancedFilterTags
                  advancedDomain={advancedFilterDomain}
                  setAdvancedDomain={setAdvancedFilterDomain}
                  disabled={!isFetching || !isFetchingTotals}
                  tab={tab}
                  moduleId={MODULE_ID}
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
            items={[
              {
                id: "tab-I",
                label: `Ingreso (${isFetchingCFDICount ? "..." : cfdiCount?.I})`,
                key: "I",
                style: {
                  backgroundColor: "white",
                  padding: "15px 15px 0 15px",
                },
              },
            ]}
            activeKey={tab}
            onChange={(key) => setTab(key as CFDI_Types)}
          />
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
              table={Tables.CFDI_EFOS_TOTALS}
              defaultColumns={CFDI_TOTALS_DEFAULT_COLUMNS}
              allColumns={columns}
              dataTest="edit-totals-table"
            />
          </div>
          <Table
            size="small"
            scroll={{ x: 10 }}
            style={{ padding: "0 15px 15px 15px", backgroundColor: "white" }}
            pagination={false}
            columns={totalsColumns}
            loading={isFetchingTotals || !efosDateValue || !rfc}
            dataSource={getTotalsRows(efosCFDIs.totals) as any}
          />
          <div
            style={{
              backgroundColor: "white",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              padding: "0 15px 15px 15px",
            }}
          >
            <h6>CFDIs</h6>
            <TableColumnsEditorModal
              table={columnEditModalID}
              defaultColumns={CFDI_EFOS_DEFAULT_COLUMNS}
              allColumns={allCFDIColumns}
              dataTest="edit-cfdi-table"
            />
          </div>
          <Table
            rowSelection={{
              type: "checkbox",
              onChange: setSelectedRows,
            }}
            style={{ padding: "0 15px 15px 15px", backgroundColor: "white" }}
            size="small"
            rowKey="UUID"
            onChange={setTableMeta}
            columns={generalColumns}
            dataSource={efosCFDIs.cfdis}
            loading={isFetching || !efosDateValue || !rfc || isFetchingTotals}
            scroll={{ y: 380, x: 10 }}
            pagination={{
              showTotal: (total) =>
                total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
              defaultCurrent: 1,
              current: tableMeta?.pagination.current,
              pageSize: tableMeta?.pagination.pageSize,
              total: efosCFDIs.totals?.filtered?.count,
              showSizeChanger: true,
              pageSizeOptions: optionsPagination,
            }}
          />
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
      />
      <EFOSModal visible={efosModalVisible} setVisible={setEfosModalVisible} />
    </>
  );
}
