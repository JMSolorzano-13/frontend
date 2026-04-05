import { CFDI_Types } from "@constants/Enums";
import { useBasicPlan } from "@hooks/useBasicPlan";
import editSearchParams from "@utils/editSearchParams";
import { IS_SIIGO } from "@utils/SIIGO/Global";
import { Radio, Select, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";

type PPDProps = {
  disabled: boolean;
  tab: CFDI_Types;
  setCustomDomain: React.Dispatch<React.SetStateAction<Domain>>;
};

enum value {
  ALL = "ALL",
  PPD = "PPD",
  PUE = "PUE",
}

enum invoice_type {
  pendinginvoice = "pendingInvoice",
  paidinvoice = "paidInvoice",
  bothInvoice = "bothInvoice",
}

export default function CFDIPPDInvoiceSelector(props: PPDProps) {
  const location = useLocation();
  // const history = useHistory()
  const navigate = useNavigate();
  const { isDownloadPlan } = useBasicPlan()
  const { disabled, tab, setCustomDomain } = props;
  const [selectedValue, setSelectedValue] = useState(() => {
    const sValue = new URLSearchParams(location.search).get("ppd") || "";
    if (value[sValue as keyof typeof value]) {
      return value[sValue as keyof typeof value];
    }
    return value.ALL;
  });
  const [selectedInvoice, setSelectedInvoice] = useState(() => {
    const sInvoice = new URLSearchParams(location.search).get("ppd_type") || "";
    if (invoice_type[sInvoice as keyof typeof invoice_type]) {
      return invoice_type[sInvoice as keyof typeof invoice_type];
    }
    return isDownloadPlan ? invoice_type.paidinvoice : invoice_type.pendinginvoice;
  });
  const domain: Domain = [["MetodoPago", "=", "PPD"]];
  const firstRender = useRef(true);

  useEffect(() => {
    navigate(
      editSearchParams(
        location.search,
        [
          { key: "ppd", value: selectedValue },
          { key: "ppd_type", value: selectedInvoice.toLowerCase() },
        ],
        {
          baseUrl: location.pathname,
        }
      ),
      { replace: true }
    );

    if (selectedInvoice === "pendingInvoice") {
      domain.push(["balance", ">", 0]);
    } else if (selectedInvoice === "paidInvoice") {
      domain.push(["balance", "<=", 0]);
    }
    if (selectedValue !== "ALL") {
      if (selectedValue === "PPD") {
        return setCustomDomain(domain);
      }
      setCustomDomain([["MetodoPago", "=", selectedValue]]);
    } else {
      setCustomDomain((prev) => (firstRender.current ? prev : []));
    }
    firstRender.current = false;
  }, [selectedInvoice, selectedValue]);

  if (tab === "I") {
    return (
      <Space style={{ display: "flex", flexWrap: "wrap" }}>
        <Radio.Group
          buttonStyle="solid"
          value={selectedValue}
          disabled={disabled}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <Radio.Button id="pue-radio" value="PUE">
            <span data-test="ppd-filter-radio">PUE</span>
          </Radio.Button>
          <Radio.Button id="ppd-radio" value="PPD">
            <span data-test="ppd-filter-radio">PPD</span>
          </Radio.Button>
          <Radio.Button id="filter-all-radio" value="ALL">
            <span data-test="ppd-all-filter-radio">Todos</span>
          </Radio.Button>
        </Radio.Group>
        {selectedValue === "PPD" && ((IS_SIIGO && !isDownloadPlan) || !IS_SIIGO) ? (
          <Select
            id="filter-inactive-select"
            style={{ width: "200px" }}
            disabled={disabled}
            value={selectedInvoice}
            data-test="filter-ppd-invoice"
            onChange={(value) => setSelectedInvoice(value)}
          >
            <Select.Option id="filter-ppd-invoice" value="pendingInvoice">
              Pendientes de pago
            </Select.Option>
            <Select.Option id="paid-invoice-ppd" value="paidInvoice">
              Totalmente pagadas
            </Select.Option>
            <Select.Option id="both-invoice-ppd" value="bothInvoice">
              Ambos
            </Select.Option>
          </Select>
        ) : null}
      </Space>
    );
  }

  return null;
}
