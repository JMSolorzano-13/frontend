import { SIIGO_LOGO_URL } from "@utils/SIIGO/urls";
import s from "./NotFoundPage.module.scss";
import Logo from "@resources/img/404.png";

export default function NotFoundPage() {
  return (
    <div className={s.FlexContainer}>
      <div>
        <div className={s.LogoSection}>
          <img src={SIIGO_LOGO_URL} width="238px" style={{ marginBottom: 35 }} />
        </div>
        <div className={s.LogoSection}>
          <img src={Logo} width="238px" />
        </div>
        <h2 className={s.Title}> Página no encontrada </h2>
        <p className={s.TextInfo}>
          Lo sentimos, la página a la que intentas acceder no existe. <br />
          Verifica que la URL sea correcta.
        </p>
      </div>
    </div>
  );
}
