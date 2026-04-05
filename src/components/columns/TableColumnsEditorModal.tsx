import { SettingOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchConfig } from "@api/config";
import { authSelector } from "@store/authSlice";
import TableColumnsEditor from "./TableColumnsEditor";
import { useAppDispatch } from "@store/store";
import resetUserConfig from "@store/authSlice/resetUserConfig";
import saveUserConfig from "@store/authSlice/saveUserConfig";

type Props = {
  table: string;
  defaultColumns: TableLayout;
  allColumns: ColumnsType<any>;
  dataTest: string;
};

export default function TableColumnsEditorModal(props: Props) {
  const { table, defaultColumns, allColumns } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { company } = useSelector(authSelector);

  const onCancel = async () => {
    setLoading(true);
    await dispatch(resetUserConfig());
    setLoading(false);
    setVisible(false);
  };

  const onOk = async () => {
    setLoading(true);
    await dispatch(saveUserConfig());
    if (company) {
      await fetchConfig(company);
    }
    setLoading(false);
    setVisible(false);
  };

  return (
    <>
      <Button icon={<SettingOutlined />} onClick={() => setVisible(true)}>
        Editar columnas
      </Button>
      <Modal
        title="Editar columnas"
        open={visible}
        onCancel={onCancel}
        closable={false}
        footer={[
          <Button
            key="cancel"
            className="close-edit-columns-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            className="save-edit-columns-button"
            type="primary"
            loading={loading}
            onClick={onOk}
          >
            Guardar
          </Button>,
        ]}
      >
        <TableColumnsEditor table={table} defaultColumns={defaultColumns} allColumns={allColumns} />
      </Modal>
    </>
  );
}
