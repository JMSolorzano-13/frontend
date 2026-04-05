import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import { ColumnsType } from "antd/lib/table";

export const conceptColumns: ColumnsType<CFDIConcept> = [
  {
    title: "Clave producto",
    dataIndex: "ClaveProducto",
    key: "ClaveProducto",
    width: 120,
  },
  {
    title: "Cantidad",
    dataIndex: "Cantidad",
    key: "Cantidad",
    width: 80,
  },
  {
    title: "Clave unidad",
    dataIndex: "ClaveUnidad",
    key: "ClaveUnidad",
    width: 110,
  },
  {
    title: "Concepto(s)",
    dataIndex: "Descripcion",
    key: "Descripcion",
    width: 300,
  },
  {
    title: "Precio unitario",
    dataIndex: "PrecioUnitario",
    key: "PrecioUnitario",
    render: (val: string | number | Date | null) => formatDisplay(val, DisplayType.MONEY),
    width: 120,
    align: "right",
  },
  {
    title: "Importe",
    dataIndex: "Importe",
    key: "Importe",
    render: (val: string | number | Date | null) => formatDisplay(val, DisplayType.MONEY),
    width: 110,
    align: "right",
  },
];
