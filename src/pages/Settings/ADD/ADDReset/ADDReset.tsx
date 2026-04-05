import { postResetADDStep } from "@api/ADD";
import { authSelector } from "@store/authSlice";
import { Button, Card, Modal, Progress, Row, Switch, Typography, message } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as P from "@constants/PageIds";


export default function ADDReset() {
  const [reset, setReset] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate()

  const { userData, workspace } = useSelector(authSelector);
  const [messageApi] = message.useMessage();

  async function resetSteps() {
    if (userData && workspace) {
      setLoading(true);
      try {
        const accessData = userData?.access[workspace];
        const response = await postResetADDStep(accessData.pasto_license_key as string);
        setInterval(() => {
          setProgress((prev) => prev + 10);
        }, 6000);
        if (response) {
          setTimeout(() => {
            navigate(P.ADD.path)
          }, 63000);
        } else {
          setLoading(false);
          messageApi.open({
            type: "error",
            content:
              "Error: No fue posible realizar la reconfiguración. Favor de contactar a soporte.",
          });
        }
      } catch (error) {
        setLoading(false);
        messageApi.open({
          type: "error",
          content:
            "Error: No fue posible realizar la reconfiguración. Favor de contactar a soporte.",
        });
      }
    }
  }
  return (
    <>
      <Card id="steps-add" style={{ padding: 20 }}>
        <Typography.Title level={2} id="reconfigure_add_conection_title">
          Reconfigurar la conexión con el ADD
        </Typography.Title>
        <Typography.Text style={{ fontSize: 16 }}>
          Utiliza esta opción si necesitas hacer un cambio de servidor o de instancia SQL de tu ADD.
        </Typography.Text>
        <Row style={{ marginTop: 20 }}>
          <Switch checked={reset} onChange={() => setReset(!reset)} style={{ marginRight: 20 }} />
          <Typography.Text style={{ color: "#5F5F5F" }}>Reconfigurar la conexión</Typography.Text>
        </Row>
        {reset && (
          <Row style={{ paddingTop: 30, display: "flex", flexDirection: "column" }}>
            <Typography.Title level={4}>Importante</Typography.Title>
            <Typography.Text>
              Una vez confirmando el paso de “Reconfigurar” dejarás de poder realizar
              sincronizaciones hasta haber concluido los pasos para volver a configurar tu ADD.
            </Typography.Text>

            <Typography.Text style={{ paddingTop: 15, paddingBottom: 15 }}>
              Deberás tener en cuenta lo siguiente:{" "}
            </Typography.Text>

            <ol style={{ paddingLeft: 15 }}>
              <li>
                1. Volverás al paso <b>2. instalar el aplicativo</b> de la configuración.
              </li>
              <li>
                2. Deberás volver a descargar el instalador y realizar la instalación en el servidor
                donde esté el ADD.
              </li>
              <li>
                3. Será necesario que vuelvas a relacionar tus empresas del lado de ezaudita® con
                las del ADD.
              </li>
            </ol>
            <Row style={{ paddingTop: 30 }}>
              <Button
                type="primary"
                onClick={() => setShowModal(true)}
                style={{ width: 115, height: 35 }}
              >
                Reconfigurar
              </Button>
            </Row>
          </Row>
        )}
      </Card>

      <Modal
        title="Confirmación de reconfiguración"
        okText="Confirmar"
        cancelText="Cancelar"
        open={showModal}
        onOk={resetSteps}
        confirmLoading={loading}
        cancelButtonProps={{
          className: loading ? "ant-btn-loading ant-btn-loading-icon" : "",
        }}
        onCancel={() => {
          if (!loading) {
            setShowModal(false);
          }
        }}
      >
        <p>¿Estás seguro que deseas iniciar la reconfiguración del conciliador ADD?</p>
        {loading && <Progress percent={progress} style={{ paddingTop: 10 }} />}
      </Modal>
    </>
  );
}
