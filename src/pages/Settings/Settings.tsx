import { PasswordSettings } from "./PaswordSettings/PasswordSettings";
import { ProfileSettings } from "./ProfileSettings/ProfileSettings";
import { CompanySettings } from "./CompanySettings/CompanySettings";
import Title from "antd/lib/typography/Title";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";

export default function Settings() {
  const { userData } = useSelector(authSelector);
  return (
    <div className="flex flex-col flex-1 h-full">
      <Title level={5} style={{ fontWeight: 400 }} data-test="user-welcome">
        Perfil del usuario{" "}
        <span id="title-perfil-usuario" style={{ color: "#0070b3" }}>
          {userData?.user.name}
        </span>
      </Title>
      <div className="flex flex-col xl:flex-row justify-between gap-5">
        <div className="bg-white p-6 flex-1">
          <ProfileSettings />
        </div>
        <div className="bg-white p-6 flex-1">
          <PasswordSettings />
        </div>
      </div>
      <div className="bg-white p-6 my-6">
        <CompanySettings />
      </div>
    </div>
  );
}
