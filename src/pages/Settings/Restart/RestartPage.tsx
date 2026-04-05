import { authSelector } from "@store/authSlice";
import { useAppDispatch } from "@store/store";
import { Button, message, Popconfirm } from "antd";
import Title from "antd/lib/typography/Title";
import resetUserConfig from "@store/authSlice/resetUserConfig";
import { useSelector } from "react-redux";

const RestartPage = () => {
  const { isFetchingConfig } = useSelector(authSelector);
  const dispatch = useAppDispatch();

  const handleResetConfig = () => {
    if (!isFetchingConfig) {
      dispatch(resetUserConfig({ clear: true }));
      message.success("Configuración reiniciada");
    }
  };
  return (
    <>
      <Title level={5} style={{ fontWeight: 400 }} id="title-reiniciar">
        Reiniciar configuraciones
      </Title>
      <div className="bg-white p-6">
        <p>
          Regresa la configuración de los dashboards, columnas y validaciones a su estado inicial.
        </p>
        <Popconfirm title="¿Confirmar reinicio de configuraciones?" onConfirm={handleResetConfig}>
          <Button
            id="adv-reset-settings-button"
            type="default"
            style={{ marginTop: 17 }}
            disabled={isFetchingConfig}
          >
            Reiniciar
          </Button>
        </Popconfirm>
      </div>
    </>
  );
};

export default RestartPage;
