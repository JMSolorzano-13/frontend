import { Link } from "react-router-dom";
import Logo from "@resources/img/logo.png";
import { ReactComponent as SmallLogo } from "@resources/svg/small_logo.svg";
import s from "@layouts/Workspace.module.scss"; // TODO: use own stylesheet
import * as P from "@constants/PageIds";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";

interface IEzLogoComponent {
  subNoCompany: boolean;
}

export default function EzLogoComponent(props: IEzLogoComponent) {
  const { company } = useSelector(authSelector);
  const { subNoCompany } = props;

  return subNoCompany ? (
    <>
      <div className={s.ezLogo}>
        <img src={Logo} width="168px" />
      </div>
      <div className={s.SmallLogo}>
        <SmallLogo />
      </div>
    </>
  ) : (
    <>
      <Link to={`${P.DASHBOARD.path}?cid=${company}`}>
        <div className={s.Logo}>
          <img src={Logo} width="168px" />
        </div>
      </Link>
      <Link to={`${P.DASHBOARD.path}?cid=${company}`}>
        <div className={s.SmallLogo}>
          <SmallLogo />
        </div>
      </Link>
    </>
  );
}
