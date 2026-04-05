import { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Alert } from "antd";
import { Navigate, useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import s from "./Login.module.scss";
import * as P from "@constants/PageIds";
import { authSelector, setCompany, setWasUserChanged } from "@store/authSlice";
import login from "@store/authSlice/login";
import { EMAIL_RULES } from "@utils/inputRules";
import FormHeader from "@components/ui/FormHeader";
import { useAppDispatch } from "@store/store";
import { getAllCompanies } from "@rules/UserDataHelper";
import _ from "lodash";
import LoadingScreen from "@components/ui/LoadingScreen";
import { getCognitoLoginUrl } from "@utils/SIIGO/cognito_urls";
import { getCookie } from "@utils/cookies";
import { IS_SIIGO, NEEDS_EZ_LOGIN } from "@utils/SIIGO/Global";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isFetching, isLogged, status, error, userData, customErrorMessage } =
    useSelector(authSelector);
  const [form] = Form.useForm();

  const token = getCookie("token");
  const company = localStorage.getItem("lastCompany");
  const companyRedirect = localStorage.getItem("companyRedirect");
  const [cantLogin, setCantLogin] = useState(false);
  const [showNotWorkspaceWarning, setNotWorkspaceWarning] = useState(false);

  useEffect(() => {
    if (token) dispatch(login({ token }));
  }, []);

  useEffect(() => {
    // Este código sólo debería afectar a ezaudita
    if (!IS_SIIGO || NEEDS_EZ_LOGIN) {
      if (error) {
        setNotWorkspaceWarning(false);
        if (status === 403 && customErrorMessage) {
          console.error("Error 403");
          setCantLogin(true);
        } else if (error && error.includes("No hay workspace")) {
          setNotWorkspaceWarning(true);
        } else {
          console.error("Error from login");
          message.error(error);
        }
      }
    }
  }, [error]);

  useEffect(() => {
    if (status && status === 428) {
      // history.push(P.SETPASSWORD.path)
      navigate(P.SETPASSWORD.path);
    }
  }, [status]);

  if (IS_SIIGO && !NEEDS_EZ_LOGIN) {
    if ((isLogged || token) && (company || companyRedirect)) {
      const redString = location.search.includes("redirect=")
        ? location.search.split("redirect=")[1]
        : null;
      if (redString) {
        return <Navigate to={redString} />;
      }
      return <Navigate to={P.DASHBOARD.path} />;
    }
  } else {
    if (isLogged && company) {
      const redString = location.search.includes("redirect=")
        ? location.search.split("redirect=")[1]
        : null;
      if (redString) {
        // redirect(redString);
        return <Navigate to={redString} />;
      }
      // redirect(P.DASHBOARD.path);
      return <Navigate to={P.DASHBOARD.path} />;
    }
  }

  if (isLogged) {
    const redirectString = location.search.includes("redirect=")
      ? location.search.split("redirect=")[1]
      : null;

    if (redirectString && company) {
      const cid = new URLSearchParams(redirectString.split("?")[1]).get("cid");
      if (cid) {
        const companies = getAllCompanies(userData);
        const isSameAccount = _.find(companies, ["key", cid]);
        if (!isSameAccount) {
          dispatch(setWasUserChanged(true));
          return (
            <Navigate to={IS_SIIGO && !NEEDS_EZ_LOGIN ? P.DASHBOARD.path : P.SELECTCOMPANY.path} />
          );
        }
        dispatch(setCompany(cid));
      } else if (userData) {
        const access = Object.keys(userData.access);
        if (access.length === 0 && NEEDS_EZ_LOGIN) {
          return (
            <Navigate to={IS_SIIGO && !NEEDS_EZ_LOGIN ? P.DASHBOARD.path : P.SELECTCOMPANY.path} />
          );
        } else if (access.length < 2) {
          const { companies } = userData.access[access[0]];
          if (Object.keys(companies).length > 1) {
            return (
              <Navigate
                to={
                  IS_SIIGO && !NEEDS_EZ_LOGIN
                    ? `${P.DASHBOARD.path}?redirect=${redirectString}`
                    : `${P.SELECTCOMPANY.path}?redirect=${redirectString}`
                }
              />
            );
          }
          if (Object.keys(companies).length === 0 && !IS_SIIGO) {
            window.location.href = P.SELECTCOMPANY.path;
          } else {
            const companyRedirect = Object.keys(companies)[0];
            dispatch(setCompany(companyRedirect));
            window.location.href = P.DASHBOARD.path;
          }
        } else {
          return (
            <Navigate
              to={
                IS_SIIGO && !NEEDS_EZ_LOGIN
                  ? `${P.DASHBOARD.path}?redirect=${redirectString}`
                  : `${P.SELECTCOMPANY.path}?redirect=${redirectString}`
              }
            />
          );
        }
      }
    } else {
      return (
        <Navigate to={IS_SIIGO && !NEEDS_EZ_LOGIN ? P.DASHBOARD.path : P.SELECTCOMPANY.path} />
      );
    }
  } else {
    if (!error && IS_SIIGO && !NEEDS_EZ_LOGIN) {
      const redirectString = location.search.includes("redirect=")
        ? location.search.split("redirect=")[1]
        : null;
      const company = new URLSearchParams(redirectString?.split("?")[1]).get("cid");
      localStorage.setItem("companyRedirect", company ?? "");
      window.location.href = getCognitoLoginUrl();
    }
  }

  let banner = null;
  const handleSubmit = () => {
    if (!isFetching) {
      const fd = form.getFieldsValue(true);
      dispatch(login({ email: fd.email.toLowerCase(), password: fd.password }));
      // if (location.search.includes("cid=")) {
      //   dispatch(setWasUserChanged(true));
      // }
    }
  };
  if (!IS_SIIGO) {
    if (location.search.includes("msg=NA_SUCCESS")) {
      banner = (
        <Alert
          message="Se ha creado la cuenta y se ha enviado un correo de confirmación; si no lo recibes, verifica tus correos “No deseados (spam)”"
          type="success"
          style={{ marginBottom: "1rem" }}
          closable
        />
      );
    }
  }

  return IS_SIIGO && !NEEDS_EZ_LOGIN ? (
    <LoadingScreen />
  ) : isFetching ? (
    <LoadingScreen />
  ) : (
    <>
      <div className={s.FlexWrapper}>
        {showNotWorkspaceWarning ? (
          <Alert
            type="warning"
            message="Por ahora no tienes acceso a ninguna empresa; contacta con el propietario de la cuenta, pídele que te invite e intenta de nuevo."
            showIcon
            closable
            style={{ marginBottom: 20, top: -20 }}
          />
        ) : null}
        <div className={s.MainSection}>
          {cantLogin ? <Alert message={customErrorMessage} style={{ marginBottom: 20 }} /> : null}
          <FormHeader />
          {banner}
          <Card className={s.Card}>
            <h5 className={s.Title}>Inicie Sesión</h5>
            <Form form={form} onFinish={handleSubmit} autoComplete="off">
              <Form.Item name="email" rules={EMAIL_RULES}>
                <Input id="login-email-input" placeholder="Correo" disabled={isFetching} />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Contraseña faltante" }]}
              >
                <Input.Password
                  id="login-password-input"
                  placeholder="Contraseña"
                  disabled={isFetching}
                />
              </Form.Item>
              <Button
                id="login-submit-button"
                type="primary"
                loading={isFetching}
                disabled={isFetching}
                htmlType="submit"
                style={{ backgroundColor: "#1677ff" }}
              >
                Continuar
              </Button>
            </Form>
            <Button
              id="forgot-password-button"
              type="link"
              style={{ color: "black", margin: "0 0 15px 0" }}
              onClick={() => navigate(P.FORGOTPASSWORD.path)}
            >
              Olvidé mi contraseña
            </Button>
            <Button
              id="create-account-button"
              type="default"
              onClick={() => navigate(P.SIGNUP.path)}
            >
              Crear una cuenta
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
