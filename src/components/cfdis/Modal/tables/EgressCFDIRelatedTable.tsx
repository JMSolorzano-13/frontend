
import CFDIEgressRelatedColumns from "@components/cfdis/CFDIEgressRelatedColumns";
import { Table } from "antd";

type EgressCFDIRelatedTableProps = {
  cfdiRelated?: CFDIRelationType[];
  setCFDIToDisplay: (cfdi: string) => void;
  setIsRelatedModal: (status: boolean) => void;
};

export default function EgressCFDIRelatedTable(props: EgressCFDIRelatedTableProps) {
  const { cfdiRelated, setCFDIToDisplay, setIsRelatedModal } = props;

  const data = cfdiRelated?.filter(
    (cr) => cr.cfdi_related.TipoDeComprobante === "I" && cr.cfdi_related.Estatus
  );

  return (
    <Table
      rowKey={(record, key) => record.TipoRelacion + key}
      dataSource={data}
      columns={CFDIEgressRelatedColumns({ setCFDIToDisplay, setIsRelatedModal })}
      size="small"
      style={{ width: 400, marginLeft: -8, marginTop: 4, marginBottom: 18 }}
      pagination={false}
      scroll={{ y: 120 }}
    />
  );
}
