import { changePassword } from "@api/user";
import { authSelector } from "@store/authSlice";
import { PASSWORD_CONFIRM_RULES, PASSWORD_RULES } from "@utils/inputRules";
import { Divider, Input, Button, Form, message, Col, Typography } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

export const PasswordSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { userData } = useSelector(authSelector);

  const handleSubmit = async () => {
    if (!loading) {
      setLoading(true);
      const { currentPassword, password } = await form.validateFields();
      try {
        if (userData?.user?.email) {
          await changePassword({
            email: userData?.user?.email,
            currentPassword,
            newPassword: password,
          });
          message.success("Contraseña cambiada con éxito");
          form.resetFields();
          setLoading(false);
        } else {
          throw new Error("No email set in state");
        }
      } catch (e: any) {
        const errorMessage = e.message;
        switch (true) {
          case errorMessage.includes("Incorrect username or password"):
            message.error(
              "No fue posible realizar el cambio, verifique su contraseña actual y vuelva a intentarlo"
            );
            break;
          case errorMessage.includes("Attempt limit exceeded"):
            message.error("Has excedido el limite de intentos, reintenta más tarde.");
            break;
          default:
            message.error("Hubo un error al cambiar la contraseña");
            break;
        }
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Typography.Title style={{ fontWeight: 500, fontSize: 18 }}>
        Cambiar contraseña
      </Typography.Title>
      <Form
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        className="flex flex-col lg:flex-row lg:items-end w-full lg:w-7/12 gap-5 h-1/2"
      >
        <Col className="flex-1 flex flex-col justify-start">
          <Form.Item
            name="currentPassword"
            rules={[{ required: true, message: "Contraseña actual faltante" }]}
            className="my-1"
          >
            <Input.Password
              id="adv-current-password"
              placeholder="Contraseña actual"
              disabled={loading}
              size="small"
            />
          </Form.Item>

          <Form.Item name="password" rules={PASSWORD_RULES} className="my-1">
            <Input.Password
              id="adv-new-password"
              placeholder="Contraseña nueva"
              disabled={loading}
              size="small"
            />
          </Form.Item>

          <Form.Item name="password_confirmation" rules={PASSWORD_CONFIRM_RULES} className="my-1">
            <Input.Password
              id="adv-new-password-confirmation"
              placeholder="Confirmar nueva contraseña"
              disabled={loading}
              size="small"
            />
          </Form.Item>
        </Col>

        <Button
          id="adv-submit-button"
          type="primary"
          loading={loading}
          disabled={loading}
          htmlType="submit"
          size="small"
          className="mb-2"
        >
          Cambiar
        </Button>
      </Form>
      <Divider />
    </div>
  );
};
