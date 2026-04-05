import { Button, Col, Form, Input, message, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { updateUser } from "@api/user";
import { authSelector, setUsername } from "@store/authSlice";
import { useAppDispatch } from "@store/store";
import usePermissions from "@hooks/usePermissions";

export const ProfileSettings = () => {
  const { userData, error } = useSelector(authSelector);
  const { isWorkspaceOwner, isOwnerandInvited } = usePermissions();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) message.error("Error al reiniciar configuración");
  }, [error]);

  useEffect(() => {
    form.setFieldsValue({ username: userData?.user?.name });
  }, [userData]);
  const handleSubmit = async () => {
    if (!loading) {
      setLoading(true);
      const { username } = await form.validateFields();
      try {
        await updateUser({ name: username });
        message.success("Usuario actualizado con éxito");
        dispatch(setUsername({ username }));
        setLoading(false);
      } catch {
        message.error("Hubo un error al editar perfil");
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <Typography.Title style={{ fontWeight: 500, fontSize: 18, padding: 3 }}>
        Datos del usuario
      </Typography.Title>
      <div className="flex flex-1 flex-col h-full gap-4">
        <Row>
          <Typography.Text style={{ fontSize: 14, fontWeight: 300, marginRight: 10 }}>
            Cuenta:
          </Typography.Text>
          <Typography.Text style={{ fontWeight: "bold", color: "#0070b3" }}>
            {userData?.user.email}
          </Typography.Text>
        </Row>
        <Row>
          <Typography.Text style={{ fontSize: 14, fontWeight: 300, marginRight: 10 }}>
            Tipo de cuenta:
          </Typography.Text>
          <Typography.Text style={{ fontWeight: "bold", color: "#0070b3" }}>
            {isOwnerandInvited
              ? "Propietario / Invitado"
              : isWorkspaceOwner
              ? "Propietario"
              : "Invitado"}
          </Typography.Text>
        </Row>
        <Form
          form={form}
          onFinish={handleSubmit}
          autoComplete="off"
          requiredMark={false}
          layout="vertical"
          className="flex flex-col lg:flex-row gap-3 xl:items-center xl:justify-start"
        >
          <Typography.Text style={{ fontSize: 14, fontWeight: 300, marginRight: 10 }}>
            Nombre de usuario:
          </Typography.Text>
          <Col xs={{ span: 24 }} lg={{ span: 8 }}>
            <Form.Item
              name="username"
              className="m-0 p-0"
              rules={[{ required: true, message: "Nombre de usuario requerido" }]}
            >
              <Input
                id="adv-username"
                placeholder="Nombre del usuario"
                disabled={loading}
                size="small"
              />
            </Form.Item>
          </Col>
          <Button
            id="adv-save-button"
            type="primary"
            loading={loading}
            disabled={loading}
            htmlType="submit"
            size="small"
          >
            Actualizar
          </Button>
        </Form>
      </div>
    </div>
  );
};
