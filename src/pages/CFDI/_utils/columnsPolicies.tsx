import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { CFDIKey, CFDIType } from "./CFDITypes";
import { CFDI_Types } from "@constants/Enums";
import { GetColumnModify } from "@components/global/getColumnModify";
import { tailwindColors } from "@utils/tailwindColors";

type Data = {
  setVisible: (visible: boolean) => void;
  setVisiblePolicy: (visible: boolean) => void;
  setCFDIToDisplay: (state: string) => void;
  setCFDITypeToRequest: (state: CFDI_Types) => void
};

export function movementsColumns(): ColumnsType<Relacion> {

  return [
    {
      title: "#",
      dataIndex: "numerador",
      key: "numerador",
      width: 40,
    },
    {
      title: "Cuenta contable",
      key: "cuenta_contable",
      dataIndex: "cuenta_contable",
      render: (value) => <GetColumnModify value={value} characters={15} />,
      width: 140,
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      width: 250,
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
      width: 150,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
    },
    {
      title: "Abono",
      dataIndex: "abono",
      key: "abono",
      width: 150,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
    },
    {
      title: "Cargo ME",
      dataIndex: "cargo_me",
      key: "cargo_me",
      width: 100,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
    },
    {
      title: "Abono ME",
      dataIndex: "abono_me",
      key: "abono_me",
      width: 100,
      render: (val) => formatDisplay(val, DisplayType.MONEY),
    },
    {
      title: "Referencia",
      dataIndex: "referencia",
      key: "referencia",
      render: (value) => <GetColumnModify value={value} characters={10} />,
      width: 120,
    },
    {
      title: "Concepto",
      dataIndex: "concepto",
      key: "concepto",
      render: (value) => <GetColumnModify value={value} characters={30} />,
      width: 255,
    },
  ];
}

export default function CFDIRelatedColumns(data: Data): ColumnsType<Relacion> {
  const { setVisible, setVisiblePolicy, setCFDIToDisplay, setCFDITypeToRequest } = data;
  const columns: ColumnsType<Relacion> = [
    {
      title: "Tipo",
      dataIndex: "TipoDeComprobante",
      key: "TipoDeComprobante",
      width: 60,
      render: (_: string, record: Relacion) => <span>{CFDIType[(record?.cfdi_related?.TipoDeComprobante) as CFDIKey]}</span>
    },
    {
      title: "Fecha expedición",
      dataIndex: "Fecha",
      key: "Fecha",
      width: 160,
      render: (_: string, record: Relacion) => record?.cfdi_related?.Fecha && <span>{moment.utc(record?.cfdi_related?.Fecha).format("DD/MM/YYYY")}</span>
    },
    {
      title: "Serie",
      dataIndex: "Serie",
      key: "Serie",
      width: 90,
      render: (_: string, record: Relacion) => <GetColumnModify value={record?.cfdi_related?.Serie || ''} characters={5} />

    },
    {
      title: "Folio",
      dataIndex: "Folio",
      key: "Folio",
      width: 90,
      render: (_: string, record: Relacion) => <GetColumnModify value={record?.cfdi_related?.Folio || ''} characters={5} />
    },
    {
      title: "RFC Emisor",
      dataIndex: "RfcEmisor",
      key: "RfcEmisor",
      width: 130,
      render: (_: string, record: Relacion) => <span>{record?.cfdi_related?.RfcEmisor || ''}</span>

    },
    {
      title: "Emisor",
      dataIndex: "NombreEmisor",
      key: "NombreEmisor",
      width: 250,
      render: (_: string, record: Relacion) => <GetColumnModify value={record?.cfdi_related?.NombreEmisor || ''} characters={18} />,
    },

    {
      title: "Total",
      dataIndex: "Total",
      key: "Total",
      width: 110,
      render: (_: string, record: Relacion) => record?.cfdi_related?.Total ? formatDisplay(record?.cfdi_related?.Total, DisplayType.MONEY) : ''

    },
    {
      title: "UUID",
      dataIndex: "UUID",
      key: "UUID",
      width: 240,
      render: (_, record: Relacion) => {
        if (record?.cfdi_related?.Folio) {
          return (
            <Tag
              key={record?.uuid_related}
              style={{
                cursor: 'pointer',
                marginBottom: 5,
                color: "#000",
                backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
                border: `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
                minWidth: "260px",
              }}
              onClick={() => {
                setVisible(true);
                setVisiblePolicy(false);
                setCFDIToDisplay(record?.uuid_related);
                setCFDITypeToRequest(record?.cfdi_related?.TipoDeComprobante as CFDI_Types || "I")
              }}
            >
              {record?.uuid_related}
            </Tag>

          )


        }
        return (
          <Tooltip title="Este CFDI no se encuentra en SiigoFiscal">
            <Tag
              key={record?.uuid_related}
              style={{
                cursor: 'default',
                marginBottom: 5,
                color: "#000",
                backgroundColor: tailwindColors?.sg_list?.bg || "rgba(9, 109, 217, 0.1)",
                border: `1px solid ${tailwindColors?.sg_list?.border}` || "1px solid #1890FF",
                minWidth: "260px",
                textDecoration: 'line-through'
              }}
            >
              {record?.uuid_related}
            </Tag>

          </Tooltip>
        )
      }


    },
  ];

  return columns;
}

