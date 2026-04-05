import RelatedCFDIColumns from "@components/cfdis/RelatedCFDIColumns";
import { Table } from "antd";

type Props = {
  cfdi: CFDI | undefined;
  loading: boolean | undefined;
  setCFDIToDisplay: (cfdi: string) => void;
  setIsRelatedModal: (status: boolean) => void;
};

export default function PPDTable(props: Props) {
  const { cfdi, loading, setCFDIToDisplay, setIsRelatedModal } = props;
  const prCount = cfdi?.pr_count as number;
  return (
    <Table
      pagination={false}
      rowKey={(record, key) => key + record.UUID_related + record.ImpPagado}
      size="small"
      dataSource={Array.isArray(cfdi?.pays) ? cfdi?.pays : []}
      style={{ marginTop: "16px" }}
      scroll={{ y: 400, x: 20 }}
      loading={loading}
      columns={RelatedCFDIColumns({ setCFDIToDisplay, setIsRelatedModal, prCount })}
    />
  );
}
