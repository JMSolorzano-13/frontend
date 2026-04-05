import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, Col, Input, message, Modal, Row, Space, Statistic, Table, Tabs } from "antd";
import type { TabsProps } from "antd";
import { columns } from "./columns";
import { cleanErrors, efosSelector } from "@store/efosSlice";
import { getEFOS } from "@store/efosSlice/getEFOS";
import useTableMeta from "@hooks/useTableMeta";
import { useDebounce } from "@hooks/useDebounce";
import { getEFOSTotals } from "@store/efosSlice/getEFOSTotals";
import { getRelatedEFOS } from "@store/efosSlice/getRelatedEFOS";
import { DEFAULT_MODAL_CFDI_TABLE_META } from "@constants/Extra";
import { useAppDispatch } from "@store/store";
import { blackListIdentifiers, blackListRFC } from "@utils/CFDI/fuzzy_search_blacklist";
import { authSelector } from "@store/authSlice";
import { DISABLE_FUZZY } from "@utils/DataFake/blockSections";
import { optionsPagination } from "@utils/global/numberPagination";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function EFOSModal(props: Props) {
  const { visible, setVisible } = props;

  const dispatch = useAppDispatch();

  const {
    efos,
    efosCount,
    isFetching,
    error,
    relatedEfos,
    relatedEfosCount,
    isFetchingRelatedEfos,
    errorRelatedEfos,
    efosTotals,
    relatedEfosTotals,
    isFetchingEfosTotals,
  } = useSelector(efosSelector);

  const { company, rfc } = useSelector(authSelector);

  const [tableMeta, setTableMeta, forceSetTableMeta] = useTableMeta<EFOS>(
    DEFAULT_MODAL_CFDI_TABLE_META
  );
  const [debouncedSearch, search, setSearch] = useDebounce("");
  const [tabKey, setTabKey] = useState("1");

  useEffect(() => {
    if (error) message.error(error);
    if (errorRelatedEfos) message.error(errorRelatedEfos);
    if (error || errorRelatedEfos) dispatch(cleanErrors());
  }, [error, errorRelatedEfos]);

  useEffect(() => {
    if (visible) {
      const domain: Domain = [];

      if (tabKey === "1") {
        dispatch(
          getRelatedEFOS({
            options: {
              ...tableMeta.parsedOptions,
              domain,
              search: debouncedSearch,
            },
          })
        );
        dispatch(
          getEFOSTotals({
            options: { fetchAll: false, domain, search: debouncedSearch },
          })
        );
      } else {
        domain.push(["company_identifier", "=", company]);
        dispatch(
          getEFOS({
            options: { ...tableMeta.parsedOptions, domain, search: debouncedSearch },
          })
        );
        dispatch(
          getEFOSTotals({
            options: { fetchAll: true, domain, search: debouncedSearch },
          })
        );
      }
    }
  }, [visible, debouncedSearch, tabKey, tableMeta, dispatch]);

  const onCancel = () => {
    setVisible(false);
  };

  const resetTableMeta = () => {
    forceSetTableMeta(DEFAULT_MODAL_CFDI_TABLE_META);
  };

  const dataToDisplay = useMemo(() => {
    let data;

    if (tabKey === "1") {
      data = [...relatedEfos];
    } else {
      data = [...efos];
    }

    data.forEach((d, key) => {
      switch (d.state) {
        case "DEFINITIVE":
          data[key] = { ...d, state: "Definitivo" };
          break;
        case "DISTORTED":
          data[key] = { ...d, state: "Desvirtuado" };
          break;
        case "ALLEGED":
          data[key] = { ...d, state: "Presunto" };
          break;
        case "FAVORABLE_JUDGMENT":
          data[key] = { ...d, state: "Sentencia favorable" };
          break;
        default:
          data[key] = { ...d, state: "Otro" };
          break;
      }
    });

    return data;
  }, [tabKey, efos, relatedEfos]);

  const totalsToDisplay = useMemo(() => {
    if (tabKey === "1") {
      return relatedEfosTotals;
    }
    return efosTotals;
  }, [tabKey, relatedEfosTotals, efosTotals]);

  function loadTabs() {
    const items: TabsProps["items"] = [
      {
        id: "tab-efos-1",
        label: "Operaciones con EFOS",
        key: "1",
      },
      {
        id: "tab-efos-2",
        label: "Todos los EFOS",
        key: "2",
      },
    ];
    return items;
  }

  return (
    <Modal
      title="Listado de EFOS"
      open={visible}
      onCancel={onCancel}
      width="90%"
      footer={[
        <Button id="close-efos-modal" key="back" onClick={onCancel}>
          Cerrar
        </Button>,
      ]}
    >
      <Space style={{ marginBottom: 15 }}>
        {(rfc && blackListRFC.includes(rfc)) ||
        (company && blackListIdentifiers.includes(company)) ||
        DISABLE_FUZZY ? null : (
          <Input.Search
            id="efos-modal-search"
            placeholder="Buscar..."
            value={search}
            onChange={(el) => {
              setSearch(el.target.value);
              resetTableMeta();
            }}
            allowClear
          />
        )}
      </Space>
      <Tabs
        defaultActiveKey="1"
        items={loadTabs()}
        onChange={(newKey) => {
          setTabKey(newKey);
          resetTableMeta();
        }}
      />
      <Table
        size="small"
        scroll={{ x: 40, y: 300 }}
        columns={columns}
        rowKey="no"
        loading={isFetching || isFetchingRelatedEfos}
        dataSource={dataToDisplay}
        pagination={{
          defaultCurrent: 1,
          showTotal: (total) =>
            total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
          pageSizeOptions: optionsPagination,
          current: tableMeta.pagination.current,
          pageSize: tableMeta?.pagination.pageSize,
          total: tabKey === "1" ? relatedEfosCount : efosCount,
        }}
        onChange={setTableMeta}
        data-test="efos-operations-table"
      />
      <Row gutter={[12, 12]} style={{ marginTop: "16px" }}>
        <Col xs={12} sm={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Desvirtuado"
              loading={isFetchingEfosTotals}
              value={totalsToDisplay?.DISTORTED}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Definitivo"
              loading={isFetchingEfosTotals}
              value={totalsToDisplay?.DEFINITIVE}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Sentencia favorable"
              loading={isFetchingEfosTotals}
              value={totalsToDisplay?.FAVORABLE_JUDGMENT}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Presunto"
              loading={isFetchingEfosTotals}
              value={totalsToDisplay?.ALLEGED}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Total"
              loading={isFetchingEfosTotals}
              value={
                (totalsToDisplay?.ALLEGED ?? 0) +
                (totalsToDisplay?.DEFINITIVE ?? 0) +
                (totalsToDisplay?.DISTORTED ?? 0) +
                (totalsToDisplay?.FAVORABLE_JUDGMENT ?? 0)
              }
            />
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}
