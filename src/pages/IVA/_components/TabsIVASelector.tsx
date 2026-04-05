import { CSSProperties, useEffect } from "react";
import { Col, Row, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import editSearchParams from "@utils/editSearchParams";
import { TState } from "../_types/StateTypes";
import { getCreditableIVATotal, getTranslatedIVATotal } from "../_utils/calculateAmount";
import { useDisableButtonsTaxes } from "@hooks/useDisableButtonsTaxes";
import { theme } from "antd";

interface TabsIVASelector {
  periodToDisplay: string;
  ivaResponse: IVAResponse | undefined;
  setModalType: (data: "creditable" | "transferred") => void;
  loading: boolean;
  setTopTab: (data: TState) => void;
  setTab: (data: TabIVAType) => void;
  topTab: TState;
}

const { useToken } = theme;

export default function TabsIVASelector({
  ivaResponse,
  setModalType,
  loading,
  setTab,
  setTopTab,
  topTab,
}: TabsIVASelector) {
  const { token } = useToken();
  const location = useLocation();
  const navigate = useNavigate();

  const styles: StylesType = {
    button: {
      active: {
        backgroundColor: token.colorPrimary,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 66,
        cursor: "pointer",
        minWidth: 179,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
      },
      inactive: {
        display: "flex",
        // flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 66,
        borderLeft: "#d1d1d1 solid 1px",
        borderTop: "#d1d1d1 solid 1px",
        borderRight: "#d1d1d1 solid 1px",
        cursor: "pointer",
        minWidth: 179,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: "#fafafa",
      },
      disabled: {
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
    text: {
      active: {
        color: "#ffffff",
      },
      inactive: {
        color: "#474747",
      },
    },
  };

  const isTaxesButtonDisabled = useDisableButtonsTaxes();

  useEffect(() => {
    function loadFirstTime() {
      const currentType = new URLSearchParams(location.search).get("ivaType") as TState | null;
      if (currentType === null) {
        handleChange("period_transferred");
      } else {
        handleChange(currentType);
      }
    }
    loadFirstTime();
  }, []);

  function handleChange(value: TState) {
    setTopTab(value);
    updateLocationSearch(value);
    if (value === "period_creditable") {
      setModalType("creditable");
    } else {
      setModalType("transferred");
    }
  }

  const updateLocationSearch = (value: TState) => {
    navigate(
      editSearchParams(
        location.search,
        [
          {
            key: "ivaType",
            value,
          },
        ],
        { baseUrl: location.pathname }
      ),
      { replace: true }
    );
  };

  return (
    <Row
      style={{
        marginTop: 10,
        borderBottomColor: "#D9D9D9",
        borderBottomWidth: 1,
      }}
    >
      <Col style={{ flex: 0.8, gap: 10 }}>
        <Row style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => {
              handleChange("period_transferred");
              setTab("ALL");
            }}
            style={{
              ...styles.button[topTab === "period_transferred" ? "active" : "inactive"],
              ...(isTaxesButtonDisabled ? styles.button.disabled : {}),
            }}
            disabled={isTaxesButtonDisabled}
          >
            <Typography.Text
              style={
                topTab === "period_transferred"
                  ? { ...styles.text.active, fontSize: 15 }
                  : { ...styles.text.inactive, fontSize: 15 }
              }
            >
              IVA trasladado
            </Typography.Text>
            <Typography.Text
              style={
                topTab === "period_transferred"
                  ? { ...styles.text.active, fontWeight: "bold", fontSize: 18 }
                  : { ...styles.text.inactive, fontWeight: "bold", fontSize: 18 }
              }
            >
              {loading ? "-" : formatDisplay(getTranslatedIVATotal(ivaResponse), DisplayType.MONEY)}
            </Typography.Text>
          </button>
          <button
            onClick={() => {
              handleChange("period_creditable");
            }}
            style={{
              ...styles.button[topTab === "period_creditable" ? "active" : "inactive"],
              ...(isTaxesButtonDisabled ? styles.button.disabled : {}),
            }}
            disabled={isTaxesButtonDisabled}
          >
            <Typography.Text
              style={
                topTab === "period_creditable"
                  ? { ...styles.text.active, fontSize: 15 }
                  : { ...styles.text.inactive, fontSize: 15 }
              }
            >
              IVA acreditable
            </Typography.Text>
            <Typography.Text
              style={
                topTab === "period_creditable"
                  ? { ...styles.text.active, fontWeight: "bold", fontSize: 18 }
                  : { ...styles.text.inactive, fontWeight: "bold", fontSize: 18 }
              }
            >
              {loading ? "-" : formatDisplay(getCreditableIVATotal(ivaResponse), DisplayType.MONEY)}
            </Typography.Text>
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 66,
              minWidth: 179,
            }}
          >
            <Typography.Text
              style={{ color: token.colorPrimary, fontSize: 15, fontWeight: "bold" }}
            >
              IVA a cargo
            </Typography.Text>
            <Typography.Text style={{ color: "#474747", fontSize: 18, fontWeight: "bold" }}>
              {loading ? "-" : formatDisplay(ivaResponse?.period.diff, DisplayType.MONEY)}
            </Typography.Text>
          </div>
        </Row>
      </Col>
    </Row>
  );
}

type StylesType = {
  button: {
    [key: string]: CSSProperties;
  };
  text: {
    [key: string]: CSSProperties;
  };
};
