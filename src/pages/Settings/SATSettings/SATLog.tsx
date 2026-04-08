import { useEffect, useState } from "react";
import { Alert, Button, Dropdown, message, Space, Typography } from "antd";
import { CloudSyncOutlined, SyncOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import moment from "moment";
import { satSelector, setLoading } from "@store/satSlice";
import SATStatusModal from "@components/SATSync/SATStatusModal";
import SATManualSyncModal from "@components/SATSync/SATManualSync";
import DailyDownloadsTable from "@components/SATSync/Tables/DailyDownloads/DailyDownloadsTable";
import HistoricalDownloadsTable from "@components/SATSync/Tables/HistoricalDownloads/HistoricalDownloadsTable";
import { getNewSatLog } from "@store/satSlice/getNewSatLog";
import { authSelector } from "@store/authSlice";
import { updateManualSyncLimit } from "@utils/SATLogStatusList";
import styles from "./SATLogStyle.module.scss";
import { useAppDispatch } from "@store/store";
import { SAT_LOG_LIMIT } from "./_constants/SATLogConstants";
import { getManualSyncStatus } from "@store/satSlice/getManualSync";
import SATManualSyncAllModal from "@components/SATSync/SATManualSync/AllCompanies";
import { companySelector } from "@store/companySlice";
import useSubscriptionData from "@hooks/useSubscriptionData";

const { Title } = Typography;

export default function SATLog() {
  const { companies: companyList } = useSelector(companySelector);
  const [SATStatesModalVisible, setSATStatesModalVisible] = useState(false);
  const [manualSyncModal, setManualSyncModal] = useState(false);
  const [manualSyncAllModal, setManualSyncAllModal] = useState(false);
  const {
    manualSync,
    newSatLog,
    newSatLogError,
    differenceDaySinceManualSync,
    fetchingNewSatLog,
    fetchingSatManualSync,
  } = useSelector(satSelector);
  const { company } = useSelector(authSelector);
  const lastManualSync: LastManualSyncType[] = JSON.parse(
    localStorage.getItem("lastSATManualSync") || "[]"
  );
  const [simulatedLoading, setSimulatedLoading] = useState(false);
  const currentLastManualSync = lastManualSync.find((e) => e.companyId === company);
  const dispatch = useAppDispatch();
  const { stripeStatus } = useSubscriptionData();

  // Local / B2C-skipped stacks often expose a non-billing stripe_status; do not block SAT manual sync.
  const skipBillingGate =
    import.meta.env.VITE_SKIP_B2C === "1" || import.meta.env.VITE_ALLOW_MANUAL_SAT_SYNC === "1";
  const isSubInactive =
    !skipBillingGate && (stripeStatus === "canceled" || stripeStatus === "past_due");

  const [lastSatLogRequest, setLastSatLogRequest] = useState<LastTimeSatLogRequestedType | null>(
    getCurrentItemFromLastSatLogRequest(localStorage.getItem("lastTimeSatLogRequested"))
  );

  function getSatLogData() {
    const startDate = moment().subtract("5", "years").format("YYYY-MM-DD");
    const yearFromStartDate = moment(startDate).format("YYYY");
    dispatch(
      getNewSatLog({
        startDate: `${yearFromStartDate}-01-01`,
        daysDifference: differenceDaySinceManualSync,
      })
    );
  }

  function getCurrentItemFromLastSatLogRequest(localStorageValue: string | null) {
    if (localStorageValue) {
      const data = JSON.parse(localStorageValue);
      const item = data.find((e: LastTimeSatLogRequestedType) => e.companyIdentifier === company);
      return item;
    }
    return null;
  }

  useEffect(() => {
    if (
      company &&
      manualSync.errorMessage.includes("Haz alcanzado el máximo de intentos por día")
    ) {
      updateManualSyncLimit(company);
    }
  }, [manualSync, differenceDaySinceManualSync]);

  const handleGetSatLog = () => {
    setSimulatedLoading(true);
    dispatch(setLoading());
    if (!lastSatLogRequest) {
      const array: LastTimeSatLogRequestedType[] = JSON.parse(
        localStorage.getItem("lastTimeSatLogRequested") || "[]"
      );
      array.push({
        companyIdentifier: company,
        time: moment().format(),
      });
      localStorage.setItem("lastTimeSatLogRequested", JSON.stringify(array));
      setLastSatLogRequest(
        getCurrentItemFromLastSatLogRequest(localStorage.getItem("lastTimeSatLogRequested"))
      );
      getSatLogData();
      dispatch(getManualSyncStatus());
    } else if (
      lastSatLogRequest &&
      moment(lastSatLogRequest.time).add(SAT_LOG_LIMIT, "minutes").isBefore(moment())
    ) {
      const array = JSON.parse(localStorage.getItem("lastTimeSatLogRequested") || "[]");
      const removeItem = array.filter(
        (e: LastTimeSatLogRequestedType) => e.companyIdentifier !== company
      );
      localStorage.setItem("lastTimeSatLogRequested", JSON.stringify(removeItem));
      setLastSatLogRequest(null);
      getSatLogData();
      dispatch(getManualSyncStatus());
    }
    setTimeout(() => setSimulatedLoading(false), 1000);
    dispatch(setLoading());
  };

  useEffect(() => {
    // useEffect used for first time load check to know if the banner is still necessary
    if (
      lastSatLogRequest &&
      moment(lastSatLogRequest.time).add(SAT_LOG_LIMIT, "minutes").isBefore(moment())
    ) {
      const array = JSON.parse(localStorage.getItem("lastTimeSatLogRequested") || "[]");
      const removeItem = array.filter(
        (e: LastTimeSatLogRequestedType) => e.companyIdentifier !== company
      );
      localStorage.setItem("lastTimeSatLogRequested", JSON.stringify(removeItem));
      setLastSatLogRequest(null);
    }
  }, []);

  useEffect(() => {
    if (newSatLogError) message.error(newSatLogError);
  }, [newSatLogError, manualSync]);

  useEffect(() => {
    // We do this to avoid requesting the endpoint if we already have the data and its blocked
    if (
      newSatLog.days.length === 0 &&
      ((lastSatLogRequest &&
        moment().isAfter(moment(lastSatLogRequest.time).add(SAT_LOG_LIMIT, "minutes"))) ||
        !lastSatLogRequest)
    ) {
      getSatLogData();
      dispatch(getManualSyncStatus());
    }
  }, [differenceDaySinceManualSync]);

  const manualDownloadDisabled =
    !manualSync.canRequest ||
    (currentLastManualSync &&
      Math.abs(moment(currentLastManualSync?.lastSyncDate).diff(new Date(), "minutes")) <= 16) ||
    fetchingSatManualSync ||
    fetchingNewSatLog ||
    simulatedLoading ||
    isSubInactive;

  const menuDescargas = [
    {
      key: "company",
      label: "Para esta empresa.",
      onClick: () => setManualSyncModal(true),
      icon: <CloudSyncOutlined style={{ fontSize: "18px" }} />,
      disabled: manualDownloadDisabled,
    },
    {
      key: "all",
      label: "Para todas las empresas de la suscripción.",
      icon: <CloudSyncOutlined style={{ fontSize: "18px" }} />,
      onClick: () => setManualSyncAllModal(true),
      disabled: manualDownloadDisabled,
    },
  ];

  return (
    <>
      {currentLastManualSync &&
        Math.abs(moment(currentLastManualSync?.lastSyncDate).diff(new Date(), "minutes")) <= 60 && (
          <Alert
            message="Se inició la descarga manual, la respuesta del SAT podría demorar hasta 60 min, te recomendamos revisar nuevamente mas tarde."
            type="warning"
            style={{ marginBottom: 20 }}
          />
        )}
      {lastSatLogRequest && (
        <Alert
          message="Estamos obteniendo la información más reciente de las descargas, esto podría demorar algunos minutos."
          type="warning"
          style={{ marginBottom: 20 }}
        />
      )}
      <Space className={styles.SATSyncButtonsContainer} align="center">
        <Space>
          <Title level={5} data-test="satsync-title" style={{ marginBottom: 0 }}>
            Descargas diarias
          </Title>
        </Space>
        <Space>
          <div>
            {manualSync.lastManualSyncDate && differenceDaySinceManualSync === 0
              ? `Última solicitud de hoy: ${moment
                  .utc(manualSync.lastManualSyncDate)
                  .format("HH:mm")}`
              : null}
          </div>
          <Button
            id="adv-refresh-button"
            type="default"
            onClick={handleGetSatLog}
            icon={<SyncOutlined />}
            loading={fetchingNewSatLog || fetchingSatManualSync || simulatedLoading}
            disabled={fetchingNewSatLog}
          />
          {companyList.length > 1 ? (
            <Dropdown menu={{ items: menuDescargas }} placement="bottomRight">
              <Button disabled={manualDownloadDisabled}>Descarga manual</Button>
            </Dropdown>
          ) : (
            <Button
              // type="primary"
              onClick={() => setManualSyncModal(true)}
              disabled={manualDownloadDisabled}
            >
              Descarga manual
            </Button>
          )}
        </Space>
      </Space>
      <DailyDownloadsTable
        dataTable={newSatLog.days}
        loading={fetchingNewSatLog || fetchingSatManualSync || simulatedLoading}
      />
      <br />
      <HistoricalDownloadsTable
        dataTable={newSatLog.historic}
        loading={fetchingNewSatLog || fetchingSatManualSync || simulatedLoading}
      />
      <SATStatusModal visible={SATStatesModalVisible} setVisible={setSATStatesModalVisible} />
      <SATManualSyncModal
        open={manualSyncModal}
        status={manualSync.status}
        handleCloseModal={setManualSyncModal}
        handleGetSATLog={handleGetSatLog}
      />
      <SATManualSyncAllModal
        open={manualSyncAllModal}
        status={manualSync.status}
        handleCloseModal={setManualSyncAllModal}
        handleGetSATLog={handleGetSatLog}
      />
    </>
  );
}
