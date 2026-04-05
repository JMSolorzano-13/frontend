import { SettingOutlined } from "@ant-design/icons";
import TableColumnsEditor from "@components/columns/TableColumnsEditor";
import { Button, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useState } from "react";
import { useSelector } from "react-redux";
import saveUserConfig from "@store/authSlice/saveUserConfig";
import { authSelector } from "@store/authSlice";
import { fetchConfig } from "@api/config";
import { useAppDispatch } from "@store/store";

interface ADDEditColumnsType {
  columns: ColumnsType<any>;
  defaultColumns: TableLayout;
  table: string;
}

export default function ADDEditColumns(props: ADDEditColumnsType) {
  const { columns, defaultColumns, table } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { company } = useSelector(authSelector);

  const dispatch = useAppDispatch();

  async function onOk() {
    setLoading(true);
    await dispatch(saveUserConfig());
    if (company) {
      await fetchConfig(company);
    }
    setLoading(false);
    setVisible(false);
  }

  async function onCancel() {
    setVisible(false);
  }

  return (
    <>
      <Button icon={<SettingOutlined />} onClick={() => setVisible(true)}>
        Editar columnas
      </Button>
      <Modal
        title="Editar columnas"
        open={visible}
        onCancel={() => onCancel()}
        closable={false}
        footer={[
          <Button
            key="cancel"
            className="close-edit-columns-button"
            onClick={() => onCancel()}
            disabled={loading}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            className="save-edit-columns-button"
            type="primary"
            loading={loading}
            onClick={() => onOk()}
          >
            Guardar
          </Button>,
        ]}
      >
        <TableColumnsEditor table={table} defaultColumns={defaultColumns} allColumns={columns} />
      </Modal>
    </>
  );
}
