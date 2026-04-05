import LogoEzaudita from "../components/LogoEzaudita";
import LogoMaintenance from "../assets/working.png";
import { Typography } from "antd";

export default function Maintenance() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={LogoMaintenance} height={280} width={280} />
      <LogoEzaudita height={30} width={168} />
      <Typography className="text-primary" style={{ padding: 15, fontSize: 22 }}>
        se está transformando
      </Typography>
      <Typography style={{ textAlign: "center", fontSize: 16, color: "#373737" }}>
        Estamos mejorando nuestra infraestructura para brindarte un servicio aún mejor, <br /> es
        por eso que necesitamos este espacio de tiempo para renovarnos; <br /> por lo tanto la
        plataforma no estará disponible en este horario:
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", padding: 18 }}>
        <Typography style={{ textAlign: "center", fontSize: 24, color: "#5f5f5f" }}>
          Viernes 26 de abril,
        </Typography>
        <Typography style={{ textAlign: "center", fontSize: 24, color: "#5f5f5f" }}>
          18:00 hrs. a 22:00 hrs.
        </Typography>
        <Typography style={{ textAlign: "center", fontSize: 16, color: "#5f5f5f" }}>
          Horario de centro
        </Typography>
      </div>
      <Typography style={{ textAlign: "center", fontSize: 16, color: "#373737", padding: 28 }}>
        Gracias por tu comprensión.
      </Typography>
    </div>
  );
}
