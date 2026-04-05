import { Avatar } from "antd";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import splitNameAndGetTwo, { splitNameAndGetChars } from "./getSplittedName";
import { tailwindColors } from "@utils/tailwindColors";
import React from "react";
import s from "./menuItems.module.scss";
import { SIIGO_CHANGE_PASSWORD_URL, SIIGO_HELP_URL, SIIGO_PORTAL_URL } from "@utils/SIIGO/urls";
import { ItemType } from "antd/lib/menu/interface";
import { LogoutOutlined } from "@ant-design/icons";

export const helpMenuItems = [
  {
    label: <div onClick={() => window?.inline_manual_player.showPanel()}>Tutoriales</div>,
    key: "help-inline-manual",
  },
  // {
  //   label: (
  //     <a href={SIIGO_HELP_URL.SUPPORT} target="_blank" rel="noreferrer">
  //       Sitio de soporte
  //     </a>
  //   ),
  //   key: "help-support-site",
  // },
  {
    label: (
      <a href={SIIGO_HELP_URL.CLIENT_PORTAL} target="_blank" rel="noreferrer">
        Portal de clientes
      </a>
    ),
    key: "help-client-portal",
  },
  {
    label: (
      <a href={SIIGO_HELP_URL.TRAINING} target="_blank" rel="noreferrer">
        Capacitaciones
      </a>
    ),
    key: "info",
  },
];

export const userMenuItems = (
  userData: UserData | null,
  hardCodedName: string,
  self_uri: string
) => {
  return [
    {
      key: "profile",
      style: {
        padding: "20px",
        pointerEvents: "none",
      },
      label: (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Avatar size={40} style={{ minWidth: "40px" }}>
            {splitNameAndGetChars(userData?.user.name) || splitNameAndGetChars(hardCodedName)}
          </Avatar>
          <div>
            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                lineHeight: "14px",
              }}
            >
              {splitNameAndGetTwo(userData?.user.name) || splitNameAndGetTwo(hardCodedName)}
            </p>
            <p>{userData?.user.email || ""}</p>
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "passwordLink",
      style: {
        padding: "24px",
      },
      className: s.MenuOptionsContainer,
      label: (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div
            className={s.MenuOptions}
            style={{ display: "flex", padding: "6px 16px", alignItems: "center", gap: "16px" }}
            onClick={() => {
              location.href = `${SIIGO_CHANGE_PASSWORD_URL}${userData?.user.email || ""}`;
            }}
          >
            <span>{React.createElement(FaLock as any, { color: tailwindColors.secondary })}</span>
            <a href={`${SIIGO_CHANGE_PASSWORD_URL}${userData?.user.email || ""}`}>
              Cambiar contraseña
            </a>
          </div>
          <div
            className={s.MenuOptions}
            style={{ display: "flex", padding: "6px 16px", alignItems: "center", gap: "16px" }}
            onClick={() => {
              location.href = SIIGO_PORTAL_URL;
            }}
          >
            <span>
              {React.createElement(FaArrowLeft as any, { color: tailwindColors.secondary })}
            </span>
            <a href={SIIGO_PORTAL_URL} rel="noreferrer">Portal contador</a>
          </div>

          <div
            className={s.MenuOptions}
            style={{ display: "flex", padding: "6px 16px", alignItems: "center", gap: "16px" }}
            onClick={() => {
              location.href = `${self_uri}/logout`;
            }}
          >
            <span>
              {React.createElement(LogoutOutlined as any, {
                color: tailwindColors.secondary,
              })}
            </span>
            <a href={`${self_uri}/logout`}>Cerrar sesión</a>
          </div>
        </div>
      ),
    },
  ] as ItemType[];
};
