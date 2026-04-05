import { Button, Space, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SorterResult } from "antd/lib/table/interface";
import { FileExcelOutlined, FileSearchOutlined, MoreOutlined } from "@ant-design/icons";
import { DisplayType, formatDisplay } from "../formatDisplay";
import { CFDI_Types } from "@constants/Enums";

type Data = {
  setCfdiOnModal: (cfdi: CFDI) => void;
  setModalVisible: (visible: boolean) => void;
  setCFDIToDisplay?: (displayCFDI: string) => void;
  setPPDModalVisible?: (display: boolean) => void;
  tab: CFDI_Types;
  activeRadioDomain: Domain;
  sorter: SorterResult<CFDI>[];
  isEFOS?: boolean;
  setCFDITypeToRequest: (state: CFDI_Types) => void;
};

export default function getExtraCols(data: Data): ColumnsType<CFDI> {
  const {
    setCfdiOnModal,
    setModalVisible,
    activeRadioDomain,
    sorter,
    isEFOS,
    tab,
    setCFDIToDisplay,
    setCFDITypeToRequest,
  } = data;

  const handleVisibleModal = (record: CFDI) => {
    if (setCFDIToDisplay) {
      setCFDIToDisplay(record.UUID);
      setCfdiOnModal(record);
      setModalVisible(true);
      setCFDITypeToRequest(tab);
    }
  };

  const extraCols: ColumnsType<CFDI> = [
    {
      title: <FileSearchOutlined style={{ marginTop: 7, marginLeft: 3, fontSize: 17 }} />,
      key: "action",
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
      fixed: true,
      align: "center",
      width: 60,
    },
  ];

  if (isEFOS) {
    extraCols.push({
      title: "Estatus",
      dataIndex: "efos",
      render: (val) => {
        if (!val || !val.state) {
          return "Ninguno";
        }
        switch (val.state) {
          case "DEFINITIVE":
            return "Definitivo";
          case "DISTORTED":
            return "Desvirtuado";
          case "ALLEGED":
            return "Presunto";
          case "FAVORABLE_JUDGMENT":
            return "Sentencia favorable";
          default:
            return "Otro";
        }
      },
      key: "efos.state",
      width: 100,
    });
  }

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
