import { DisconnectOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, message, Modal } from "antd";
import type { MenuProps } from "antd";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { updatePermissions } from "@api/user";
import usePermissions from "@hooks/usePermissions";
import { authSelector } from "@store/authSlice";
import getUsers from "@store/userSlice/getUsers";
import UserEdit from "./UserEdit";
import { useAppDispatch } from "@store/store";

type Props = {
  user: UserWithPermissions;
};

export default function UserActions(props: Props) {
  const { user } = props;
  const { userData } = useSelector(authSelector);
  const { canEditUsers, isWorkspaceOwner } = usePermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [unlinkModal, setUnlinkModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const onUnlink = async () => {
    setLoading(true);
    try {
      const companiesToUnlink: { [key: string]: string[] } = {};
      user.permissions.forEach((p) => {
        companiesToUnlink[p.identifier] = [];
      });
      await updatePermissions({
        emails: [user.email],
        permissions: companiesToUnlink,
      });
      message.success("Usuario desvinculado");
      setUnlinkModal(false);
      dispatch(getUsers());
    } catch {
      message.error("Error al desvincular usuario");
    }
    setLoading(false);
  };

  const companies = useMemo(() => {
    const c: number[] = [];
    user.permissions.forEach((p) => {
      c.push(p.companyId);
    });
    return c;
  }, [user]);

  const roles = useMemo(() => {
    const rMap = new Map<string, boolean>();
    user.permissions.forEach((p) => {
      p.roles.forEach((r) => {
        rMap.set(r, true);
      });
    });
    return Array.from(rMap.keys());
  }, [user]);

  const menu = useMemo<MenuProps["items"]>(() => {
    const menuItems: MenuProps["items"] = [
      {
        key: "unlink",
        label: "Desvincular",
        icon: <DisconnectOutlined />,
        onClick: () => setUnlinkModal(true),
      },
    ];
    if (canEditUsers) {
      menuItems.unshift({
        key: "edit-access",
        label: "Editar acceso",
        icon: <EditOutlined />,
        onClick: () => setModalVisible(true),
      });
    }
    return menuItems;
  }, []);

  if (user.id === userData?.user.id) {
    return null;
  }

  return (
    <>
      {isWorkspaceOwner ? (
        <Dropdown menu={{ items: menu }} placement="bottomRight">
          <Button icon={<MoreOutlined />} type="link" style={{ color: "black" }} />
        </Dropdown>
      ) : null}
      <UserEdit
        visible={modalVisible}
        setVisible={setModalVisible}
        userValues={{
          emails: [user.email],
          roles,
          companies,
        }}
        editMode
      />
      <Modal
        title="¿Está seguro que desea desvincular este usuario?"
        open={unlinkModal}
        closable={false}
        footer={[
          <Button key="back" onClick={() => setUnlinkModal(false)} disabled={loading}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={onUnlink}
            data-test="unlick-account"
          >
            Desvincular
          </Button>,
        ]}
      >
        <p>
          Esta acción no se puede deshacer. Si desvincula un usuario, no podrá acceder a la
          aplicación.
        </p>
      </Modal>
    </>
  );
}
