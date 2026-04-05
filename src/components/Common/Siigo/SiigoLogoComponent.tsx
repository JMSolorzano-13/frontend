import { SIIGO_LOGO_URL } from "@utils/SIIGO/urls";
import { Link } from "react-router-dom";
import s from "./../../../layouts/Workspace.module.scss"; // TODO: Use own style sheet
import * as P from "@constants/PageIds";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";

export default function SiigoLogoComponent() {
  const { company } = useSelector(authSelector);

  return (
    <>
      <Link to={`${P.DASHBOARD.path}?cid=${company}`}>
        <div className={s.Logo}>
          <img src={SIIGO_LOGO_URL} width="140px" className="min-h-[32px]" height="32px" />
        </div>
      </Link>
      <Link to={`${P.DASHBOARD.path}?cid=${company}`}>
        <div className={s.SmallLogo}>
          <img src={SIIGO_LOGO_URL} width="140px" className="min-h-[32px]" height="32px" />
        </div>
      </Link>
    </>
  );
}
