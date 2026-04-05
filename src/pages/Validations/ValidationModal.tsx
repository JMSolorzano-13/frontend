import { Key, useEffect, useMemo, useState } from "react";
import {
  ClearOutlined,
  DownloadOutlined,
  FileSearchOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { ColumnType } from "antd/lib/table";
import {
  Button,
  Dropdown,
  Input,
  Modal,
  Space,
  Tabs,
  Table,
  TablePaginationConfig,
  message,
  Grid,
  Tooltip,
  theme,
} from "antd";
import type { MenuProps, TabsProps } from "antd";
import { ColumnsType, FilterValue, SorterResult } from "antd/lib/table/interface";
import { useSelector } from "react-redux";
import { CFDI_Types, Tables } from "@constants/Enums";
import { useDebounce } from "@hooks/useDebounce";
import { cfdiSelector } from "@store/cfdiSlice";
import { getCFDIs } from "@store/cfdiSlice/getCFDIs";
import { getTotals } from "@store/cfdiSlice/getTotals";
import { commonSelector } from "@store/common";
import getDataColumns from "@utils/CFDI/dataColumns";
import { useCColumns } from "@hooks/useCColumns";
import columns from "@utils/CFDI/columns";
import getTotalsRows from "@utils/CFDI/getTotalRows";
import { exportCFDI } from "@utils/exportCFDI";
import delayedDownload from "@utils/delayedDownload";
import { getCFDICount } from "@store/cfdiSlice/getCFDICount";
import { authSelector } from "@store/authSlice";
import CFDIModal from "@components/cfdis/Modal/CFDIModal";
import { useAppDispatch } from "@store/store";
import { blackListIdentifiers, blackListRFC } from "@utils/CFDI/fuzzy_search_blacklist";
import { DISABLE_FUZZY } from "@utils/DataFake/blockSections";
import { numberPagination, optionsPagination } from "@utils/global/numberPagination";

const { useBreakpoint } = Grid;

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
  validationDomain: Domain;
  cfdiTypes: CFDI_Types[];
  validationId: string;
  exportName: {
    group: string;
    subtitle: string;
  };
};

const { useToken } = theme;

export default function ValidationModal(props: Props) {
  const { token } = useToken();
  const { visible, setVisible, title, validationDomain, validationId, cfdiTypes, exportName } =
    props;
  const dispatch = useAppDispatch();
  const screens = useBreakpoint();
  const [modalVisible, setModalVisible] = useState(false);
  const [cfdiOnModal, setCfdiOnModal] = useState<CFDI>();
  const [CFDITypeToRequest] = useState<CFDI_Types>(CFDI_Types.INGRESS);
  const [cfdiModalType, setCFDIModalType] = useState("normal");
  const [CFDIToDisplay, setCFDIToDisplay] = useState("");
  const { datesValue } = useSelector(commonSelector);
  const { validationCFDIs, isFetching, isFetchingTotals, isFetchingCFDICount, cfdiCount } =
    useSelector(cfdiSelector);
  const [debouncedSearch, search, setSearch] = useDebounce("");
  const [tab, setTab] = useState<CFDI_Types>(
    cfdiTypes.length > 0 ? cfdiTypes[0] : CFDI_Types.INGRESS
  );
  const [tableMeta, setTableMeta] = useState<{
    sorter: SorterResult<CFDI>[];
    pagination: TablePaginationConfig;
  }>();
  const [selectedRows, setSelectedRows] = useState<Array<Key>>([]);
  const [totalsColumns] = useCColumns(columns, Tables.CFDI_ISSUED_TOTALS);
  const [linksToDownload, setLinksToDownload] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const downloadLinks = () => {
    if (linksToDownload.length > 0) {
      delayedDownload(linksToDownload);
      setLinksToDownload([]);
    }
  };

  const mainColumns = useMemo(() => {
    return getDataColumns({
      module: "validation-complete",
      sorter: tableMeta?.sorter,
      tab,
      token,
      isDownloadPlan: false
    });
  }, [tableMeta?.sorter]);

  const fieldsToFetch = useMemo(() => {
    const defaultFields = ["from_xml", "TipoDeComprobante", "is_issued"];
    const fields = mainColumns
      .map((c) => {
        const dataIndex = "dataIndex" in c ? (c.dataIndex as string) : undefined;
        if (dataIndex) {
          return dataIndex.startsWith("c_") ? `${dataIndex}.name` : dataIndex;
        }
        return undefined;
      })
      .filter((dataIndex): dataIndex is string => dataIndex !== undefined);

    return Array.from(new Set([...defaultFields, ...fields]));
  }, [mainColumns]);

  // useEffect for CFDICount
  useEffect(() => {
    if (visible) {
      dispatch(
        getCFDICount({
          module: "validation-complete",
          validationId,
          options: { domain: validationDomain, search: debouncedSearch },
        })
      );
    }
  }, [debouncedSearch, visible, datesValue]);

  useEffect(() => {
    if (visible) {
      dispatch(
        getTotals({
          module: "validation-complete",
          validationId,
          options: { search: debouncedSearch, domain: validationDomain },
          cfdiTypes: [tab],
        })
      );
    }
  }, [dispatch, debouncedSearch, datesValue, visible, tab]);

  useEffect(() => {
    if (!visible) return;

    let orderBy = "";
    let limit = 30;
    let offset = 0;
    if (tableMeta) {
      const { sorter, pagination } = tableMeta;
      if (sorter.length > 0) {
        sorter.forEach((s) => {
          let order = "";
          if (s.order === undefined || s.column === undefined) return;
          order = s.order === "ascend" ? "asc" : "desc";
          orderBy += `"${s.column.dataIndex}" ${order} `;
        });
      }
      if (pagination) {
        limit = pagination.pageSize ?? 30;
        offset = pagination.current ? pagination.current - 1 : 0;
      }
    }

    dispatch(
      getCFDIs({
        module: "validation-complete",
        validationId,
        type: tab,
        options: {
          domain: validationDomain,
          orderBy,
          search: debouncedSearch,
          limit,
          offset,
          fields: fieldsToFetch,
        },
      })
    );
  }, [debouncedSearch, tableMeta, tab, dispatch, datesValue, visible]);

  const extraCols = useMemo(() => {
    const extraCol: ColumnsType<CFDI> = [
      {
        title: <FileSearchOutlined style={{ marginTop: 7, marginLeft: 3, fontSize: 17 }} />,
        key: "action",
        render: (_, record: CFDI) => (
          <Space>
            <Tooltip title="Ver detalles">
              <Button
                size="small"
                type="text"
                icon={<MoreOutlined />}
                onClick={() => {
                  setCfdiOnModal(record);
                  setModalVisible(true);
                  setCFDIToDisplay(record.UUID);
                }}
              />
            </Tooltip>
          </Space>
        ),
        fixed: true,
        width: 60,
      },
    ];
    return extraCol;
  }, [mainColumns]);

  const allColumns: ColumnsType<CFDI> = useMemo(() => {
    const columns = [...extraCols, ...mainColumns];
    return columns;
  }, [mainColumns]);

  const { company, rfc } = useSelector(authSelector);

  const performExportCFDI = async (
    format: "CSV" | "PDF" | "XML" | "XLSX",
    selectedRowKeys: Array<Key>
  ) => {
    if (selectedRowKeys.length === 0) {
      message.error("No se ha seleccionado ningún CFDI");
      return;
    }
    setIsExporting(true);
    const fieldsToExport = mainColumns
      .filter(
        (c: ColumnType<CFDI>) => c.dataIndex !== undefined && !String(c.dataIndex).includes("_")
      )
      .map((c: ColumnType<CFDI>) => c.dataIndex as string);
    exportCFDI({
      company,
      format,
      selectedIds: selectedRowKeys as string[],
      fields: fieldsToExport,
      exportName: {
        group: exportName.group,
        subtitle: exportName.subtitle as string,
        datesValue: datesValue,
        rfc: rfc as string,
      },
      exportType: "validation",
    })
      .then((links) => {
        setLinksToDownload(links);
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  const menu = useMemo<MenuProps["items"]>(() => {
    const menuItems: MenuProps["items"] = [
      {
        key: "desc-text",
        label: `Descargar ${
          selectedRows.length > 0 ? `(${selectedRows.length} seleccionados)` : "Todos"
        } en formato:`,
      },
      {
        label: "Excel",
        key: "export-xlsx",
        icon: <DownloadOutlined />,
        onClick: () => {
          performExportCFDI("XLSX", selectedRows);
        },
      },
      {
        label: "PDF",
        key: "export-pdf",
        icon: <DownloadOutlined />,
        onClick: () => {
          performExportCFDI("PDF", selectedRows);
        },
      },
      {
        label: "XML",
        key: "export-xml",
        icon: <DownloadOutlined />,
        onClick: () => {
          performExportCFDI("XML", selectedRows);
        },
      },
    ];
    return menuItems;
  }, [selectedRows]);

  const handleClear = () => {
    setSearch("");
  };

  const handleChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<CFDI> | SorterResult<CFDI>[]
  ) => {
    setTableMeta({
      sorter: sorter instanceof Array ? sorter : [sorter],
      pagination,
    });
  };

  function loadTabs() {
    const items: TabsProps["items"] = [];
    if (cfdiTypes.length === 0 || cfdiTypes.includes(CFDI_Types.INGRESS)) {
      items.push({
        id: "tab-I",
        label: `Ingreso (${isFetchingCFDICount ? "..." : cfdiCount?.I})`,
        key: "I",
        style: { backgroundColor: "white", padding: "15px 15px 0 15px" },
      });
    }
    if (cfdiTypes.length === 0 || cfdiTypes.includes(CFDI_Types.EGRESS)) {
      items.push({
        id: "tab-E",
        label: `Egreso (${isFetchingCFDICount ? "..." : cfdiCount?.E})`,
        key: "E",
        style: { backgroundColor: "white", padding: "15px 15px 0 15px" },
      });
    }
    if (cfdiTypes.length === 0 || cfdiTypes.includes(CFDI_Types.TRANSFER)) {
      items.push({
        id: "tab-T",
        label: `Traslado (${isFetchingCFDICount ? "..." : cfdiCount?.T})`,
        key: "T",
        style: { backgroundColor: "white", padding: "15px 15px 0 15px" },
      });
    }
    if (cfdiTypes.length === 0 || cfdiTypes.includes(CFDI_Types.PAYROLL)) {
      items.push({
        id: "tab-N",
        label: `Nómina (${isFetchingCFDICount ? "..." : cfdiCount?.N})`,
        key: "N",
        style: { backgroundColor: "white", padding: "15px 15px 0 15px" },
      });
    }
    if (cfdiTypes.length === 0 || cfdiTypes.includes(CFDI_Types.PAYMENT)) {
      items.push({
        id: "tab-P",
        label: `Pago (${isFetchingCFDICount ? "..." : cfdiCount?.P})`,
        key: "P",
        style: { backgroundColor: "white", padding: "15px 15px 0 15px" },
      });
    }
    return items;
  }

  return (
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      style={{ top: 30 }}
      width={1800}
      title={title}
      footer={[]}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: screens.sm ? "row" : "column",
          gap: 8,
        }}
      >
        <Space>
          {(rfc && blackListRFC.includes(rfc)) ||
          (company && blackListIdentifiers.includes(company)) ||
          DISABLE_FUZZY ? null : (
            <Input.Search
              id="validation-search"
              placeholder="Buscar..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              disabled={isFetching || isFetchingTotals}
            />
          )}
        </Space>
        <Space>
          {linksToDownload.length > 0 ? (
            <Button
              id="download-button"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={downloadLinks}
            >
              Descargar archivos
            </Button>
          ) : (
            <Dropdown
              menu={{ items: menu }}
              placement="bottomRight"
              disabled={selectedRows.length === 0 || isExporting}
            >
              <Button id="export-button">{isExporting ? "Exportando..." : "Acciones"}</Button>
            </Dropdown>
          )}
          <Button
            id="clear-filters-button"
            type="default"
            icon={<ClearOutlined />}
            onClick={handleClear}
            disabled={isFetching || isFetchingTotals || debouncedSearch === ""}
          />
        </Space>
      </div>
      <div style={{ marginTop: 25 }}>
        <Tabs
          type="card"
          size="small"
          items={loadTabs()}
          activeKey={tab}
          onChange={(key: string) => setTab(key as CFDI_Types)}
        />
        <Table
          size="small"
          scroll={{ x: 1600 }}
          style={{ padding: "0 15px 30px 15px", backgroundColor: "white" }}
          pagination={false}
          columns={totalsColumns}
          loading={isFetchingTotals}
          dataSource={getTotalsRows(validationCFDIs.totals[validationId]) as any}
        />
        <Table
          rowSelection={{
            type: "checkbox",
            onChange: setSelectedRows,
          }}
          style={{ padding: "0 15px 15px 15px", backgroundColor: "white" }}
          size="small"
          rowKey="UUID"
          onChange={handleChange}
          columns={allColumns}
          dataSource={validationCFDIs.cfdis}
          loading={isFetching || isFetchingTotals}
          scroll={{ y: 400 }}
          pagination={{
            showTotal: (total) =>
              total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
            defaultPageSize: numberPagination,
            pageSizeOptions: optionsPagination,
            showSizeChanger: true,
            total: cfdiCount ? Number(cfdiCount[tab]) || 0 : 0,
          }}
          data-test="cfdi-validation-table"
        />
      </div>
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
    </Modal>
  );
}
