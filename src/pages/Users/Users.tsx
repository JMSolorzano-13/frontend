import UsersCRUD from "@components/users/UsersCRUD/UsersCRUD";
import { Card } from "antd";
import Title from "antd/lib/typography/Title";

export default function Users() {
  return (
    <>
      <Title level={5} style={{ fontWeight: 400 }} id="title-users">
        Usuarios
      </Title>
      <Card>
        <UsersCRUD />
      </Card>
    </>
  );
}
