import { useEffect, useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import s from "./SetPassword.module.scss";
import * as P from "@constants/PageIds";
import { useAppDispatch } from "@store/store";
import { authSelector } from "@store/authSlice";
import { authChallenge } from "@api/user";
import login from "@store/authSlice/login";
import FormHeader from "@components/ui/FormHeader";
import { PASSWORD_CONFIRM_RULES, PASSWORD_RULES } from "@utils/inputRules";

export default function SetPassword() {
  const { error, status, challengeName, challengeSession, email } = useSelector(authSelector);
  // const history = useHistory()
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!status || status !== 428) {
      // history.push(P.LOGIN.path)
      navigate(P.LOGIN.path);
    }
  }, [status, history]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleSubmit = async () => {
    if (!loading) {
      setLoading(true);
      if (challengeName && challengeSession && email) {
        const { password } = await form.validateFields();
        try {
          await authChallenge(challengeName, challengeSession, email, password);
          message.loading("Contraseña cambiada, iniciando sesión...", 3);
          setTimeout(() => {
            dispatch(login({ email, password }));
          }, 3000);
        } catch {
          message.error("Hubo un error al cambiar la contraseña");
          setLoading(false);
        }
      }
    }
  };

  return (
    <>
      <div className={s.FlexWrapper}>
        <div className={s.MainSection}>
          <FormHeader />
          <Card className={s.Card}>
            <h5 className={s.Title}>Cambiar contraseña</h5>
            <h6 className={s.Text}>Es necesario configurar su nueva contraseña</h6>
            <Form form={form} onFinish={handleSubmit} autoComplete="off">
              <Form.Item name="password" rules={PASSWORD_RULES}>
                <Input.Password
                  id="set-password-input"
                  placeholder="Contraseña nueva"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item name="password_confirmation" rules={PASSWORD_CONFIRM_RULES}>
                <Input.Password
                  id="set-password-confirm-input"
                  placeholder="Confirmar nueva contraseña"
                  disabled={loading}
                />
              </Form.Item>
              <Button
                id="set-password-submit-button"
                type="primary"
                loading={loading}
                disabled={loading}
                htmlType="submit"
              >
                Continuar
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
}
