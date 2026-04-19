import React, { useState } from "react";
import { Card, Form, Input, Button, message, Checkbox } from "antd";
import { useNavigate, useParams } from "react-router";
import s from "./Signup.module.scss";
import * as P from "@constants/PageIds";
import { registerNewUser } from "@api/user";
import {
  EMAIL_RULES,
  PASSWORD_CONFIRM_RULES,
  PASSWORD_RULES,
  PHONE_RULES,
} from "@utils/inputRules";
import FormHeader from "@components/ui/FormHeader";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const params = useParams<{ source: string | undefined }>();
  // const history = useHistory()
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async () => {
    const { name, phone, email, password } = form.getFieldsValue(true);
    setLoading(true);
    try {
      await registerNewUser(name, email.toLowerCase(), phone, password, params.source);
      form.resetFields();
      navigate(`${P.LOGIN.path}?msg=NA_SUCCESS`);
    } catch (e: any) {
      const status = e.response?.status ?? e.request?.status;
      const raw =
        (typeof e.response?.data?.Message === "string" && e.response.data.Message) ||
        (typeof e.request?.response === "string" && e.request.response) ||
        "";
      if (status === 403) {
        message.error("El correo ya esta registrado");
      } else if (raw.includes("Source name") && raw.includes("does not exist")) {
        message.error(
          "El código de distribuidor no existe, verifica que esté correctamente escrito en la URL e intenta de nuevo",
          9
        );
      } else {
        message.error("Error al crear la cuenta");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className={s.FlexWrapper}>
        <div className={s.MainSection}>
          <FormHeader linkEnabled={!params.source} />
          <Card className={s.Card}>
            <h5 className={s.Title}>Crear una cuenta</h5>
            <Form
              form={form}
              onFinish={onFinish}
              autoComplete="off"
              initialValues={{ source: params.source }}
            >
              <Form.Item name="name" rules={[{ required: true, message: "Nombre faltante" }]}>
                <Input
                  id="signup-name-input"
                  placeholder="Nombre completo"
                  type="text"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item name="email" rules={EMAIL_RULES}>
                <Input
                  id="signup-email-input"
                  placeholder="Correo"
                  type="email"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item name="phone" rules={PHONE_RULES}>
                <Input
                  id="signup-phone-input"
                  placeholder="Celular"
                  type="text"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item name="password" rules={PASSWORD_RULES}>
                <Input.Password
                  id="signup-password-input"
                  placeholder="Contraseña"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item name="password_confirmation" rules={PASSWORD_CONFIRM_RULES}>
                <Input.Password
                  id="signup-password-confirmation-input"
                  placeholder="Confirmar contraseña"
                  disabled={loading}
                />
              </Form.Item>

              {params.source ? (
                <Form.Item name="source">
                  <Input id="signup-source-input" disabled />
                </Form.Item>
              ) : null}
              <Form.Item>
                <Form.Item
                  name="terms"
                  valuePropName="checked"
                  initialValue={false}
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject("Es necesario aceptar los términos y condiciones"),
                    },
                  ]}
                  style={{ margin: 0 }}
                >
                  <Checkbox disabled={loading}>
                    {"  "}He leído y acepto los{" "}
                    <a
                      href="https://ezaudita.com/terminos-y-condiciones/"
                      target="_blank"
                      style={{ color: "#0070b3" }}
                      rel="noopener noreferrer"
                    >
                      términos y condiciones.
                    </a>
                  </Checkbox>
                </Form.Item>
                <Button
                  id="signup-submit-button"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Continuar
                </Button>
              </Form.Item>
            </Form>
            <p style={{ textAlign: "center", fontSize: "1.2rem" }}>¿Ya tienes cuenta?</p>
            <Button id="login-button" type="default" onClick={() => navigate(P.LOGIN.path)}>
              Iniciar Sesión
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
