import Button from "antd/lib/button";
import s from "./NotFoundPage.module.scss";
import Logo from "@resources/img/logo.png";
import Image from "@resources/img/working1.png";
import { useSelector } from "react-redux";
import { companySelector } from "@store/companySlice";
import { authSelector } from "@store/authSlice";
import { useMemo } from "react";

export default function NotFound() {
  const { companies } = useSelector(companySelector);
  const { rfc, company: comp } = useSelector(authSelector);
  const currentCompany = useMemo(() => {
    const company = companies.find((company) => company.identifier === comp);

    if (!company) return;

    return company;
  }, [companies]);
  return (
    <div className="bg-white w-full h-full flex flex-col justify-center items-center">
      <div className={s.LogoSection}>
        <img src={Logo} width="238px" />
      </div>
      <div className={s.Image}>
        <img src={Image} width="450px" />
      </div>
      <h6 className="leading-6 mb-7 mt-4 text-center">
        Tu empresa <span className="font-bold">{rfc} - {currentCompany?.name || ""}</span> cuenta con un volumen considerable de
        información que se está procesando, <br />
        por favor intenta consultar esta empresa más tarde. Lamentamos las molestias.
      </h6>
      <h6 className="leading-6 mb-7 text-center">Gracias por tu paciencia y comprensión.</h6>
      {companies?.length > 1 && (
        <div className={s.ButtonSection}>
          <Button
            type="primary"
            onClick={() => {
              localStorage.removeItem("lastCompany");
              localStorage.removeItem("lastWorkspace");
              window.location.replace("/");
            }}
          >
            Ir al menú de empresas
          </Button>
        </div>
      )}
    </div>
  );
}
