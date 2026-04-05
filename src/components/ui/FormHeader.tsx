import Logo from "@resources/img/logo.png";
import s from "./FormHeader.module.scss";

type Props = {
  linkEnabled?: boolean;
};

export default function FormHeader(props: Props) {
  const { linkEnabled } = props;

  const logo = linkEnabled ? (
    <a href="https://ezaudita.com/">
      <img src={Logo} width="238px" />
    </a>
  ) : (
    <img src={Logo} width="238px" />
  );

  return <div className={s.LogoSection}>{logo}</div>;
}

FormHeader.defaultProps = {
  linkEnabled: true,
};
