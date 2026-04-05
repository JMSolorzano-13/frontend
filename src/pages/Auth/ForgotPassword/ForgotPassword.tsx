import { useEffect, useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { useNavigate, useLocation } from "react-router";
import s from "./ForgotPassword.module.scss";
import * as P from "@constants/PageIds";
import { resetPassword, sendForgotPasswordEmail } from "@api/user";
import FormHeader from "@components/ui/FormHeader";
import { EMAIL_RULES, PASSWORD_CONFIRM_RULES, PASSWORD_RULES } from "@utils/inputRules";

export default function ForgotPassword() {
  const [form] = Form.useForm();
  // const history = useHistory()
  const navigate = useNavigate();
  const location = useLocation();
  const [codeSended, setCodeSended] = useState(false);
  const [loading, setLoading] = useState(false);
  const [urlCode] = useState(() => {
    return new URLSearchParams(location.search).get("code") || "";
  });
  const [urlEmail] = useState(() => {
    return new URLSearchParams(location.search).get("email") || "";
  });

  useEffect(() => {
    if (urlCode && urlEmail) {
      setCodeSended(true);
      form.setFieldsValue({
        code: urlCode,
        email: urlEmail,
      });
    }
  }, []);

  const handleSubmit = async () => {
    if (!loading) {
      setLoading(true);
      const fd = form.getFieldsValue(true);

      if (!codeSended) {
        const { email } = fd;
        try {
          await sendForgotPasswordEmail(email.toLowerCase());
        } catch (error: any) {
          const errorMessage = error.response.data.Message;
          switch (true) {
            case errorMessage.includes("InvalidParameterException"):
              message.error(
                "No se pudo enviar el correo, la cuenta ingresada no ha sido verificada."
              );
              break;
            case errorMessage.includes("LimitExceededException"):
              message.error(
                "No se pudo enviar el correo, ha excedido el límite de intentos, pruebe más tarde.",
                8
              );
              break;
            case errorMessage.includes("NotAuthorizedException"):
              message.error(
                "No se puede enviar el correo en el estado actual, pruebe iniciar sesión con su contraseña temporal o póngase en contacto con el área de soporte.",
                9
              );
              break;
            case errorMessage.includes("UserNotFoundException"):
              message.error("No se pudo enviar el correo, la cuenta ingresada no existe.");
              break;
            default:
              message.error("No se pudo enviar el correo, intente de nuevo");
              break;
          }
          setLoading(false);
          return;
        }
        message.success("Se ha enviado un correo con el código de verificación");
        setLoading(false);
        setCodeSended(true);
      } else {
        const { email, code, password } = fd;
        try {
          await resetPassword(email, password, code);
        } catch {
          message.error("No se pudo cambiar la contraseña, intente de nuevo");
          setLoading(false);
          return;
        }
        setLoading(false);
        message.success("Contraseña cambiada con éxito");
        navigate(P.LOGIN.path);
        // history.push(P.LOGIN.path)
      }
    }
  };

  return (
    <>
      <div className={s.FlexWrapper}>
        <div className={s.MainSection}>
          <FormHeader />
          <Card className={s.Card}>
            <h5 className={s.Title}>Recuperar cuenta</h5>
            <h6 style={{ marginBottom: 30 }}>
              {!codeSended
                ? "Ingrese su correo para mandarle un código de verificación y recuperar su cuenta"
                : "Ingrese el código que se envió a su correo y la nueva contraseña que quisiera usar"}
            </h6>
            <Form form={form} onFinish={handleSubmit} autoComplete="off">
              <Form.Item name="email" rules={EMAIL_RULES}>
                <Input
                  id="forgot-email-input"
                  placeholder="Correo"
                  disabled={loading || codeSended}
                  style={{ textTransform: "lowercase" }}
                />
              </Form.Item>
              {codeSended ? (
                <>
                  <Form.Item name="code" rules={[{ required: true, message: "Código faltante" }]}>
                    <Input
                      id="forgot-code-input"
                      placeholder="Código"
                      disabled={loading || urlCode !== ""}
                    />
                  </Form.Item>
                  <Form.Item name="password" rules={PASSWORD_RULES}>
                    <Input.Password
                      id="forgot-password-input"
                      placeholder="Nueva contraseña"
                      disabled={loading}
                    />
                  </Form.Item>
                  <Form.Item
                    id="forgot-password-confirm-input"
                    name="password_confirmation"
                    rules={PASSWORD_CONFIRM_RULES}
                  >
                    <Input.Password placeholder="Confirmar nueva contraseña" disabled={loading} />
                  </Form.Item>
                </>
              ) : null}
              <Button
                id="forgot-submit-button"
                type="primary"
                loading={loading}
                disabled={loading}
                htmlType="submit"
              >
                Continuar
              </Button>
            </Form>
            <Button id="login-button" type="default" onClick={() => navigate(P.LOGIN.path)}>
              Iniciar sesión
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
