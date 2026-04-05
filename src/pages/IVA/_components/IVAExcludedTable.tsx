import { useEffect } from "react";
import { Table, Space, Button, Tooltip } from "antd";
import { useAppDispatch } from "@store/store";
import { buildNotConsiderIVA, buildMovedIVA } from "@utils/domains";
import { useSelector } from "react-redux";
import { ivaSelector } from "@store/ivaSlice";
import { FileExcelOutlined, FileSearchOutlined, MoreOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import * as UTILS from "../_utils";
import IVACFDIColumns, { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { DEFAULT_IVA_CFDI_TABLE_META } from "@constants/Extra";
import useTableMeta from "@hooks/useTableMeta";
import { commonSelector } from "@store/common";
import { isYearly } from "@utils/IVA/datesUtils";
import { getExcludedCFDIs } from "@store/ivaSlice/getExcluded";
import parseTableMeta from "@utils/CFDI/parseTableMeta";
import { TState, UpdateUUIDsType } from "../_types/StateTypes";
import { optionsPagination } from "@utils/global/numberPagination";

interface IVAExcludedTableType {
  ivaSection: "creditable" | "transferred";
  modalPeriod: string;
  setCFDIModalType: (value: string) => void;
  setCFDIFromRecord: (value: IVACFDI) => void;
  setCFDIToDisplay: (value: string) => void;
  setCFDIModalVisible: (value: boolean) => void;
  tab: TabIVAType;
  topTab: TState;
  isExercise: boolean;
  uuids: UpdateUUIDsType;
  setUUIDs: (state: UpdateUUIDsType) => void;
  updateSucceded: boolean;
  setPaymentDateSucceded: boolean;
}

export default function IVAExcludedTable({
  ivaSection,
  modalPeriod,
  tab,
  setCFDIModalType,
  setCFDIFromRecord,
  setCFDIToDisplay,
  setCFDIModalVisible,
  topTab,
  isExercise,
  uuids,
  setUUIDs,
  updateSucceded,
  setPaymentDateSucceded,
}: IVAExcludedTableType) {
  const dispatch = useAppDispatch();
  const { excludedFromCalculation } = useSelector(ivaSelector);
  const [tableMeta, setTableMeta, forceSetTableMeta] = useTableMeta<IVACFDI>(
    DEFAULT_IVA_CFDI_TABLE_META
  );
  const { periodDates } = useSelector(commonSelector);
  const yearly = isYearly(periodDates);

  /* function manageOnCloseModal() {
    if (reload) {
      navigator(
        editSearchParams(location.search, [{ key: "modal", value: "false" }], {
          baseUrl: location.pathname,
        }),
        { replace: true }
      );
      manageUpdateExcluded();
    } else {
      setModalDetailsVisible();
    }
  }*/

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
                if (record.TipoDeComprobante === "P") {
                  setCFDIModalType("ppd");
                } else {
                  setCFDIModalType("normal");
                  setCFDIFromRecord(record);
                }
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

  useEffect(() => {
    function handleLoadData() {
      const { orderBy, limit, offset } = parseTableMeta<IVACFDI>(tableMeta);
      if (periodDates) {
        const pdates = periodDates.split("|");
        const periodToSend = yearly
          ? `${pdates[0].split("T")[0].split("-")[0]}-12-01`
          : pdates[0].split("T")[0];

        const domain: Domain =
          tab === "EXCLUDED"
            ? buildNotConsiderIVA(ivaSection, pdates)
            : buildMovedIVA(ivaSection, pdates);
        const datesDifference = UTILS.isYearly(periodDates);
        const optionsForAllTab: SearchOptions = {
          limit: limit,
          offset: offset,
          orderBy: orderBy,
          period: periodToSend,
          domain,
          yearly: datesDifference || isExercise || topTab.includes("exercise"),
        };
        dispatch(
          getExcludedCFDIs({
            tab,
            options: optionsForAllTab,
          })
        );
      }
    }
    handleLoadData();
  }, [periodDates, ivaSection, tab, topTab, updateSucceded, setPaymentDateSucceded]);

  useEffect(() => {
    forceSetTableMeta({
      ...tableMeta,
      pagination: { ...tableMeta.pagination, current: 1, defaultCurrent: 1 },
      parsedOptions: { ...tableMeta.parsedOptions, offset: 0 },
    });
  }, [tab, periodDates, ivaSection, topTab]);

  return (
    <div style={{ display: "flex", marginTop: 10, flexDirection: "column" }}>
      <Table
        rowKey="UUID"
        size="small"
        columns={[
          ...extraCols,
          ...IVACFDIColumns({
            modalType: ivaSection,
            modalPeriod,
            tab,
            sorter: tableMeta.sorter,
            setUUIDs,
            uuids,
            topTab,
          }),
        ]}
        scroll={{ y: 420, x: 10 }}
        loading={excludedFromCalculation.isFetching}
        dataSource={excludedFromCalculation.response.cfdis as any}
        onChange={setTableMeta}
        pagination={{
          defaultCurrent: 1,
          current: tableMeta?.pagination.current,
          pageSize: tableMeta?.pagination.pageSize,
          total: excludedFromCalculation.response.quantity,
          pageSizeOptions: optionsPagination,
          showSizeChanger: true,
          showTotal: (total) =>
            total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
        }}
      />
    </div>
  );
}
