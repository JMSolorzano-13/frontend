import { TableMeta } from "@hooks/useTableMeta";
import { TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { updateDoctosType } from "./StateTypes";

export type RelatedDocto = {
  created_at: string;
  payment_related: {
    FechaPago: string;
    FormaDePagoP: string;
    c_forma_pago: {
      name: string;
    };
  };
  cfdi_related: {
    // Serie: string;
    // Folio: string;
    UsoCFDIReceptor: string;
    Fecha: string;
    is_too_big: boolean;
  };
  cfdi_origin: {
    Fecha: string;
    Serie: string;
    Folio: string;
    RfcEmisor: string;
    NombreEmisor: string;
  };
  Serie: string;
  Folio: string;
  UUID_related: string;
  UUID: string;
  ObjetoImpDR: string;
  BaseIVA16: number;
  BaseIVA8: number;
  BaseIVA0: number;
  BaseIVAExento: number;
  IVATrasladado16: number;
  IVATrasladado8: number;
  TrasladosIVAMXN: number;
  RetencionesIVAMXN: number;
  ImpPagadoMXN: number;
  ExcludeFromIVA: boolean;
  identifier: string;
};

export interface IDoctoRelacionadoTable {
  dataSource: RelatedDocto[];
  loading: boolean;
  doctosTableMeta: TableMeta<RelatedDocto>;
  setDoctosTableMeta: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RelatedDocto> | SorterResult<any>[]
  ) => void;
  totalDoctoRelacionados: number;
  tab: TabIVAType;
  setCFDIToDisplay: (visible: string) => void;
  setCFDIModalVisible: (state: boolean) => void;
  doctoUUIDs: updateDoctosType;
  setDoctoUUIDs: (state: updateDoctosType) => void;
}
export interface PropsColumnsDoctoTable {
  setCFDIToDisplay: (visible: string) => void;
  setCFDIModalVisible: (state: boolean) => void;
  doctoUUIDs: updateDoctosType;
  setDoctoUUIDs: (state: updateDoctosType) => void;
  sorter: SorterResult<RelatedDocto>[];
}
