import { useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { Button, Grid, Modal, Typography } from "antd";
import { useAppDispatch } from "@store/store";
import resetUserConfig from "@store/authSlice/resetUserConfig";
import TableColumnsEditor from "./TableColumnsEditor";
import saveUserConfig from "@store/authSlice/saveUserConfig";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";
import { fetchConfig } from "@api/config";
import { ColumnsType } from "antd/lib/table";
import { CFDI_Types } from "@constants/Enums";

type Props = {
  table: string;
  defaultColumns: TableLayout;
  allColumns: ColumnsType<any>;
  detailsTable: string;
  defaultDetailsColumns: TableLayout;
  allDetailsColumns: ColumnsType<any>;
  tab?: CFDI_Types;
};

export default function CFDITablesColumnEditor(props: Props) {
  const {
    table,
    defaultColumns,
    allColumns,
    detailsTable,
    defaultDetailsColumns,
    allDetailsColumns,
    tab,
  } = props;
  const { useBreakpoint } = Grid;
  const { xl } = useBreakpoint();
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
        className="edit-columns-modal"
        title="Editar columnas"
        open={visible}
        onCancel={onCancel}
        style={xl ? { minWidth: 1000 } : {}}
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
        <div style={xl ? { display: "flex", gap: 25 } : {}}>
          <div style={{ marginBottom: 16 }}>
            <Typography.Text style={{ fontWeight: 600, fontSize: 17 }}>Encabezados</Typography.Text>
            <TableColumnsEditor
              table={table}
              defaultColumns={defaultColumns}
              allColumns={allColumns}
            />
          </div>
          <div>
            <Typography.Text style={{ fontWeight: 600, fontSize: 17 }}>
              {tab === "P" ? "Documentos relacionados" : "Detalles"}
            </Typography.Text>
            <TableColumnsEditor
              table={detailsTable}
              defaultColumns={defaultDetailsColumns}
              allColumns={allDetailsColumns}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
