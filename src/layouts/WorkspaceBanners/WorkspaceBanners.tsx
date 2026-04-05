import { useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authSelector, setHasPendingPayment, setRFC } from "@store/authSlice";
import useSubscriptionData from "@hooks/useSubscriptionData";
import { cfdiSelector, closeExportBanner } from "@store/cfdiSlice";
import { companySelector } from "@store/companySlice";
import { closeBanner, satSelector } from "@store/satSlice";
import * as P from "@constants/PageIds";
import moment from "moment";
import { tailwindColors } from "@utils/tailwindColors";
import { IS_SIIGO } from "@utils/SIIGO/Global";
import FreeTrialNotification from "@components/Notifications/FreeTrialNotification";
import AfterDaysNotifications from "@components/Notifications/AfterDaysNotifications";
import viewNotifications from "@store/authSlice/notifications";
import { useAppDispatch } from "@store/store";

export default function WorkspaceBanners() {
  const dispatch = useDispatch();
  const dispatchView = useAppDispatch();
  const { isSATServiceAvailable, satBannerClosed, currentConfig } = useSelector(satSelector);
  const { exportBanner } = useSelector(cfdiSelector);
  const { company, oldCompany, license, hasPendingPayment, isNotificationView, workspace } =
    useSelector(authSelector);
  const { companies } = useSelector(companySelector);
  const [licenseMessage, setLicenseMessage] = useState<React.ReactNode>("");
  const [limitMessage, setLimitMessage] = useState(false);
  const [certificateMessage, setCertificateMessage] = useState<React.ReactNode>("");
  const { dateEnd, stripeStatus, isTrialing, isCanceled } = useSubscriptionData();
  const isManualSync = false; // TODO: Modify when final version is released
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatchView(viewNotifications({ workspace }));
  }, []);

  useEffect(() => {
    if (license && license.latest_invoice && license.latest_invoice.status === "open") {
      dispatch(setHasPendingPayment(true));
    } else {
      dispatch(setHasPendingPayment(false));
    }

    if (company && oldCompany && companies.length > 0) {
      const companyFound = companies.find((c) => c.id === oldCompany);
      if (companyFound) {
        const haveCert = companyFound.has_valid_certs;

        if (stripeStatus === "past_due") {
          setLicenseMessage(
            "El servicio de descargas desde el SAT está inactivo, renueva tu suscripción lo antes posible para mantener actualizados tus CFDIs."
          );
        }

        if (dateEnd && stripeStatus !== "past_due") {
          const now = new Date();
          const endDate = new Date(dateEnd);
          if (now.getTime() > endDate.getTime() - 5 * 24 * 60 * 60 * 1000) {
            if (now.getTime() > endDate.getTime() && isCanceled) {
              setLicenseMessage(
                "El servicio de descargas desde el SAT está inactivo, renueva tu suscripción lo antes posible para mantener actualizados tus CFDIs."
              );
            } else if (!isTrialing) {
              setLicenseMessage(
                <>
                  Tu plan vence el {endDate.toLocaleDateString()}. Al llegar esa fecha, se generará
                  automáticamente una <b>liga de pago</b> que aparecerá en la aplicación y también
                  se enviará por correo electrónico. Tendrás <b>3 días de gracia</b> para realizar
                  el pago y así continuar disfrutando de todos los beneficios.{" "}
                </>
              );
            }
          }
        }
        if (
          (haveCert !== null && haveCert === false) ||
          (currentConfig?.expires && moment(currentConfig.expires) < moment())
        ) {
          setCertificateMessage(
            <span>
              Es posible que la e.firma (FIEL) haya caducado o esté revocada, ve a{" "}
              <Link to={`${P.Sign.path}/?cid=${company}`} style={{ color: tailwindColors.primary }}>
                Sincroniza SAT / Actualizar e.firma
              </Link>{" "}
              para asignar los archivos vigentes y asegurar la descarga de tus CFDIs.
            </span>
          );
        } else {
          setCertificateMessage("");
        }

        if (companyFound.exceed_metadata_limit && !companyFound.permission_to_sync) {
          setLimitMessage(true);
        }
        dispatch(setRFC(companyFound.rfc));
      } else {
        dispatch(setRFC(null));
      }
    } else {
      dispatch(setRFC(null));
    }
  }, [companies, company, stripeStatus]);

  useEffect(() => {
    if (exportBanner && notificationRef.current) {
      notificationRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [exportBanner]);

  const showInvoiceUrl = useMemo(() => {
    if (license && license.latest_invoice && license.latest_invoice.status === "open") {
      return true;
    }
    return false;
  }, [license]);

  return (
    <>
      {isNotificationView?.isFreeTrialNotificationView && (
        <FreeTrialNotification remainingDays={isNotificationView.trialRemainingDays} />
      )}
      {isNotificationView?.isAfterDaysNotificationsView && (
        <AfterDaysNotifications remainingDays={isNotificationView.trialRemainingDays} />
      )}

      {!isSATServiceAvailable && !satBannerClosed ? (
        <Alert
          message="Por el momento los servicios del SAT se encuentran inestables; te recomendamos intentar más tarde."
          type="warning"
          style={{ marginBottom: 10 }}
          onClose={() => dispatch(closeBanner())}
          showIcon
          closable
        />
      ) : null}
      {certificateMessage !== "" ? (
        <Alert
          message={certificateMessage}
          type="warning"
          style={{ display: "flex", marginBottom: 10 }}
          onClose={() => setCertificateMessage("")}
          showIcon
          closable
        />
      ) : null}
      {licenseMessage !== "" ? (
        <Alert
          message={licenseMessage}
          type={
            typeof licenseMessage === "string"
              ? licenseMessage.includes("inactivo")
                ? "error"
                : "warning"
              : "warning"
          }
          style={{ marginBottom: 10 }}
          onClose={() => setLicenseMessage("")}
          showIcon
          closable
        />
      ) : null}
      {exportBanner ? (
        <div ref={notificationRef}>
          <Alert
            type="success"
            message={
              <span>
                Tu petición ha sido enviada; ve al menú{" "}
                <Link
                  to={`${P.MASSIVEEXPORT.path}/?cid=${company}&tab=cfdis`}
                  style={{ color: tailwindColors.primary }}
                  onClick={() => dispatch(closeExportBanner())}
                >
                  Exportaciones
                </Link>{" "}
                para realizar la descarga.
              </span>
            }
            style={{ marginBottom: 10 }}
            onClose={() => dispatch(closeExportBanner())}
            closable
          />
        </div>
      ) : null}
      {limitMessage ? (
        <Alert
          message={
            IS_SIIGO ? (
              <span>
                Las características de esta suscripción exceden el millón de CFDIs descargados
                permitido. Contáctanos para solicitar una ampliación.
              </span>
            ) : (
              <span>
                Las características de esta suscripción exceden el millón de CFDIs descargados
                permitido. Escríbenos a
                <a
                  href="mailto: ventas@ezaudita.com?subject=Límite de descarga excedido"
                  style={{ color: "#0070b3" }}
                >
                  {" ventas@ezaudita.com "}
                </a>
                para solicitar una ampliación.
              </span>
            )
          }
          style={{ marginBottom: 10 }}
          type="warning"
          showIcon
          closable
        />
      ) : null}
      {showInvoiceUrl ? (
        <Alert
          message={
            <span>
              Existe un pago pendiente; haz clic en
              <Link
                to={`${P.SUBSCRIPTION.path}/?cid=${company}`}
                style={{ color: tailwindColors.primary }}
              >
                {" Suscripción "}
              </Link>
              para liquidarlo.
            </span>
          }
          style={{ marginBottom: 10 }}
          type="warning"
          showIcon
          closable
        />
      ) : null}
      {isTrialing && !hasPendingPayment && !IS_SIIGO && (
        <Alert
          message={
            <span>
              Tienes un plan de prueba; haz clic en
              <Link
                to={`${P.SUBSCRIPTION.path}/?cid=${company}`}
                style={{ color: tailwindColors.primary }}
              >
                {" Suscripción "}
              </Link>
              para contratar.
            </span>
          }
          style={{ marginBottom: 10 }}
          type="info"
          showIcon
          closable
        />
      )}
      {isManualSync && (
        <Alert
          message={
            <span>
              La última descarga automática desde el SAT falló; te sugerimos intentar una descarga
              manual desde
              <Link to={`${P.SAT.path}/?cid=${company}`} style={{ color: tailwindColors.primary }}>
                {" Sincroniza SAT / Descargas CFDIs "}
              </Link>
              .
            </span>
          }
          style={{ marginBottom: 10 }}
          type="warning"
          showIcon
          closable
        />
      )}
    </>
  );
}
