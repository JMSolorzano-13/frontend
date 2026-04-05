import { Button, Col, Row, Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { createWorker } from "@store/addSlice/createWorker";
import { authSelector } from "@store/authSlice";
import useSubscriptionData from "@hooks/useSubscriptionData";
import { useNavigate } from "react-router";
import * as P from "@constants/PageIds";
import styles from "./StepOne.module.scss";
import { useAppDispatch } from "@store/store";
import { handleDownload } from "./_utils/DownloadInstaller";

interface StepOneType {
  manageStep: (step: 0 | 1 | 2) => void;
}

const StepOne = ({ manageStep }: StepOneType) => {
  const dispatch = useAppDispatch();
  const { workspace, addEnabled } = useSelector(authSelector);
  const { isTrialing, isCanceled } = useSubscriptionData();
  // const history = useHistory()
  const navigate = useNavigate();
  const handleCreateWorker = () => {
    dispatch(createWorker({ workspaceId: workspace as string }));
    manageStep(1);
  };

  return (
    <>
      <Space direction="vertical" size="middle" className={styles.StepOneContainer}>
        <Typography.Title level={4}>¿Tienes CONTPAQi® Contabilidad?</Typography.Title>
        <Typography.Paragraph>
          Utiliza este módulo para asegurar que la información contenida en tu ADD coincide con lo
          que tiene el SAT, tanto en cantidad de CFDIs como en estatus de vigente o cancelado.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Este módulo tiene la capacidad de adicionar los CFDIs faltantes en tu ADD y modificar el
          estatus de vigente a cancelado, la conciliación puede hacerse automáticamente todos los
          días, o manualmente cada que lo requieras.
        </Typography.Paragraph>
      </Space>
      <Space direction="vertical" size="middle" className={styles.GuideContainer}>
        <Typography.Text style={{ fontWeight: "bold" }}>
          Conéctate con el ADD en solo tres sencillos pasos:
        </Typography.Text>
        <ol>
          <li>
            1. Descarga el aplicativo e instálalo en el mismo servidor en donde se ejecuta CONTPAQi®
            Contabilidad.
          </li>
          <li>2. Espera unos minutos a que ezaudita® detecte la correcta instalación.</li>
          <li>3. Relaciona la empresa en el ADD con tu empresa en ezaudita®.</li>
        </ol>
      </Space>
      {(isTrialing && !isCanceled) || addEnabled ? (
        <>
          <Row className={styles.WindowsInstaller}>
            <Typography.Text
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: 20,
              }}
            >
              Instalador de Windows®
            </Typography.Text>
            <Button id="im-add-download-installer" type="primary" onClick={() => handleDownload()}>
              Descargar el Instalador
            </Button>
          </Row>

          <Col id="add-case-2-2">
            <Button id="im-add-page-one-next-step" type="primary" onClick={handleCreateWorker}>
              Siguiente
            </Button>
          </Col>
        </>
      ) : (
        <Row className={styles.WindowsInstaller}>
          <Typography.Text
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              marginRight: 5,
            }}
          >
            Comienza ya.
          </Typography.Text>
          <Typography.Text
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            Activa el módulo de sincronización ADD desde el menú de suscripciones
          </Typography.Text>
          <Button type="primary" onClick={() => navigate(P.SUBSCRIPTION.path)}>
            Adquirir el módulo de sincronización ADD
          </Button>
        </Row>
      )}

      {/* <Row id="add-case-1" className={styles.CaseOneContainer}>
        <Typography.Text className={styles.MR_20}>
          Puedes probar este módulo por un periodo de 10 días. Comienza ya
        </Typography.Text>
        <Button type="ghost">Comenzar mi periodo de prueba</Button>
      </Row>
      <Row id="add-case-2" className={styles.ActivateAddContainer}>
        <Typography.Text className={styles.MR_20}>
          <b>Comienza ya.</b> Activa el módulo de sincronización ADD desde el
          menú de suscripciones
        </Typography.Text>
        <Button type="primary">Adquirir el módulo de sincronización ADD</Button>
      </Row> */}
    </>
  );
};

export default StepOne;
