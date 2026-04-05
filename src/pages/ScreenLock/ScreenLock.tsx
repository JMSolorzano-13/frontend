import s from "./ScreenPage.module.scss";
import Logo from "@resources/img/logo.png";
import Image from "@resources/img/working1.png";
import { Typography } from "antd";
import parse from "html-react-parser";

const APP_LOCK_TEXT = import.meta.env.VITE_REACT_APP_LOCK_MESSAGE || "";

const ScreenLock = () => {
  return (
    <div className="bg-gray w-full h-screen flex flex-col justify-center items-center">
      <div className={s.LogoSection}>
        <img src={Logo} width="238px" />
      </div>
      <div className={s.Image}>
        <img src={Image} width="450px" />
      </div>
      <h4 className="leading-6 text-primary mb-7 mt-6 text-center">¡Estamos en mantenimiento!</h4>
      <Typography.Paragraph style={{ textAlign: "center", fontSize: 18 }}>
        {parse(
          APP_LOCK_TEXT || "Estamos trabajando en mejoras para ti. Gracias por tu comprensión."
        )}
      </Typography.Paragraph>
    </div>
  );
};

export default ScreenLock;