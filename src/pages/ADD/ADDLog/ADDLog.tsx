import { useState, useEffect } from "react";
import { Card, Table, Row, Tooltip, Button } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { addSelector } from "@store/addSlice";
import { getSyncSearch } from "@store/addSlice/getSyncSearch";
import { ADDLogColumns } from "@utils/ADD/ADDLogColumns";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@store/store";
import { numberPagination, optionsPagination } from "@utils/global/numberPagination";
import Title from "antd/lib/typography/Title";
import { useCOIEnabled } from "@hooks/useCOI";

export default function ADDLog() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { syncSearch, syncSearchLoading } = useSelector(addSelector);
  const { coi_enabled } = useCOIEnabled();

  useEffect(() => {
    dispatch(getSyncSearch());
  }, []);

  const handleReloadSyncSearch = () => {
    setLoading(true);
    dispatch(getSyncSearch());
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <Title level={5} style={{ fontWeight: 400 }} id="title-bitacora-add">
        Bitácora de sincronización {coi_enabled ? "COI" : "ADD"}
      </Title>
      <Card>
        <Row style={{ display: "flex", justifyContent: "flex-end", marginBottom: 5 }}>
          <Tooltip title="Actualizar bitácora">
            <Button
              id="add-refresh-button"
              onClick={handleReloadSyncSearch}
              icon={<SyncOutlined />}
              loading={loading}
            />
          </Tooltip>
        </Row>
        <Table
          columns={ADDLogColumns()}
          dataSource={syncSearch}
          scroll={{ x: 10, y: 500 }}
          style={{ wordWrap: "unset" }}
          size="small"
          pagination={{
            showTotal: (total) =>
              total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
            defaultPageSize: numberPagination,
            pageSizeOptions: optionsPagination,
          }}
          loading={syncSearchLoading}
        />
      </Card>
    </>
  );
}
