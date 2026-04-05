import { useState } from "react";
import { Modal, Button, Typography } from "antd";
import { useSelector } from "react-redux";
import { getManualSyncAll } from "@store/satSlice/getManualSync";
import { authSelector } from "@store/authSlice";
import { addManualSyncToList } from "@utils/SATLogStatusList";
import { useAppDispatch } from "@store/store";

const SATManualSyncAllModal = ({
  open,
  handleCloseModal,
  status,
  handleGetSATLog,
}: SATManualSyncAllModal) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { Text } = Typography;
  const { company } = useSelector(authSelector);

  function launchManualSync() {
    setLoading(true);
    dispatch(getManualSyncAll());
    if (company) {
      const manualSyncPayload: LastManualSyncType = {
        companyId: company,
        amountOfDailyRequest: 1,
        lastSyncDate: new Date(),
      };
      addManualSyncToList(manualSyncPayload);
    }
    handleCloseModal(false);
    setLoading(false);
    setTimeout(() => handleGetSATLog(), 10000);
  }

  return (
    <Modal
      title="Descarga manual para todas las empresas de la suscripción"
      open={open}
      onCancel={() => handleCloseModal(false)}
      footer={[
        <Button id="cancel-submit-button" htmlType="submit" onClick={() => handleCloseModal(false)}>
          Cancelar
        </Button>,
        <Button
          id="signup-submit-button"
          type="primary"
          loading={loading || status !== "available"}
          disabled={loading || status !== "available"}
          onClick={() => launchManualSync()}
          style={{ marginLeft: 10 }}
        >
          Continuar
        </Button>,
      ]}
    >
      <div>
        <Text>
          Esta opción realiza una petición al SAT para descargar los CFDIs faltantes, incluyendo los
          emitidos y recibidos al día de hoy, tanto para la empresa activa como para el resto de las
          empresas incluidas en la suscripción.
        </Text>
        <br /> <br />
        <Text>Este tipo de descarga manual solo puede realizarse 2 veces por día y con límite máximo de 2,000 CFDIs por empresa.</Text>
      </div>
    </Modal>
  );
};

export default SATManualSyncAllModal;

interface SATManualSyncAllModal {
  open: boolean;
  handleCloseModal: (state: boolean) => void;
  status: "busy" | "error" | "available";
  handleGetSATLog: () => void;
}
