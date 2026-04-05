import { Button, Space, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FileExcelOutlined, FileSearchOutlined, MoreOutlined } from "@ant-design/icons";
import { ADD_CFDI_Types } from "@constants/Enums";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { SorterResult } from "antd/lib/table/interface";

function translateAction(action: ADDActionType, Estatus: boolean) {
  if (action === "Cancel") return "Cancelar";
  if (action === "Send") return "Enviar";
  if (action === "Both" && Estatus) {
    return "Enviar";
  } else if (action === "Both" && !Estatus) {
    return "Enviar y cancelar";
  }

  return "Ninguno";
}

interface ExtraColsType {
  tab: ADD_CFDI_Types;
  setCFDIToDisplay?: (displayCFDI: string) => void;
  setCfdiOnModal: (cfdi: CFDI) => void;
  setModalVisible: (visible: boolean) => void;
  sorter: SorterResult<ADDCFDI>[];
  activeRadioDomain: Domain;
}

export default function getExtraCols(props: ExtraColsType) {
  const { setCFDIToDisplay, setCfdiOnModal, setModalVisible, sorter, activeRadioDomain } = props;

  const handleVisibleModal = (record: CFDI) => {
    if (setCFDIToDisplay) {
      setCFDIToDisplay(record.UUID);
      setCfdiOnModal(record);
      setModalVisible(true);
    }
  };

  const extraCols: ColumnsType<ADDCFDI> = [
    {
      title: <FileSearchOutlined style={{ marginTop: 7, marginLeft: 3, fontSize: 17 }} />,
      key: "extra",
      render: (_, record: CFDI) => (
        <Space style={{ display: "flex" }}>
          <Tooltip title="Ver detalles">
            <Button
              size="small"
              type="text"
              icon={<MoreOutlined />}
              onClick={() => {
                handleVisibleModal(record);
              }}
            />
          </Tooltip>
          {!record.from_xml ? (
            <div style={{ display: "flex" }}>
              <Tooltip title="Sin XML" placement="left">
                <FileExcelOutlined width={20} style={{ marginLeft: -5 }} />
              </Tooltip>
            </div>
          ) : null}
        </Space>
      ),
      align: "center",
      fixed: true,
      width: 60,
    },
    {
      title: "Operación a realizar",
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (value, _) => translateAction(value, _.Estatus),
    },
  ];

  if (
    (activeRadioDomain.length > 0 &&
      activeRadioDomain[0][0] === "Estatus" &&
      activeRadioDomain[0][1] === "=" &&
      activeRadioDomain[0][2] === false) ||
    activeRadioDomain.length === 0
  ) {
    extraCols.push({
      title: "Fecha cancelación",
      dataIndex: "FechaCancelacion",
      key: "FechaCancelacion",
      showSorterTooltip: false,
      sorter: true,
      sortOrder:
        sorter?.findIndex((s) => s.columnKey === "FechaCancelacion") === -1
          ? undefined
          : sorter?.find((s) => s.columnKey === "FechaCancelacion")?.order,
      render: (val) => formatDisplay(val, DisplayType.PUREDATE),
      width: 160,
      fixed: false,
    });
  }

  return extraCols;
}
