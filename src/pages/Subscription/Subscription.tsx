import { useEffect, useMemo, useState } from "react";
import { Button, Card, Divider, message, Row, Typography } from "antd";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { authSelector } from "@store/authSlice";
import { companySelector } from "@store/companySlice";
import { getCompanies } from "@store/companySlice/getCompanies";
import { userSelector } from "@store/userSlice";
import { getUsers } from "@store/userSlice/getUsers";
import usePermissions from "@hooks/usePermissions";
import * as P from "@constants/PageIds";
import useSubscriptionData from "@hooks/useSubscriptionData";
import SubscriptionPurchaseForm, { SubsError } from "./SubscriptionPurchaseForm";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import { useAppDispatch } from "@store/store";
import moment from "moment";
import "moment/locale/es-mx";
import "moment/dist/locale/es-mx";
import HasPaymentLink from "./_components/HasPaymentLink";
import HasPendingPayment from "./_components/HasPendingPayment";
import CurrentPlanInfo from "./_components/CurrentPlanInfo";

const { Title } = Typography;

moment().locale("es-mx");

export default function Subscription() {
  const dispatch = useAppDispatch();
  const { isWorkspaceOwner } = usePermissions();
  const { companies } = useSelector(companySelector);
  const { users, error } = useSelector(userSelector);
  const [openPaymentLink, setOpenPaymentLink] = useState<string>();
  const [pendingPaymentLink, setPendingPaymentLink] = useState<string>();
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const {
    currentCompanies,
    currentPlan,
    maxCompanies,
    maxUsers,
    dateEnd,
    stripeStatus,
    isTrialing,
    isCanceled,
  } = useSubscriptionData();
  const { license } = useSelector(authSelector);
  const [packageBought, setPackageBought] = useState("");
  const [validPaymentDay, setValidPaymentDay] = useState<moment.Moment>();
  const datePlusOneYear = moment().add(1, "year");
  let paymentLimitDay = "";

  if (!isWorkspaceOwner) {
    return <Navigate to={`${P.DASHBOARD.path}`} />;
  }

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (companies.length === 0) {
      dispatch(getCompanies());
    }
    if (users.length === 0) {
      dispatch(getUsers());
    }
  }, []);

  const purchaseDone = (invoiceUrl: string) => {
    setOpenPaymentLink(invoiceUrl);
  };

  const purchaseError = (error: SubsError) => {
    if (error.data && error.data.paymentUrl) {
      setPendingPaymentLink(error.data.paymentUrl);
    }
  };

  const companiesInfoText = useMemo(() => {
    if (maxCompanies && maxCompanies > 0) {
      return `${currentCompanies} de ${maxCompanies}`;
    }
    if (!currentCompanies) return "";
    return `${currentCompanies}`;
  }, [maxCompanies, currentCompanies]);

  const usersInfoText = useMemo(() => {
    if (maxUsers && maxUsers > 0) {
      return `${users.length} de ${maxUsers}`;
    }
    return `${users.length}`;
  }, [maxUsers, users]);

  const actualPlan = useMemo(() => {
    if (currentPlan) {
      if (isTrialing) {
        return "Freemium";
      }
      if (isCanceled) {
        return "-";
      }
      return currentPlan.stripe_name;
    }
    return undefined;
  }, [currentPlan, stripeStatus]);

  const from_date = license?.latest_invoice?.created_at;
  let hasLeftDays = false;
  if (from_date) {
    const daysLeft = moment().diff(from_date, "days");
    paymentLimitDay = moment(from_date).add(3, "days").subtract(6, "hours").format("DD MMMM YYYY");
    if (daysLeft > 3) {
      hasLeftDays = false;
    } else {
      hasLeftDays = true;
    }
  }

  return (
    <>
      <Title level={5} style={{ fontWeight: 400 }} id="title-subscripcion">
        Suscripción
      </Title>
      <Card>
        <CurrentPlanInfo
          actualPlan={actualPlan}
          usersInfoText={usersInfoText}
          companiesInfoText={companiesInfoText}
        />

        <Row style={{ marginTop: 20 }}>
          <Button onClick={() => setOpenInvoiceModal(true)}>Datos de facturación</Button>
        </Row>
        {currentPlan ? (
          <>
            <Divider />
            <Title level={3} style={{ fontWeight: 400 }}>
              {isTrialing ? "Elige tu Plan" : "Ajusta tu Plan"}
            </Title>
            {!isTrialing ? (
              <h6 style={{ color: "#000000", fontWeight: 400 }}>
                Selecciona otro plan si deseas mejorar tu suscripción:
              </h6>
            ) : null}
            <div style={{ maxWidth: 1035, marginBottom: 150, paddingTop: 30 }}>
              <HasPaymentLink
                paymentLink={openPaymentLink}
                validPaymentDay={validPaymentDay}
                packageBought={packageBought}
              />
              <HasPendingPayment
                hasLeftDays={hasLeftDays}
                actualPlan={actualPlan}
                paymentLimitDay={paymentLimitDay}
                datePlusOneYear={datePlusOneYear}
                pendingPaymentLink={pendingPaymentLink}
              />
              {!pendingPaymentLink ? (
                <SubscriptionPurchaseForm
                  purchaseDone={purchaseDone}
                  purchaseError={purchaseError}
                  userSource={users}
                  dateEnd={dateEnd}
                  openPayment={openPaymentLink}
                  setPackageBought={setPackageBought}
                  setValidPaymentDay={setValidPaymentDay}
                  openPaymentLink={
                    openPaymentLink ? openPaymentLink : license?.latest_invoice?.hosted_invoice_url
                  }
                />
              ) : null}
            </div>
          </>
        ) : null}
        <p
          style={{
            fontSize: "12px",
            padding: "2px 12px 8px 12px",
            opacity: "0.5",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          ID suscripción: {license?.sub_identifier}
        </p>
      </Card>
      <InvoiceDetailsModal visible={openInvoiceModal} setVisible={setOpenInvoiceModal} />
    </>
  );
}
