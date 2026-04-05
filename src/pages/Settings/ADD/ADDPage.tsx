import { useEffect, useState } from "react";
import { Card, Steps } from "antd";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";
import useSubscriptionData from "@hooks/useSubscriptionData";
import { Link } from "react-router-dom";
import * as P from "@constants/PageIds";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import StepOne from "./StepOne";
import FinalStep from "./FinalStep";
import StepTwo from "./StepTwo";
import styles from "./StepOne.module.scss";
import Title from "antd/es/typography/Title";

export default function ADDPage() {
  const { company } = useSelector(authSelector);
  const [step, setStep] = useState(0);
  const { isTrialing, dateEnd, isCanceled } = useSubscriptionData();

  const manageStep = (newStep: 0 | 1 | 2) => {
    if (step !== 2) {
      setStep(() => newStep);
    }
  };
  const { userData, workspace } = useSelector(authSelector);

  useEffect(() => {
    function manageActualStep() {
      if (userData && userData.access && workspace) {
        const addData = userData.access[workspace];
        if (addData.pasto_worker_id) {
          setStep(() => 1);
        }
        if (addData.pasto_installed) {
          setStep(() => 2);
        }
      }
    }
    manageActualStep();
  }, [userData, workspace]);

  return (
    <>
      <Title level={5} style={{ fontWeight: 400 }} id="title-configuracion-add">
        Configuración del ADD
      </Title>

      <Card id="steps-add" style={{ padding: 20 }}>
        <Steps current={step}>
          <Steps.Step
            className={step === 0 ? "im-add-step-one-active" : "im-add-step-one"}
            title={step > 1 ? "Finalizado" : "En progreso"}
            description="Descargar el aplicativo"
          />
          <Steps.Step
            className={step === 1 ? "im-add-step-two-active" : "im-add-step-two"}
            title={step > 1 ? "Finalizado" : "Esperando"}
            description="Instalar el aplicativo"
          />
          <Steps.Step
            className={step === 2 ? "im-add-step-three-active" : "im-add-step-three"}
            title={step === 2 ? "Finalizado" : "Esperando"}
            description="Relación de compañías"
          />
        </Steps>
        {step === 0 && <StepOne manageStep={manageStep} />}
        {step === 1 && <StepTwo manageStep={manageStep} step={step} />}
        {step === 2 && <FinalStep />}
        {isTrialing && !isCanceled ? (
          <div className={styles.GreenBanner}>
            <span>
              <b>PERIODO DE PRUEBA:</b> Te encuentras en tu periodo de prueba para este módulo, el
              periodo vencerá el {formatDisplay(dateEnd, DisplayType.DATE)}. Podrás contratarlo
              dentro de la{" "}
              <Link to={`${P.SUBSCRIPTION.path}/?cid=${company}`} style={{ color: "#4079ff" }}>
                Sección de Suscripciones
              </Link>
            </span>
          </div>
        ) : null}
      </Card>
    </>
  );
}
