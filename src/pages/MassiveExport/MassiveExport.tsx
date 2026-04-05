import { SyncOutlined } from "@ant-design/icons";
import { Button, Card, Space, Table, Tooltip, Tabs } from "antd";
import Title from "antd/lib/typography/Title";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { cfdiSelector } from "@store/cfdiSlice";
import { getCFDIMassiveExport } from "@store/cfdiSlice/getCFDIMassiveExport";
import { getIVAExport } from "@store/cfdiSlice/getIVAExports";
import getMassiveExportColumns, {
  getISRExportColumns,
  getIVAExportColumns,
} from "./massiveExportColumns";
import { useAppDispatch } from "@store/store";
import { useNavigate } from "react-router-dom";
import editSearchParams from "@utils/editSearchParams";
import useTableMeta from "@hooks/useTableMeta";
import parseTableMeta from "@utils/CFDI/parseTableMeta";
import { DEFAULT_CFDI_EXPORTS_TABLE_META, DEFAULT_IVA_EXPORTS_TABLE_META } from "@constants/Extra";
import usePermissions from "@hooks/usePermissions";

export default function MassiveExport() {
  const {
    cfdiExports,
    isFetchingExports,
    isFetchingIVAExports,
    ivaExports,
    cfdiExportsQty,
    ivaExportsQty,
  } = useSelector(cfdiSelector);
  const navigate = useNavigate();

  const selectedTabType = new URLSearchParams(window.location.search).get("tab");
  const { canAccessPayroll } = usePermissions();

  function changeTabHandler(keyTab: string) {
    navigate(
      editSearchParams(location.search, [{ key: "tab", value: keyTab }], {
        baseUrl: location.pathname,
      }),
      { replace: true }
    );
  }

  const [cfdiTableMeta, setCFDITableMeta] = useTableMeta<CFDIExport>(
    DEFAULT_CFDI_EXPORTS_TABLE_META
  );
  const [ivaTableMeta, setIVATableMeta] = useTableMeta<IVAExport>(DEFAULT_IVA_EXPORTS_TABLE_META);

  const dispatch = useAppDispatch();
  const handleGetExports = () => {
    if (selectedTabType === "cfdis") {
      const { orderBy, limit, offset } = parseTableMeta<CFDIExport>(cfdiTableMeta);
      dispatch(
        getCFDIMassiveExport({
          options: {
            orderBy,
            limit,
            offset,
            domain: canAccessPayroll
              ? []
              : [
                  ["cfdi_type", "!=", "N"],
                  ["cfdi_type", "!=", "Nconceptos"],
                ],
          },
        })
      );
    } else if (selectedTabType === "iva") {
      const { orderBy, limit, offset } = parseTableMeta<IVAExport>(ivaTableMeta);
      dispatch(
        getIVAExport({
          options: {
            orderBy,
            limit,
            offset,
          },
        })
      );
    } else if (selectedTabType === "isr") {
      const { orderBy, limit, offset } = parseTableMeta<IVAExport>(ivaTableMeta);
      dispatch(
        getIVAExport({
          options: {
            orderBy,
            limit,
            offset,
          },
          isr: true,
        })
      );
    } else {
      const { orderBy, limit, offset } = parseTableMeta<CFDIExport>(cfdiTableMeta);
      dispatch(
        getCFDIMassiveExport({
          options: {
            orderBy,
            limit,
            offset,
            domain: canAccessPayroll
              ? []
              : [
                  ["cfdi_type", "!=", "N"],
                  ["cfdi_type", "!=", "Nconceptos"],
                ],
          },
        })
      );
    }
  };

  useEffect(() => {
    handleGetExports();
  }, [cfdiTableMeta, ivaTableMeta, selectedTabType, canAccessPayroll]);

  function handleRenderTable(key: string) {
    if (key === "cfdis") {
      return (
        <Table
          rowKey="identifier"
          size="small"
          columns={getMassiveExportColumns(cfdiTableMeta.sorter, handleGetExports)}
          loading={isFetchingExports}
          dataSource={cfdiExports}
          onChange={setCFDITableMeta}
          scroll={{ x: 10, y: 550 }}
          style={{ marginTop: 20 }}
          pagination={{
            defaultCurrent: 1,
            current: cfdiTableMeta?.pagination.current,
            pageSize: cfdiTableMeta?.pagination.pageSize,
            total: cfdiExportsQty <= 50 ? cfdiExportsQty : 50,
            showSizeChanger: true,
            showTotal: (total) =>
              total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
          }}
        />
      );
    }
    if (key == "iva") {
      return (
        <Table
          rowKey="identifier"
          size="small"
          columns={getIVAExportColumns(ivaTableMeta.sorter, handleGetExports)}
          loading={isFetchingIVAExports}
          dataSource={ivaExports}
          onChange={setIVATableMeta}
          scroll={{ x: 10, y: 550 }}
          style={{ marginTop: 20 }}
          pagination={{
            defaultCurrent: 1,
            current: ivaTableMeta?.pagination.current,
            pageSize: ivaTableMeta?.pagination.pageSize,
            total: ivaExportsQty <= 50 ? ivaExportsQty : 50,
            showSizeChanger: true,
            showTotal: (total) =>
              total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
          }}
        />
      );
    } else {
      return (
        <Table
          rowKey="identifier"
          size="small"
          columns={getISRExportColumns(ivaTableMeta.sorter, handleGetExports)}
          loading={isFetchingIVAExports}
          dataSource={ivaExports}
          onChange={setIVATableMeta}
          scroll={{ x: 10, y: 550 }}
          style={{ marginTop: 20 }}
          pagination={{
            defaultCurrent: 1,
            current: ivaTableMeta?.pagination.current,
            pageSize: ivaTableMeta?.pagination.pageSize,
            total: ivaExportsQty <= 50 ? ivaExportsQty : 50,
            showSizeChanger: true,
            showTotal: (total) =>
              total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
          }}
        />
      );
    }
  }

  return (
    <>
      <Title level={5} style={{ fontWeight: 400 }} id="title-exportaciones">
        Exportaciones
      </Title>
      <Card style={{ position: "relative" }}>
        <Space style={{ position: "absolute", right: 24, top: 16, zIndex: 100 }}>
          <Tooltip overlay="Actualizar">
            <Button
              icon={<SyncOutlined spin={isFetchingExports} />}
              onClick={handleGetExports}
              disabled={isFetchingExports}
            />
          </Tooltip>
        </Space>
        <Tabs
          defaultActiveKey={selectedTabType || "cfdis"}
          type="card"
          size="small"
          onChange={(key: string) => changeTabHandler(key)}
          items={[
            { key: "cfdis", label: "CFDIs" },
            { key: "iva", label: "Detalle de base IVA" },
            { key: "isr", label: "Detalle de base ISR" },
          ].map((item) => ({
            label: item.label,
            key: item.key,
            children: handleRenderTable(item.key),
          }))}
        />
      </Card>
    </>
  );
}
