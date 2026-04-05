import { Row, Col, Typography } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import useSubscriptionData from "@hooks/useSubscriptionData";
import { authSelector } from "@store/authSlice";

interface ICurrentPlanInfo {
  actualPlan: string | undefined;
  usersInfoText: string;
  companiesInfoText: string;
}
export default function CurrentPlanInfo({
  actualPlan,
  usersInfoText,
  companiesInfoText,
}: ICurrentPlanInfo) {
  const { currentExtraUsers, currentPlan, dateEnd, stripeStatus } = useSubscriptionData();
  const { addEnabled } = useSelector(authSelector);
  const shouldShowDate = stripeStatus !== "past_due" && stripeStatus !== "canceled";

  if (currentPlan) {
    return (
      <>
        <Row>
          <Col style={{ width: "100%" }}>
            <Typography.Title style={{ fontWeight: 400, fontSize: 18 }}>
              Información general
            </Typography.Title>
            <Row style={{ width: "60%", justifyContent: "space-between", marginLeft: 20 }}>
              <div>
                <Typography.Text style={{ fontSize: 14, fontWeight: 300, marginRight: 10 }}>
                  Plan Actual:{" "}
                </Typography.Text>
                <Typography.Text style={{ fontWeight: "bold", color: "#0070b3" }}>
                  {" "}
                  {actualPlan}
                </Typography.Text>
              </div>
              <div>
                <Typography.Text style={{ fontSize: 14, fontWeight: 300, marginRight: 10 }}>
                  Usuarios utilizados:{" "}
                </Typography.Text>
                <Typography.Text style={{ fontWeight: "bold", color: "#0070b3" }}>
                  {" "}
                  {usersInfoText}
                </Typography.Text>
              </div>
              <div>
                <Typography.Text style={{ fontSize: 14, fontWeight: 300, marginRight: 10 }}>
                  Compañías registradas:{" "}
                </Typography.Text>
                <Typography.Text style={{ fontWeight: "bold", color: "#0070b3" }}>
                  {" "}
                  {companiesInfoText}
                </Typography.Text>
              </div>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col style={{ width: "100%", marginTop: 10 }}>
            <Typography.Title style={{ fontWeight: 400, fontSize: 18 }}>
              Extras contratados
            </Typography.Title>
            <Col style={{ width: "60%", justifyContent: "space-between", marginLeft: 20 }}>
              <div>
                <Typography.Text style={{ fontSize: 14, fontWeight: 300, marginRight: 10 }}>
                  Usuarios adicionales:{" "}
                </Typography.Text>
                <Typography.Text style={{ fontWeight: "bold", color: "#0070b3" }}>
                  {" "}
                  {currentExtraUsers}
                </Typography.Text>
              </div>
              <div>
                <Typography.Text style={{ fontSize: 14, fontWeight: 300, marginRight: 10 }}>
                  Sincronización con ADD:{" "}
                </Typography.Text>
                <Typography.Text
                  style={{
                    fontWeight: "bold",
                    color: addEnabled ? "#0070b3" : "#878787",
                  }}
                >
                  {" "}
                  {addEnabled ? "Activo" : "Inactivo"}
                </Typography.Text>
              </div>
            </Col>
          </Col>
        </Row>
        <Row>
          <Col style={{ width: "100%", marginTop: 10 }}>
            <Typography.Title style={{ fontWeight: 400, fontSize: 18 }}>
              Vencimiento de tu plan y extras
            </Typography.Title>
            <Col style={{ width: "60%", justifyContent: "space-between", marginLeft: 20 }}>
              <div>
                <Typography.Text style={{ fontSize: 14, fontWeight: 300, marginRight: 10 }}>
                  Vencimiento:{" "}
                </Typography.Text>

                {shouldShowDate && (
                  <Typography.Text style={{ fontWeight: "bold", color: "#0070b3" }}>
                    {" "}
                    {dateEnd ? moment(dateEnd).format("DD MMMM YYYY") : ""}
                  </Typography.Text>
                )}
              </div>
            </Col>
          </Col>
        </Row>
      </>
    );
  }
  return null;
}
