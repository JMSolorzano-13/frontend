import Button from "antd/lib/button";
import { useNavigate } from "react-router";
import s from "@pages/NotFound/NotFoundPage.module.scss";
import Logo from "@resources/img/logo.png";
import { ReactComponent as Image } from "@resources/svg/NotFound.svg";
import * as P from "@constants/PageIds";

export default function EzNotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className={s.FlexContainer}>
      <div>
        <div className={s.LogoSection}>
          <img src={Logo} width="238px" />
        </div>
        <h2 className={s.Title}> Página no encontrada </h2>
        <div className={s.Image}>
          <Image />
        </div>
        <p className={s.TextInfo}>
          Lo sentimos, la página a la que intentas acceder no existe. <br />
          Verifica que la URL sea correcta o prueba con alguna de estas opciones.
        </p>
        <div className={s.ButtonSection}>
          <Button href="https://ezaudita.com" data-test="btn-ezaudita-webpage">
            Ir a ezaudita.com
          </Button>
          <Button
            type="primary"
            onClick={() => {
              navigate(P.LOGIN.path);
            }}
            data-test="btn-login-ezaudita"
          >
            Iniciar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
