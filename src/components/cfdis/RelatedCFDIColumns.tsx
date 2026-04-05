import { ColumnGroupType, ColumnType } from "antd/lib/table";
import { Tag } from "antd";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";

interface Props {
  setCFDIToDisplay: (cfdi: string) => void;
  setIsRelatedModal: (status: boolean) => void;
  prCount: number;
}

export default function RelatedCFDIColumns({
  setCFDIToDisplay,
  setIsRelatedModal,
  prCount,
}: Props): (ColumnGroupType<paidData> | ColumnType<paidData>)[] {
  return [
    {
      title: `UUID ${prCount > 3 ? `- # Relacionados: ${prCount}` : ""}`,
      dataIndex: "UUID_related",
      key: "UUID_related",
      render: (val: string) => (
        <Tag
          onClick={() => {
            setCFDIToDisplay(val);
            setIsRelatedModal(true);
          }}
          style={{
            cursor: "pointer",
            marginBottom: 5,
            color: "#000000",
            backgroundColor: "rgba(9, 109, 217, 0.1)",
            border: "1px solid #1890FF",
            minWidth: "260px",
          }}
        >
          {val}
        </Tag>
      ),
      width: 285,
    },
    {
      title: "Folio",
      dataIndex: "Folio",
      key: "Folio",
      width: 75,
      sorter: (a, b) => a?.Folio?.localeCompare(b?.Folio),
      defaultSortOrder: "descend",
      showSorterTooltip: false,
    },
    {
      title: "Moneda",
      dataIndex: "MonedaDR",
      key: "MonedaDR",
      width: 75,
    },
    {
      title: "Objeto de impuesto",
      dataIndex: "ObjetoImpDR",
      key: "ObjetoImpDR",
      width: 80,
    },
    {
      title: "Método de pago",
      dataIndex: "MetodoDePagoDR",
      key: "MetodoDePagoDR",
      render: (_, record) => record?.cfdi_related?.MetodoPago || "",
      width: 80,
    },
    {
      title: "Parcialidad",
      dataIndex: "NumParcialidad",
      key: "NumParcialidad",
      width: 90,
    },
    {
      title: "Saldo anterior",
      dataIndex: "ImpSaldoAnt",
      key: "ImpSaldoAnt",
      render: (val: string | number | Date | null) => formatDisplay(val, DisplayType.MONEY),
      width: 120,
      align: "right",
    },
    {
      title: "Pagado",
      dataIndex: "ImpPagado",
      key: "ImpPagado",
      render: (val: string | number | Date | null) => formatDisplay(val, DisplayType.MONEY),
      width: 110,
      align: "right",
    },
    {
      title: "Saldo insoluto",
      dataIndex: "ImpSaldoInsoluto",
      key: "ImpSaldoInsoluto",
      render: (val: string | number | Date | null) => formatDisplay(val, DisplayType.MONEY),
      width: 110,
      align: "right",
    },
  ];
}
