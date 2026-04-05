import { ColumnsType } from "antd/es/table";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { PropsColumnsDoctoTable, RelatedDocto } from "../_types/RelatedDocsTable";
import { Button, Space, Switch, Tag, Tooltip } from "antd";
import { FileExcelOutlined, FileSearchOutlined, MoreOutlined } from "@ant-design/icons";
import { GetColumnModify } from "@components/global/getColumnModify";

export default function IVADoctoRelacionadoColumns({
  setCFDIModalVisible,
  setCFDIToDisplay,
  doctoUUIDs,
  setDoctoUUIDs,
  sorter,
}: PropsColumnsDoctoTable): ColumnsType<RelatedDocto> {
  const allColumns: ColumnsType<RelatedDocto> = [
    {
      title: <FileSearchOutlined style={{ marginTop: 7, marginLeft: 3, fontSize: 17 }} />,
      key: "action",
      render: (_, record) => (
        <Space style={{ display: "flex" }}>
          <Tooltip title="Ver detalles">
            <Button
              size="small"
              type="text"
              icon={<MoreOutlined />}
              onClick={() => {
                setCFDIToDisplay(record.UUID_related);
                setCFDIModalVisible(true);
              }}
            />
          </Tooltip>
          {record.cfdi_related.is_too_big ? (
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
    {
      title: "No considerar IVA",
      key: "ExcludedFromIVA",
      dataIndex: "ExcludedFromIVA",
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={record.ExcludeFromIVA}
            checked={
              doctoUUIDs?.some((u) => u.uuid === record.identifier) && !record.ExcludeFromIVA
                ? true
                : record.ExcludeFromIVA && !doctoUUIDs.some((u) => u.uuid === record.identifier)
                ? true
                : false
            }
            onChange={() => {
              if (!doctoUUIDs.some((u) => u.uuid === record.identifier)) {
                setDoctoUUIDs([
                  ...doctoUUIDs,
                  { uuid: record.identifier, currentValue: record.ExcludeFromIVA },
                ]);
                return;
              }
              const newArray = doctoUUIDs.filter((u) => u.uuid !== record.identifier);
              setDoctoUUIDs(newArray);
            }}
          />
        );
      },
      width: 140,
      align: "center",
    },
    {
      title: "Fecha de pago",
      key: "FechaPago",
      dataIndex: "payment_related.FechaPago",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FechaPago") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FechaPago")?.order,
      render: (_, record) => formatDisplay(record?.payment_related?.FechaPago, DisplayType.DATE),
      width: 140,
    },
    {
      title: "Fecha de emisión",
      key: "FechaCFDI",
      dataIndex: "cfdi_origin.Fecha",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FechaCFDI") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FechaCFDI")?.order,
      render: (_, record) => formatDisplay(record?.cfdi_origin?.Fecha, DisplayType.DATE),
      width: 170,
    },
    {
      title: "UUID",
      key: "UUIDPago",
      dataIndex: "UUIDPago",
      render: (_, record) => {
        return (
          <Tag
            style={{
              cursor: "pointer",
              marginBottom: 5,
              color: "#000000",
              backgroundColor: "rgba(9, 109, 217, 0.1)",
              border: "1px solid #1890FF",
              minWidth: "260px",
            }}
            onClick={() => {
              setCFDIToDisplay(record?.UUID);
              setCFDIModalVisible(true);
            }}
          >
            {record?.UUID}
          </Tag>
        );
      },
      width: 320,
    },
    {
      title: "Serie",
      key: "SeriePago",
      dataIndex: "cfdi_origin.Serie",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "SeriePago") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "SeriePago")?.order,
      render: (_, record) => record?.cfdi_origin?.Serie,
      width: 100,
    },
    {
      title: "Folio",
      key: "FolioPago",
      dataIndex: "cfdi_origin.Folio",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FolioPago") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FolioPago")?.order,
      render: (_, record) => record?.cfdi_origin?.Folio,
      width: 110,
    },
    {
      title: "RFC Emisor",
      key: "RfcEmisor",
      dataIndex: "cfdi_origin.RfcEmisor",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RfcEmisor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RfcEmisor")?.order,
      render: (_, record) => record?.cfdi_origin?.RfcEmisor,
      width: 140,
    },
    {
      title: "Emisor",
      key: "NombreEmisor",
      dataIndex: "cfdi_origin.NombreEmisor",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "NombreEmisor") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "NombreEmisor")?.order,
      render: (_, record) => (
        <GetColumnModify value={record?.cfdi_origin?.NombreEmisor} characters={31} />
      ),
      width: 320,
    },
    {
      title: "Forma de pago código",
      key: "FormaPagoCodigo",
      dataIndex: "payment_related.FormaDePagoP",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FormaPagoCodigo") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FormaPagoCodigo")?.order,
      render: (_, record) => record?.payment_related?.FormaDePagoP,
      width: 180,
    },
    {
      title: "Forma de pago",
      key: "FormaPago",
      dataIndex: "FormaPago",
      render: (_, record) => record?.payment_related?.c_forma_pago.name,
      width: 250,
    },
    {
      title: "DR - Serie",
      key: "SerieDR",
      dataIndex: "Serie",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "SerieDR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "SerieDR")?.order,
      width: 100,
    },
    {
      title: "DR - Folio",
      key: "FolioDR",
      dataIndex: "Folio",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FolioDR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FolioDR")?.order,
      width: 160,
    },
    {
      title: "DR - Fecha de emisión",
      key: "FechaDR",
      dataIndex: "cfdi_related.Fecha",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FechaDR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FechaDR")?.order,
      render: (_, record) => formatDisplay(record?.cfdi_related?.Fecha, DisplayType.DATE),
      width: 180,
    },
    {
      title: "DR - UUID",
      key: "DoctoRelacionadoUUID",
      dataIndex: "UUID_related",
      render: (_, record) => <GetColumnModify value={record.UUID_related} characters={37} />,
      width: 320,
    },
    {
      title: "DR - Uso de CFDI",
      key: "UsoCFDIDR",
      dataIndex: "cfdi_related.UsoCFDIReceptor",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "UsoCFDIDR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "UsoCFDIDR")?.order,
      render: (_, record) => record?.cfdi_related?.UsoCFDIReceptor,
      width: 150,
    },
    {
      title: "DR - Objeto de impuesto",
      key: "ObjetoImpDR",
      dataIndex: "ObjetoImpDR",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "ObjetoImpDR") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "ObjetoImpDR")?.order,
      width: 200,
    },
    {
      title: "DR - Base IVA 16%",
      key: "BaseIVA16",
      dataIndex: "BaseIVA16",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA16") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA16")?.order,
      render: (_, record) => formatDisplay(record?.BaseIVA16, DisplayType.MONEY),
      width: 160,
      align: "right",
    },
    {
      title: "DR - Base IVA 8%",
      key: "BaseIVA8",
      dataIndex: "BaseIVA8",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA8") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA8")?.order,
      render: (_, record) => formatDisplay(record?.BaseIVA8, DisplayType.MONEY),
      width: 150,
      align: "right",
    },
    {
      title: "DR - Base IVA 0%",
      key: "BaseIVA0",
      dataIndex: "BaseIVA0",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVA0") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVA0")?.order,
      render: (_, record) => formatDisplay(record?.BaseIVA0, DisplayType.MONEY),
      width: 150,
      align: "right",
    },
    {
      title: "DR - Base IVA Exento",
      key: "BaseIVAExento",
      dataIndex: "BaseIVAExento",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "BaseIVAExento") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "BaseIVAExento")?.order,
      render: (_, record) => formatDisplay(record?.BaseIVAExento, DisplayType.MONEY),
      width: 180,
      align: "right",
    },
    {
      title: "DR - IVA Acreditable 16%",
      key: "IVATrasladado16",
      dataIndex: "IVATrasladado16",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "IVATrasladado16") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "IVATrasladado16")?.order,
      render: (_, record) => formatDisplay(record?.IVATrasladado16, DisplayType.MONEY),
      width: 200,
      align: "right",
    },
    {
      title: "DR - IVA Acreditable 8%",
      key: "IVATrasladado8",
      dataIndex: "IVATrasladado8",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "IVATrasladado8") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "IVATrasladado8")?.order,
      render: (_, record) => formatDisplay(record?.IVATrasladado8, DisplayType.MONEY),
      width: 200,
      align: "right",
    },
    {
      title: "DR - IVA Acreditable Total",
      key: "TrasladosIVAMXN",
      dataIndex: "TrasladosIVAMXN",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "TrasladosIVAMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "TrasladosIVAMXN")?.order,
      render: (_, record) => formatDisplay(record?.TrasladosIVAMXN, DisplayType.MONEY),
      width: 200,
      align: "right",
    },
    {
      title: "DR - Retenciones IVA",
      key: "RetencionesIVAMXN",
      dataIndex: "RetencionesIVAMXN",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "RetencionesIVAMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "RetencionesIVAMXN")?.order,
      render: (_, record) => formatDisplay(record?.RetencionesIVAMXN, DisplayType.MONEY),
      width: 170,
      align: "right",
    },
    {
      title: "DR - Importe pagado",
      key: "ImpPagadoMXN",
      dataIndex: "ImpPagadoMXN",
      sorter: true,
      showSorterTooltip: false,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "ImpPagadoMXN") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "ImpPagadoMXN")?.order,
      render: (_, record) => formatDisplay(record?.ImpPagadoMXN, DisplayType.MONEY),
      width: 170,
      align: "right",
    },
  ];
  return allColumns;
}
