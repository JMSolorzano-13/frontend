import { optionsPagination } from "@utils/global/numberPagination";
import { IDoctoRelacionadoTable } from "../_types/RelatedDocsTable";
import IVADoctoRelacionadoColumns from "../_utils/IVADoctoRelacionadoColumns";
import { Table, Typography } from "antd";

export default function DoctoRelacionadoTable(props: IDoctoRelacionadoTable) {
  const {
    dataSource,
    loading,
    doctosTableMeta,
    setDoctosTableMeta,
    totalDoctoRelacionados,
    tab,
    setCFDIModalVisible,
    setCFDIToDisplay,
    doctoUUIDs,
    setDoctoUUIDs,
  } = props;
  return (
    <>
      <Typography.Title
        style={{ fontSize: "16px", marginBottom: 20, marginTop: 10 }}
        id={`iva_title_table_header_${tab}`}
      >
        Documentos relacionados
      </Typography.Title>
      <Table
        rowKey={(record) => record.UUID_related + Math.random()}
        columns={IVADoctoRelacionadoColumns({
          setCFDIModalVisible,
          setCFDIToDisplay,
          doctoUUIDs,
          setDoctoUUIDs,
          sorter: doctosTableMeta.sorter
        })}
        scroll={{ y: 420, x: 10 }}
        loading={loading}
        size="small"
        dataSource={dataSource}
        onChange={setDoctosTableMeta}
        pagination={{
          showTotal: (total) =>
            total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
          defaultCurrent: 1,
          current: doctosTableMeta?.pagination.current,
          pageSizeOptions: optionsPagination,
          pageSize: doctosTableMeta?.pagination.pageSize,
          total: totalDoctoRelacionados,
          showSizeChanger: true,
        }}
      />
    </>
  );
}
